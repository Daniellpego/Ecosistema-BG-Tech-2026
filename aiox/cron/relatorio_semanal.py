"""AIOX Cron — Relatorio Semanal Consolidado.

Roda toda segunda-feira as 08h. Consolida a semana anterior
e envia relatorio formatado para os 3 socios via WhatsApp.
"""

import asyncio
import json
import logging
import os
from datetime import datetime, timezone, timedelta
from pathlib import Path

import httpx
from dotenv import load_dotenv

_project_root = Path(__file__).resolve().parent.parent.parent
load_dotenv(_project_root / ".env")

SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
EVOLUTION_URL: str = os.getenv("EVOLUTION_URL", "http://localhost:8080")
EVOLUTION_INSTANCE: str = os.getenv("EVOLUTION_INSTANCE", "gradios")
EVOLUTION_APIKEY: str = os.getenv("EVOLUTION_APIKEY", "")

SOCIOS = {
    "Daniel": os.getenv("DANIEL_WHATSAPP", "5543988372540"),
    "Gustavo": os.getenv("GUSTAVO_WHATSAPP", ""),
    "Brian": os.getenv("BRIAN_WHATSAPP", ""),
}

logger = logging.getLogger("aiox.relatorio_semanal")
logger.setLevel(logging.INFO)
if not logger.handlers:
    logger.addHandler(logging.StreamHandler())


def _sb_headers() -> dict[str, str]:
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
    }


async def _count(table: str, filters: dict[str, str]) -> int:
    """Conta registros no Supabase com filtros."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(
                f"{SUPABASE_URL}/rest/v1/{table}",
                headers={
                    **_sb_headers(),
                    "Prefer": "count=exact",
                    "Range-Unit": "items",
                    "Range": "0-0",
                },
                params={"select": "id", **filters},
            )
            r.raise_for_status()
            content_range = r.headers.get("content-range", "*/0")
            total_str = content_range.split("/")[1]
            return int(total_str) if total_str != "*" else 0
    except Exception:
        return 0


async def _sum_receitas(inicio: str, fim: str) -> float:
    """Soma receitas confirmadas no periodo."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(
                f"{SUPABASE_URL}/rest/v1/receitas",
                headers=_sb_headers(),
                params={
                    "select": "valor_bruto",
                    "and": f"(data.gte.{inicio},data.lte.{fim},status.eq.confirmado)",
                },
            )
            r.raise_for_status()
            rows = r.json()
            return sum(float(row.get("valor_bruto", 0) or 0) for row in rows)
    except Exception:
        return 0.0


async def enviar_whatsapp(numero: str, mensagem: str) -> bool:
    """Envia mensagem via Evolution API."""
    if not EVOLUTION_APIKEY or not numero:
        return False
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.post(
                f"{EVOLUTION_URL}/message/sendText/{EVOLUTION_INSTANCE}",
                headers={"apikey": EVOLUTION_APIKEY, "Content-Type": "application/json"},
                json={"number": numero, "text": mensagem},
            )
            r.raise_for_status()
            return True
    except Exception as e:
        logger.error("Erro WhatsApp para %s: %s", numero, e)
        return False


async def executar() -> None:
    """Gera e envia relatorio semanal consolidado."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        logger.warning("Supabase nao configurado — skip")
        return

    logger.info("Gerando relatorio semanal")

    # Periodo: segunda passada ate domingo
    hoje = datetime.now(timezone.utc)
    seg_passada = hoje - timedelta(days=hoje.weekday() + 7)
    dom_passado = seg_passada + timedelta(days=6)
    inicio = seg_passada.strftime("%Y-%m-%d")
    fim = dom_passado.strftime("%Y-%m-%d")

    # Dados da semana
    leads_semana = await _count("leads", {
        "and": f"(created_at.gte.{inicio},created_at.lte.{fim}T23:59:59)",
    })
    leads_quentes = await _count("leads", {
        "and": f"(created_at.gte.{inicio},created_at.lte.{fim}T23:59:59,lead_temperature.eq.quente)",
    })

    receita_semana = await _sum_receitas(inicio, fim)

    projetos_entregues = await _count("projetos", {
        "and": f"(status.eq.entregue)",
    })
    projetos_ativos = await _count("projetos", {
        "status": "neq.entregue",
    })

    alertas_semana = await _count("jarvis_studies", {
        "and": f"(created_at.gte.{inicio},created_at.lte.{fim}T23:59:59)",
        "tags": "cs.{alerta-crm}",
    })

    estudos_semana = await _count("jarvis_studies", {
        "and": f"(created_at.gte.{inicio},created_at.lte.{fim}T23:59:59)",
    })

    # Monta relatorio
    periodo_fmt = f"{seg_passada.strftime('%d/%m')} a {dom_passado.strftime('%d/%m/%Y')}"
    relatorio = (
        f"\U0001f4ca *RELATORIO SEMANAL GRADIOS*\n"
        f"Periodo: {periodo_fmt}\n\n"
        f"\U0001f465 *LEADS*\n"
        f"  Captados: {leads_semana}\n"
        f"  Quentes: {leads_quentes}\n\n"
        f"\U0001f4b0 *RECEITA*\n"
        f"  Semana: R$ {receita_semana:,.2f}\n\n"
        f"\U0001f4cb *PROJETOS*\n"
        f"  Ativos: {projetos_ativos}\n"
        f"  Entregues (total): {projetos_entregues}\n\n"
        f"\U0001f916 *JARVIS*\n"
        f"  Estudos gerados: {estudos_semana}\n"
        f"  Alertas CRM: {alertas_semana}\n\n"
        f"\U0001f50d *DESTAQUES*\n"
    )

    # Adiciona alertas se houver
    if leads_semana == 0:
        relatorio += "  \u26a0\ufe0f Nenhum lead captado — revisar campanhas\n"
    if leads_quentes > 0:
        relatorio += f"  \u2705 {leads_quentes} leads quentes para abordar\n"
    if receita_semana == 0:
        relatorio += "  \u26a0\ufe0f Nenhuma receita confirmada na semana\n"

    relatorio += f"\n_Gerado por JARVIS — {hoje.strftime('%d/%m/%Y %H:%M')}_"

    # Envia para cada socio
    for nome, numero in SOCIOS.items():
        if numero:
            ok = await enviar_whatsapp(numero, relatorio)
            if ok:
                logger.info("Relatorio enviado para %s", nome)
            else:
                logger.warning("Falha ao enviar para %s", nome)

    logger.info("Relatorio semanal concluido")


if __name__ == "__main__":
    asyncio.run(executar())
