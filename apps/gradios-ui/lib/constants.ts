export const JARVIS_URL =
  process.env.NEXT_PUBLIC_JARVIS_URL ?? "http://localhost:8001";

export interface Agent {
  slug: string;
  label: string;
  desc: string;
  emoji: string;
  color: string;
}

export const AGENTS: Agent[] = [
  { slug: "manufatura", label: "Manufatura", desc: "ROI industrial",        emoji: "\u{1F3ED}", color: "text-orange-400" },
  { slug: "fiscal",     label: "Fiscal",     desc: "ICMS/CFOP 2026",       emoji: "\u{1F4CA}", color: "text-emerald-400" },
  { slug: "copy",       label: "Copy",       desc: "Textos que vendem",    emoji: "\u{270D}\u{FE0F}",  color: "text-pink-400" },
  { slug: "dev",        label: "Dev",        desc: "Next.js + Supabase",   emoji: "\u{1F4BB}", color: "text-cyan-400" },
  { slug: "ads",        label: "Ads",        desc: "ROAS 5x+",            emoji: "\u{1F4E2}", color: "text-yellow-400" },
  { slug: "brand",      label: "Brand",      desc: "Identidade premium",   emoji: "\u{1F3A8}", color: "text-purple-400" },
  { slug: "cfo",        label: "CFO",        desc: "Dashboard financeiro", emoji: "\u{1F4B0}", color: "text-green-400" },
  { slug: "crm",        label: "CRM",        desc: "Pipeline clientes",   emoji: "\u{1F91D}", color: "text-blue-400" },
];

export const AGENT_MAP = Object.fromEntries(AGENTS.map((a) => [a.slug, a]));
