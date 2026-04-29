import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Serviços | Gradios — Sites, Apps, Sistemas e Automações",
  description:
    "Sites, apps mobile, sistemas sob medida e automações com IA. Desenvolvemos tecnologia para sua empresa em Londrina e todo o Brasil.",
  alternates: { canonical: "/servicos" },
  openGraph: {
    title: "Serviços | Gradios",
    description:
      "Sites, apps, sistemas sob medida e automações com IA. Tecnologia para sua empresa.",
    type: "website",
  },
};

const services = [
  {
    slug: "sites",
    title: "Sites",
    description:
      "Institucionais, landing pages e e-commerce que convertem visitante em cliente.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    slug: "apps",
    title: "Apps",
    description:
      "Aplicativos mobile iOS e Android desenvolvidos sob medida para sua operação.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
        aria-hidden="true"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
  {
    slug: "sistemas",
    title: "Sistemas",
    description:
      "Software sob medida que organiza e escala a operação da sua empresa.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    slug: "automacoes",
    title: "Automações + IA",
    description:
      "Atendimento automático, agendamento inteligente e agentes que trabalham por você.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
        aria-hidden="true"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Serviços Gradios",
  url: "https://gradios.co/servicos",
  description:
    "Sites, apps mobile, sistemas sob medida e automações com IA para empresas.",
  itemListElement: services.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: s.title,
    url: `https://gradios.co/servicos/${s.slug}`,
  })),
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: "https://gradios.co" },
    { "@type": "ListItem", position: 2, name: "Serviços", item: "https://gradios.co/servicos" },
  ],
};

export default function ServicosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* ── Hero ── */}
      <section className="px-4 sm:px-6 lg:px-8 pt-12 pb-12 sm:pt-16 sm:pb-16 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 bg-bg-alt border border-card-border rounded-full px-3 py-1 text-xs font-medium text-text-muted mb-6">
            <span aria-hidden="true">📍</span>
            Londrina-PR
          </span>
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-primary mb-3">
            Serviços
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text leading-[1.05] tracking-tight mb-5">
            Nossos Serviços
          </h1>
          <p className="text-lg sm:text-xl text-text-muted leading-relaxed">
            Desenvolvemos tecnologia sob medida para sua empresa — do site ao
            sistema, com IA aplicada.
          </p>
        </div>
      </section>

      {/* ── Grid de serviços ── */}
      <section
        className="bg-bg-alt border-y border-card-border px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
        aria-label="Nossos serviços"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/servicos/${s.slug}`}
              className="group bg-white border border-card-border rounded-card p-7 flex flex-col hover:border-text/20 hover:shadow-card transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/8 text-primary flex items-center justify-center mb-5 group-hover:bg-primary/12 transition-colors">
                {s.icon}
              </div>
              <h2 className="text-xl font-bold text-text tracking-tight mb-2.5">
                {s.title}
              </h2>
              <p className="text-sm text-text-muted leading-relaxed flex-1">
                {s.description}
              </p>
              <span className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-primary group-hover:text-primary/80 transition-colors">
                Saiba mais
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform duration-200"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Contato ── */}
      <section
        id="contato"
        className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center"
        aria-labelledby="contato-title"
      >
        <div className="max-w-lg mx-auto">
          <p className="text-xs font-semibold tracking-[0.12em] uppercase text-text-muted mb-3">
            Começar
          </p>
          <h2
            id="contato-title"
            className="text-3xl sm:text-4xl font-black text-text tracking-tight mb-4"
          >
            Vamos conversar?
          </h2>
          <p className="text-text-muted leading-relaxed mb-9">
            Conta pra gente o que sua empresa precisa. A gente desenha a solução.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/5543988372540"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-text text-white font-bold text-base px-6 py-3.5 rounded-lg hover:bg-text/90 active:scale-[0.98] transition-all"
              aria-label="Falar com a Gradios pelo WhatsApp"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 shrink-0"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar no WhatsApp
            </a>
            <a
              href="https://instagram.com/gradios.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-white border border-card-border text-text font-semibold text-sm px-5 py-3.5 rounded-lg hover:bg-bg-alt hover:border-text/20 active:scale-[0.98] transition-all"
              aria-label="Ver a Gradios no Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 shrink-0"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              Ver no Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
