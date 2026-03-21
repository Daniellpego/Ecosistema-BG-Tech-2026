# ============================================
# GRADIOS — Toggle entre LOCAL e EXTERNO
# Uso: .\toggle-env.ps1 local | externo
# ============================================

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("local", "externo")]
    [string]$Mode
)

$envFile = "E:\gradios\apps\gradios-ui\.env.local"

if (-not (Test-Path $envFile)) {
    Write-Host "ERRO: .env.local nao encontrado" -ForegroundColor Red
    exit 1
}

$content = Get-Content $envFile -Raw

if ($Mode -eq "externo") {
    $content = $content -replace "NEXT_PUBLIC_JARVIS_URL=http://localhost:8001", "# NEXT_PUBLIC_JARVIS_URL=http://localhost:8001"
    $content = $content -replace "# NEXT_PUBLIC_JARVIS_URL=https://jarvis.gradios.co", "NEXT_PUBLIC_JARVIS_URL=https://jarvis.gradios.co"
    Write-Host "Modo EXTERNO ativado: https://jarvis.gradios.co" -ForegroundColor Green
} else {
    $content = $content -replace "NEXT_PUBLIC_JARVIS_URL=https://jarvis.gradios.co", "# NEXT_PUBLIC_JARVIS_URL=https://jarvis.gradios.co"
    $content = $content -replace "# NEXT_PUBLIC_JARVIS_URL=http://localhost:8001", "NEXT_PUBLIC_JARVIS_URL=http://localhost:8001"
    Write-Host "Modo LOCAL ativado: http://localhost:8001" -ForegroundColor Green
}

Set-Content $envFile $content
Write-Host "Reinicie o Next.js para aplicar: npm run dev" -ForegroundColor Yellow
