'use client';

import { useState, useEffect } from 'react';
import { Product, ProductVariant } from '@/lib/shopify';
import ProductActions from './ProductActions';

interface ProductVariantSelectorProps {
  product: Product;
  onVariantChange?: (image: string) => void; // Callback para atualizar a galeria
}

export default function ProductVariantSelector({ product, onVariantChange }: ProductVariantSelectorProps) {
  // Inicializar com a primeira variante se houver variantes
  const initialVariant = product.variants && product.variants.length > 0 
    ? product.variants[0] 
    : null;
  
  const [selectedVariant] = useState<ProductVariant | null>(initialVariant);
  const [displayPrice] = useState(
    initialVariant?.price || product.price
  );
  const [displayImage] = useState(
    initialVariant?.image || product.image
  );

  // Atualizar callback quando a variante inicial for carregada
  useEffect(() => {
    if (initialVariant?.image && onVariantChange) {
      onVariantChange(initialVariant.image);
    }
  }, [initialVariant?.image, onVariantChange]);

  return (
    <>
      {/* Preço atualizado baseado na variante selecionada */}
      <p className="text-primary text-4xl font-bold mb-6">
        R$ {displayPrice.toFixed(2).replace('.', ',')}
      </p>

      {/* Ações do produto com variante selecionada */}
      <ProductActions 
        product={{
          ...product,
          price: displayPrice,
          image: displayImage,
        }}
        selectedVariant={selectedVariant || undefined}
      />
    </>
  );
}

