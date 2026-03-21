"use client";

import { useState, useEffect, useCallback, use } from "react";
import { AGENT_MAP } from "@/lib/constants";
import { supabaseSelect } from "@/lib/api";
import { ChatModal } from "@/components/ChatModal";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  Clock,
  Bot,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface Projeto {
  id: string;
  nome: string;
  cliente: string;
  valor: number;
  prazo: string;
  responsavel: string;
  status: string;
  progresso: number;
  descricao: string;
  created_at: string;
}

interface Interacao {
  id: string;
  agent: string;
  user_message: string;
  agent_response: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  backlog:       { label: "Backlog",       color: "bg-zinc-600" },
  em_andamento:  { label: "Em andamento",  color: "bg-blue-500" },
  em_revisao:    { label: "Em revisao",    color: "bg-yellow-500" },
  entregue:      { label: "Entregue",      color: "bg-green-500" },
  cancelado:     { label: "Cancelado",     color: "bg-red-500" },
};

export default function ProjetoDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [interacoes, setInteracoes] = useState<Interacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatAgent, setChatAgent] = useState<typeof AGENT_MAP[string] | null>(null);
  const [chatPrompt, setChatPrompt] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    const rows = await supabaseSelect<Projeto>("projetos", {
      id: `eq.${id}`,
      limit: "1",
    });
    if (rows.length > 0) {
      setProjeto(rows[0]);
      const hist = await supabaseSelect<Interacao>("jarvis_memory", {
        session_id: `eq.projeto-${id}`,
        order: "created_at.desc",
        limit: "20",
      });
      setInteracoes(hist);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  function acionarPM() {
    if (!projeto) return;
    const pmAgent = AGENT_MAP["pm"];
    if (pmAgent) {
      setChatAgent(pmAgent);
      setChatPrompt(
        `Analise o projeto "${projeto.nome}" do cliente ${projeto.cliente}. ` +
        `Valor: R$${projeto.valor}. Prazo: ${projeto.prazo}. Status: ${projeto.status}. ` +
        `Progresso: ${projeto.progresso}%. Descricao: ${projeto.descricao ?? "N/A"}. ` +
        `Gere um status report completo com riscos e proximos passos.`
      );
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!projeto) {
    return (
      <div className="p-6 text-center text-zinc-500">
        Projeto nao encontrado
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[projeto.status] ?? STATUS_LABELS.backlog;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/projetos"
            className="p-2 rounded-lg hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight">{projeto.nome}</h1>
            <p className="text-xs text-zinc-500 mt-0.5">{projeto.cliente}</p>
          </div>
          <button
            onClick={acionarPM}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-sm font-medium text-white transition-colors"
          >
            <Bot className="w-4 h-4" />
            Acionar PM Agent
          </button>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Info cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <InfoCard icon={<div className={`w-2 h-2 rounded-full ${statusInfo.color}`} />} label="Status" value={statusInfo.label} />
          <InfoCard icon={<DollarSign className="w-4 h-4 text-green-400" />} label="Valor" value={`R$ ${(projeto.valor ?? 0).toLocaleString("pt-BR")}`} />
          <InfoCard icon={<Calendar className="w-4 h-4 text-blue-400" />} label="Prazo" value={projeto.prazo ? new Date(projeto.prazo).toLocaleDateString("pt-BR") : "N/A"} />
          <InfoCard icon={<User className="w-4 h-4 text-purple-400" />} label="Responsavel" value={projeto.responsavel ?? "N/A"} />
          <InfoCard icon={<Clock className="w-4 h-4 text-amber-400" />} label="Progresso" value={`${projeto.progresso ?? 0}%`} />
        </div>

        {/* Progress bar */}
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-zinc-300">Progresso geral</span>
            <span className="text-sm text-zinc-400">{projeto.progresso ?? 0}%</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
              style={{ width: `${projeto.progresso ?? 0}%` }}
            />
          </div>
        </div>

        {/* Descricao */}
        {projeto.descricao && (
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4">
            <h2 className="text-sm font-medium text-zinc-400 mb-2">Descricao</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">{projeto.descricao}</p>
          </div>
        )}

        {/* Historico de interacoes */}
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4">
          <h2 className="text-sm font-medium text-zinc-400 mb-3">Historico de interacoes</h2>
          {interacoes.length === 0 ? (
            <p className="text-sm text-zinc-600 py-4 text-center">
              Nenhuma interacao registrada — acione o PM Agent para comecar
            </p>
          ) : (
            <div className="space-y-3">
              {interacoes.map((int) => (
                <div key={int.id} className="border-l-2 border-zinc-700 pl-3 space-y-1">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                    <span className="font-medium text-zinc-400">{int.agent}</span>
                    <span>{new Date(int.created_at).toLocaleString("pt-BR")}</span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2">{int.agent_response}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {chatAgent && (
        <ChatModal
          agent={chatAgent}
          initialPrompt={chatPrompt}
          onClose={() => { setChatAgent(null); setChatPrompt(""); }}
        />
      )}
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl px-4 py-3">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[10px] text-zinc-500">{label}</span>
      </div>
      <p className="text-sm font-medium text-zinc-200">{value}</p>
    </div>
  );
}
