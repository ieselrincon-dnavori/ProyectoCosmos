Write-Host "🛑 Parando Cosmos Fitness..."

# Detectar si existe docker-compose
$compose = "docker compose"

if (Get-Command "docker-compose" -ErrorAction SilentlyContinue) {
    $compose = "docker-compose"
}

Write-Host "➡ Usando: $compose"

# Parar contenedores
Invoke-Expression "$compose down"
