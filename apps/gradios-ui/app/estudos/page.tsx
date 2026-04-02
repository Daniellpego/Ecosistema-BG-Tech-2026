"use client";

import { useState, useEffect, useCallback } from "react";
import { AGENTS, AGENT_MAP } from "@/lib/constants";
import { supabaseSelect } from "@/lib/api";
import { MarkdownContent } from "@/components/MarkdownContent";
import {
  FileText,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  X,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────

interface Estudo {
  id: string;
  title: string;
  agent: string;
  content: string;
  summary: string | null;
  tags: string[];
  status: string;
  created_at: string;
}

// ─── Component ──────────────────────────────────────────────────────

export default function EstudosPage() {
  const [estudos, setEstudos] = useState<Estudo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterAgent, setFilterAgent] = useState("all");
  const [selectedEstudo, setSelectedEstudo] = useState<Estudo | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await supabaseSelect<Estudo>(
        "jarvis_studies",
        {
          select: "id,title,agent,content,summary,tags,status,created_at",
          order: "created_at.desc",
          limit: "100",
        },
      );
      setEstudos(rows);
    } catch (err) {
      console.error("Erro ao carregar estudos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = estudos.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (e.title ?? "").toLowerCase().includes(q) ||
      (e.tags ?? []).some((t) => t.toLowerCase().includes(q));
    const matchAgent = filterAgent === "all" || e.agent === filterAgent;
    return matchSearch && matchAgent;
  });

  function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function formatRelative(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hrs = Math.floor(diff / 3600000);
    if (hrs < 1) return "agora";
    if (hrs < 24) return `${hrs}h atras`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d atras`;
    return formatDate(iso);
  }

  // Agents que tem estudos (para o filtro)
  const agentsComEstudos = [...new Set(estudos.map((e) => e.agent))];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border-subtle bg-bg/80 backdrop-blur-md px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Estudos</h1>
              <p className="text-xs text-text-muted mt-0.5">{estudos.length} estudos gerados pelos agents</p>
            </div>
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-bg-overlay text-text-secondary hover:text-text-secondary transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      <div className="p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar por titulo ou tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-bg-raised border border-border-subtle rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="bg-bg-raised border border-border-subtle rounded-xl pl-10 pr-8 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 appearance-none cursor-pointer"
            >
              <option value="all">Todos os agents</option>
              {AGENTS.filter((a) => agentsComEstudos.includes(a.slug)).map((a) => (
                <option key={a.slug} value={a.slug}>
                  {a.emoji} {a.label}
                </option>
              ))}
            </select>
          </div>
          <div className="text-xs text-text-muted self-center">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Content: list + viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1 space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {loading && estudos.length === 0 && (
              <div className="py-12 text-center">
                <div className="w-5 h-5 border-2 border-zinc-700 border-t-indigo-400 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-text-dim">Carregando estudos...</p>
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="py-12 text-center">
                <div className="text-2xl mb-2">{"📚"}</div>
                <p className="text-sm text-text-secondary font-medium">Nenhum estudo encontrado</p>
                <p className="text-xs text-text-dim mt-1">Converse com um agent para gerar analises e estudos</p>
              </div>
            )}
            {filtered.map((estudo) => {
              const agent = AGENT_MAP[estudo.agent];
              const selected = selectedEstudo?.id === estudo.id;
              return (
                <button
                  key={estudo.id}
                  onClick={() => setSelectedEstudo(estudo)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selected
                      ? "bg-bg-overlay border-brand-cyan/40"
                      : "bg-bg-raised border-border-subtle hover:border-border-hover"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${agent?.bgColor ?? "bg-zinc-800"}`}>
                      {agent?.emoji ?? "\u{1F4C4}"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium text-text-secondary line-clamp-2">
                        {estudo.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-[10px] font-medium ${agent?.color ?? "text-text-muted"}`}>
                          {agent?.label ?? estudo.agent}
                        </span>
                        <span className="text-[10px] text-text-dim">{formatRelative(estudo.created_at)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(estudo.tags ?? []).slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] bg-bg-overlay text-text-muted px-1.5 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full ${
                        estudo.status === "completo"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-yellow-500/15 text-yellow-400"
                      }`}
                    >
                      {estudo.status}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Viewer */}
          <div className="lg:col-span-2">
            {selectedEstudo ? (
              <div className="bg-bg-raised border border-border-subtle rounded-xl overflow-hidden sticky top-24">
                {/* Viewer header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-border-subtle">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${AGENT_MAP[selectedEstudo.agent]?.bgColor ?? "bg-zinc-800"}`}>
                    {AGENT_MAP[selectedEstudo.agent]?.emoji ?? "\u{1F4C4}"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold text-text">{selectedEstudo.title}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[11px] ${AGENT_MAP[selectedEstudo.agent]?.color ?? "text-text-muted"}`}>
                        {AGENT_MAP[selectedEstudo.agent]?.label ?? selectedEstudo.agent}
                      </span>
                      <span className="text-[10px] text-text-dim flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(selectedEstudo.created_at)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEstudo(null)}
                    className="p-1.5 rounded-lg hover:bg-zinc-800 text-text-muted hover:text-text-secondary transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Viewer content */}
                <div className="px-6 py-5 max-h-[calc(100vh-300px)] overflow-y-auto prose-jarvis">
                  {selectedEstudo.summary && (
                    <div className="mb-4 p-3 bg-bg-overlay/50 rounded-lg border border-border-subtle">
                      <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">Resumo</p>
                      <p className="text-sm text-text-secondary">{selectedEstudo.summary}</p>
                    </div>
                  )}
                  <MarkdownContent content={selectedEstudo.content ?? ""} />
                </div>

                {/* Viewer footer: tags */}
                {(selectedEstudo.tags ?? []).length > 0 && (
                  <div className="px-6 py-3 border-t border-border-subtle flex flex-wrap gap-1.5">
                    {selectedEstudo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-bg-overlay text-text-muted px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-bg-raised/50 border border-border-subtle rounded-xl">
                <FileText className="w-8 h-8 text-zinc-700 mb-3" />
                <p className="text-sm text-text-dim">Selecione um estudo para visualizar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
