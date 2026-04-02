"use client";

import { useState, useEffect, useCallback } from "react";
import { AGENTS } from "@/lib/constants";
import { fetchAgentConfigs, saveAgentConfigs } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { Zap, Save, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

type ModelOption = "qwen2.5:14b" | "claude-opus";

interface AgentConfig {
  slug: string;
  active: boolean;
  model: ModelOption;
}

export default function ConfigPage() {
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [jarvisUrl, setJarvisUrl] = useState("http://localhost:8001");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [loading, setLoading] = useState(true);
  const [agentConfigs, setAgentConfigs] = useState<AgentConfig[]>(
    AGENTS.map((a) => ({ slug: a.slug, active: true, model: "qwen2.5:14b" as ModelOption }))
  );

  const loadConfigs = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await fetchAgentConfigs();
      if (rows.length > 0) {
        setAgentConfigs(
          AGENTS.map((a) => {
            const row = rows.find((r) => r.slug === a.slug);
            return {
              slug: a.slug,
              active: row?.is_active ?? true,
              model: (row?.model === "claude-opus" ? "claude-opus" : "qwen2.5:14b") as ModelOption,
            };
          })
        );
      }
    } catch {
      // Usa defaults se falhar
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  function toggleAgent(slug: string) {
    setAgentConfigs((prev) =>
      prev.map((c) => (c.slug === slug ? { ...c, active: !c.active } : c))
    );
  }

  function setModel(slug: string, model: ModelOption) {
    setAgentConfigs((prev) =>
      prev.map((c) => (c.slug === slug ? { ...c, model } : c))
    );
  }

  async function handleSave() {
    setSaveStatus("saving");
    try {
      await saveAgentConfigs(
        agentConfigs.map((c) => ({
          slug: c.slug,
          model: c.model,
          is_active: c.active,
        }))
      );
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border-subtle bg-bg/80 backdrop-blur-md px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
            <Zap className="w-4 h-4 text-text" />
          </div>
          <div>
            <h1 className="font-bold text-text">Configuracoes</h1>
            <p className="text-xs text-text-muted">Personalizar o JARVIS</p>
          </div>
          <div className="ml-auto">
            <button onClick={loadConfigs} disabled={loading}
              className="p-2 rounded-lg hover:bg-bg-overlay text-text-secondary hover:text-text transition-colors disabled:opacity-40">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <div className="px-6 py-8 space-y-8">
        {/* Conexoes */}
        <section>
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
            Conexoes
          </h2>
          <div className="bg-bg-raised border border-border-subtle rounded-card p-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">
                URL do Ollama
              </label>
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => setOllamaUrl(e.target.value)}
                className="w-full bg-bg-overlay border border-border-default rounded-lg px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">
                URL da JARVIS API
              </label>
              <input
                type="text"
                value={jarvisUrl}
                onChange={(e) => setJarvisUrl(e.target.value)}
                className="w-full bg-bg-overlay border border-border-default rounded-lg px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-brand-cyan/30 font-mono"
              />
            </div>
          </div>
        </section>

        {/* Agents */}
        <section>
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
            Agents
          </h2>
          <div className="bg-bg-raised border border-border-subtle rounded-card divide-y divide-border-subtle">
            {AGENTS.map((agent) => {
              const config = agentConfigs.find((c) => c.slug === agent.slug);
              if (!config) return null;
              return (
                <div
                  key={agent.slug}
                  className="p-4 flex items-center gap-4"
                >
                  <span className="text-xl flex-shrink-0">{agent.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-text">
                      {agent.label}
                    </h3>
                    <p className="text-xs text-text-muted">{agent.desc}</p>
                  </div>
                  <select
                    value={config.model}
                    onChange={(e) =>
                      setModel(agent.slug, e.target.value as ModelOption)
                    }
                    className="bg-bg-overlay border border-border-default rounded-lg px-3 py-1.5 text-xs text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-cyan/30"
                  >
                    <option value="qwen2.5:14b">Qwen 2.5:14b</option>
                    <option value="claude-opus">Claude Opus</option>
                  </select>
                  <button
                    onClick={() => toggleAgent(agent.slug)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      config.active ? "bg-brand-cyan" : "bg-bg-overlay"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                        config.active ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <StatusBadge
                    online={config.active}
                    label={config.active ? "Ativo" : "Inativo"}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Salvar */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-card font-medium text-sm transition-all ${
              saveStatus === "saved"
                ? "bg-status-ok text-text"
                : saveStatus === "error"
                  ? "bg-status-error text-text"
                  : saveStatus === "saving"
                    ? "bg-brand-cyan text-text opacity-80"
                    : "bg-gradient-brand hover:opacity-90 text-text"
            }`}
          >
            {saveStatus === "saved" ? (
              <><CheckCircle2 className="w-4 h-4" /> Salvo!</>
            ) : saveStatus === "error" ? (
              <><AlertCircle className="w-4 h-4" /> Erro ao salvar</>
            ) : saveStatus === "saving" ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Salvando...</>
            ) : (
              <><Save className="w-4 h-4" /> Salvar configuracoes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
