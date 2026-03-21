"use client";

import { useState, useEffect, useCallback } from "react";
import { supabaseSelect } from "@/lib/api";
import { UserMenu } from "@/components/UserMenu";
import { ChatModal } from "@/components/ChatModal";
import { AGENT_MAP } from "@/lib/constants";
import {
  Plus,
  Search,
  Calendar,
  DollarSign,
  User,
  GripVertical,
  X,
  Loader2,
  FolderKanban,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────
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

const COLUNAS = [
  { key: "backlog",       label: "Backlog",       color: "border-zinc-600" },
  { key: "em_andamento",  label: "Em andamento",  color: "border-blue-500" },
  { key: "em_revisao",    label: "Em revisao",    color: "border-yellow-500" },
  { key: "entregue",      label: "Entregue",      color: "border-green-500" },
  { key: "cancelado",     label: "Cancelado",     color: "border-red-500" },
];

function diasRestantes(prazo: string): number {
  const diff = new Date(prazo).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function prazoColor(prazo: string): string {
  const dias = diasRestantes(prazo);
  if (dias < 0) return "text-red-400";
  if (dias <= 7) return "text-yellow-400";
  return "text-green-400";
}

function prazoBadge(prazo: string): string {
  const dias = diasRestantes(prazo);
  if (dias < 0) return "bg-red-500/10 border-red-500/30";
  if (dias <= 7) return "bg-yellow-500/10 border-yellow-500/30";
  return "bg-green-500/10 border-green-500/30";
}

// ─── Main ───────────────────────────────────────────────────────
export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [chatAgent, setChatAgent] = useState<typeof AGENT_MAP[string] | null>(null);
  const [dragItem, setDragItem] = useState<string | null>(null);

  const loadProjetos = useCallback(async () => {
    setLoading(true);
    const rows = await supabaseSelect<Projeto>("projetos", {
      order: "created_at.desc",
      limit: "100",
    });
    setProjetos(rows);
    setLoading(false);
  }, []);

  useEffect(() => { loadProjetos(); }, [loadProjetos]);

  const filteredProjetos = projetos.filter((p) => {
    const matchSearch =
      !search ||
      p.nome?.toLowerCase().includes(search.toLowerCase()) ||
      p.cliente?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function projetosPorColuna(colKey: string) {
    return filteredProjetos.filter((p) => p.status === colKey);
  }

  async function handleDrop(projetoId: string, novoStatus: string) {
    setProjetos((prev) =>
      prev.map((p) => (p.id === projetoId ? { ...p, status: novoStatus } : p)),
    );
    setDragItem(null);
    // Persist to Supabase via JARVIS API
    try {
      await fetch(`${process.env.NEXT_PUBLIC_JARVIS_URL ?? "http://localhost:8001"}/jarvis/projetos/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projeto_id: projetoId, status: novoStatus }),
      });
    } catch { /* best effort */ }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderKanban className="w-5 h-5 text-indigo-400" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">Projetos</h1>
              <p className="text-xs text-zinc-500 mt-0.5">{projetos.length} projetos</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar projeto ou cliente..."
                className="pl-9 pr-3 py-2 w-64 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 focus:outline-none"
            >
              <option value="">Todos</option>
              {COLUNAS.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo projeto
            </button>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Kanban */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4 min-h-[70vh]">
            {COLUNAS.map((col) => {
              const items = projetosPorColuna(col.key);
              return (
                <div
                  key={col.key}
                  className="space-y-3"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => dragItem && handleDrop(dragItem, col.key)}
                >
                  {/* Column header */}
                  <div className={`flex items-center gap-2 pb-2 border-b-2 ${col.color}`}>
                    <span className="text-sm font-medium text-zinc-300">{col.label}</span>
                    <span className="text-[10px] text-zinc-600 bg-zinc-800/60 px-1.5 rounded-full">
                      {items.length}
                    </span>
                  </div>

                  {/* Cards */}
                  {items.map((projeto) => (
                    <div
                      key={projeto.id}
                      draggable
                      onDragStart={() => setDragItem(projeto.id)}
                      onDragEnd={() => setDragItem(null)}
                      className={`bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-3 space-y-2 cursor-grab active:cursor-grabbing hover:border-zinc-700/60 transition-all ${
                        dragItem === projeto.id ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-zinc-200 leading-tight">
                          {projeto.nome}
                        </p>
                        <GripVertical className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0 mt-0.5" />
                      </div>
                      <p className="text-[11px] text-zinc-500">{projeto.cliente}</p>

                      {/* Progresso */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-zinc-600">Progresso</span>
                          <span className="text-[10px] text-zinc-400">{projeto.progresso ?? 0}%</span>
                        </div>
                        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${projeto.progresso ?? 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-3 text-[10px]">
                        <span className="flex items-center gap-1 text-zinc-500">
                          <DollarSign className="w-3 h-3" />
                          R$ {(projeto.valor ?? 0).toLocaleString("pt-BR")}
                        </span>
                        <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded border ${prazoBadge(projeto.prazo)} ${prazoColor(projeto.prazo)}`}>
                          <Calendar className="w-3 h-3" />
                          {diasRestantes(projeto.prazo)}d
                        </span>
                      </div>

                      {projeto.responsavel && (
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                          <User className="w-3 h-3" />
                          {projeto.responsavel}
                        </div>
                      )}
                    </div>
                  ))}

                  {items.length === 0 && (
                    <div className="text-center py-8 text-[11px] text-zinc-700">
                      Nenhum projeto
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Project Modal */}
      {showModal && (
        <NovoProjetoModal
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); loadProjetos(); }}
        />
      )}

      {chatAgent && (
        <ChatModal
          agent={chatAgent}
          initialPrompt=""
          onClose={() => setChatAgent(null)}
        />
      )}
    </div>
  );
}

// ─── Novo Projeto Modal ──────────────────────────────────────────
function NovoProjetoModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    nome: "",
    cliente: "",
    valor: "",
    prazo: "",
    responsavel: "Daniel",
    descricao: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const jarvisUrl = process.env.NEXT_PUBLIC_JARVIS_URL ?? "http://localhost:8001";
      await fetch(`${jarvisUrl}/jarvis/projetos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome,
          cliente: form.cliente,
          valor: parseFloat(form.valor) || 0,
          prazo: form.prazo,
          responsavel: form.responsavel,
          descricao: form.descricao,
          status: "backlog",
          progresso: 0,
        }),
      });
      onSaved();
    } catch {
      alert("Erro ao salvar projeto");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-200">Novo projeto</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Nome do projeto</label>
              <input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Cliente</label>
              <input
                value={form.cliente}
                onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Valor (R$)</label>
              <input
                type="number"
                value={form.valor}
                onChange={(e) => setForm({ ...form, valor: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Prazo</label>
              <input
                type="date"
                value={form.prazo}
                onChange={(e) => setForm({ ...form, prazo: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Responsavel</label>
            <select
              value={form.responsavel}
              onChange={(e) => setForm({ ...form, responsavel: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-200 focus:outline-none"
            >
              <option value="Daniel">Daniel</option>
              <option value="Gustavo">Gustavo</option>
              <option value="Brian">Brian</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Descricao</label>
            <textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm text-zinc-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Criar projeto
          </button>
        </form>
      </div>
    </div>
  );
}
