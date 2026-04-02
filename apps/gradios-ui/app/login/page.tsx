"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Email ou senha incorretos"
          : authError.message,
      );
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 relative overflow-hidden">
      {/* Gradient glow */}
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />

      <div className="w-full max-w-sm space-y-8 relative z-10">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center mb-4 shadow-glow">
            <span className="text-2xl font-bold text-white">G</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text">
            GRADIOS AIOX
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Orquestrador Autonomo de Operacoes
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-text-muted mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="input"
              placeholder="voce@gradios.co"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-text-muted mb-1.5">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
              placeholder="********"
            />
          </div>

          {error && (
            <div className="text-sm text-status-error bg-status-error/10 border border-status-error/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-brand text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-glow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <p className="text-center text-[11px] text-text-dim">
          Acesso restrito aos socios GRADIOS
        </p>
      </div>
    </div>
  );
}
