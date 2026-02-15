Write-Host "=============================="
Write-Host "  INICIANDO COSMOS FITNESS"
Write-Host "=============================="

docker compose build
docker compose up -d

Write-Host "API: http://localhost:3000"
Write-Host "FRONTEND: http://localhost:8100"
