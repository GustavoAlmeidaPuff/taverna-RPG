'use client';

import { useState } from 'react';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/lib/shopify';

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-4">
        {/* Botões de Quantidade */}
        <div 
          className="flex items-center border rounded-lg overflow-hidden"
          style={{
            borderColor: '#DFA026',
            backgroundColor: '#1d1816'
          }}
        >
          <button 
            onClick={decrementQuantity}
            className="px-4 py-3 text-secondary-text hover:bg-[#2a1f1a] transition-colors font-bold text-lg"
            style={{
              fontFamily: "'Garamond', 'Palatino Linotype', 'Palatino', 'Times New Roman', serif"
            }}
          >
            -
          </button>
          <span 
            className="px-6 py-3 text-secondary-text font-bold text-lg border-l border-r"
            style={{
              borderColor: '#DFA026',
              fontFamily: "'Garamond', 'Palatino Linotype', 'Palatino', 'Times New Roman', serif"
            }}
          >
            {quantity}
          </span>
          <button 
            onClick={incrementQuantity}
            className="px-4 py-3 text-secondary-text hover:bg-[#2a1f1a] transition-colors font-bold text-lg"
            style={{
              fontFamily: "'Garamond', 'Palatino Linotype', 'Palatino', 'Times New Roman', serif"
            }}
          >
            +
          </button>
        </div>
        
        {/* Botão Adicionar ao Baú */}
        <button 
          onClick={handleAddToCart}
          className="flex-1 px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity uppercase flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, #e8a64a 0%, #d6891f 50%, #c77a1a 100%)',
            color: '#2c1810',
            border: '1px solid rgba(0, 0, 0, 0.25)',
            fontFamily: "'Garamond', 'Palatino Linotype', 'Palatino', 'Times New Roman', serif",
            letterSpacing: '0.03em',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.2)'
          }}
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Adicionar ao Baú</span>
        </button>
        
        {/* Botão Favorito */}
        <button 
          className="w-12 h-12 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: '#221A16',
            border: '1px solid #DF9F26',
            color: '#DF9F26'
          }}
        >
          <Heart className="w-5 h-5" />
        </button>
        
        {/* Botão Compartilhar */}
        <button 
          className="w-12 h-12 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: '#221A16',
            border: '1px solid #DF9F26',
            color: '#DF9F26'
          }}
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
