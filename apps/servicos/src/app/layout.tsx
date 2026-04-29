import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gradios | Tecnologia sob medida para sua empresa",
  description:
    "Sites, apps, sistemas e automações sob medida. De Londrina pra todo o Brasil.",
  openGraph: {
    title: "Gradios | Tecnologia sob medida para sua empresa",
    description:
      "Sites, apps, sistemas e automações sob medida. De Londrina pra todo o Brasil.",
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
      <body>{children}</body>
    </html>
  );
}
