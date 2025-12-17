import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
});

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
    <html lang="pt-BR" className={cinzel.variable}>
      <body>{children}</body>
    </html>
  );
}
