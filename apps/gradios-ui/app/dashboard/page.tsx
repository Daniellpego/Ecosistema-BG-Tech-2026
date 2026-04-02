"use client";

import { useState, useEffect, useCallback } from "react";
import { AGENTS } from "@/lib/constants";
import { fetchHealth } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Zap } from "lucide-react";

interface HealthData {
  ollama: boolean;
  models: string[];
  supabase: boolean;
  claude: boolean;
}

export default function DashboardPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHealth = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchHealth();
      setHealth(data);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao conectar");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHealth();
    const interval = setInterval(loadHealth, 30000);
    return () => clearInterval(interval);
  }, [loadHealth]);

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <header className="border-b border-border-subtle bg-bg/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
            <Zap className="w-4 h-4 text-text" />
          </div>
          <div>
            <h1 className="font-bold text-text">Dashboard</h1>
            <p className="text-xs text-text-muted">Metricas e status do sistema</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Status Cards */}
        <section>
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
            Status do Sistema
          </h2>
          {loading && !health ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="bg-status-error/10 border border-status-error/20 rounded-card p-6 text-center">
              <p className="text-status-error text-sm">{error}</p>
              <button
                onClick={loadHealth}
                className="mt-3 text-xs text-status-error hover:text-status-error/80 underline"
              >
                Tentar novamente
              </button>
            </div>
          ) : health ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatusCard
                title="Ollama"
                online={health.ollama}
                detail={health.models.length > 0 ? health.models.join(", ") : "Sem modelos"}
              />
              <StatusCard
                title="Supabase"
                online={health.supabase}
                detail={health.supabase ? "Conectado" : "Nao configurado"}
              />
              <StatusCard
                title="Claude API"
                online={health.claude}
                detail={health.claude ? "API key ativa" : "Sem API key"}
              />
              <StatusCard
                title="JARVIS API"
                online
                detail="FastAPI v2.0"
              />
            </div>
          ) : null}
        </section>

        {/* Agents Grid */}
        <section>
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
            Agents Disponiveis
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AGENTS.map((agent) => (
              <div
                key={agent.slug}
                className="bg-bg-raised border border-border-subtle rounded-card p-4 hover:border-border-subtle/80 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{agent.emoji}</span>
                  <div>
                    <h3 className="font-medium text-sm text-text">
                      {agent.label}
                    </h3>
                    <p className="text-xs text-text-muted">{agent.desc}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <StatusBadge online label="Ativo" />
                  <span className={`text-xs ${agent.color}`}>{agent.slug}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Modelos */}
        <section>
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
            Modelos Carregados
          </h2>
          <div className="bg-bg-raised border border-border-subtle rounded-card p-6">
            {health?.models && health.models.length > 0 ? (
              <div className="space-y-3">
                {health.models.map((model) => (
                  <div
                    key={model}
                    className="flex items-center justify-between bg-bg-overlay rounded-lg px-4 py-3"
                  >
                    <span className="text-sm font-mono text-text-secondary">
                      {model}
                    </span>
                    <StatusBadge online label="Loaded" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted text-center py-4">
                Nenhum modelo carregado no Ollama
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatusCard({
  title,
  online,
  detail,
}: {
  title: string;
  online: boolean;
  detail: string;
}) {
  return (
    <div className="bg-bg-raised border border-border-subtle rounded-card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
        <StatusBadge online={online} />
      </div>
      <p className="text-xs text-text-muted truncate">{detail}</p>
    </div>
  );
}
