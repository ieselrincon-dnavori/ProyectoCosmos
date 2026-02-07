#!/bin/bash

echo "=============================="
echo "  REINICIANDO COSMOS FITNESS"
echo "=============================="

if command -v docker-compose &> /dev/null
then
    COMPOSE="docker-compose"
else
    COMPOSE="docker compose"
fi

echo "➡ Usando: $COMPOSE"

echo "🛑 Parando contenedores..."
$COMPOSE down

echo "🚀 Levantando servicios SIN rebuild..."
$COMPOSE up -d

echo ""
echo "💡 Si cambiaste Dockerfile o package.json usa:"
echo "   docker compose up -d --build"

echo "=============================="
echo " COSMOS FITNESS REINICIADO"
echo "=============================="

