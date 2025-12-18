'use client';

import { useState } from 'react';
import { Product } from '@/lib/shopify';
import { Star, Shield, RotateCcw } from 'lucide-react';
import ProductGallery from './ProductGallery';
import ProductVariantSelector from './ProductVariantSelector';

interface ProductDetailContentProps {
  product: Product;
  rating?: number;
  reviews?: number;
}

export default function ProductDetailContent({ product, rating = 5, reviews = 0 }: ProductDetailContentProps) {
  const [primaryImage, setPrimaryImage] = useState<string | undefined>(undefined);

  const handleVariantChange = (image: string) => {
    setPrimaryImage(image);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Gallery */}
        <ProductGallery 
          images={product.images && product.images.length > 0 ? product.images : [product.image || '/images/placeholder.png']}
          badge={product.badge}
          productName={product.name}
          primaryImage={primaryImage}
        />

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold text-text mb-4">{product.name}</h1>
          
          {/* Rating - será conectado ao Firebase para avaliações reais futuramente */}
          {reviews > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-primary fill-current' : 'text-muted-text'}`} />
                ))}
              </div>
              <span className="text-text">
                {rating} ({reviews} avaliações)
              </span>
            </div>
          )}
          
          {/* Variantes e Ações do Produto */}
          <ProductVariantSelector 
            product={product} 
            onVariantChange={handleVariantChange}
          />

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-card rounded-lg p-4 text-center">
              <Shield className="text-primary w-8 h-8 mx-auto mb-2" />
              <p className="text-card-text text-sm font-bold">Compra Segura</p>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <RotateCcw className="text-primary w-8 h-8 mx-auto mb-2" />
              <p className="text-card-text text-sm font-bold">Devolução em 30 dias</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


