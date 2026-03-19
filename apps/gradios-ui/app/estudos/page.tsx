"use client";

import { useState } from "react";
import { AGENTS } from "@/lib/constants";
import { MarkdownContent } from "@/components/MarkdownContent";
import { Zap, ArrowLeft, Search, Filter } from "lucide-react";
import Link from "next/link";

interface Estudo {
  id: string;
  title: string;
  agent: string;
  content: string;
  tags: string[];
  status: "completo" | "rascunho";
  created_at: string;
}

const SAMPLE_ESTUDOS: Estudo[] = [
  {
    id: "1",
    title: "Analise ROI Automacao Industrial - Linha 3",
    agent: "manufatura",
    content:
      "## Diagnostico\n\nA Linha 3 apresenta **gargalo no processo de embalagem** com perda de 12% de capacidade.\n\n### ROI Projetado\n\n| Indicador | Valor |\n|-----------|-------|\n| Investimento | R$ 450.000 |\n| Payback | 8 meses |\n| ROI anual | 180% |\n\n### Recomendacao\n\nAutomacao com **bracos roboticos ABB** para a etapa de paletizacao.",
    tags: ["automacao", "roi", "linha-3"],
    status: "completo",
    created_at: "2026-03-15",
  },
  {
    id: "2",
    title: "Reforma Tributaria 2026 - Impacto CBS/IBS",
    agent: "fiscal",
    content:
      "## Analise da Reforma Tributaria\n\nCom a entrada em vigor da **CBS e IBS**, empresas do setor industrial precisam revisar:\n\n1. Creditos de ICMS em transicao\n2. Aliquotas unificadas CBS\n3. Split payment obrigatorio\n\n> Prazo: adequacao ate **Q3 2026**",
    tags: ["tributario", "cbs", "ibs", "2026"],
    status: "completo",
    created_at: "2026-03-12",
  },
  {
    id: "3",
    title: "Campanha Meta Ads - Black Friday 2026",
    agent: "ads",
    content:
      "## Estrutura de Campanha\n\n**Objetivo:** ROAS 5x+ para Black Friday 2026\n\n### Funil\n- **TOF:** Video Views (lookalike 1%)\n- **MOF:** Engagement retargeting\n- **BOF:** Conversao DPA\n\n### Budget\n- Investimento: R$ 50.000\n- ROAS projetado: 5.2x\n- Receita estimada: R$ 260.000",
    tags: ["meta-ads", "black-friday", "roas"],
    status: "rascunho",
    created_at: "2026-03-10",
  },
];

export default function EstudosPage() {
  const [search, setSearch] = useState("");
  const [filterAgent, setFilterAgent] = useState("all");
  const [selectedEstudo, setSelectedEstudo] = useState<Estudo | null>(null);

  const filtered = SAMPLE_ESTUDOS.filter((e) => {
    const matchSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.tags.some((t) => t.includes(search.toLowerCase()));
    const matchAgent = filterAgent === "all" || e.agent === filterAgent;
    return matchSearch && matchAgent;
  });

  const getAgentInfo = (slug: string) =>
    AGENTS.find((a) => a.slug === slug);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white">Estudos</h1>
            <p className="text-xs text-zinc-500">
              Biblioteca de estudos gerados
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar estudos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-8 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 appearance-none cursor-pointer"
            >
              <option value="all">Todos os agents</option>
              {AGENTS.map((a) => (
                <option key={a.slug} value={a.slug}>
                  {a.emoji} {a.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista */}
          <div className="lg:col-span-1 space-y-3">
            {filtered.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-8">
                Nenhum estudo encontrado
              </p>
            ) : (
              filtered.map((estudo) => {
                const agent = getAgentInfo(estudo.agent);
                return (
                  <button
                    key={estudo.id}
                    onClick={() => setSelectedEstudo(estudo)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedEstudo?.id === estudo.id
                        ? "bg-zinc-800/80 border-indigo-500/40"
                        : "bg-zinc-900/80 border-zinc-800/80 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{agent?.emoji ?? "\u{1F4DD}"}</span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-white truncate">
                          {estudo.title}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-1">
                          {agent?.label} &middot; {estudo.created_at}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {estudo.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span
                          className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full ${
                            estudo.status === "completo"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-yellow-500/15 text-yellow-400"
                          }`}
                        >
                          {estudo.status}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Visualizacao */}
          <div className="lg:col-span-2">
            {selectedEstudo ? (
              <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-800">
                  <span className="text-2xl">
                    {getAgentInfo(selectedEstudo.agent)?.emoji ?? "\u{1F4DD}"}
                  </span>
                  <div>
                    <h2 className="font-semibold text-white">
                      {selectedEstudo.title}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {getAgentInfo(selectedEstudo.agent)?.label} &middot;{" "}
                      {selectedEstudo.created_at}
                    </p>
                  </div>
                </div>
                <div className="prose-jarvis">
                  <MarkdownContent content={selectedEstudo.content} />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-zinc-900/50 border border-zinc-800/50 rounded-xl">
                <p className="text-sm text-zinc-600">
                  Selecione um estudo para visualizar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
