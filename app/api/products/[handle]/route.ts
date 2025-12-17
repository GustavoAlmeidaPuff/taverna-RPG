import { NextResponse } from 'next/server';
import { getProductByHandle } from '@/lib/shopify';

export async function GET(
  request: Request,
  { params }: { params: { handle: string } }
) {
  try {
    const product = await getProductByHandle(params.handle);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Erro na API de produto:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar produto' },
      { status: 500 }
    );
  }
}
