@echo off
echo ========================================
echo   GRADIOS JARVIS — Iniciando...
echo ========================================
echo.

echo [1/3] Iniciando backend...
cd /d E:\gradios\gradios-jarvis
start "JARVIS API" cmd /k "call venv\Scripts\activate && uvicorn app:app --host 0.0.0.0 --port 8001 --reload"

timeout /t 3 /nobreak > nul

echo [2/3] Iniciando frontend...
cd /d E:\gradios\apps\gradios-ui
start "GRADIOS UI" cmd /k "npm run dev"

timeout /t 5 /nobreak > nul

echo [3/3] Verificando saude...
curl -s http://localhost:8001/health

echo.
echo ========================================
echo   JARVIS rodando:
echo   API:  http://localhost:8001
echo   UI:   http://localhost:3000
echo ========================================
pause
