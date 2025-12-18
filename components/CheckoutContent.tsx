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
        <h1 className="text-3xl font-bold text-[#E0DEDC] mb-4">Seu baú está vazio</h1>
        <p className="text-[#E0DEDC]/70 mb-6">Adicione produtos ao carrinho antes de finalizar o pedido.</p>
        <Link 
          href="/"
          className="bg-gradient-to-r from-orange-600 to-[#DFA026] text-[#E0DEDC] px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity inline-block"
          style={{
            background: 'linear-gradient(to right, #ea580c, #DFA026)'
          }}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-[#281E19] rounded-lg p-4 md:p-6 relative">
                {/* Trash Icon - Top Right */}
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 text-[#E0DEDC] hover:text-[#DFA026] transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded flex items-center justify-center flex-shrink-0 bg-gray-700 overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#E0DEDC] font-bold mb-2 uppercase text-sm md:text-base">{item.name}</h3>
                    <p className="text-[#DFA026] font-bold text-lg md:text-xl mb-3">
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center border border-[#3d3128] rounded overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1.5 md:px-4 md:py-2 bg-[#281E19] text-[#E0DEDC] hover:bg-[#322520] transition-colors"
                        >
                          -
                        </button>
                        <span className="px-4 md:px-6 py-1.5 md:py-2 text-[#E0DEDC] bg-[#281E19]">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1.5 md:px-4 md:py-2 bg-[#281E19] text-[#E0DEDC] hover:bg-[#322520] transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    {/* Subtotal */}
                    <p className="text-[#E0DEDC] text-sm">
                      Subtotal: R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#281E19] rounded-lg p-6 sticky top-4">
            <h2 className="text-xl md:text-2xl font-bold text-[#E0DEDC] mb-6 uppercase">Resumo do Pedido</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-[#E0DEDC]">
                <span>Subtotal:</span>
                <span>R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-[#E0DEDC]">
                <span>Frete:</span>
                <span>
                  {hasFreeShipping ? 'Grátis' : 'Calculado no checkout'}
                </span>
              </div>
            </div>

            {!hasFreeShipping && (
              <div className="flex items-center gap-2 text-[#E0DEDC] text-sm mb-6 p-3 bg-[#1a140f] rounded-lg">
                <Gift className="text-[#DFA026] w-4 h-4 flex-shrink-0" />
                <span>
                  Faltam <span className="text-[#DFA026] font-semibold">R$ {(250 - total).toFixed(2).replace('.', ',')}</span> para frete grátis
                </span>
              </div>
            )}

            <div className="mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg md:text-xl font-bold text-[#E0DEDC]">Total:</span>
                <span className="text-xl md:text-2xl font-bold text-[#DFA026]">
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
              className="w-full bg-gradient-to-r from-orange-600 to-[#DFA026] text-[#E0DEDC] py-3 rounded-lg font-bold hover:opacity-90 transition-opacity mb-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase"
              style={{
                background: 'linear-gradient(to right, #ea580c, #DFA026)'
              }}
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
              className="block w-full bg-[#281E19] border border-[#3d3128] text-[#E0DEDC] py-3 rounded-lg font-semibold text-center hover:bg-[#322520] transition-colors"
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
