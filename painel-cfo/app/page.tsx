
"use client";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { bodyHTML } from "./cfo-body";

export default function CFODashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cleanupFn: (() => void) | undefined;
    try {
      if (!ref.current) return;
      ref.current.innerHTML = bodyHTML;
      const tryInit = () => {
        const w = window as any;
        if (w.A) {
          w.A.init();
          if (typeof w.A.cleanup === "function") cleanupFn = w.A.cleanup;
        } else setTimeout(tryInit, 100);
      };
      tryInit();
    } catch (e: any) {
      setError("Erro ao carregar painel CFO. Tente novamente.");
    }
    return () => {
      if (cleanupFn) cleanupFn();
      const w = window as any;
      if (w.A && typeof w.A.cleanup === "function") w.A.cleanup();
    };
  }, []);
  return (
    <div>
      <Script src="/cfo-app.js" strategy="afterInteractive" />
      {error ? (
        <div className="error-state" style={{ color: "red", padding: "24px", textAlign: "center" }}>{error}</div>
      ) : (
        <div ref={ref}></div>
      )}
    </div>
  );
}
