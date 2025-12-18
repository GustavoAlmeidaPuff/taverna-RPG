import { NextResponse } from 'next/server';
import { getProductsByIds } from '@/lib/shopify';

// Forçar rota dinâmica
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ids } = body;
    
    if (!Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'IDs devem ser um array' },
        { status: 400 }
      );
    }
    
    if (ids.length === 0) {
      return NextResponse.json({ products: [] });
    }
    
    const products = await getProductsByIds(ids);
    
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Erro na API de produtos por IDs:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produtos' },
      { status: 500 }
    );
  }
}
