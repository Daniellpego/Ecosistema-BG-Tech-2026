"use client";

import { MarkdownContent } from "./MarkdownContent";
import { AGENT_MAP } from "@/lib/constants";
import type { ChatMessage as ChatMessageType } from "@/lib/hooks/useChat";

interface ChatMessageProps {
  message: ChatMessageType;
  isStreaming?: boolean;
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  const isUser = message.role === "user";
  const agent = message.agentSlug ? AGENT_MAP[message.agentSlug] : null;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-bg-overlay flex items-center justify-center text-sm mr-3 mt-1">
          {agent?.emoji ?? "\u{1F916}"}
        </div>
      )}
      <div
        className={`max-w-2xl rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-gradient-brand text-white"
            : "bg-bg-raised border border-border-subtle text-text-secondary"
        }`}
      >
        {!isUser && message.agent && (
          <span className={`block text-xs font-medium mb-1.5 ${agent?.color ?? "text-brand-cyan"}`}>
            {agent?.emoji ?? ""} {message.agent}
          </span>
        )}
        {message.text ? (
          isUser ? (
            <span className="whitespace-pre-wrap">{message.text}</span>
          ) : (
            <div className="prose-jarvis">
              <MarkdownContent content={message.text} />
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-brand-cyan ml-0.5 animate-pulse" />
              )}
            </div>
          )
        ) : isStreaming ? (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
