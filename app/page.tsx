import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Categories from '@/components/Categories';
import Products from '@/components/Products';
import Footer from '@/components/Footer';

export default function Home() {
  // PLACEHOLDER DATA - será conectado ao Shopify para buscar produtos reais
  const newArrivals = [
    {
      id: 1,
      name: "Dados de RPG - Conjunto Aurora 7 Peças",
      price: 49.90,
      originalPrice: 59.90,
      discount: 15,
      badge: 'oferta' as const,
      // PLACEHOLDER IMAGE - será substituída por imagem real do Shopify
      image: "https://images.unsplash.com/photo-1606166188517-4a72b4c8b5b8?w=400&q=80"
    },
    {
      id: 2,
      name: "Cavaleiro Negro - Miniatura Premium para RPG",
      price: 89.90,
      badge: 'novo' as const,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80"
    },
    {
      id: 3,
      name: "Grid Hexagonal Premium - Tabuleiro de Batalha",
      price: 149.90,
      badge: 'lançamento' as const,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
    },
    {
      id: 4,
      name: "Dragão das Sombras - Miniatura Épica Colecionável",
      price: 899.90,
      originalPrice: 1099.90,
      discount: 18,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80"
    }
  ];

  const bestSellers = [
    {
      id: 5,
      name: "Dragão das Sombras - Miniatura Épica Colecionável",
      price: 899.90,
      originalPrice: 1099.90,
      discount: 18,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80"
    },
    {
      id: 6,
      name: "Grid Hexagonal Premium - Tabuleiro de Batalha",
      price: 149.90,
      badge: 'lançamento' as const,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
    },
    {
      id: 7,
      name: "Cavaleiro Negro - Miniatura Premium para RPG",
      price: 89.90,
      badge: 'novo' as const,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80"
    },
    {
      id: 8,
      name: "Dados de RPG - Conjunto Aurora 7 Peças",
      price: 49.90,
      originalPrice: 59.90,
      discount: 15,
      badge: 'oferta' as const,
      image: "https://images.unsplash.com/photo-1606166188517-4a72b4c8b5b8?w=400&q=80"
    }
  ];

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
