"""AIOX Cron — Monitor de Prazos de Projetos.

Roda todo dia as 18h. Busca projetos com prazo nos proximos 7 dias
e envia alerta para Daniel no WhatsApp.
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
DANIEL_WHATSAPP: str = os.getenv("DANIEL_WHATSAPP", "5543988372540")

logger = logging.getLogger("aiox.monitor_projetos")
logger.setLevel(logging.INFO)
if not logger.handlers:
    logger.addHandler(logging.StreamHandler())


def _sb_headers() -> dict[str, str]:
    """Headers para Supabase REST."""
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
    }


async def enviar_whatsapp(numero: str, mensagem: str) -> bool:
    """Envia mensagem via Evolution API."""
    if not EVOLUTION_APIKEY:
        logger.warning("EVOLUTION_APIKEY nao configurado — skip WhatsApp")
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
        logger.error("Erro ao enviar WhatsApp: %s", e)
        return False


async def executar() -> None:
    """Busca projetos com prazo proximo e envia alertas."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        logger.warning("Supabase nao configurado — skip")
        return

    logger.info("Monitor de projetos iniciado")

    hoje = datetime.now(timezone.utc)
    limite = (hoje + timedelta(days=7)).strftime("%Y-%m-%d")
    hoje_str = hoje.strftime("%Y-%m-%d")

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(
                f"{SUPABASE_URL}/rest/v1/projetos",
                headers=_sb_headers(),
                params={
                    "select": "id,nome,cliente,prazo,responsavel,status,progresso",
                    "and": f"(prazo.lte.{limite},prazo.gte.{hoje_str},status.neq.entregue,status.neq.cancelado)",
                    "order": "prazo.asc",
                },
            )
            r.raise_for_status()
            projetos = r.json()
    except Exception as e:
        logger.error("Erro ao buscar projetos: %s", e)
        return

    if not projetos:
        logger.info("Nenhum projeto com prazo proximo")
        return

    logger.info("Encontrados %d projetos com prazo nos proximos 7 dias", len(projetos))

    # Monta mensagem
    linhas = ["\u26a0\ufe0f *ALERTAS DE PRAZO — PROJETOS*\n"]
    for p in projetos:
        prazo = p.get("prazo", "N/A")
        dias = (datetime.strptime(prazo, "%Y-%m-%d") - datetime.now()).days if prazo != "N/A" else 0
        emoji = "\U0001f534" if dias < 0 else ("\U0001f7e1" if dias <= 3 else "\U0001f7e2")
        linhas.append(
            f"{emoji} *{p.get('nome', 'N/A')}*\n"
            f"   Cliente: {p.get('cliente', 'N/A')}\n"
            f"   Prazo: {prazo}\n"
            f"   Dias restantes: {dias}\n"
            f"   Responsavel: {p.get('responsavel', 'N/A')}\n"
            f"   Progresso: {p.get('progresso', 0)}%\n"
        )

    mensagem = "\n".join(linhas)
    await enviar_whatsapp(DANIEL_WHATSAPP, mensagem)
    logger.info("Alerta de projetos enviado para Daniel")


if __name__ == "__main__":
    asyncio.run(executar())
