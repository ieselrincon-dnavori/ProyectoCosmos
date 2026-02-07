#!/bin/bash

echo "=============================="
echo " 🚀 GESTOR DE GITHUB - COSMOS"
echo "=============================="

# ==============================
# Selección de usuario
# ==============================

echo "👤 ¿Quién está realizando los cambios?"
echo " [ 1 ] - Domingo"
echo " [ 2 ] - Dámaris"
echo " [ 0 ] - Salir"
echo "------------------------------"
read -p "Selecciona una opción: " USER_OPTION

case $USER_OPTION in
    1)
        USER_NAME="Domingo"
        USER_EMAIL="domingojosenavarroorihuela@alumno.ieselrincon.es"
        ;;
    2)
        USER_NAME="Dámaris"
        USER_EMAIL="damarisvidalrodriguez@alumno.ieselrincon.es"
        ;;
    0)
        echo "👋 Saliendo."
        exit 0
        ;;
    *)
        echo "❌ Opción no válida."
        exit 1
        ;;
esac

git config user.name "$USER_NAME"
git config user.email "$USER_EMAIL"

echo "✅ Identidad configurada como: $USER_NAME"
echo ""

# ==============================
# Verificar repo
# ==============================

if [ ! -d ".git" ]; then
  echo "❌ Este directorio no es un repositorio git"
  exit 1
fi

# ==============================
# Menú principal
# ==============================

echo "📌 ¿Qué deseas hacer?"
echo " [ 1 ] Subir cambios a DEVELOP"
echo " [ 2 ] Migrar DEVELOP → MAIN"
echo " [ 0 ] Salir"
echo "------------------------------"
read -p "Selecciona una opción: " OPCION

# ==============================
# OPCIÓN 1 → DEVELOP
# ==============================

if [ "$OPCION" == "1" ]; then

    echo "🌿 Cambiando a rama develop..."

    # Crear develop si no existe
    git checkout develop 2>/dev/null || git checkout -b develop

    echo "📋 Estado actual:"
    git status -s

    echo "➕ Añadiendo archivos..."
    git add .

    read -p "✏️  Mensaje del commit: " MENSAJE

    if [ -z "$MENSAJE" ]; then
      MENSAJE="Actualización en develop por $USER_NAME"
    fi

    git commit -m "$MENSAJE"

    echo "⬆️ Subiendo a develop..."
    git push -u origin develop

    echo ""
    echo "✅ Cambios subidos a DEVELOP"
    echo "======================================"
fi


# ==============================
# OPCIÓN 2 → MERGE A MAIN
# ==============================

if [ "$OPCION" == "2" ]; then

    echo "⚠️ Vas a migrar DEVELOP → MAIN"
    read -p "¿Estás seguro? (yes/no): " CONFIRMACION

    if [ "$CONFIRMACION" != "yes" ]; then
        echo "Cancelado."
        exit 0
    fi

    echo "🌿 Cambiando a main..."
    git checkout main

    echo "🔄 Haciendo merge de develop..."
    git merge develop

    echo "⬆️ Subiendo main..."
    git push origin main

    echo ""
    echo "🚀 DEVELOP MIGRADO A MAIN"
    echo "======================================"
fi

