import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

const SOCIALS: { href: string; label: string; icon: React.ReactNode }[] = [
  {
    href: "https://www.instagram.com/gradios.ai/",
    label: "Instagram da Gradios (@gradios.ai)",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311C8.416 2.175 8.796 2.163 12 2.163zm0 1.838c-3.141 0-3.495.012-4.73.068-1.043.048-1.61.218-1.987.363-.499.194-.856.426-1.231.801-.375.375-.607.732-.801 1.231-.145.377-.315.944-.363 1.987-.056 1.235-.068 1.589-.068 4.73s.012 3.495.068 4.73c.048 1.043.218 1.61.363 1.987.194.499.426.856.801 1.231.375.375.732.607 1.231.801.377.145.944.315 1.987.363 1.235.056 1.589.068 4.73.068s3.495-.012 4.73-.068c1.043-.048 1.61-.218 1.987-.363.499-.194.856-.426 1.231-.801.375-.375.607-.732.801-1.231.145-.377.315-.944.363-1.987.056-1.235.068-1.589.068-4.73s-.012-3.495-.068-4.73c-.048-1.043-.218-1.61-.363-1.987-.194-.499-.426-.856-.801-1.231-.375-.375-.732-.607-1.231-.801-.377-.145-.944-.315-1.987-.363-1.235-.056-1.589-.068-4.73-.068zm0 3.063c-2.755 0-4.987 2.232-4.987 4.987s2.232 4.987 4.987 4.987 4.987-2.232 4.987-4.987S14.755 7.064 12 7.064zm0 8.221A3.234 3.234 0 1 1 12 8.817a3.234 3.234 0 0 1 0 6.468zm5.197-8.395a1.165 1.165 0 1 1 0-2.33 1.165 1.165 0 0 1 0 2.33z" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/company/gradios",
    label: "LinkedIn da Gradios",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    href: "https://www.facebook.com/gradios",
    label: "Facebook da Gradios",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M22.675 0h-21.35C.595 0 0 .593 0 1.325v21.351C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.405 24 24 23.408 24 22.676V1.325C24 .593 23.405 0 22.675 0z" />
      </svg>
    ),
  },
  {
    href: "https://x.com/gradiosco",
    label: "X (Twitter) da Gradios",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "https://www.youtube.com/@gradios",
    label: "YouTube da Gradios",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const COL_SOLUCOES = [
  { href: "#solucoes", label: "Automação de Processos" },
  { href: "#solucoes", label: "Desenvolvimento Sob Medida" },
  { href: "#solucoes", label: "Integrações e APIs" },
  { href: "#solucoes", label: "Dashboards e Relatórios" },
  { href: "#solucoes", label: "IA Aplicada ao Negócio" },
];

const COL_NAVEGACAO = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#cases", label: "Cases de sucesso" },
  { href: "/diagnostico", label: "Diagnóstico gratuito" },
  { href: "/sobre", label: "Sobre a Gradios" },
  { href: "/blog", label: "Blog" },
  { href: "/respostas", label: "Perguntas sobre automação" },
  { href: "#contato", label: "Contato" },
];

const COL_LEGAL = [
  { href: "/termos", label: "Termos de uso" },
  { href: "/privacidade", label: "Política de privacidade" },
];

const CLIENT_LOGOS = [
  { src: "/logo-cliente-1.webp", alt: "Logo de cliente Gradios — contabilidade" },
  { src: "/logo-cliente-2.webp", alt: "Logo de cliente Gradios — saúde" },
  { src: "/logo-cliente-3.webp", alt: "Logo de cliente Gradios — varejo" },
];

export function Footer() {
  return (
    <footer
      className="bg-inverse text-fg-on-inverse"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Rodapé
      </h2>

      <div className="mx-auto w-full max-w-container-default px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop py-section-regular">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand col */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 mb-5 focus-visible:outline-none focus-visible:shadow-focus-accent rounded-md"
              aria-label="Gradios — início"
            >
              <Image
                src="/logo.webp"
                alt=""
                width={200}
                height={183}
                className="w-10 h-auto"
                loading="lazy"
              />
              <span className="text-headline text-white font-semibold">
                Gradios
              </span>
            </Link>

            <p className="text-callout text-white/60 max-w-xs mb-6 leading-relaxed">
              Processos manuais consomem tempo e dinheiro. Nós eliminamos os dois.
            </p>

            {/* +17 empresas seal */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-2 mb-6">
              <div className="flex -space-x-1.5">
                {CLIENT_LOGOS.map((logo, i) => (
                  <Image
                    key={logo.src}
                    src={logo.src}
                    alt={logo.alt}
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded-full border border-neutral-900 object-cover bg-white"
                    style={{ zIndex: CLIENT_LOGOS.length - i }}
                  />
                ))}
              </div>
              <span className="text-footnote text-white/60">
                <span className="text-white font-semibold">+17</span> empresas atendidas
              </span>
            </div>

            {/* Social */}
            <div className="flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-colors duration-fast ease-standard focus-visible:outline-none focus-visible:shadow-focus-accent"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Soluções */}
          <FooterColumn title="Soluções" items={COL_SOLUCOES} />

          {/* Navegação */}
          <FooterColumn title="Navegação" items={COL_NAVEGACAO} />

          {/* Contato + Legal */}
          <div>
            <FooterTitle>Contato</FooterTitle>
            <ul className="flex flex-col gap-3 mb-8">
              <li>
                <a
                  href="mailto:contato@gradios.com.br"
                  className="text-callout text-white/60 hover:text-white transition-colors duration-fast ease-standard inline-flex items-center gap-2 focus-visible:outline-none focus-visible:shadow-focus-accent rounded-md"
                >
                  <Mail className="w-4 h-4 shrink-0" aria-hidden />
                  contato@gradios.com.br
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5543988372540"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-callout text-white/60 hover:text-white transition-colors duration-fast ease-standard inline-flex items-center gap-2 focus-visible:outline-none focus-visible:shadow-focus-accent rounded-md"
                >
                  <Phone className="w-4 h-4 shrink-0" aria-hidden />
                  (43) 98837-2540
                </a>
              </li>
              <li className="text-footnote text-white/40 inline-flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" aria-hidden />
                Londrina, PR · Brasil
              </li>
            </ul>

            <FooterTitle>Legal</FooterTitle>
            <ul className="flex flex-col gap-2">
              {COL_LEGAL.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-callout text-white/60 hover:text-white transition-colors duration-fast ease-standard focus-visible:outline-none focus-visible:shadow-focus-accent rounded-md"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="/llms.txt"
                  className="text-footnote text-white/40 hover:text-white/70 transition-colors duration-fast ease-standard"
                >
                  llms.txt
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-footnote text-white/40 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Gradios Soluções em Tecnologia LTDA. Todos os direitos reservados.
          </p>
          <p className="text-footnote text-white/30 text-center sm:text-right tabular-nums">
            CNPJ 65.663.208/0001-36
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-caption font-semibold text-white uppercase tracking-wider mb-4">
      {children}
    </h3>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div>
      <FooterTitle>{title}</FooterTitle>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.href + item.label}>
            <Link
              href={item.href}
              className="text-callout text-white/60 hover:text-white transition-colors duration-fast ease-standard focus-visible:outline-none focus-visible:shadow-focus-accent rounded-md"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
