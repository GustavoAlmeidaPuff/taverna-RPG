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
        <div className="flex items-center gap-2 border border-border rounded">
          <button 
            onClick={decrementQuantity}
            className="px-4 py-2 text-text hover:bg-input transition-colors"
          >
            -
          </button>
          <span className="px-4 py-2 text-text">{quantity}</span>
          <button 
            onClick={incrementQuantity}
            className="px-4 py-2 text-text hover:bg-input transition-colors"
          >
            +
          </button>
        </div>
        <button 
          onClick={handleAddToCart}
          className="flex-1 bg-primary text-primary-text px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Adicionar ao Baú</span>
        </button>
        <button className="w-12 h-12 border border-border rounded-lg flex items-center justify-center hover:bg-input transition-colors">
          <Heart className="text-text w-5 h-5" />
        </button>
        <button className="w-12 h-12 border border-border rounded-lg flex items-center justify-center hover:bg-input transition-colors">
          <Share2 className="text-text w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
