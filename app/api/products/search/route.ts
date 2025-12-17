import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/shopify';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    if (!query || query.trim().length === 0) {
      return NextResponse.json({ products: [] });
    }

    // Buscar todos os produtos (pode ser otimizado no futuro com limite maior)
    const allProducts = await getAllProducts(100);
    
    // Normalizar a query para busca case-insensitive
    const normalizedQuery = query.toLowerCase().trim();
    const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 0);
    
    // Filtrar produtos que contenham as palavras-chave no nome ou descrição
    const filteredProducts = allProducts.filter(product => {
      const name = (product.name || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      const searchText = `${name} ${description}`;
      
      // Verifica se todas as palavras da query estão presentes
      return queryWords.every(word => searchText.includes(word));
    });
    
    // Ordenar por relevância (produtos com match no nome primeiro)
    const sortedProducts = filteredProducts.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(normalizedQuery);
      const bNameMatch = b.name.toLowerCase().includes(normalizedQuery);
      
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      return 0;
    });
    
    // Limitar a 10 resultados para performance
    const limitedProducts = sortedProducts.slice(0, 10);
    
    return NextResponse.json({ products: limitedProducts });
  } catch (error) {
    console.error('Erro na API de busca:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos', products: [] },
      { status: 500 }
    );
  }
}
