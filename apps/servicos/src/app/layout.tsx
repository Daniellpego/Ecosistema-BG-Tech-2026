import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Serviços — Gradios",
  description:
    "Sites, apps, sistemas e automações com IA para empresas que querem crescer. Desenvolvido em Londrina para todo o Brasil.",
  openGraph: {
    title: "Serviços — Gradios",
    description:
      "Sites, apps, sistemas e automações com IA para empresas que querem crescer.",
    url: "https://gradios.co/servicos",
    siteName: "Gradios",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
