'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const crypto = require('node:crypto');
const { criarApp, MARCA } = require('../src/server.js');

const SECRET = 'whsec_teste_secret_123';
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const escutar = (srv) => new Promise((r) => srv.listen(0, '127.0.0.1', () => r(srv.address().port)));

function assinar(corpo, secret = SECRET) {
  return crypto.createHmac('sha256', secret).update(corpo).digest('hex');
}

function evento(id, text, conv = 'conv1') {
  return JSON.stringify({
    evento: 'message.created',
    conversationId: conv,
    dados: { id, senderId: 'u1', type: 'text', text, createdAt: new Date().toISOString() },
    enviadoEm: new Date().toISOString(),
  });
}

async function montar({ falhasIniciais = 0 } = {}) {
  const recebidas = [];
  let restantesFalhas = falhasIniciais;
  const mock = http.createServer((req, res) => {
    let b = '';
    req.on('data', (c) => (b += c));
    req.on('end', () => {
      if (restantesFalhas > 0) {
        restantesFalhas -= 1;
        res.writeHead(500).end('erro');
        return;
      }
      recebidas.push({ token: req.headers['x-bot-token'], corpo: JSON.parse(b) });
      res.writeHead(201, { 'Content-Type': 'application/json' }).end(JSON.stringify({ id: 'pub' + recebidas.length }));
    });
  });
  const portaMock = await escutar(mock);
  const app = criarApp(
    {
      secret: SECRET,
      botToken: 'bot_teste',
      agoraUrl: `http://127.0.0.1:${portaMock}`,
      maxAttempts: 3,
      retryBaseMs: 20,
      timeoutMs: 1000,
      adminToken: '',
    },
    () => {},
  );
  const porta = await escutar(app.servidor);
  const base = `http://127.0.0.1:${porta}`;
  const enviar = (corpo, sig) =>
    fetch(`${base}/webhooks/agora`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(sig === null ? {} : { 'X-Agora-Signature': sig ?? assinar(corpo) }) },
      body: corpo,
    });
  const fechar = () => {
    app.servidor.close();
    mock.close();
    app.servidor.closeAllConnections?.();
    mock.closeAllConnections?.();
  };
  return { base, enviar, recebidas, app, fechar };
}

test('recusa subir sem secret', () => {
  assert.throws(() => criarApp({ secret: '' }), /AGORA_WEBHOOK_SECRET/);
});

test('/saude responde 200', async () => {
  const s = await montar();
  const r = await fetch(`${s.base}/saude`);
  assert.equal(r.status, 200);
  assert.equal((await r.json()).ok, true);
  s.fechar();
});

test('assinatura ausente, errada ou de outro corpo: 401 sem efeito colateral', async () => {
  const s = await montar();
  const corpo = evento('m1', '!ajuda');
  assert.equal((await s.enviar(corpo, null)).status, 401);
  assert.equal((await s.enviar(corpo, '00'.repeat(32))).status, 401);
  assert.equal((await s.enviar(corpo, assinar(corpo, 'outro'))).status, 401);
  assert.equal((await s.enviar(corpo, 'lixo')).status, 401);
  await esperar(50);
  assert.equal(s.app.estado.totalEventos, 0);
  assert.equal(s.recebidas.length, 0);
  s.fechar();
});

test('JSON inválido com assinatura correta: 400', async () => {
  const s = await montar();
  const corpo = '{nao e json';
  assert.equal((await s.enviar(corpo)).status, 400);
  s.fechar();
});

test('idempotência: 202 depois 200, processa uma vez só', async () => {
  const s = await montar();
  const corpo = evento('m2', '!ajuda');
  assert.equal((await s.enviar(corpo)).status, 202);
  assert.equal((await s.enviar(corpo)).status, 200);
  await esperar(100);
  assert.equal(s.app.estado.totalEventos, 1);
  assert.equal(s.recebidas.length, 1);
  s.fechar();
});

test('!ajuda, !eventos, !contar e desconhecido respondem na mesma conversa, sem iniciar por comando', async () => {
  const s = await montar();
  for (const [i, t] of ['!ajuda', '!eventos', '!contar um dois três', '!xyz'].entries()) {
    assert.equal((await s.enviar(evento('c' + i, t, 'convA'))).status, 202);
  }
  await esperar(150);
  assert.equal(s.recebidas.length, 4);
  for (const r of s.recebidas) {
    assert.equal(r.token, 'bot_teste');
    assert.equal(r.corpo.conversationId, 'convA');
    assert.ok(r.corpo.text.startsWith(MARCA), 'resposta deve começar com a marca');
    assert.ok(!r.corpo.text.trimStart().startsWith('!'));
  }
  const textos = s.recebidas.map((r) => r.corpo.text).join('\n');
  assert.match(textos, /!ajuda/);
  assert.match(textos, /3 palavra/);
  assert.match(textos, /!ajuda para ver/);
  s.fechar();
});

test('laço: eco da resposta do bot e mensagens comuns não geram resposta', async () => {
  const s = await montar();
  await s.enviar(evento('l1', `${MARCA} Comandos: !ajuda`));
  await s.enviar(evento('l2', 'oi pessoal'));
  await s.enviar(evento('l3', 'olha o !ajuda no meio'));
  await esperar(100);
  assert.equal(s.recebidas.length, 0);
  assert.equal(s.app.estado.totalEventos, 3);
  s.fechar();
});

test('falha ao responder: retenta com espera crescente e então vai para falhas', async () => {
  const s = await montar({ falhasIniciais: 99 });
  assert.equal((await s.enviar(evento('f1', '!ajuda'))).status, 202);
  await esperar(300);
  assert.equal(s.app.estado.falhas.length, 1);
  assert.equal(s.app.estado.falhas[0].tentativas, 3);
  assert.equal(s.app.estado.pendentes.size, 0);
  s.fechar();
});

test('falha transitória: retentativa acaba entregando', async () => {
  const s = await montar({ falhasIniciais: 2 });
  await s.enviar(evento('t1', '!ajuda'));
  await esperar(300);
  assert.equal(s.recebidas.length, 1);
  assert.equal(s.app.estado.falhas.length, 0);
  s.fechar();
});
