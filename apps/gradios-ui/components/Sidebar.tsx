"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  FolderKanban,
  CalendarDays,
  FileText,
  Bell,
  BrainCircuit,
  Activity,
  Settings,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/",         label: "Painel",    icon: LayoutDashboard },
  { href: "/agents",   label: "Agents",    icon: Bot },
  { href: "/projetos", label: "Projetos",  icon: FolderKanban },
  { href: "/agenda",   label: "Agenda",    icon: CalendarDays },
  { href: "/estudos",  label: "Estudos",   icon: FileText },
  { href: "/alertas",  label: "Alertas",   icon: Bell },
  { href: "/cerebro",  label: "Cérebro",   icon: BrainCircuit },
  { href: "/status",   label: "Status",    icon: Activity },
];

const BOTTOM_NAV = [
  { href: "/config", label: "Config", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-bg-raised border-r border-border-subtle flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border-subtle">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-glow-sm">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-text">GRADIOS</h1>
            <p className="text-[10px] text-text-dim font-medium tracking-wider">JARVIS</p>
          </div>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150
                ${isActive
                  ? "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20"
                  : "text-text-muted hover:text-text-secondary hover:bg-bg-overlay border border-transparent"
                }
              `}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
              {item.href === "/alertas" && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-status-warn" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-3 border-t border-border-subtle space-y-0.5">
        {BOTTOM_NAV.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150
                ${isActive
                  ? "bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20"
                  : "text-text-muted hover:text-text-secondary hover:bg-bg-overlay border border-transparent"
                }
              `}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* User */}
        <div className="flex items-center gap-2.5 px-3 py-2 mt-1">
          <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">DP</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-text-secondary truncate">Daniel Pego</p>
            <p className="text-[10px] text-text-dim truncate">daniel@gradios.co</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
