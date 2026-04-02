"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface UserData {
  email: string;
  name: string;
  initials: string;
}

const NAME_MAP: Record<string, string> = {
  "daniel": "Daniel",
  "gustavo": "Gustavo",
  "brian": "Brian",
};

function extractName(email: string): string {
  const local = email.split("@")[0].toLowerCase();
  for (const [key, name] of Object.entries(NAME_MAP)) {
    if (local.includes(key)) return name;
  }
  return local.charAt(0).toUpperCase() + local.slice(1);
}

export function UserMenu() {
  const [user, setUser] = useState<UserData | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        const name = extractName(data.user.email);
        setUser({
          email: data.user.email,
          name,
          initials: name.slice(0, 2).toUpperCase(),
        });
      }
    });
  }, [supabase]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (!user) return null;

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-bg-overlay transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center text-[11px] font-bold text-white">
          {user.initials}
        </div>
        <span className="hidden sm:block text-xs text-text-secondary font-medium">
          {user.name}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-bg-raised border border-border-subtle rounded-card shadow-xl py-1 z-50">
          <div className="px-3 py-2 border-b border-border-subtle">
            <p className="text-xs font-medium text-text-secondary">{user.name}</p>
            <p className="text-[10px] text-text-muted truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-status-error hover:bg-bg-overlay transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
