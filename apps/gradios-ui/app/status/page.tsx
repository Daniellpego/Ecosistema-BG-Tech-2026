"use client";

import { useState, useEffect, useCallback } from "react";
import { JARVIS_URL } from "@/lib/constants";
import { UserMenu } from "@/components/UserMenu";
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
};

function statusColor(ok: boolean): string {
  return ok ? "bg-emerald-400" : "bg-red-400";
}

function statusLabel(ok: boolean): string {
  return ok ? "Online" : "Offline";
}

function statusTextColor(ok: boolean): string {
  return ok ? "text-emerald-400" : "text-red-400";
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
      <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-indigo-400" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">Status do Sistema</h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                {health ? `v${health.version} · ${health.agents_count} agents` : "Verificando..."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={checkHealth}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <span className="text-[10px] text-zinc-600">
              {lastCheck.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Overall status */}
        <div className={`rounded-xl border p-6 text-center ${
          !health
            ? "border-red-500/30 bg-red-500/5"
            : health.status === "ok"
              ? "border-emerald-500/30 bg-emerald-500/5"
              : "border-yellow-500/30 bg-yellow-500/5"
        }`}>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            !health
              ? "bg-red-500/10 text-red-400"
              : health.status === "ok"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-yellow-500/10 text-yellow-400"
          }`}>
            {!health ? (
              <><WifiOff className="w-4 h-4" /> API Offline</>
            ) : health.status === "ok" ? (
              <><Wifi className="w-4 h-4" /> Todos os servicos operacionais</>
            ) : (
              <><Server className="w-4 h-4" /> Sistema degradado ({onlineCount}/{totalServices} online)</>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-2">
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
                className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4 hover:border-zinc-700/60 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      ok ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{meta.label}</p>
                      <p className="text-[10px] text-zinc-600">{meta.desc}</p>
                    </div>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${statusColor(ok)} ${ok ? "animate-pulse" : ""}`} />
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${statusTextColor(ok)}`}>
                    {statusLabel(ok)}
                  </span>
                  {latency !== undefined && latency > 0 && (
                    <span className="text-[10px] text-zinc-500">
                      {latency}ms
                    </span>
                  )}
                </div>

                {/* Models for Ollama */}
                {key === "ollama" && svc?.models && svc.models.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {svc.models.map((m) => (
                      <span key={m} className="text-[9px] text-zinc-500 bg-zinc-800/60 px-1.5 py-0.5 rounded">
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
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4">
          <h3 className="text-sm font-medium text-zinc-400 mb-3 flex items-center gap-2">
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
                <span className="text-xs text-zinc-500">{item.label}</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-mono"
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
