#!/bin/bash

echo "=============================="
echo "  BUILD COMPLETO COSMOS"
echo "=============================="

if command -v docker-compose &> /dev/null
then
    COMPOSE="docker-compose"
else
    COMPOSE="docker compose"
fi

$COMPOSE down
$COMPOSE up -d --build

echo "✅ Build terminado"

