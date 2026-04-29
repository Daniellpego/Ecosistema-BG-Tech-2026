import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Apps — Gradios",
  description:
    "Aplicativos mobile e web sob medida para o fluxo real do seu negócio. iOS, Android e Progressive Web Apps.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Desenvolvimento de Aplicativos",
      provider: { "@type": "Organization", name: "Gradios", url: "https://gradios.co" },
      description: "Aplicativos mobile e web sob medida para o fluxo real do seu negócio.",
      url: "https://gradios.co/servicos/apps",
      areaServed: "BR",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: "https://gradios.co" },
        { "@type": "ListItem", position: 2, name: "Serviços", item: "https://gradios.co/servicos" },
        { "@type": "ListItem", position: 3, name: "Apps", item: "https://gradios.co/servicos/apps" },
      ],
    },
  ],
};

const features = [
  { title: "iOS e Android", body: "React Native ou nativo — escolhemos a stack certa para o seu caso e orçamento." },
  { title: "Progressive Web App", body: "Experiência de app direto no browser, sem precisar publicar nas lojas." },
  { title: "Offline-first", body: "Funciona mesmo sem internet. Sincroniza quando a conexão volta." },
  { title: "Notificações push", body: "Comunique-se com seus usuários no momento certo, no canal certo." },
  { title: "Design system próprio", body: "Componentes consistentes que aceleram futuras atualizações." },
  { title: "App Store & Play Store", body: "Cuidamos de toda a publicação, revisões e atualizações nas lojas." },
];

export default function AppsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="pt-8 pb-6 flex items-center gap-1.5 text-xs text-text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-text transition-colors">Início</Link>
          <span>/</span>
          <Link href="/" className="hover:text-text transition-colors">Serviços</Link>
          <span>/</span>
          <span className="text-text">Apps</span>
        </nav>

        {/* Hero */}
        <section className="pb-12">
          <div className="w-12 h-12 rounded-xl bg-primary/8 text-primary flex items-center justify-center mb-5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <path d="M12 18h.01" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-text mb-4">Apps</h1>
          <p className="text-text-muted text-base sm:text-lg leading-relaxed">
            Um bom app não é só bonito — é aquele que o usuário entende em 10 segundos e não larga mais.
            Construímos produtos mobile que encantam e retêm.
          </p>
        </section>

        {/* Features */}
        <section className="pb-12">
          <h2 className="text-lg font-semibold text-text mb-5">O que está incluso</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f.title} className="bg-bg-alt border border-card-border rounded-card p-5">
                <h3 className="text-sm font-semibold text-text mb-1.5">{f.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20">
          <div className="bg-[#0A1B3D] rounded-card p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Tem uma ideia de app?</h2>
            <p className="text-white/60 text-sm mb-6">Me conta pelo WhatsApp. Respondo no mesmo dia.</p>
            <a
              href="https://wa.me/5543988372540?text=Oi%2C+quero+desenvolver+um+app+pela+Gradios"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-[#0A1B3D] text-sm font-semibold px-6 py-3 rounded-pill hover:bg-white/90 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Falar no WhatsApp
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
