'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Loader2 } from 'lucide-react';

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { addOrderToHistory, clearCart } = useCart();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando seu pedido...');

  useEffect(() => {
    const verifyOrder = async () => {
      if (!user) {
        setStatus('error');
        setMessage('Você precisa estar logado para verificar o pedido.');
        return;
      }

      try {
        // Verificar se há checkout pendente no localStorage
        const pendingCheckout = localStorage.getItem('pendingCheckout');
        
        if (pendingCheckout) {
          const checkoutData = JSON.parse(pendingCheckout);
          
          // Verificar se o checkout foi pago consultando a API do Shopify
          // Por enquanto, vamos assumir que se chegou nesta página, o pagamento foi confirmado
          // Em produção, você deve verificar o status real do checkout no Shopify
          
          // Extrair checkoutId da URL ou do localStorage
          const checkoutId = searchParams.get('checkoutId') || checkoutData.checkoutId;
          
          if (checkoutId) {
            // Tentar verificar status do checkout no Shopify
            try {
              const response = await fetch(`/api/checkout/status?checkoutId=${encodeURIComponent(checkoutId)}`);
              
              if (!response.ok) {
                throw new Error('Erro ao verificar status');
              }
              
              const data = await response.json();
              
              if (data.status === 'completed' || data.paid) {
                // Salvar no histórico apenas se o pagamento foi confirmado
                await addOrderToHistory({
                  items: checkoutData.items,
                  total: checkoutData.total,
                  checkoutUrl: checkoutData.checkoutUrl,
                  orderId: data.orderId,
                  shopifyOrderId: data.shopifyOrderId,
                });
                
                // Limpar checkout pendente
                localStorage.removeItem('pendingCheckout');
                
                setStatus('success');
                setMessage('Pedido confirmado! Seu pedido foi registrado com sucesso.');
              } else if (data.status === 'unknown') {
                // Se não conseguir verificar, aguardar webhook
                // O webhook do Shopify atualizará depois
                setStatus('success');
                setMessage('Pedido processado. Aguardando confirmação final do pagamento via webhook.');
              } else {
                setStatus('loading');
                setMessage('Aguardando confirmação do pagamento...');
                // Tentar novamente após alguns segundos (máximo 3 tentativas)
                const retryCount = parseInt(localStorage.getItem('checkoutRetryCount') || '0');
                if (retryCount < 3) {
                  localStorage.setItem('checkoutRetryCount', (retryCount + 1).toString());
                  setTimeout(() => verifyOrder(), 3000);
                } else {
                  localStorage.removeItem('checkoutRetryCount');
                  setStatus('success');
                  setMessage('Pedido processado. O webhook do Shopify confirmará o pagamento em breve.');
                }
              }
            } catch (error) {
              // Se não conseguir verificar, aguardar webhook
              console.error('Erro ao verificar status do checkout:', error);
              setStatus('success');
              setMessage('Pedido processado. Aguardando confirmação final do pagamento via webhook.');
            }
          } else {
            setStatus('error');
            setMessage('Não foi possível identificar o pedido.');
          }
        } else {
          setStatus('success');
          setMessage('Pedido processado com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao verificar pedido:', error);
        setStatus('error');
        setMessage('Erro ao processar seu pedido. Entre em contato com o suporte.');
      }
    };

    verifyOrder();
  }, [user, searchParams, addOrderToHistory]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h1 className="text-3xl font-bold text-text mb-4">Processando...</h1>
            <p className="text-muted-text">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-text mb-4">Pedido Confirmado!</h1>
            <p className="text-muted-text mb-8">{message}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity uppercase"
                style={{
                  background: 'linear-gradient(135deg, #e8a64a 0%, #d6891f 50%, #c77a1a 100%)',
                  color: '#2c1810',
                }}
              >
                Continuar Comprando
              </Link>
              <Link
                href="/historico"
                className="px-6 py-3 rounded-lg font-bold border-2 hover:opacity-90 transition-opacity uppercase"
                style={{
                  borderColor: '#DFA026',
                  color: '#DFA026',
                }}
              >
                Ver Meus Pedidos
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 text-red-500 mx-auto mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-text mb-4">Erro ao Processar Pedido</h1>
            <p className="text-muted-text mb-8">{message}</p>
            <Link
              href="/checkout"
              className="px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity uppercase inline-block"
              style={{
                background: 'linear-gradient(135deg, #e8a64a 0%, #d6891f 50%, #c77a1a 100%)',
                color: '#2c1810',
              }}
            >
              Voltar ao Checkout
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <Suspense fallback={
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
              <h1 className="text-3xl font-bold text-text mb-4">Carregando...</h1>
            </div>
          </div>
        }>
          <CheckoutSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

