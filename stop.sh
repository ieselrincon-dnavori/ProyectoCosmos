#!/bin/bash

if command -v docker-compose &> /dev/null
then
    COMPOSE="docker-compose"
else
    COMPOSE="docker compose"
fi

echo "🛑 Parando Cosmos Fitness..."
$COMPOSE down
