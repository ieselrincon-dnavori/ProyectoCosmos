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
echo "        🚀 COSMOS MANAGER PRO"
echo "================================="
echo "1️⃣  Start rápido (sin rebuild)"
echo "2️⃣  Rebuild TOTAL (DB limpia)"
echo "3️⃣  Ver logs en vivo"
echo "4️⃣  Reinicio limpio"
echo "5️⃣  Limpieza NUCLEAR Docker ⚠️"
echo "0️⃣  Salir"
echo "================================="

read -p "Selecciona una opción: " option

case $option in

# -----------------------------
# START RAPIDO
# -----------------------------
1)
    echo "🚀 Iniciando contenedores..."
    $COMPOSE up -d
    echo "✅ Cosmos en marcha"
    ;;


# -----------------------------
# REBUILD TOTAL (LA QUE USARÁS MÁS)
# -----------------------------
2)
    echo "🔥 REBUILD TOTAL..."

    echo "🛑 Parando contenedores + borrando volúmenes..."
    $COMPOSE down -v --remove-orphans

    echo "🧹 Eliminando imágenes huérfanas..."
    docker image prune -f

    echo "🏗️ Reconstruyendo entorno..."
    $COMPOSE up -d --build

    echo ""
    echo "✅ ENTORNO COMPLETAMENTE LIMPIO"
    echo "👉 Base de datos regenerada"
    echo "👉 Seed ejecutado"
    echo ""
    ;;


# -----------------------------
# LOGS (MUY PRO)
# -----------------------------
3)
    echo "📡 Logs en vivo (CTRL+C para salir)"
    $COMPOSE logs -f
    ;;


# -----------------------------
# RESTART LIMPIO
# -----------------------------
4)
    echo "🔄 Reiniciando servicios..."
    $COMPOSE restart
    echo "✅ Servicios reiniciados"
    ;;


# -----------------------------
# LIMPIEZA NUCLEAR
# -----------------------------
5)
    echo "🧨 LIMPIEZA NUCLEAR"
    echo "Esto borrará TODO lo no usado por Docker."
    read -p "Escribe 'NUCLEAR' para continuar: " confirm

    if [ "$confirm" = "NUCLEAR" ]; then
        docker compose down -v --remove-orphans
        docker system prune -a --volumes -f

        echo ""
        echo "💀 Docker quedó como recién instalado."
        echo "⚠️ El próximo build será lento."
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

