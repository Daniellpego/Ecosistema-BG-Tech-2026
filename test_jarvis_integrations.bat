@echo off
chcp 65001 >nul
echo.
echo ========================================================
echo   GRADIOS JARVIS — Teste de Integracoes CRM + CFO
echo   Prerequisitos: API rodando em localhost:8001
echo ========================================================
echo.

echo [1/4] Testando health check...
echo --------------------------------------------------------
curl -s http://localhost:8001/health | python -m json.tool 2>nul || curl -s http://localhost:8001/health
echo.
echo.

echo [2/4] Testando GET /jarvis/crm/leads...
echo --------------------------------------------------------
echo (Aguardando resposta do Ollama — pode levar 30-60s)
curl -s --max-time 120 http://localhost:8001/jarvis/crm/leads | python -m json.tool 2>nul || curl -s --max-time 120 http://localhost:8001/jarvis/crm/leads
echo.
echo.

echo [3/4] Testando GET /jarvis/cfo/resumo...
echo --------------------------------------------------------
echo (Aguardando resposta do Ollama — pode levar 30-60s)
curl -s --max-time 120 http://localhost:8001/jarvis/cfo/resumo | python -m json.tool 2>nul || curl -s --max-time 120 http://localhost:8001/jarvis/cfo/resumo
echo.
echo.

echo [4/4] Testando POST /jarvis/crm (com contexto automatico)...
echo --------------------------------------------------------
curl -s --max-time 120 -X POST http://localhost:8001/jarvis/crm -H "Content-Type: application/json" -d "{\"message\": \"quais leads precisam de follow-up urgente?\"}" | python -m json.tool 2>nul || curl -s --max-time 120 -X POST http://localhost:8001/jarvis/crm -H "Content-Type: application/json" -d "{\"message\": \"quais leads precisam de follow-up urgente?\"}"
echo.
echo.

echo ========================================================
echo   Testes concluidos.
echo ========================================================
pause
