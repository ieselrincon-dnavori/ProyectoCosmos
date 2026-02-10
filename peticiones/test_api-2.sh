#!/bin/bash

set -euo pipefail

API="http://localhost:3000"

GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[1;33m"
NC="\033[0m"

TESTS=0
FAILED=0

step() {
  echo ""
  echo -e "${YELLOW}🔎 $1${NC}"
}

pass() {
  TESTS=$((TESTS+1))
  echo -e "${GREEN}✅ $1${NC}"
}

fail() {
  TESTS=$((TESTS+1))
  FAILED=$((FAILED+1))

  echo ""
  echo -e "${RED}❌ TEST FALLIDO: $1${NC}"
  echo "-----------------------------"
  echo "HTTP: $2"
  echo "Respuesta:"
  echo "$3"
  echo "-----------------------------"
  exit 1
}

request() {
  RESPONSE=$(curl --fail-with-body --max-time 10 -s -w "\n%{http_code}" "$@") || {
    echo ""
    echo -e "${RED}❌ Error de conexión con la API${NC}"
    exit 1
  }

  BODY=$(echo "$RESPONSE" | head -n -1)
  CODE=$(echo "$RESPONSE" | tail -n1)
}

echo "====================================="
echo "      🧪 TEST AUTOMÁTICO COSMOS PRO"
echo "====================================="


###################################
step "1️⃣ API viva"
###################################

request $API

[[ "$CODE" != "200" ]] && fail "API no responde correctamente" "$CODE" "$BODY"

echo "$BODY" | grep "API funcionando" >/dev/null \
  || fail "Texto esperado no encontrado en API root" "$CODE" "$BODY"

pass "API OK"


###################################
step "2️⃣ Login"
###################################

request -X POST $API/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@mail.com","password":"admin123"}'

[[ "$CODE" != "200" ]] && fail "Error en login" "$CODE" "$BODY"

echo "$BODY" | grep "id_usuario" >/dev/null \
  || fail "Login no devolvió id_usuario" "$CODE" "$BODY"

pass "Login OK"


###################################
step "3️⃣ Obtener bonos"
###################################

request $API/bonos

[[ "$CODE" != "200" ]] && fail "Error obteniendo bonos" "$CODE" "$BODY"

echo "$BODY" | grep "Bono mensual" >/dev/null \
  || fail "No aparece 'Bono mensual'" "$CODE" "$BODY"

pass "Bonos cargan"


###################################
step "4️⃣ Crear pago sesiones"
###################################

request -X POST $API/pagos \
  -H "Content-Type: application/json" \
  -d '{
    "id_cliente":10,
    "id_bono":2,
    "metodo_pago":"tarjeta"
}'

if [[ "$CODE" != "200" && "$CODE" != "201" ]]; then
  fail "Error creando pago" "$CODE" "$BODY"
fi

echo "$BODY" | grep "sesiones_restantes" >/dev/null \
  || fail "El pago no devolvió sesiones_restantes" "$CODE" "$BODY"

pass "Pago creado"


###################################
step "5️⃣ Crear reserva válida"
###################################

request -X POST $API/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "id_cliente":10,
    "id_horario":1
}'

if [[ "$CODE" != "200" && "$CODE" != "201" ]]; then
  fail "Error creando reserva" "$CODE" "$BODY"
fi

echo "$BODY" | grep "id_reserva" >/dev/null \
  || fail "No se devolvió id_reserva" "$CODE" "$BODY"

RESERVA_ID=$(echo "$BODY" | sed -n 's/.*"id_reserva":\([0-9]*\).*/\1/p')

pass "Reserva creada (ID $RESERVA_ID)"


###################################
step "6️⃣ Sesiones deben bajar"
###################################

request $API/pagos/cliente/10

[[ "$CODE" != "200" ]] && fail "Error consultando sesiones" "$CODE" "$BODY"

echo "$BODY" | grep '"sesiones_restantes":9' >/dev/null \
  || fail "Las sesiones no bajaron a 9" "$CODE" "$BODY"

pass "Sesiones decrementadas"


###################################
step "7️⃣ Detectar duplicado"
###################################

request -X POST $API/reservas \
  -H "Content-Type: application/json" \
  -d '{
    "id_cliente":10,
    "id_horario":1
}'

echo "$BODY" | grep "Ya tienes una reserva" >/dev/null \
  || fail "No se detectó la reserva duplicada" "$CODE" "$BODY"

pass "Duplicado bloqueado"


###################################
step "8️⃣ Cancelar reserva"
###################################

request -X PATCH $API/reservas/$RESERVA_ID/cancelar

[[ "$CODE" != "200" ]] && fail "Error cancelando reserva" "$CODE" "$BODY"

echo "$BODY" | grep "cancelada" >/dev/null \
  || fail "La reserva no se canceló correctamente" "$CODE" "$BODY"

pass "Reserva cancelada"


###################################
step "9️⃣ Sesiones deben volver a 10"
###################################

request $API/pagos/cliente/10

[[ "$CODE" != "200" ]] && fail "Error consultando sesiones tras cancelar" "$CODE" "$BODY"

echo "$BODY" | grep '"sesiones_restantes":10' >/dev/null \
  || fail "Las sesiones no volvieron a 10" "$CODE" "$BODY"

pass "Sesión restaurada"


echo ""
echo "====================================="
echo -e "${GREEN}        🚀 BACKEND VALIDADO${NC}"
echo "====================================="
echo ""
echo "Tests ejecutados: $TESTS"
echo "Fallos: $FAILED"
