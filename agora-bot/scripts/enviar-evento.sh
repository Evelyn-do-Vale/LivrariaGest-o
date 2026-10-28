#!/bin/sh
# Envia um evento message.created assinado (ou com assinatura forjada) ao receptor.
# Uso:
#   AGORA_WEBHOOK_SECRET=whsec_... ./scripts/enviar-evento.sh URL [texto] [id-da-mensagem]
#   FORJADA=1 ./scripts/enviar-evento.sh URL      # assinatura falsa -> espera 401
# Variável opcional: CONVERSA (id da conversa; precisa ser real para o bot responder no Ágora).
URL=${1:-http://localhost:3000}
TEXTO=${2:-!ajuda}
ID=${3:-teste-$(date +%s)}
CONVERSA=${CONVERSA:-conversa-de-teste}
AGORA_=$(date -u +%Y-%m-%dT%H:%M:%S.000Z)
BODY=$(printf '{"evento":"message.created","conversationId":"%s","dados":{"id":"%s","senderId":"u1","type":"text","text":"%s","createdAt":"%s"},"enviadoEm":"%s"}' "$CONVERSA" "$ID" "$TEXTO" "$AGORA_" "$AGORA_")
if [ -n "$FORJADA" ]; then
  SIG=$(printf '0%.0s' $(seq 1 64))
else
  : "${AGORA_WEBHOOK_SECRET:?defina AGORA_WEBHOOK_SECRET}"
  SIG=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$AGORA_WEBHOOK_SECRET" -hex | sed 's/^.* //')
fi
curl -i -sS -X POST "$URL/webhooks/agora" \
  -H 'Content-Type: application/json' \
  -H "X-Agora-Signature: $SIG" \
  --data-binary "$BODY"
echo
