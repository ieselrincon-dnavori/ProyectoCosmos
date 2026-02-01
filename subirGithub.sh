#!/bin/bash

echo "=============================="
echo " 🚀 SUBIENDO PROYECTO A GITHUB"
echo "=============================="

# Menú de selección de usuario
echo "👤 ¿Quién está realizando los cambios?"
echo " [ 1 ] - Domingo"
echo " [ 2 ] - Dámaris"
echo " [ 0 ] - Salir"
echo "------------------------------"
read -p "Selecciona una opción: " OPCION

case $OPCION in
    1)
        USER_NAME="Domingo"
        USER_EMAIL="domingojosenavarroorihuela@alumno.ieselrincon.es"
        ;;
    2)
        USER_NAME="Dámaris"
        USER_EMAIL="damarisvidalrodriguez@alumno.ieselrincon.es"
        ;;
    0)
        echo "👋 Saliendo sin subir cambios."
        exit 0
        ;;
    *)
        echo "❌ Opción no válida."
        exit 1
        ;;
esac

# Configurar identidad local para este repositorio
git config user.name "$USER_NAME"
git config user.email "$USER_EMAIL"

echo "✅ Identidad configurada como: $USER_NAME"

# Comprobar que estamos en un repo git
if [ ! -d ".git" ]; then
  echo "❌ Este directorio no es un repositorio git"
  exit 1
fi

# Mostrar estado
echo "📋 Estado actual:"
git status -s

# Añadir todo
echo "➕ Añadiendo archivos..."
git add .

# Pedir mensaje de commit
echo ""
read -p "✏️  Mensaje del commit: " MENSAJE

if [ -z "$MENSAJE" ]; then
  MENSAJE="Actualización automática por $USER_NAME"
fi

# Commit
echo "📦 Creando commit..."
git commit -m "$MENSAJE"

# Push
echo "⬆️  Subiendo a GitHub..."
git push

echo "======================================"
echo " ✅ PROYECTO SUBIDO POR $USER_NAME"
echo "======================================"