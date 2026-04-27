"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@gradios/ui";

const CONSENT_KEY = "gradios-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (!consent) {
        // Small delay so it doesn't compete with hero animations
        const t = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(t);
      }
    } catch {
      // localStorage unavailable (e.g., private mode) — show banner anyway
      setVisible(true);
    }
  }, []);

  const persist = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // noop
    }
    window.dispatchEvent(new CustomEvent("gradios-cookie-consent-change", { detail: value }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Consentimento de cookies"
      className="fixed bottom-4 left-4 right-4 z-[60] max-w-md rounded-2xl border border-card-border bg-white p-5 shadow-xl sm:left-auto sm:right-6 sm:bottom-6"
    >
      <p className="text-sm text-text-muted leading-relaxed mb-4">
        Usamos cookies para melhorar sua experiência, medir o uso do site e personalizar conteúdo, conforme nossa{" "}
        <Link href="/privacidade" className="text-primary font-medium underline underline-offset-2 hover:opacity-80">
          Política de Privacidade
        </Link>
        .
      </p>
      <div className="flex flex-col sm:flex-row gap-2.5">
        <Button
          type="button"
          onClick={() => persist("accepted")}
          className="flex-1 rounded-full text-sm py-2.5 px-4 font-bold bg-gradient-primary border-none shadow-none text-white hover:shadow-lg hover:shadow-[#0A1B5C]/25 transition-all text-white"
        >
          Aceitar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => persist("rejected")}
          className="flex-1 rounded-full text-sm font-semibold border-card-border bg-white text-text-muted hover:bg-bg-alt hover:text-text-muted"
        >
          Recusar
        </Button>
      </div>
    </div>
  );
}
