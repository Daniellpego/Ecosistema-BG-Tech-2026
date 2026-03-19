"""
GRADIOS JARVIS — Script de teste das integracoes CRM + CFO.

Uso:
  cd E:\gradios\gradios-jarvis
  venv\Scripts\python ..\test_jarvis_integrations.py
"""

import httpx
import json
import sys
from datetime import datetime

BASE = "http://localhost:8001"
TIMEOUT = 120.0
SEPARATOR = "=" * 60


def fmt_json(data: dict, indent: int = 2) -> str:
    """Formata JSON para exibicao."""
    return json.dumps(data, ensure_ascii=False, indent=indent)


def print_header(title: str) -> None:
    """Imprime cabecalho formatado."""
    print(f"\n{SEPARATOR}")
    print(f"  {title}")
    print(SEPARATOR)


def test_health() -> bool:
    """Testa o health check."""
    print_header("1/5 — HEALTH CHECK")
    try:
        r = httpx.get(f"{BASE}/health", timeout=10.0)
        data = r.json()
        print(f"  Status:   {data.get('status', 'N/A')}")
        print(f"  Ollama:   {'OK' if data.get('ollama') else 'OFFLINE'}")
        print(f"  Supabase: {'OK' if data.get('supabase') else 'NAO CONECTADO'}")
        print(f"  Claude:   {'OK' if data.get('claude') else 'SEM API KEY'}")
        print(f"  Modelos:  {', '.join(data.get('models', [])) or 'nenhum'}")
        print(f"  Agents:   {', '.join(data.get('agents', []))}")
        print(f"  Versao:   {data.get('version', 'N/A')}")
        return True
    except Exception as e:
        print(f"  ERRO: {e}")
        print(f"  A API esta rodando em {BASE}?")
        return False


def test_crm_leads() -> None:
    """Testa GET /jarvis/crm/leads."""
    print_header("2/5 — CRM: ANALISE DE LEADS")
    print("  Buscando leads do Supabase + gerando analise IA...")
    print("  (pode levar 30-60s se Ollama estiver processando)")
    try:
        r = httpx.get(f"{BASE}/jarvis/crm/leads", timeout=TIMEOUT)
        if r.status_code != 200:
            print(f"  ERRO HTTP {r.status_code}: {r.text[:200]}")
            return

        data = r.json()
        pipeline = data.get("pipeline", {})

        print(f"\n  PIPELINE:")
        print(f"    Total leads: {pipeline.get('total_leads', 0)}")
        print(f"    Total deals: {pipeline.get('total_deals', 0)}")

        leads = pipeline.get("leads", [])
        if leads:
            print(f"\n  TOP 5 LEADS:")
            for lead in leads[:5]:
                valor = float(lead.get("valor_estimado", 0) or 0)
                print(
                    f"    - {lead.get('nome', 'N/A'):20s} | "
                    f"{lead.get('empresa', 'N/A'):20s} | "
                    f"{lead.get('status', 'N/A'):15s} | "
                    f"R$ {valor:>10,.2f}"
                )

        analise = data.get("analise_ia", "")
        if analise:
            print(f"\n  ANALISE IA:")
            for line in analise.split("\n"):
                print(f"    {line}")
        else:
            print("\n  [Sem analise IA — Ollama pode estar offline]")

    except httpx.TimeoutException:
        print("  TIMEOUT — Ollama demorou mais de 120s para responder")
    except Exception as e:
        print(f"  ERRO: {e}")


def test_cfo_resumo() -> None:
    """Testa GET /jarvis/cfo/resumo."""
    print_header("3/5 — CFO: RESUMO FINANCEIRO")
    print("  Buscando dados financeiros + gerando analise IA...")
    try:
        r = httpx.get(f"{BASE}/jarvis/cfo/resumo", timeout=TIMEOUT)
        if r.status_code != 200:
            print(f"  ERRO HTTP {r.status_code}: {r.text[:200]}")
            return

        data = r.json()
        resumo = data.get("resumo", {})

        if "error" not in resumo:
            print(f"\n  DRE — {resumo.get('periodo', 'N/A')}:")
            print(f"    Receita Bruta:      R$ {resumo.get('receita_bruta', 0):>12,.2f}")
            print(f"    MRR:                R$ {resumo.get('mrr', 0):>12,.2f}")
            print(f"    Custos Fixos:       R$ {resumo.get('custos_fixos', 0):>12,.2f}")
            print(f"    Gastos Variaveis:   R$ {resumo.get('gastos_variaveis', 0):>12,.2f}")
            print(f"    Impostos:           R$ {resumo.get('impostos', 0):>12,.2f}")
            print(f"    Resultado Liquido:  R$ {resumo.get('resultado_liquido', 0):>12,.2f}")
            print(f"    Saldo Caixa:        R$ {resumo.get('saldo_caixa', 0):>12,.2f}")
            print(f"    Burn Rate:          R$ {resumo.get('burn_rate', 0):>12,.2f}")
            print(f"    Runway:             {resumo.get('runway_meses', 0)} meses")
            print(f"    Clientes Ativos:    {resumo.get('clientes_ativos', 0)}")
        else:
            print(f"  [Supabase: {resumo.get('error', 'erro desconhecido')}]")

        analise = data.get("analise_ia", "")
        if analise:
            print(f"\n  ANALISE IA:")
            for line in analise.split("\n"):
                print(f"    {line}")

    except httpx.TimeoutException:
        print("  TIMEOUT — Ollama demorou mais de 120s")
    except Exception as e:
        print(f"  ERRO: {e}")


def test_crm_with_context() -> None:
    """Testa POST /jarvis/crm com injecao automatica de contexto."""
    print_header("4/5 — CRM: PERGUNTA COM CONTEXTO AUTOMATICO")
    print("  Perguntando: 'quais leads precisam de follow-up urgente?'")
    try:
        r = httpx.post(
            f"{BASE}/jarvis/crm",
            json={"message": "quais leads precisam de follow-up urgente?"},
            timeout=TIMEOUT,
        )
        if r.status_code != 200:
            print(f"  ERRO HTTP {r.status_code}: {r.text[:200]}")
            return

        data = r.json()
        print(f"\n  Agent: {data.get('agent_name', 'N/A')}")
        print(f"  Session: {data.get('session_id', 'N/A')}")
        print(f"\n  RESPOSTA:")
        for line in data.get("response", "").split("\n"):
            print(f"    {line}")

    except httpx.TimeoutException:
        print("  TIMEOUT")
    except Exception as e:
        print(f"  ERRO: {e}")


def test_cfo_with_context() -> None:
    """Testa POST /jarvis/cfo com injecao automatica de contexto."""
    print_header("5/5 — CFO: PERGUNTA COM CONTEXTO AUTOMATICO")
    print("  Perguntando: 'qual o runway atual e os maiores riscos?'")
    try:
        r = httpx.post(
            f"{BASE}/jarvis/cfo",
            json={"message": "qual o runway atual e os maiores riscos financeiros?"},
            timeout=TIMEOUT,
        )
        if r.status_code != 200:
            print(f"  ERRO HTTP {r.status_code}: {r.text[:200]}")
            return

        data = r.json()
        print(f"\n  Agent: {data.get('agent_name', 'N/A')}")
        print(f"\n  RESPOSTA:")
        for line in data.get("response", "").split("\n"):
            print(f"    {line}")

    except httpx.TimeoutException:
        print("  TIMEOUT")
    except Exception as e:
        print(f"  ERRO: {e}")


def main() -> None:
    """Executa todos os testes."""
    print(SEPARATOR)
    print("  GRADIOS JARVIS — Teste de Integracoes")
    print(f"  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(SEPARATOR)

    if not test_health():
        print("\nAbortando — API offline.")
        sys.exit(1)

    test_crm_leads()
    test_cfo_resumo()
    test_crm_with_context()
    test_cfo_with_context()

    print(f"\n{SEPARATOR}")
    print("  Todos os testes concluidos.")
    print(SEPARATOR)


if __name__ == "__main__":
    main()
