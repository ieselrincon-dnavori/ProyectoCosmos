#!/bin/bash

echo "=============================="
echo " 🚀 SUBIENDO PROYECTO A GITHUB"
echo "=============================="

# Comprobar que estamos en un repo git
if [ ! -d ".git" ]; then
  echo "❌ Este directorio no es un repositorio git"
  exit 1
fi

# Mostrar estado
echo "📋 Estado actual:"
git status

# Añadir todo
echo "➕ Añadiendo archivos..."
git add .

# Pedir mensaje de commit
echo ""
read -p "✏️  Mensaje del commit: " MENSAJE

if [ -z "$MENSAJE" ]; then
  MENSAJE="Actualización automática"
fi

# Commit
echo "📦 Creando commit..."
git commit -m "$MENSAJE"

# Push
echo "⬆️  Subiendo a GitHub..."
git push

echo "=============================="
echo " ✅ PROYECTO SUBIDO CORRECTAMENTE"
echo "=============================="

