import { JARVIS_URL, SUPABASE_URL, SUPABASE_KEY } from "./constants";

interface FetchOptions {
  timeout?: number;
}

// ─── Supabase helpers ──────────────────────────────────────────────

function supabaseHeaders(): Record<string, string> {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
  };
}

export async function supabaseSelect<T = Record<string, unknown>>(
  table: string,
  params: Record<string, string> = {},
): Promise<T[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  const qs = new URLSearchParams({ select: "*", ...params });
  const res = await fetchWithTimeout(
    `${SUPABASE_URL}/rest/v1/${table}?${qs}`,
    { method: "GET", headers: supabaseHeaders() },
  );
  if (!res.ok) return [];
  return res.json();
}

export async function supabaseCount(
  table: string,
  filters: Record<string, string> = {},
): Promise<number> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return 0;
  const qs = new URLSearchParams({ select: "id", ...filters });
  const res = await fetchWithTimeout(
    `${SUPABASE_URL}/rest/v1/${table}?${qs}`,
    {
      method: "GET",
      headers: {
        ...supabaseHeaders(),
        Prefer: "count=exact",
        "Range-Unit": "items",
        Range: "0-0",
      },
    },
  );
  if (!res.ok) return 0;
  const range = res.headers.get("content-range");
  if (range) {
    const total = range.split("/")[1];
    return total === "*" ? 0 : parseInt(total, 10);
  }
  return 0;
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  opts: FetchOptions = {}
): Promise<Response> {
  const { timeout = 30000 } = opts;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function fetchAgents(): Promise<
  Record<string, { name: string; title: string }>
> {
  const res = await fetchWithTimeout(`${JARVIS_URL}/agents`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Falha ao carregar agents");
  return res.json();
}

export async function fetchHealth(): Promise<{
  status: string;
  ollama: boolean;
  models: string[];
  supabase: boolean;
  claude: boolean;
}> {
  const res = await fetchWithTimeout(`${JARVIS_URL}/health`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Falha no health check");
  return res.json();
}

// ─── Config helpers ──────────────────────────────────────────────

export interface AgentConfigRow {
  slug: string;
  model: string;
  is_active: boolean;
}

export async function fetchAgentConfigs(): Promise<AgentConfigRow[]> {
  const res = await fetchWithTimeout(`${JARVIS_URL}/config/agents`, {
    method: "GET",
  });
  if (!res.ok) return [];
  return res.json();
}

export async function saveAgentConfigs(
  agents: AgentConfigRow[]
): Promise<{ updated: number; total: number }> {
  const res = await fetchWithTimeout(`${JARVIS_URL}/config/agents`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ agents }),
  });
  if (!res.ok) throw new Error("Falha ao salvar configuracoes");
  return res.json();
}

export function streamAgent(
  agentSlug: string,
  message: string,
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (err: Error) => void
): AbortController {
  const controller = new AbortController();

  (async () => {
    try {
      const res = await fetch(
        `${JARVIS_URL}/jarvis/${agentSlug}/stream`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, stream: true }),
          signal: controller.signal,
        }
      );
      if (!res.ok || !res.body) {
        throw new Error(`JARVIS respondeu ${res.status}: ${res.statusText}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finished = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          let data: Record<string, unknown>;
          try {
            data = JSON.parse(payload);
          } catch {
            // JSON invalido — pula essa linha
            continue;
          }
          if (data.type === "token" && data.token) {
            onToken(data.token as string);
          } else if (data.type === "done") {
            finished = true;
            onDone();
          } else if (data.type === "error") {
            throw new Error((data.message as string) ?? "Erro no agent");
          }
        }
      }
      if (!finished) onDone();
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        onError(e instanceof Error ? e : new Error(String(e)));
      }
    }
  })();

  return controller;
}

// ─── Orchestrator helpers ─────────────────────────────────────

export interface OrchestrateResponse {
  session_id: string;
  agents_consulted: string[];
  responses: {
    agent: string;
    name: string;
    title: string;
    response: string;
  }[];
  timestamp: string;
}

export async function orchestrate(message: string, sessionId?: string): Promise<OrchestrateResponse> {
  const res = await fetchWithTimeout(`${JARVIS_URL}/jarvis/orchestrate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, session_id: sessionId }),
  });
  if (!res.ok) throw new Error("Orquestração falhou");
  return res.json();
}

// ─── Brain (Cérebro Externo) helpers ──────────────────────────

export interface BrainNode {
  id: string;
  slug: string;
  title: string;
  node_type: string;
  content: string;
  summary: string | null;
  tags: string[];
  parent_moc: string | null;
  metadata: Record<string, unknown>;
  created_by: string;
  is_active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface BrainEdge {
  slug: string;
  title: string;
  node_type: string;
  summary: string | null;
  edge_type: string;
  distance: number;
}

export interface BrainStats {
  total_nodes: number;
  nodes_by_type: Record<string, number>;
  total_edges: number;
  total_learnings: number;
  last_checkpoint: {
    checkpoint_date: string;
    health_score: number;
    summary: string;
  } | null;
}

export interface BrainLearning {
  content: string;
  learning_type: string;
  confidence: number;
  created_at: string;
}

export async function fetchBrainStats(): Promise<BrainStats> {
  const res = await fetchWithTimeout(`${JARVIS_URL}/brain/stats`, { method: "GET" });
  if (!res.ok) throw new Error("Falha ao carregar stats do cérebro");
  return res.json();
}

export async function fetchBrainNode(slug: string): Promise<BrainNode> {
  const res = await fetchWithTimeout(`${JARVIS_URL}/brain/node/${slug}`, { method: "GET" });
  if (!res.ok) throw new Error(`Node '${slug}' não encontrado`);
  return res.json();
}

export async function fetchBrainNavigate(slug: string, depth: number = 1): Promise<BrainEdge[]> {
  const res = await fetchWithTimeout(`${JARVIS_URL}/brain/navigate/${slug}?depth=${depth}`, { method: "GET" });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchBrainChildren(slug: string): Promise<BrainNode[]> {
  const res = await fetchWithTimeout(`${JARVIS_URL}/brain/children/${slug}`, { method: "GET" });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchBrainSearch(query: string, limit: number = 5): Promise<BrainEdge[]> {
  const qs = new URLSearchParams({ q: query, limit: String(limit) });
  const res = await fetchWithTimeout(`${JARVIS_URL}/brain/search?${qs}`, { method: "GET" });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchBrainLearnings(agentSlug: string, limit: number = 10): Promise<BrainLearning[]> {
  const res = await fetchWithTimeout(`${JARVIS_URL}/brain/learnings/${agentSlug}?limit=${limit}`, { method: "GET" });
  if (!res.ok) return [];
  return res.json();
}

export async function createBrainNode(data: {
  slug: string;
  title: string;
  node_type: string;
  content: string;
  summary?: string;
  tags?: string[];
  parent_moc?: string;
  created_by?: string;
}): Promise<BrainNode> {
  const res = await fetchWithTimeout(`${JARVIS_URL}/brain/node`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Falha ao criar node");
  return res.json();
}

export async function updateBrainNode(slug: string, data: Partial<Pick<BrainNode, "title" | "content" | "summary" | "tags" | "is_active">>): Promise<BrainNode> {
  const res = await fetchWithTimeout(`${JARVIS_URL}/brain/node/${slug}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Falha ao atualizar node");
  return res.json();
}

export async function runBrainCheckpoint(): Promise<Record<string, unknown>> {
  const res = await fetchWithTimeout(`${JARVIS_URL}/brain/checkpoint`, { method: "POST" });
  if (!res.ok) throw new Error("Falha ao executar checkpoint");
  return res.json();
}
