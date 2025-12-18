'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, ProductVariant } from '@/lib/shopify';
import ProductVariants from './ProductVariants';
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

  // Inicializar callback apenas uma vez
  useEffect(() => {
    if (initialVariant && onVariantChange) {
      const variantImage = initialVariant.image || product.image;
      onVariantChange(variantImage);
    }
  }, []); // Apenas na montagem

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
      {/* Seleção de Variantes */}
      {product.variants && product.variants.length > 1 && (
        <ProductVariants
          variants={product.variants}
          selectedVariantId={selectedVariant?.id}
          onVariantSelect={handleVariantSelect}
          productName={product.name}
        />
      )}

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
