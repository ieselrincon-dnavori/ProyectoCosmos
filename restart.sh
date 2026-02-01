#!/bin/bash

echo "=============================="
echo "  REINICIANDO COSMOS FITNESS"
echo "=============================="

# Detectar compose
if command -v docker-compose &> /dev/null
then
    COMPOSE="docker-compose"
else
    COMPOSE="docker compose"
fi

echo "➡ Usando: $COMPOSE"

echo "🛑 Parando contenedores..."
$COMPOSE down

echo "🔧 Reconstruyendo + levantando..."
$COMPOSE up -d --build

echo "=============================="
echo " COSMOS FITNESS REINICIADO"
echo " API:      http://localhost:3000"
echo " FRONTEND: http://localhost:8100"
echo "=============================="
