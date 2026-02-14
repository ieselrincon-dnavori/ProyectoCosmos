#!/bin/bash

clear

if command -v docker-compose &> /dev/null
then
    COMPOSE="docker-compose"
else
    COMPOSE="docker compose"
fi

while true; do

echo "================================="
echo "        🚀 COSMOS MANAGER"
echo "================================="
echo "1️⃣  Start rápido"
echo "2️⃣  Rebuild TOTAL (DB limpia)"
echo "3️⃣  Limpieza NUCLEAR Docker"
echo "0️⃣  Salir"
echo "================================="

read -p "Selecciona una opción: " option

case $option in

1)
    echo "🚀 Iniciando servicios..."
    $COMPOSE up -d
    echo "✅ Cosmos en marcha"
    ;;

2)
    echo "🔥 REBUILD TOTAL..."

    echo "🛑 Parando todo + borrando volúmenes..."
    $COMPOSE down -v --remove-orphans

    echo "🧹 Limpiando basura..."
    docker system prune -f

    echo "🏗️ Construyendo desde cero..."
    $COMPOSE up -d --build

    echo "✅ Entorno limpio y DB regenerada"
    ;;

3)
    echo "🧨 LIMPIEZA NUCLEAR"
    read -p "Esto borrará TODO Docker no usado. ¿Seguro? (yes/no): " confirm

    if [ "$confirm" = "yes" ]; then
        docker compose down -v --remove-orphans
        docker system prune -a --volumes -f
        echo "✅ Docker quedó como recién instalado"
    else
        echo "Cancelado."
    fi
    ;;

0)
    echo "👋 Saliendo..."
    exit 0
    ;;

*)
    echo "❌ Opción inválida"
    ;;

esac

echo ""
read -p "Pulsa ENTER para continuar..."
clear

done

