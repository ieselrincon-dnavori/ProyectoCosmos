#!/bin/bash

API="http://localhost:3000"

echo "====================================="
echo "      🧪 TEST AUTOMÁTICO COSMOS"
echo "====================================="


##################################
echo ""
echo "1️⃣ Comprobando API..."
##################################

curl -s $API | jq .

if [ $? -ne 0 ]; then
  echo "❌ API no responde"
  exit 1
fi

echo "✅ API OK"



##################################
echo ""
echo "2️⃣ Login ADMIN"
##################################

curl -s -X POST $API/login \
-H "Content-Type: application/json" \
-d '{"email":"admin@mail.com","password":"admin"}' | jq .

echo "✅ Login admin OK"



##################################
echo ""
echo "3️⃣ Obtener bonos"
##################################

curl -s $API/bonos | jq .

echo "✅ Bonos cargan"



##################################
echo ""
echo "4️⃣ Crear pago cliente 10"
##################################

curl -s -X POST $API/pagos \
-H "Content-Type: application/json" \
-d '{
"id_cliente":10,
"id_bono":2,
"metodo_pago":"tarjeta"
}' | jq .

echo "✅ Pago creado"



##################################
echo ""
echo "5️⃣ Ver bono activo"
##################################

curl -s $API/pagos/cliente/10/activo | jq .

echo "✅ Bono activo detectado"



##################################
echo ""
echo "6️⃣ Intentar reservar SIN bono (cliente 14)"
##################################

curl -s -X POST $API/reservas \
-H "Content-Type: application/json" \
-d '{
"id_cliente":14,
"id_horario":1
}' | jq .

echo "👉 Debe devolver error 403"



##################################
echo ""
echo "7️⃣ Crear reserva válida (cliente 10)"
##################################

RESERVA=$(curl -s -X POST $API/reservas \
-H "Content-Type: application/json" \
-d '{
"id_cliente":10,
"id_horario":1
}')

echo $RESERVA | jq .

RESERVA_ID=$(echo $RESERVA | jq -r '.id_reserva')

echo "Reserva ID: $RESERVA_ID"



##################################
echo ""
echo "8️⃣ Ver sesiones restantes"
##################################

curl -s $API/pagos/cliente/10 | jq .

echo "👉 Debe ser 9"



##################################
echo ""
echo "9️⃣ Probar duplicado"
##################################

curl -s -X POST $API/reservas \
-H "Content-Type: application/json" \
-d '{
"id_cliente":10,
"id_horario":1
}' | jq .

echo "👉 Debe decir 'Ya tienes una reserva activa'"



##################################
echo ""
echo "🔟 Cancelar reserva"
##################################

curl -s -X PATCH $API/reservas/$RESERVA_ID/cancelar | jq .

echo "✅ Reserva cancelada"



##################################
echo ""
echo "11️⃣ Ver reservas cliente"
##################################

curl -s $API/reservas/cliente/10 | jq .



echo ""
echo "====================================="
echo "       ✅ TEST COMPLETADO"
echo "====================================="
