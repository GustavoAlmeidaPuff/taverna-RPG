import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Webhook para receber notificações do Shopify quando um pedido é criado/pago
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verificar se é um evento de pedido criado/pago
    // O Shopify envia webhooks com diferentes tipos de eventos
    if (body.event === 'orders/create' || body.event === 'orders/paid') {
      const order = body.data;
      
      if (!order || !order.id || !order.email) {
        return NextResponse.json(
          { error: 'Dados do pedido inválidos' },
          { status: 400 }
        );
      }

      // Buscar usuário pelo email
      if (!db) {
        return NextResponse.json(
          { error: 'Firebase não está disponível' },
          { status: 500 }
        );
      }

      // Buscar usuário no Firestore pelo email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', order.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Se não encontrar usuário, apenas logar (pode ser um pedido de guest)
        console.log('Pedido de usuário não cadastrado:', order.email);
        return NextResponse.json({ success: true, message: 'Pedido processado (usuário não cadastrado)' });
      }

      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;

      // Verificar se já existe um checkout pendente no localStorage do usuário
      // Como não temos acesso ao localStorage do cliente aqui, vamos criar o pedido
      // baseado nos dados do Shopify
      
      // Converter itens do pedido do Shopify para formato do nosso sistema
      const orderItems = order.line_items?.map((item: any) => ({
        id: item.product_id?.toString() || '',
        name: item.name || item.title || '',
        price: parseFloat(item.price || '0'),
        quantity: item.quantity || 1,
        variantId: item.variant_id?.toString() || '',
        variantTitle: item.variant_title || '',
        image: item.image || '',
        handle: item.product_id?.toString() || '',
      })) || [];

      // Salvar pedido no histórico
      const ordersRef = collection(db, 'users', userId, 'orders');
      await setDoc(doc(ordersRef), {
        items: orderItems,
        total: parseFloat(order.total_price || '0'),
        checkoutUrl: order.order_status_url || '',
        orderId: order.order_number?.toString() || '',
        shopifyOrderId: order.id?.toString() || '',
        createdAt: serverTimestamp(),
        status: order.financial_status === 'paid' ? 'completed' : 'pending',
        shopifyData: order, // Salvar dados completos do Shopify para referência
      });

      // Limpar checkout pendente do localStorage (será feito no cliente)
      return NextResponse.json({ 
        success: true, 
        message: 'Pedido registrado no histórico',
        userId 
      });
    }

    return NextResponse.json({ success: true, message: 'Evento não processado' });
  } catch (error: any) {
    console.error('Erro ao processar webhook do Shopify:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao processar webhook',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// GET para verificação do webhook (alguns sistemas requerem)
export async function GET() {
  return NextResponse.json({ message: 'Webhook endpoint ativo' });
}
