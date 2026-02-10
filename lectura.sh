#!/bin/bash

# ==============================================================================
# SCRIPT DE INSPECCIÓN ESENCIAL
# OBJETIVO: Mostrar solo código fuente y archivos de configuración clave.
# ==============================================================================

ROOT_DIR=${1:-"."}

# Validar existencia del directorio
[ ! -d "$ROOT_DIR" ] && echo "Error: Directorio no encontrado." && exit 1

echo "=============================================================================="
echo "RESUMEN EJECUTIVO DE CÓDIGO FUENTE"
echo "=============================================================================="

# Búsqueda selectiva:
# 1. Excluye node_modules, .git, y assets de imagen.
# 2. Excluye archivos de bloqueo (lock) y temporales.
find "$ROOT_DIR" \( -name "node_modules" -o -name ".git" -o -name "assets" -o -name ".angular" \) -prune -o \
    -type f \
    ! -name "package-lock.json" \
    ! -name "*.png" \
    ! -name "*.svg" \
    ! -name "*.ico" \
    ! -name "*.jpg" \
    -print | while read -r archivo; do

    echo -e "\n[ARCHIVO]: $archivo"
    echo "------------------------------------------------------------------------------"
    
    # Mostrar contenido
    cat "$archivo"
    
    echo -e "\n------------------------------------------------------------------------------"
done

echo "=============================================================================="
echo "INSPECCIÓN FINALIZADA"
echo "=============================================================================="
