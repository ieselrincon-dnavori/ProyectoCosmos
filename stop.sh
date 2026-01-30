#!/bin/bash

if command -v docker-compose &> /dev/null
then
    COMPOSE="docker-compose"
else
    COMPOSE="docker compose"
fi

echo "🛑 Parando Cosmos Fitness..."
$COMPOSE down
echo "🗑️ Borrando volumen de datos de Postgres..."
docker volume rm proyectocosmos_postgres_data
