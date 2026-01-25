#!/bin/bash

echo "=============================="
echo "  INICIANDO COSMOS FITNESS"
echo "=============================="

# Comprobar docker
if ! command -v docker &> /dev/null
then
    echo "❌ Docker no está instalado"
    exit 1
fi

# Comprobar docker compose
if command -v docker-compose &> /dev/null
then
    COMPOSE="docker-compose"
else
    COMPOSE="docker compose"
fi

echo "➡ Usando: $COMPOSE"

# Construir imágenes
echo "🔧 Construyendo contenedores..."
$COMPOSE build

# Levantar servicios
echo "🚀 Levantando servicios..."
$COMPOSE up -d

echo "=============================="
echo " COSMOS FITNESS EN MARCHA"
echo " API:      http://localhost:3000"
echo " FRONTEND: http://localhost:8100"
echo "=============================="

