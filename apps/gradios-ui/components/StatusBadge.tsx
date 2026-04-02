interface StatusBadgeProps {
  online: boolean;
  label?: string;
}

export function StatusBadge({ online, label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${
        online
          ? "bg-status-ok/10 text-status-ok"
          : "bg-zinc-800 text-text-dim"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          online ? "bg-status-ok animate-pulse" : "bg-text-dim"
        }`}
      />
      {label ?? (online ? "Online" : "Offline")}
    </span>
  );
}
