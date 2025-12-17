import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Categories from '@/components/Categories';
import Products from '@/components/Products';
import Footer from '@/components/Footer';
import { getAllProducts } from '@/lib/shopify';

export default async function Home() {
  // Buscar produtos reais do Shopify
  const products = await getAllProducts(20);
  
  // Dividir produtos em duas seções (novos e mais vendidos)
  // Como tem apenas 1 produto, vamos mostrar o mesmo produto nas duas seções
  const newArrivals = products.slice(0, 4);
  const bestSellers = products.slice(0, 4).length > 0 ? products.slice(0, 4) : products;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <Categories />
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
