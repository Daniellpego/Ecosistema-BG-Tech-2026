import Link from "next/link";

const services = [
  {
    slug: "sites",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "Sites",
    description: "Landing pages e sites institucionais que convertem — rápidos, seguros e indexados do jeito certo.",
  },
  {
    slug: "apps",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
    title: "Apps",
    description: "Aplicativos mobile e web sob medida para o fluxo real do seu negócio.",
  },
  {
    slug: "sistemas",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Sistemas",
    description: "ERPs, CRMs e painéis internos que substituem planilhas e processos manuais.",
  },
  {
    slug: "automacoes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M12 6v6l4 2" />
        <path d="M22 2 12 12" />
        <path d="m17 2 5 5-5 5" />
      </svg>
    ),
    title: "Automações + IA",
    description: "Fluxos automáticos e agentes de IA que executam tarefas repetitivas enquanto você foca no que importa.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      name: "Serviços Gradios",
      description: "Sites, apps, sistemas e automações com IA.",
      url: "https://gradios.co/servicos",
      numberOfItems: 4,
      itemListElement: services.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.title,
        url: `https://gradios.co/servicos/${s.slug}`,
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: "https://gradios.co" },
        { "@type": "ListItem", position: 2, name: "Serviços", item: "https://gradios.co/servicos" },
      ],
    },
  ],
};

export default function ServicosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted border border-card-border rounded-pill px-3 py-1 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            Londrina · PR
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">
            Nossos Serviços
          </h1>
          <p className="text-text-muted text-base sm:text-lg leading-relaxed">
            Da ideia ao ar. Desenvolvemos software que resolve problemas reais
            para empresas que querem crescer de verdade.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/${service.slug}`}
              className="group block bg-bg-alt border border-card-border rounded-card p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/8 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/12 transition-colors">
                {service.icon}
              </div>
              <h2 className="text-base font-semibold text-text mb-2">
                {service.title}
              </h2>
              <p className="text-sm text-text-muted leading-relaxed mb-4">
                {service.description}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                Saiba mais
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-[#0A1B3D] rounded-card p-8 sm:p-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Vamos conversar?
          </h2>
          <p className="text-white/60 text-sm sm:text-base mb-8 leading-relaxed">
            Conta o que você precisa. Retornamos no mesmo dia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/5543988372540"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#0A1B3D] text-sm font-semibold px-6 py-3 rounded-pill hover:bg-white/90 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar no WhatsApp
            </a>
            <a
              href="https://instagram.com/gradios.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white text-sm font-semibold px-6 py-3 rounded-pill hover:bg-white/15 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Ver no Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
