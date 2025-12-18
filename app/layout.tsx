import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taverna-rpg-store.vercel.app';
const siteName = 'Taverna RPG Store';
const defaultDescription = 'Sua loja de RPG favorita! Dados, miniaturas, grids e tudo para suas aventuras épicas.';
const defaultImage = `${siteUrl}/images/logo.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Dados, Miniaturas e Acessórios para RPG`,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    'RPG',
    'RPG de mesa',
    'dados RPG',
    'miniaturas RPG',
    'acessórios RPG',
    'D&D',
    'Dungeons & Dragons',
    'loja RPG',
    'produtos RPG',
    'grid RPG',
    'dados poliedros',
    'miniaturas de fantasia',
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/images/favicon.ico',
    apple: '/images/favicon.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} - Dados, Miniaturas e Acessórios para RPG`,
    description: defaultDescription,
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - Dados, Miniaturas e Acessórios para RPG`,
    description: defaultDescription,
    images: [defaultImage],
    creator: '@taverna_rpg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Adicione aqui os códigos de verificação quando disponíveis
    // google: 'seu-codigo-google',
    // yandex: 'seu-codigo-yandex',
    // bing: 'seu-codigo-bing',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data para organização (global)
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: siteUrl,
    logo: defaultImage,
    description: defaultDescription,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Portuguese',
    },
  };

  return (
    <html lang="pt-BR" className={cinzel.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
