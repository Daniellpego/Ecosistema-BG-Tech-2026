@echo off
echo ========================================
echo   GRADIOS AIOX — Iniciando tudo...
echo ========================================
echo.

echo [1/5] Subindo Docker (N8N + Evolution + Redis + Postgres)...
cd /d E:\gradios
docker-compose -f docker-compose.aiox.yml up -d
timeout /t 5 /nobreak > nul

echo [2/5] Iniciando backend JARVIS (porta 8001)...
cd /d E:\gradios\gradios-jarvis
start "JARVIS API" cmd /k "call venv\Scripts\activate && uvicorn app:app --host 0.0.0.0 --port 8001 --reload"
timeout /t 3 /nobreak > nul

echo [3/5] Iniciando frontend GRADIOS UI (porta 3010)...
cd /d E:\gradios\apps\gradios-ui
start "GRADIOS UI" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul

echo [4/5] Iniciando AIOX Scheduler (crons autonomos)...
cd /d E:\gradios
start "AIOX Scheduler" /min cmd /c "cd /d E:\gradios\gradios-jarvis && call venv\Scripts\activate && cd /d E:\gradios && python -m aiox.scheduler"
timeout /t 2 /nobreak > nul

echo [5/6] Verificando saude...
curl -s http://localhost:8001/health 2>nul
echo.
curl -s http://localhost:8080 2>nul
echo.

echo [6/6] Subindo Cloudflare Tunnel...
where cloudflared >nul 2>&1
if %errorlevel%==0 (
    REM Verifica se o servico Windows ja esta rodando
    sc query cloudflared >nul 2>&1
    if %errorlevel%==0 (
        sc query cloudflared | find "RUNNING" >nul 2>&1
        if %errorlevel%==0 (
            echo   Tunnel rodando como servico Windows — OK
        ) else (
            net start cloudflared >nul 2>&1
            echo   Servico cloudflared iniciado!
        )
    ) else (
        start "Cloudflare Tunnel" /min cmd /c "cloudflared tunnel --config E:\gradios\cloudflare\config.yml run gradios-jarvis"
        echo   Tunnel ativo (modo manual)!
    )
) else (
    echo   cloudflared nao instalado — tunnel ignorado
    echo   Para instalar: powershell -ExecutionPolicy Bypass -File E:\gradios\cloudflare\setup-tunnel.ps1
)
timeout /t 2 /nobreak > nul

echo.
echo ========================================
echo   GRADIOS AIOX rodando:
echo.
echo   --- LOCAL ---
echo   API JARVIS:    http://localhost:8001
echo   UI:            http://localhost:3010
echo   N8N:           http://localhost:5678
echo   Evolution API: http://localhost:8080
echo   Redis:         localhost:6379
echo   Scheduler:     background
echo.
echo   --- EXTERNO (Cloudflare Tunnel) ---
echo   API JARVIS:    https://jarvis.gradios.co
echo   UI:            https://app.gradios.co
echo   N8N:           https://n8n.gradios.co
echo ========================================
pause
