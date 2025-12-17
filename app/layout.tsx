import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taverna RPG Store - Dados, Miniaturas e Acessórios para RPG",
  description: "Sua loja de RPG favorita! Dados, miniaturas, grids e tudo para suas aventuras épicas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
