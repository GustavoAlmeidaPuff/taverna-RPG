'use client';

import { useState, useEffect, useCallback } from 'react';
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
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(initialVariant);
  const [displayPrice, setDisplayPrice] = useState(
    initialVariant?.price || product.price
  );
  const [displayImage, setDisplayImage] = useState(
    initialVariant?.image || product.image
  );

  // Atualizar callback quando a variante inicial for carregada
  useEffect(() => {
    if (initialVariant?.image && onVariantChange) {
      onVariantChange(initialVariant.image);
    }
  }, [initialVariant?.image, onVariantChange]);

  const handleVariantSelect = useCallback((variant: ProductVariant) => {
    setSelectedVariant(variant);
    setDisplayPrice(variant.price);
    const variantImage = variant.image || product.image;
    setDisplayImage(variantImage);
    if (onVariantChange) {
      onVariantChange(variantImage);
    }
  }, [product.image, onVariantChange]);

  return (
    <>
      {/* Preço atualizado baseado na variante selecionada */}
      <p className="text-primary text-4xl font-bold mb-6">
        R$ {displayPrice.toFixed(2).replace('.', ',')}
      </p>

      {/* Seletor de Variantes */}
      {product.variants && product.variants.length > 1 && (
        <div className="mb-6">
          <h3 className="text-text font-bold mb-3 text-base sm:text-lg">Selecione a Variante:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {product.variants.map((variant) => (
              <button
                key={variant.variantId}
                onClick={() => handleVariantSelect(variant)}
                className={`relative p-3 sm:p-4 rounded-lg border-2 transition-all touch-manipulation ${
                  selectedVariant?.variantId === variant.variantId
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                    : 'border-border hover:border-primary/50 active:border-primary'
                }`}
                aria-pressed={selectedVariant?.variantId === variant.variantId}
                aria-label={`Selecionar variante ${variant.title}`}
              >
                {variant.image && (
                  <div className="w-full h-16 sm:h-20 mb-2 rounded overflow-hidden bg-card">
                    <img
                      src={variant.image}
                      alt={variant.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <p className="text-text font-semibold text-xs sm:text-sm line-clamp-2">{variant.title}</p>
                <p className="text-primary font-bold text-xs sm:text-sm mt-1">
                  R$ {variant.price.toFixed(2).replace('.', ',')}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

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

