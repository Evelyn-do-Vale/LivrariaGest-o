# Bot e receptor de webhooks para o Ágora

Trabalho da disciplina **Web Services** (CST em ADS · IFRO · 2026/2) · Tópico 5 · Webhooks.

- **URL pública do serviço:** https://SEU-NOME.fslab.dev  <!-- TROCAR pelo endereço criado em cloud.fslab.dev -->
- **Integrantes:** <!-- TROCAR: Nome 1, Nome 2, ... -->

## O que o serviço faz

1. **Recebe** os webhooks `message.created` do Ágora em `POST /webhooks/agora`: confere a assinatura, descarta duplicatas e responde `202` na hora.
2. **Responde** na mesma conversa por `POST https://api.agora.fslab.dev/bot/messages` (cabeçalho `x-bot-token`), por meio de uma fila com retentativa.

Sem dependências externas: só módulos nativos do Node.js (20 ou superior).

## Como instalar e rodar

```bash
cp .env.example .env     # preencha AGORA_WEBHOOK_SECRET e AGORA_BOT_TOKEN
npm start                # ou: PORT=3000 node src/server.js
npm test                 # testes automatizados (usam um Ágora simulado)
```

O serviço **recusa subir** se `AGORA_WEBHOOK_SECRET` não estiver definido. Sem `AGORA_BOT_TOKEN` ou `AGORA_URL` ele roda em *modo seco*: recebe e registra, mas só escreve no log o que responderia.

### Na VM (Docker)

```bash
docker build -t agora-bot .
docker run -d --name agora-bot --restart unless-stopped \
  --env-file .env -p 3000:3000 agora-bot
```

O serviço escuta em `0.0.0.0`. Em cloud.fslab.dev > Endereços, o subdomínio aponta para a VM e a porta publicada (aqui, 3000). O `.env` fica **só na VM**.

### Variáveis de ambiente

| Variável | Obrigatória | Para quê |
|---|---|---|
| `AGORA_WEBHOOK_SECRET` | sim | secret `whsec_...` mostrado pelo Ágora ao criar o bot |
| `AGORA_BOT_TOKEN` | para responder | token `bot_...` mostrado pelo Ágora |
| `AGORA_URL` | para responder | `https://api.agora.fslab.dev` (a API, não a tela web) |
| `PORT` | não | porta do serviço (padrão 3000) |
| `ADMIN_TOKEN` | não | se definido, `/eventos` e `/falhas` exigem o cabeçalho `x-admin-token` |

## Comandos do bot

| Comando | Resposta |
|---|---|
| `!ajuda` | lista os comandos |
| `!eventos` | resumo dos últimos 5 eventos recebidos |
| `!contar [texto]` | **comando próprio**: conta palavras e caracteres do texto enviado e informa quantas mensagens o serviço já viu na conversa e no total (usa o conteúdo do evento e o estado do serviço) |
| qualquer outro `!algo` | resposta curta orientando a usar `!ajuda` |

## Como o laço é evitado

Toda resposta do bot começa com a marca `🤖`, nunca com `!`, e o serviço só reage a mensagens cujo texto **começa** com `!`; por isso nenhuma resposta (nem a do `!ajuda`, que cita os comandos no meio do texto) pode disparar o bot. Além disso, mensagens que começam com `🤖` e mensagens cujo id foi devolvido pelo próprio `POST /bot/messages` são ignoradas.

## Segurança e confiabilidade (resumo)

- **Autenticidade:** HMAC-SHA256 em hexadecimal, calculado sobre o **corpo bruto**, comparado com `crypto.timingSafeEqual` (tempo constante). Assinatura ausente ou errada: `401`, sem efeito colateral. JSON inválido (com assinatura correta): `400`.
- **Idempotência:** chave `evento + dados.id`. Evento novo: `202`. Duplicata: `200`, sem reprocessar.
- **Resposta rápida:** a rota responde `202` antes de qualquer chamada ao Ágora; o envio acontece depois, numa fila.
- **Retentativa:** até 5 tentativas com espera crescente (1 s, 2 s, 4 s, 8 s). Esgotadas, o item vai para `GET /falhas`.
- **Limitação conhecida:** estado (vistos, eventos, fila, falhas) fica em memória e se perde ao reiniciar o serviço.

## Como conferir o serviço (exemplos de curl)

```bash
# 1. Saúde, a partir do seu computador (não de dentro da VM)
curl https://SEU-NOME.fslab.dev/saude

# 2. Últimos eventos e falhas (acrescente -H "x-admin-token: ..." se ADMIN_TOKEN estiver definido)
curl https://SEU-NOME.fslab.dev/eventos
curl https://SEU-NOME.fslab.dev/falhas

# 3. Assinatura forjada: espera 401
FORJADA=1 ./scripts/enviar-evento.sh https://SEU-NOME.fslab.dev

# 4. Evento válido enviado duas vezes com o mesmo id: espera 202 e depois 200
export AGORA_WEBHOOK_SECRET=...   # o mesmo secret do .env da VM
./scripts/enviar-evento.sh https://SEU-NOME.fslab.dev '!ajuda' evt-001
./scripts/enviar-evento.sh https://SEU-NOME.fslab.dev '!ajuda' evt-001
```

Os passos 3 e 4 usam uma conversa fictícia: o evento é registrado, mas a resposta do bot irá para `/falhas` (o Ágora não conhece essa conversa). Para a prova da conversa real, escreva os comandos no Ágora.

## Estrutura

```
src/server.js            serviço (rotas, HMAC, idempotência, fila, comandos)
test/servico.test.js     testes automatizados
scripts/enviar-evento.sh gera eventos assinados / forjados para teste
Dockerfile, .env.example
evidencias/              capturas de tela da entrega
```
