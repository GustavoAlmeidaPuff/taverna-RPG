import { NextRequest, NextResponse } from 'next/server';

// Helper para fazer requisições à Storefront API
async function storefrontApiRequest(query: string, variables: any = {}) {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN!;
  const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
  
  if (!accessToken) {
    throw new Error('SHOPIFY_STOREFRONT_ACCESS_TOKEN não configurado');
  }
  
  const url = `https://${storeDomain}/api/2024-10/graphql.json`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify Storefront API error: ${response.statusText} - ${errorText}`);
  }
  
  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`Shopify GraphQL errors: ${JSON.stringify(data.errors)}`);
  }
  
  return data.data;
}

// Query GraphQL para verificar status do checkout
const CHECKOUT_QUERY = `
  query getCheckout($id: ID!) {
    checkout(id: $id) {
      id
      completedAt
      order {
        id
        name
        email
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
      }
      paymentDue {
        amount
        currencyCode
      }
    }
  }
`;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const checkoutId = searchParams.get('checkoutId');

    if (!checkoutId) {
      return NextResponse.json(
        { error: 'checkoutId é obrigatório' },
        { status: 400 }
      );
    }

    // Converter checkoutId para formato GraphQL se necessário
    let formattedCheckoutId = checkoutId;
    if (!checkoutId.startsWith('gid://')) {
      formattedCheckoutId = `gid://shopify/Checkout/${checkoutId}`;
    }

    try {
      const data = await storefrontApiRequest(CHECKOUT_QUERY, {
        id: formattedCheckoutId,
      });

      const checkout = data.checkout;
      
      if (!checkout) {
        return NextResponse.json(
          { error: 'Checkout não encontrado' },
          { status: 404 }
        );
      }

      // Verificar se o checkout foi completado
      const isCompleted = !!checkout.completedAt;
      const hasOrder = !!checkout.order;
      const isPaid = checkout.paymentDue?.amount === '0.00' || hasOrder;

      return NextResponse.json({
        status: isCompleted ? 'completed' : 'pending',
        paid: isPaid,
        completedAt: checkout.completedAt,
        orderId: checkout.order?.name,
        shopifyOrderId: checkout.order?.id,
      });
    } catch (error: any) {
      // Se o checkout não existir mais ou já foi convertido em pedido,
      // pode significar que foi pago
      console.error('Erro ao verificar checkout:', error);
      return NextResponse.json({
        status: 'unknown',
        paid: false,
        message: 'Não foi possível verificar o status do checkout',
      });
    }
  } catch (error: any) {
    console.error('Erro ao processar verificação de status:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao verificar status',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
