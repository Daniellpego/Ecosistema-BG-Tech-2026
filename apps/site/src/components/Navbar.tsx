"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import {
  Button,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@gradios/ui/v2";

const NAV_ITEMS = [
  { href: "#solucoes", label: "Soluções" },
  { href: "#como-funciona", label: "Como Funciona" },
  { href: "#cases", label: "Cases" },
  { href: "/blog", label: "Blog" },
  { href: "#contato", label: "Contato" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-[background-color,border-color,box-shadow] duration-normal ease-standard ${
        scrolled
          ? "bg-base/80 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto w-full max-w-container-default px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 focus-visible:outline-none focus-visible:shadow-focus rounded-md"
            aria-label="Gradios — início"
          >
            <Image
              src="/logo.webp"
              alt=""
              width={200}
              height={183}
              className="w-10 h-auto"
              priority
            />
            <span className="text-headline text-fg-primary font-semibold">
              Gradios
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-8"
            aria-label="Navegação principal"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-callout font-medium text-fg-secondary hover:text-fg-primary transition-colors duration-fast ease-standard focus-visible:outline-none focus-visible:shadow-focus rounded-md"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side: hamburger (mobile) + CTA */}
          <div className="flex items-center gap-2">
            {/* Hamburger — mobile only, abre Sheet à esquerda */}
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-fg-primary hover:bg-subtle transition-colors duration-fast ease-standard focus-visible:outline-none focus-visible:shadow-focus lg:hidden"
                  aria-label="Abrir menu"
                >
                  <Menu className="h-5 w-5" aria-hidden />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <SheetHeader>
                  <SheetTitle>
                    <span className="flex items-center gap-2.5">
                      <Image
                        src="/logo.webp"
                        alt=""
                        width={200}
                        height={183}
                        className="w-9 h-auto"
                      />
                      <span className="text-headline text-fg-primary font-semibold">
                        Gradios
                      </span>
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <nav
                  className="flex flex-col mt-2"
                  aria-label="Navegação mobile"
                >
                  {NAV_ITEMS.map((item) => (
                    <SheetClose key={item.href} asChild>
                      <Link
                        href={item.href}
                        className="block py-3 text-body text-fg-primary hover:text-fg-brand transition-colors duration-fast ease-standard border-b border-subtle last:border-b-0 focus-visible:outline-none focus-visible:shadow-focus rounded-md"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto pt-6">
                  <SheetClose asChild>
                    <Button asChild block size="lg">
                      <Link href="/diagnostico">Diagnóstico gratuito</Link>
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>

            {/* CTA — desktop e mobile (mas mobile compacto) */}
            <Button asChild size="md" className="hidden sm:inline-flex">
              <Link href="/diagnostico">Diagnóstico gratuito</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
