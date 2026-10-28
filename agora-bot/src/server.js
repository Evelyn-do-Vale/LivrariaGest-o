'use strict';
/**
 * Receptor de webhooks + bot para o Ágora (agora.fslab.dev).
 * Sem dependências externas: só módulos nativos do Node 20+.
 */
const http = require('node:http');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

// Toda resposta do bot começa com esta marca. Mensagens que começam com ela
// são ignoradas na entrada (ver "laço" no README).
const MARCA = '🤖';

// ---------------------------------------------------------------- configuração
function carregarEnv(arquivo) {
  // Parser mínimo de .env (não sobrescreve variáveis já definidas no ambiente).
  if (!fs.existsSync(arquivo)) return;
  for (const linha of fs.readFileSync(arquivo, 'utf8').split(/\r?\n/)) {
    const m = linha.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m || linha.trim().startsWith('#')) continue;
    let valor = m[2];
    if (/^(".*"|'.*')$/.test(valor)) valor = valor.slice(1, -1);
    if (process.env[m[1]] === undefined) process.env[m[1]] = valor;
  }
}

function lerConfig(env = process.env) {
  return {
    secret: env.AGORA_WEBHOOK_SECRET || '',
    botToken: env.AGORA_BOT_TOKEN || '',
    agoraUrl: (env.AGORA_URL || '').replace(/\/+$/, ''),
    port: Number(env.PORT) || 3000,
    adminToken: env.ADMIN_TOKEN || '',
    maxAttempts: Number(env.MAX_TENTATIVAS) || 5,
    retryBaseMs: Number(env.RETRY_BASE_MS) || 1000,
    timeoutMs: Number(env.TIMEOUT_MS) || 5000,
  };
}

// ------------------------------------------------------------------- aplicação
function criarApp(cfg, log = console.log) {
  if (!cfg.secret) {
    throw new Error('AGORA_WEBHOOK_SECRET não definido: o serviço se recusa a subir sem o secret.');
  }
  const modoSeco = !cfg.agoraUrl || !cfg.botToken;

  const estado = {
    iniciadoEm: Date.now(),
    eventos: [], // últimos eventos aceitos (máx. 50)
    totalEventos: 0,
    vistos: new Map(), // chave de idempotência -> timestamp
    porConversa: new Map(), // conversationId -> nº de mensagens
    pendentes: new Set(), // itens ainda sendo entregues ao Ágora
    falhas: [], // itens que esgotaram as tentativas
    enviadas: new Set(), // ids de mensagens publicadas pelo próprio bot
    respondidas: 0,
  };

  // ---- segurança ----------------------------------------------------------
  function assinaturaValida(corpoBruto, cabecalho) {
    const esperado = crypto.createHmac('sha256', cfg.secret).update(corpoBruto).digest();
    const dado = String(cabecalho || '').trim().replace(/^sha256=/i, '');
    if (!/^[0-9a-f]{64}$/i.test(dado)) return false;
    return crypto.timingSafeEqual(esperado, Buffer.from(dado, 'hex')); // tempo constante
  }

  function lerCorpoBruto(req, limite = 1024 * 1024) {
    return new Promise((resolve, reject) => {
      const partes = [];
      let tamanho = 0;
      req.on('data', (c) => {
        tamanho += c.length;
        if (tamanho > limite) {
          reject(Object.assign(new Error('corpo grande demais'), { status: 413 }));
          req.destroy();
          return;
        }
        partes.push(c);
      });
      req.on('end', () => resolve(Buffer.concat(partes)));
      req.on('error', reject);
    });
  }

  function responder(res, status, corpo) {
    const json = JSON.stringify(corpo);
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(json);
  }

  function marcarVisto(chave) {
    estado.vistos.set(chave, Date.now());
    if (estado.vistos.size > 5000) estado.vistos.delete(estado.vistos.keys().next().value);
  }

  // ---- fila de saída com retentativa --------------------------------------
  function enfileirar(conversationId, text) {
    const item = {
      conversationId,
      text,
      tentativas: 0,
      criadoEm: new Date().toISOString(),
      ultimoErro: null,
    };
    estado.pendentes.add(item);
    setImmediate(() => tentar(item));
  }

  async function enviarAoAgora(item) {
    if (modoSeco) {
      log(`[modo seco] responderia em ${item.conversationId}: ${item.text.slice(0, 80)}`);
      return null;
    }
    const resp = await fetch(`${cfg.agoraUrl}/bot/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-bot-token': cfg.botToken },
      body: JSON.stringify({ conversationId: item.conversationId, text: item.text }),
      signal: AbortSignal.timeout(cfg.timeoutMs),
    });
    const texto = await resp.text();
    if (!resp.ok) throw new Error(`HTTP ${resp.status} ${texto.slice(0, 150)}`);
    try {
      const d = JSON.parse(texto);
      return d.id ?? d._id ?? d.message?.id ?? d.dados?.id ?? null;
    } catch {
      return null;
    }
  }

  async function tentar(item) {
    item.tentativas += 1;
    try {
      const idPublicado = await enviarAoAgora(item);
      estado.pendentes.delete(item);
      estado.respondidas += 1;
      if (idPublicado) {
        estado.enviadas.add(String(idPublicado));
        if (estado.enviadas.size > 2000) estado.enviadas.delete(estado.enviadas.values().next().value);
      }
    } catch (e) {
      item.ultimoErro = e.message;
      if (item.tentativas >= cfg.maxAttempts) {
        estado.pendentes.delete(item);
        estado.falhas.push({ ...item, desistiuEm: new Date().toISOString() });
        log(`[falha] desisti após ${item.tentativas} tentativas: ${e.message}`);
      } else {
        const espera = cfg.retryBaseMs * 2 ** (item.tentativas - 1); // 1s, 2s, 4s, 8s...
        log(`[retry] tentativa ${item.tentativas} falhou (${e.message}); nova em ${espera}ms`);
        setTimeout(() => tentar(item), espera);
      }
    }
  }

  // ---- comandos ------------------------------------------------------------
  const AJUDA =
    `${MARCA} Comandos que eu entendo:\n` +
    '• !ajuda – mostra esta lista\n' +
    '• !eventos – resumo dos últimos eventos recebidos\n' +
    '• !contar [texto] – conta palavras e caracteres do texto e diz quantas mensagens vi nesta conversa';

  function resumoEventos() {
    const ultimos = estado.eventos.slice(-5).reverse();
    if (!ultimos.length) return `${MARCA} Ainda não recebi eventos.`;
    const linhas = ultimos.map((e) => {
      const hora = e.recebidoEm.slice(11, 19);
      const t = e.texto ? ` "${e.texto.slice(0, 40)}"` : '';
      return `• ${hora} ${e.evento}${t}`;
    });
    return `${MARCA} Últimos ${ultimos.length} de ${estado.totalEventos} eventos:\n${linhas.join('\n')}`;
  }

  function comandoContar(resto, conversationId) {
    const palavras = resto.trim() ? resto.trim().split(/\s+/).length : 0;
    const nConversa = estado.porConversa.get(conversationId) || 0;
    const total = estado.totalEventos;
    const parteTexto = resto.trim()
      ? `Seu texto tem ${palavras} palavra(s) e ${resto.trim().length} caractere(s).`
      : 'Dica: use !contar seguido de um texto.';
    return `${MARCA} ${parteTexto} Nesta conversa já vi ${nConversa} mensagem(ns); no total, ${total} evento(s).`;
  }

  function tratarMensagem(env) {
    const d = env.dados || {};
    const texto = typeof d.text === 'string' ? d.text.trim() : '';
    if (!texto) return; // sem texto (ex.: cifrada ou mídia)
    if (texto.startsWith(MARCA)) return; // mensagem do próprio bot
    if (d.id != null && estado.enviadas.has(String(d.id))) return; // id publicado por nós
    if (!texto.startsWith('!')) return; // não é comando
    if (!env.conversationId) return;

    const [cmd, ...partes] = texto.split(/\s+/);
    const resto = partes.join(' ');
    let resposta;
    switch (cmd.toLowerCase()) {
      case '!ajuda':
        resposta = AJUDA;
        break;
      case '!eventos':
        resposta = resumoEventos();
        break;
      case '!contar':
        resposta = comandoContar(resto, env.conversationId);
        break;
      default:
        resposta = `${MARCA} Não conheço esse comando. Use !ajuda para ver a lista.`;
    }
    enfileirar(env.conversationId, resposta);
  }

  function processar(env) {
    const d = env.dados || {};
    estado.totalEventos += 1;
    if (env.conversationId) {
      estado.porConversa.set(env.conversationId, (estado.porConversa.get(env.conversationId) || 0) + 1);
    }
    estado.eventos.push({
      recebidoEm: new Date().toISOString(),
      evento: env.evento,
      conversationId: env.conversationId || null,
      mensagemId: d.id ?? null,
      senderId: d.senderId ?? null,
      texto: typeof d.text === 'string' ? d.text.slice(0, 200) : null,
    });
    if (estado.eventos.length > 50) estado.eventos.shift();
    if (env.evento === 'message.created') tratarMensagem(env);
  }

  // ---- rotas ---------------------------------------------------------------
  async function rotaWebhook(req, res) {
    let bruto;
    try {
      bruto = await lerCorpoBruto(req);
    } catch (e) {
      return responder(res, e.status || 400, { erro: e.message });
    }

    // 1) autenticidade sobre o corpo BRUTO, antes de qualquer outra coisa
    if (!assinaturaValida(bruto, req.headers['x-agora-signature'])) {
      log('[401] assinatura ausente ou inválida');
      return responder(res, 401, { erro: 'assinatura inválida' });
    }

    // 2) JSON
    let env;
    try {
      env = JSON.parse(bruto.toString('utf8'));
    } catch {
      return responder(res, 400, { erro: 'JSON inválido' });
    }
    if (!env || typeof env !== 'object' || Array.isArray(env) || typeof env.evento !== 'string') {
      return responder(res, 400, { erro: 'envelope inválido' });
    }

    // 3) idempotência: evento + dados.id (o Ágora não manda id de entrega)
    const dadosId = env.dados && typeof env.dados === 'object' ? env.dados.id : undefined;
    const chave =
      dadosId !== undefined && dadosId !== null
        ? `${env.evento}:${dadosId}`
        : `${env.evento}:sha256:${crypto.createHash('sha256').update(bruto).digest('hex')}`;
    if (estado.vistos.has(chave)) {
      return responder(res, 200, { duplicado: true });
    }
    marcarVisto(chave);

    // 4) responde já; o trabalho acontece depois
    responder(res, 202, { aceito: true });
    setImmediate(() => processar(env));
  }

  function autorizadoAdmin(req) {
    if (!cfg.adminToken) return true;
    const dado = String(req.headers['x-admin-token'] || '');
    const a = Buffer.from(dado);
    const b = Buffer.from(cfg.adminToken);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }

  const servidor = http.createServer(async (req, res) => {
    const caminho = new URL(req.url, 'http://x').pathname;
    try {
      if (caminho === '/saude' && req.method === 'GET') {
        return responder(res, 200, {
          ok: true,
          naFila: estado.pendentes.size,
          falhas: estado.falhas.length,
          modoSeco,
          uptimeSeg: Math.round((Date.now() - estado.iniciadoEm) / 1000),
        });
      }
      if (caminho === '/webhooks/agora') {
        if (req.method !== 'POST') return responder(res, 405, { erro: 'use POST' });
        return await rotaWebhook(req, res);
      }
      if ((caminho === '/eventos' || caminho === '/falhas') && req.method === 'GET') {
        if (!autorizadoAdmin(req)) return responder(res, 401, { erro: 'x-admin-token necessário' });
        if (caminho === '/eventos') {
          return responder(res, 200, { total: estado.totalEventos, eventos: [...estado.eventos].reverse() });
        }
        return responder(res, 200, { total: estado.falhas.length, falhas: estado.falhas });
      }
      return responder(res, 404, { erro: 'não encontrado' });
    } catch (e) {
      log('[erro]', e);
      if (!res.headersSent) responder(res, 500, { erro: 'erro interno' });
    }
  });

  return { servidor, estado, modoSeco };
}

// ------------------------------------------------------------------ inicialização
if (require.main === module) {
  carregarEnv(path.join(process.cwd(), '.env'));
  const cfg = lerConfig();
  let app;
  try {
    app = criarApp(cfg);
  } catch (e) {
    console.error(`[fatal] ${e.message}`);
    process.exit(1);
  }
  app.servidor.listen(cfg.port, '0.0.0.0', () => {
    console.log(`Serviço no ar em 0.0.0.0:${cfg.port}${app.modoSeco ? ' (MODO SECO: falta AGORA_URL ou AGORA_BOT_TOKEN)' : ''}`);
  });
}

module.exports = { criarApp, lerConfig, MARCA };
