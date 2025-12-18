'use client';

import Link from 'next/link';
import { Product } from '@/lib/shopify';

interface SearchProductCardProps {
  product: Product;
}

export default function SearchProductCard({ product }: SearchProductCardProps) {
  return (
    <Link
      href={`/produto/${product.handle}`}
      className="block rounded-lg overflow-hidden relative group cursor-pointer"
      style={{ 
        backgroundColor: '#1d1816', 
        border: '0.5px solid #DFA026',
        boxShadow: '0 0 8px rgba(223, 160, 38, 0.2)',
        transition: 'box-shadow 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 0 12px rgba(223, 160, 38, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 0 8px rgba(223, 160, 38, 0.2)';
      }}
    >
      {/* Imagem do produto */}
      <div className="relative w-full aspect-square bg-gray-800 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 bg-gray-700 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Informações do produto */}
      <div className="p-2 md:p-4">
        <h3 className="text-secondary-text font-bold text-sm md:text-lg mb-1 md:mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            {product.originalPrice && product.originalPrice > product.price ? (
              <>
                <p className="text-muted-text line-through text-xs md:text-sm">
                  R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                </p>
                <p className="text-primary font-bold text-base md:text-xl">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
              </>
            ) : (
              <p className="text-primary font-bold text-base md:text-xl">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
