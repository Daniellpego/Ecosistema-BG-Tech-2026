"use client";

import { useState, useEffect, useCallback } from "react";
import { JARVIS_URL } from "@/lib/constants";
import {
  Activity,
  RefreshCw,
  Wifi,
  WifiOff,
  Server,
  Database,
  MessageSquare,
  Globe,
  Cloud,
  Bot,
  Cpu,
  Zap,
  BrainCircuit,
} from "lucide-react";

interface ServiceStatus {
  ok: boolean;
  latency_ms?: number;
  models?: string[];
}

interface HealthData {
  status: string;
  agents_count: number;
  version: string;
  services: Record<string, ServiceStatus>;
}

const SERVICE_META: Record<string, { label: string; icon: React.ElementType; desc: string }> = {
  ollama:     { label: "Ollama",         icon: Cpu,            desc: "Motor de IA local (qwen2.5:14b)" },
  supabase:   { label: "Supabase",       icon: Database,       desc: "Banco de dados PostgreSQL" },
  whatsapp:   { label: "WhatsApp",       icon: MessageSquare,  desc: "Evolution API (mensagens)" },
  n8n:        { label: "N8N",            icon: Zap,            desc: "Automacoes e workflows" },
  cloudflare: { label: "Cloudflare",     icon: Cloud,          desc: "Tunnel (acesso externo)" },
  claude:     { label: "Claude API",     icon: Bot,            desc: "IA Anthropic (fallback)" },
  brain:      { label: "Cerebro",       icon: BrainCircuit,   desc: "Knowledge Graph (memoria)" },
};

function statusColor(ok: boolean): string {
  return ok ? "bg-status-ok" : "bg-status-error";
}

function statusLabel(ok: boolean): string {
  return ok ? "Online" : "Offline";
}

function statusTextColor(ok: boolean): string {
  return ok ? "text-status-ok" : "text-status-error";
}

export default function StatusPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  const checkHealth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${JARVIS_URL}/health`, {
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        setHealth(await res.json());
      }
    } catch {
      setHealth(null);
    } finally {
      setLoading(false);
      setLastCheck(new Date());
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // a cada 30s
    return () => clearInterval(interval);
  }, [checkHealth]);

  const services = health?.services ?? {};
  const totalServices = Object.keys(SERVICE_META).length;
  const onlineCount = Object.values(services).filter((s) => s.ok).length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border-subtle bg-bg/80 backdrop-blur-md px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-brand-cyan" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">Status do Sistema</h1>
              <p className="text-xs text-text-muted mt-0.5">
                {health ? `v${health.version} · ${health.agents_count} agents` : "Verificando..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={checkHealth}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-bg-overlay text-text-secondary hover:text-text-secondary transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <span className="text-[10px] text-text-dim">
              {lastCheck.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Overall status */}
        <div className={`rounded-card border p-6 text-center ${
          !health
            ? "border-status-error/30 bg-status-error/5"
            : health.status === "ok"
              ? "border-status-ok/30 bg-status-ok/5"
              : "border-status-warn/30 bg-status-warn/5"
        }`}>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            !health
              ? "bg-status-error/10 text-status-error"
              : health.status === "ok"
                ? "bg-status-ok/10 text-status-ok"
                : "bg-status-warn/10 text-status-warn"
          }`}>
            {!health ? (
              <><WifiOff className="w-4 h-4" /> API Offline</>
            ) : health.status === "ok" ? (
              <><Wifi className="w-4 h-4" /> Todos os servicos operacionais</>
            ) : (
              <><Server className="w-4 h-4" /> Sistema degradado ({onlineCount}/{totalServices} online)</>
            )}
          </div>
          <p className="text-xs text-text-muted mt-2">
            Atualiza automaticamente a cada 30 segundos
          </p>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(SERVICE_META).map(([key, meta]) => {
            const svc = services[key];
            const ok = svc?.ok ?? false;
            const latency = svc?.latency_ms;
            const Icon = meta.icon;

            return (
              <div
                key={key}
                className="bg-bg-raised border border-border-subtle rounded-card p-4 hover:border-border-hover transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      ok ? "bg-status-ok/10 text-status-ok" : "bg-status-error/10 text-status-error"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary">{meta.label}</p>
                      <p className="text-[10px] text-text-dim">{meta.desc}</p>
                    </div>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${statusColor(ok)} ${ok ? "animate-pulse" : ""}`} />
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${statusTextColor(ok)}`}>
                    {statusLabel(ok)}
                  </span>
                  {latency !== undefined && latency > 0 && (
                    <span className="text-[10px] text-text-muted">
                      {latency}ms
                    </span>
                  )}
                </div>

                {/* Models for Ollama */}
                {key === "ollama" && svc?.models && svc.models.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {svc.models.map((m) => (
                      <span key={m} className="text-[9px] text-text-muted bg-bg-overlay px-1.5 py-0.5 rounded">
                        {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* URLs */}
        <div className="bg-bg-raised border border-border-subtle rounded-card p-4">
          <h3 className="text-sm font-medium text-text-secondary mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            URLs de acesso
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { label: "API JARVIS (local)", url: "http://localhost:8001" },
              { label: "API JARVIS (externo)", url: "https://jarvis.gradios.co" },
              { label: "UI (local)", url: "http://localhost:3010" },
              { label: "UI (externo)", url: "https://app.gradios.co" },
              { label: "N8N (local)", url: "http://localhost:5678" },
              { label: "N8N (externo)", url: "https://n8n.gradios.co" },
            ].map((item) => (
              <div key={item.url} className="flex items-center justify-between py-1.5">
                <span className="text-xs text-text-muted">{item.label}</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-cyan hover:text-brand-cyan/80 font-mono"
                >
                  {item.url}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
