import React from 'react';

/**
 * Helpers visuais usados pelas stories de tokens.
 * São puramente apresentacionais — não fazem parte do sistema de design.
 */

export const Section: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <section className="mb-12 last:mb-0">
    <header className="mb-6">
      <h2 className="text-title-3 text-fg-primary mb-1">{title}</h2>
      {description && (
        <p className="text-callout text-fg-secondary max-w-3xl">{description}</p>
      )}
    </header>
    {children}
  </section>
);

export const Mono: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <code
    className="text-footnote text-fg-tertiary font-mono"
    style={{ fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace' }}
  >
    {children}
  </code>
);

export const Swatch: React.FC<{
  name: string;
  value: string;
  hint?: string;
  /** se for true, usa o value como CSS var (envolve em var()) */
  isVar?: boolean;
}> = ({ name, value, hint, isVar = false }) => {
  const bg = isVar ? `var(${value})` : value;
  return (
    <div className="flex items-center gap-4 p-3 rounded-md border bg-surface">
      <div
        className="h-14 w-14 shrink-0 rounded-md border"
        style={{ background: bg }}
        aria-hidden
      />
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-callout font-semibold text-fg-primary truncate">{name}</span>
        <Mono>{value}</Mono>
        {hint && <Mono>{hint}</Mono>}
      </div>
    </div>
  );
};

export const Grid: React.FC<{
  cols?: 2 | 3 | 4 | 5;
  children: React.ReactNode;
}> = ({ cols = 5, children }) => {
  const map: Record<number, string> = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  };
  return <div className={`grid gap-3 ${map[cols]}`}>{children}</div>;
};

export const Row: React.FC<{
  label: string;
  meta?: string;
  children: React.ReactNode;
}> = ({ label, meta, children }) => (
  <div className="flex items-center gap-6 py-4 border-b border-subtle last:border-0">
    <div className="w-40 shrink-0">
      <div className="text-callout font-semibold text-fg-primary">{label}</div>
      {meta && <Mono>{meta}</Mono>}
    </div>
    <div className="flex-1 min-w-0">{children}</div>
  </div>
);
