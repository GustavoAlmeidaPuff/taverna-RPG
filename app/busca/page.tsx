import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';
import { getAllProducts, Product } from '@/lib/shopify';
import SearchProductCard from '@/components/SearchProductCard';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }> | { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Garantir compatibilidade com Next.js 14 e 15
  const params = await Promise.resolve(searchParams);
  const query = params.q || '';
  
  // Buscar produtos
  let products: Product[] = [];
  if (query.trim()) {
    const allProducts = await getAllProducts(100);
    const normalizedQuery = query.toLowerCase().trim();
    const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 0);
    
    // Filtrar produtos que contenham as palavras-chave no nome, descrição ou tags
    const filteredProducts = allProducts.filter(product => {
      const name = (product.name || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      const tags = (product.tags || '').toLowerCase();
      const searchText = `${name} ${description} ${tags}`;
      
      // Verifica se todas as palavras da query estão presentes
      return queryWords.every(word => searchText.includes(word));
    });
    
    // Ordenar por relevância (produtos com match no nome primeiro)
    products = filteredProducts.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(normalizedQuery);
      const bNameMatch = b.name.toLowerCase().includes(normalizedQuery);
      
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      return 0;
    });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header da página de busca */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-secondary-text hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </Link>
            
            <div className="flex items-center gap-4 mb-4">
              <Search className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-secondary-text mb-2">
                  Resultados da Busca
                </h1>
                {query && (
                  <p className="text-secondary-text text-lg">
                    Buscando por: <span className="text-primary font-semibold">&quot;{query}&quot;</span>
                  </p>
                )}
              </div>
            </div>
            
            {query && (
              <p className="text-muted-text">
                {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </p>
            )}
          </div>

          {/* Resultados */}
          {!query ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-muted-text mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-secondary-text mb-2">
                Digite um termo para buscar
              </h2>
              <p className="text-muted-text">
                Use a barra de pesquisa no topo para encontrar produtos
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-muted-text mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-secondary-text mb-2">
                Nenhum produto encontrado
              </h2>
              <p className="text-muted-text mb-6">
                Não encontramos produtos para &quot;{query}&quot;
              </p>
              <Link
                href="/"
                className="inline-block bg-primary text-primary-text px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Ver todos os produtos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <SearchProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
