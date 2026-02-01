# Configuración de codificación para emojis
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "==============================" -ForegroundColor Cyan
Write-Host " 🚀 GESTIÓN DE REPOSITORIO" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

# 1. COMPROBAR CAMBIOS NUEVOS EN LA NUBE
Write-Host "🔍 Buscando cambios nuevos en GitHub..." -ForegroundColor Gray
git fetch | Out-Null

$cambiosNuevos = git log HEAD..origin/main --oneline --pretty=format:"- %an: %s"

if ($cambiosNuevos) {
    Write-Host "⚠️  HAY CAMBIOS NUEVOS DE TU COMPAÑERO/A:" -ForegroundColor Yellow
    Write-Host $cambiosNuevos
    Write-Host "`n📥 Descargando actualizaciones antes de continuar..." -ForegroundColor Gray
    git pull
} else {
    Write-Host "✨ Todo actualizado, no hay cambios externos." -ForegroundColor Green
}

Write-Host "`n------------------------------"

# 2. MENÚ DE SELECCIÓN DE USUARIO
Write-Host "👤 ¿Quién está realizando los cambios ahora?"
Write-Host " [ 1 ] - Domingo"
Write-Host " [ 2 ] - Dámaris"
Write-Host " [ 0 ] - Salir"
Write-Host "------------------------------"
$opcion = Read-Host "Selecciona una opción"

switch ($opcion) {
    "1" {
        $userName = "Domingo"
        $userEmail = "domingojosenavarroorihuela@alumno.ieselrincon.es"
    }
    "2" {
        $userName = "Dámaris"
        $userEmail = "damarisvidalrodriguez@alumno.ieselrincon.es"
    }
    "0" {
        Write-Host "👋 Saliendo..." -ForegroundColor Yellow
        exit
    }
    Default {
        Write-Host "❌ Opción no válida." -ForegroundColor Red
        exit
    }
}

# Configurar identidad local
git config user.name "$userName"
git config user.email "$userEmail"

# 3. PROCESO DE SUBIDA
if (-not (Test-Path ".git")) {
    Write-Host "❌ Error: No es un repositorio git." -ForegroundColor Red
    exit
}

Write-Host "`n📋 Estado actual:" -ForegroundColor Yellow
git status -s

Write-Host "`n➕ Añadiendo archivos..." -ForegroundColor Yellow
git add .

$mensaje = Read-Host "✏️  Mensaje del commit"
if ([string]::IsNullOrWhiteSpace($mensaje)) {
    $mensaje = "Actualización automática por $userName"
}

Write-Host "📦 Creando commit..." -ForegroundColor Yellow
git commit -m "$mensaje"

Write-Host "⬆️  Subiendo a GitHub..." -ForegroundColor Yellow
git push

Write-Host "======================================" -ForegroundColor Green
Write-Host " ✅ PROYECTO SUBIDO POR $userName" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green