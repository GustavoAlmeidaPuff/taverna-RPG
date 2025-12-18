import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import Products from '@/components/Products';
import Footer from '@/components/Footer';
import { getAllProducts } from '@/lib/shopify';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taverna-rpg-store.vercel.app';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Sua loja de RPG favorita! Dados, miniaturas, grids e tudo para suas aventuras épicas. Encontre os melhores produtos para suas campanhas de RPG de mesa.',
  openGraph: {
    title: 'Taverna RPG Store - Dados, Miniaturas e Acessórios para RPG',
    description: 'Sua loja de RPG favorita! Dados, miniaturas, grids e tudo para suas aventuras épicas.',
    url: siteUrl,
    siteName: 'Taverna RPG Store',
    images: [
      {
        url: `${siteUrl}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Taverna RPG Store',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default async function Home() {
  // Buscar produtos reais do Shopify
  const products = await getAllProducts(20);
  
  // Dividir produtos em duas seções (novos e mais vendidos)
  // Como tem apenas 1 produto, vamos mostrar o mesmo produto nas duas seções
  const newArrivals = products.slice(0, 4);
  const bestSellers = products.slice(0, 4).length > 0 ? products.slice(0, 4) : products;

  // Structured Data para a página inicial
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Taverna RPG Store',
    url: siteUrl,
    description: 'Sua loja de RPG favorita! Dados, miniaturas, grids e tudo para suas aventuras épicas.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/busca?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const storeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Taverna RPG Store',
    image: `${siteUrl}/images/logo.png`,
    description: 'Sua loja de RPG favorita! Dados, miniaturas, grids e tudo para suas aventuras épicas.',
    url: siteUrl,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
    },
    priceRange: '$$',
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <Hero />
        {/* <Categories /> */}
        <Products 
          title="ACABARAM DE CHEGAR"
          subtitle="Os mais novos tesouros da taverna"
          products={newArrivals}
        />
        <Products 
          title="MAIS VENDIDOS"
          subtitle="Os favoritos dos aventureiros"
          products={bestSellers}
        />
      </main>
      <Footer />
    </div>
  );
}
