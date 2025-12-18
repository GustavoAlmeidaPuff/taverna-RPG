'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Trash2, Gift, Loader2 } from 'lucide-react';
import AuthModal from '@/components/AuthModal';

export function CheckoutContent() {
  const { items, removeItem, updateQuantity, getTotal } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirecionar para login se não estiver autenticado ao acessar a página
  useEffect(() => {
    if (items.length > 0 && !user) {
      setShowAuthModal(true);
    }
  }, [user, items.length]);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-text mb-4">Seu baú está vazio</h1>
        <p className="text-muted-text mb-6">Adicione produtos ao carrinho antes de finalizar o pedido.</p>
        <Link 
          href="/"
          className="bg-primary text-primary-text px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity inline-block"
        >
          Continuar Comprando
        </Link>
      </div>
    );
  }

  const total = getTotal();
  const hasFreeShipping = total >= 250;

  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-8">MEU BAÚ</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-card rounded-lg p-4 flex gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 rounded flex items-center justify-center flex-shrink-0 bg-gray-700 overflow-hidden">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-500 rounded-full"></div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="text-card-text font-bold mb-1">{item.name}</h3>
                  <p className="text-primary font-bold text-lg mb-3">
                    R$ {item.price.toFixed(2).replace('.', ',')}
                  </p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-border rounded">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1.5 text-card-text hover:bg-input transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 py-1.5 text-card-text">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1.5 text-card-text hover:bg-input transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-destructive hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Subtotal */}
                  <p className="text-muted-text text-sm mt-2">
                    Subtotal: R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold text-card-text mb-4">Resumo do Pedido</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-card-text">
                <span>Subtotal:</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-card-text">
                <span>Frete:</span>
                <span className={hasFreeShipping ? 'text-primary font-bold' : ''}>
                  {hasFreeShipping ? 'Grátis' : 'Calculado no checkout'}
                </span>
              </div>
            </div>

            {!hasFreeShipping && (
              <div className="flex items-center gap-2 text-muted-text text-sm mb-4 p-3 bg-[#2a1f1a] rounded">
                <Gift className="text-primary w-4 h-4" />
                <span>
                  Faltam R$ {(250 - total).toFixed(2).replace('.', ',')} para frete grátis
                </span>
              </div>
            )}

            <div className="border-t border-border pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-card-text">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <button 
              onClick={async () => {
                if (!user) {
                  setShowAuthModal(true);
                  return;
                }

                // Validar se todos os itens têm variantId
                const itemsWithoutVariant = items.filter(item => !item.variantId);
                if (itemsWithoutVariant.length > 0) {
                  setError('Alguns produtos não têm variante configurada. Por favor, recarregue a página e tente novamente.');
                  return;
                }

                setIsProcessing(true);
                setError(null);

                try {
                  // Preparar itens para o checkout
                  const checkoutItems = items.map(item => ({
                    variantId: item.variantId!,
                    quantity: item.quantity,
                  }));

                  // Chamar API de checkout
                  const response = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ items: checkoutItems }),
                  });

                  const data = await response.json();

                  if (!response.ok) {
                    throw new Error(data.message || data.error || 'Erro ao processar checkout');
                  }

                  // Redirecionar para o checkout do Shopify
                  if (data.checkoutUrl) {
                    window.location.href = data.checkoutUrl;
                  } else {
                    throw new Error('URL de checkout não retornada');
                  }
                } catch (err: any) {
                  console.error('Erro ao processar checkout:', err);
                  setError(err.message || 'Erro ao processar checkout. Tente novamente.');
                  setIsProcessing(false);
                }
              }}
              disabled={isProcessing}
              className="w-full bg-primary text-primary-text py-3 rounded-lg font-bold hover:opacity-90 transition-opacity mb-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : (
                'FINALIZAR PEDIDO'
              )}
            </button>

            {error && (
              <div className="mb-3 p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <Link 
              href="/"
              className="block w-full border border-primary text-primary py-3 rounded-lg font-semibold text-center hover:bg-primary hover:text-primary-text transition-colors"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
