"use client";

import { useState, useEffect, useCallback } from "react";
import { AGENTS } from "@/lib/constants";
import { fetchHealth, fetchBrainStats, supabaseSelect, supabaseCount, type BrainStats } from "@/lib/api";
import { ChatModal } from "@/components/ChatModal";
import type { Agent } from "@/lib/constants";
import {
  Users,
  DollarSign,
  FolderKanban,
  Bell,
  Bot,
  FileText,
  TrendingUp,
  Clock,
  RefreshCw,
  ArrowRight,
  Zap,
  BrainCircuit,
  GitBranch,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────────

interface HealthData {
  ollama: boolean;
  models: string[];
  supabase: boolean;
  claude: boolean;
  status: string;
}

interface KPIs {
  totalLeads: number;
  totalEstudos: number;
  totalProjetos: number;
  totalAlertas: number;
}

interface RecentStudy {
  id: string;
  title: string;
  agent: string;
  created_at: string;
}

// ─── Component ──────────────────────────────────────────────────

export default function DashboardPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [kpis, setKpis] = useState<KPIs>({ totalLeads: 0, totalEstudos: 0, totalProjetos: 0, totalAlertas: 0 });
  const [recentStudies, setRecentStudies] = useState<RecentStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatAgent, setChatAgent] = useState<Agent | null>(null);
  const [brainStats, setBrainStats] = useState<BrainStats | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [healthData, leads, estudos, projetos, studies, brainData] = await Promise.allSettled([
        fetchHealth().catch(() => null),
        supabaseCount("leads"),
        supabaseCount("jarvis_studies"),
        supabaseCount("projetos"),
        supabaseSelect<RecentStudy>("jarvis_studies", {
          select: "id,title,agent,created_at",
          order: "created_at.desc",
          limit: "6",
        }),
        fetchBrainStats().catch(() => null),
      ]);

      if (healthData.status === "fulfilled" && healthData.value) {
        setHealth(healthData.value);
      }

      setKpis({
        totalLeads: leads.status === "fulfilled" ? leads.value : 0,
        totalEstudos: estudos.status === "fulfilled" ? estudos.value : 0,
        totalProjetos: projetos.status === "fulfilled" ? projetos.value : 0,
        totalAlertas: 0,
      });

      if (studies.status === "fulfilled") {
        setRecentStudies(studies.value);
      }
      if (brainData.status === "fulfilled" && brainData.value) {
        setBrainStats(brainData.value);
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [loadData]);

  const servicesOnline = [
    health?.ollama && "Ollama",
    health?.supabase && "Supabase",
    health?.claude && "Claude",
  ].filter(Boolean);

  function formatRelative(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "agora";
    if (mins < 60) return `${mins}min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `${days}d`;
  }

  const agentMap = Object.fromEntries(AGENTS.map((a) => [a.slug, a]));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border-subtle bg-bg/80 backdrop-blur-md px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Painel</h1>
            <p className="text-xs text-text-muted mt-0.5">
              {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Service status pills */}
            <div className="flex items-center gap-1.5">
              <div className={`status-dot ${health?.ollama ? "status-dot-ok animate-pulse" : "status-dot-error"}`} />
              <span className="text-[11px] text-text-muted">
                {servicesOnline.length > 0 ? `${servicesOnline.length} servicos online` : "Verificando..."}
              </span>
            </div>
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-bg-overlay text-text-muted hover:text-text-secondary transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon={Users}
            label="Leads no Pipeline"
            value={kpis.totalLeads}
            href="/agents"
            color="text-brand-cyan"
            bgColor="bg-brand-cyan/10"
            loading={loading}
          />
          <KPICard
            icon={FolderKanban}
            label="Projetos Ativos"
            value={kpis.totalProjetos}
            href="/projetos"
            color="text-status-info"
            bgColor="bg-status-info/10"
            loading={loading}
          />
          <KPICard
            icon={FileText}
            label="Estudos Gerados"
            value={kpis.totalEstudos}
            href="/estudos"
            color="text-purple-400"
            bgColor="bg-purple-500/10"
            loading={loading}
          />
          <KPICard
            icon={Bot}
            label="Agents Online"
            value={health?.ollama ? AGENTS.length : 0}
            href="/agents"
            color="text-status-ok"
            bgColor="bg-status-ok/10"
            loading={loading}
          />
        </div>

        {/* Brain Health Bar */}
        {brainStats && (
          <Link href="/cerebro" className="card-hover p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
              <BrainCircuit className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-text">Cerebro Externo</p>
                {brainStats.last_checkpoint && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    brainStats.last_checkpoint.health_score >= 80 ? "text-emerald-400 bg-emerald-500/10" : "text-amber-400 bg-amber-500/10"
                  }`}>
                    {brainStats.last_checkpoint.health_score}% health
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-[11px] text-text-dim">
                <span className="flex items-center gap-1"><BrainCircuit className="w-3 h-3" />{brainStats.total_nodes} nodes</span>
                <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" />{brainStats.total_edges} conexoes</span>
                <span className="flex items-center gap-1"><Lightbulb className="w-3 h-3" />{brainStats.total_learnings} aprendizados</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-text-dim shrink-0" />
          </Link>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-sm font-semibold text-text-secondary">Acoes rapidas</h2>
            <div className="space-y-2">
              <QuickAction
                emoji="🤝"
                label="Analisar Pipeline CRM"
                desc="Verificar leads quentes e followups"
                onClick={() => setChatAgent(agentMap["crm"])}
              />
              <QuickAction
                emoji="💰"
                label="Resumo Financeiro"
                desc="DRE, MRR e projecao do mes"
                onClick={() => setChatAgent(agentMap["cfo"])}
              />
              <QuickAction
                emoji="📋"
                label="Status dos Projetos"
                desc="Prazos, entregas e riscos"
                onClick={() => setChatAgent(agentMap["pm"])}
              />
              <QuickAction
                emoji="📢"
                label="Performance de Ads"
                desc="ROAS, CTR e otimizacoes"
                onClick={() => setChatAgent(agentMap["ads"])}
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-secondary">Atividade recente</h2>
              <Link href="/estudos" className="text-xs text-brand-cyan hover:underline flex items-center gap-1">
                Ver todos <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="card">
              {loading && recentStudies.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-5 h-5 border-2 border-border-default border-t-brand-cyan rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-text-dim">Carregando atividade...</p>
                </div>
              ) : recentStudies.length === 0 ? (
                <div className="p-8 text-center">
                  <Zap className="w-8 h-8 text-text-dim mx-auto mb-2" />
                  <p className="text-sm text-text-muted">Nenhuma atividade ainda</p>
                  <p className="text-xs text-text-dim mt-1">Converse com um agent para gerar estudos</p>
                </div>
              ) : (
                <div className="divide-y divide-border-subtle">
                  {recentStudies.map((study) => {
                    const agent = agentMap[study.agent];
                    return (
                      <div key={study.id} className="flex items-center gap-3 px-4 py-3 hover:bg-bg-overlay/50 transition-colors">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${agent?.bgColor ?? "bg-zinc-800"}`}>
                          {agent?.emoji ?? "📄"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-text-secondary truncate">{study.title}</p>
                          <p className="text-[11px] text-text-dim">
                            {agent?.label ?? study.agent}
                          </p>
                        </div>
                        <span className="text-[10px] text-text-dim flex items-center gap-1 flex-shrink-0">
                          <Clock className="w-3 h-3" />
                          {formatRelative(study.created_at)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-secondary">Agents disponiveis</h2>
            <Link href="/agents" className="text-xs text-brand-cyan hover:underline flex items-center gap-1">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {AGENTS.slice(0, 6).map((agent) => (
              <button
                key={agent.slug}
                onClick={() => setChatAgent(agent)}
                className="card-hover p-3 text-center group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mx-auto mb-2 ${agent.bgColor} group-hover:scale-110 transition-transform`}>
                  {agent.emoji}
                </div>
                <p className="text-xs font-medium text-text-secondary group-hover:text-text">{agent.label}</p>
                <p className="text-[10px] text-text-dim mt-0.5">{agent.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {chatAgent && (
        <ChatModal agent={chatAgent} onClose={() => setChatAgent(null)} />
      )}
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────

function KPICard({
  icon: Icon,
  label,
  value,
  href,
  color,
  bgColor,
  loading,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  href: string;
  color: string;
  bgColor: string;
  loading: boolean;
}) {
  return (
    <Link href={href} className="card-accent p-4 hover:border-border-hover transition-colors group">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bgColor}`}>
          <Icon className={`w-4.5 h-4.5 ${color}`} />
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-text-dim group-hover:text-text-muted transition-colors" />
      </div>
      {loading ? (
        <div className="h-8 w-16 bg-bg-overlay rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-text">{value}</p>
      )}
      <p className="text-xs text-text-muted mt-0.5">{label}</p>
    </Link>
  );
}

function QuickAction({
  emoji,
  label,
  desc,
  onClick,
}: {
  emoji: string;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full card-hover p-3 flex items-center gap-3 text-left group"
    >
      <span className="text-xl flex-shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-secondary group-hover:text-text transition-colors">{label}</p>
        <p className="text-[11px] text-text-dim">{desc}</p>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-text-dim group-hover:text-text-muted transition-colors flex-shrink-0" />
    </button>
  );
}
