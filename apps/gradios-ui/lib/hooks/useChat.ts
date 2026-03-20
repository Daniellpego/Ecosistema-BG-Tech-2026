"use client";

import { useState, useRef, useCallback } from "react";
import { streamAgent } from "../api";
import type { Agent } from "../constants";

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  agent?: string;
  agentSlug?: string;
  timestamp: Date;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const loadingRef = useRef(false);

  const send = useCallback(
    (text: string, agent: Agent) => {
      if (!text.trim() || loadingRef.current) return;

      loadingRef.current = true;
      setLoading(true);

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        text: text.trim(),
        timestamp: new Date(),
      };

      const agentMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "agent",
        text: "",
        agent: agent.label,
        agentSlug: agent.slug,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg, agentMsg]);

      const targetId = agentMsg.id;
      let accumulated = "";
      let done = false;

      abortRef.current = streamAgent(
        agent.slug,
        text.trim(),
        (token) => {
          accumulated += token;
          const current = accumulated;
          setMessages((prev) =>
            prev.map((m) => (m.id === targetId ? { ...m, text: current } : m))
          );
        },
        () => {
          if (done) return;
          done = true;
          loadingRef.current = false;
          setLoading(false);
        },
        (err) => {
          if (done) return;
          done = true;
          loadingRef.current = false;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === targetId ? { ...m, text: `Erro: ${err.message}` } : m
            )
          );
          setLoading(false);
        }
      );
    },
    // Sem dependencias mutaveis — usa ref para checar loading
    [],
  );

  const clearMessages = useCallback(() => {
    abortRef.current?.abort();
    loadingRef.current = false;
    setMessages([]);
    setLoading(false);
  }, []);

  return { messages, loading, send, clearMessages };
}
