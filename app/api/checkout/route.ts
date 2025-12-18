import { NextRequest, NextResponse } from 'next/server';
import { createCheckout, CheckoutLineItem } from '@/lib/shopify';

// Forçar rota dinâmica
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Itens do carrinho são obrigatórios' },
        { status: 400 }
      );
    }

    // Validar e formatar itens para o checkout
    const lineItems: CheckoutLineItem[] = items
      .filter((item: any) => item.variantId && item.quantity > 0)
      .map((item: any) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));

    if (lineItems.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum item válido encontrado. Certifique-se de que os produtos têm variantId.' },
        { status: 400 }
      );
    }

    // Criar checkout no Shopify
    const checkout = await createCheckout(lineItems);

    // Adicionar URL de retorno para verificar status após pagamento
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const returnUrl = `${siteUrl}/checkout/success?checkoutId=${checkout.checkoutId}`;

    return NextResponse.json({
      success: true,
      checkoutUrl: checkout.checkoutUrl,
      checkoutId: checkout.checkoutId,
      returnUrl: returnUrl,
    });
  } catch (error: any) {
    console.error('Erro ao processar checkout:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao criar checkout',
        message: error.message || 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
