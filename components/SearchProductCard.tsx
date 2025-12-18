'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/shopify';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';

interface SearchProductCardProps {
  product: Product;
}

export default function SearchProductCard({ product }: SearchProductCardProps) {
  const { addItem } = useCart();
  const { user, isFavorite, addFavorite, removeFavorite } = useAuth();
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      setPendingProduct(product);
      setShowAuthModal(true);
      return;
    }
    
    addItem(product);
  };

  const handleToggleFavorite = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      if (isFavorite(product.id)) {
        await removeFavorite(product.id);
      } else {
        await addFavorite(product.id);
      }
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    }
  };

  const getPrimaryImage = (product: Product): string => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return product.image || '/images/placeholder.png';
  };

  const getSecondaryImage = (product: Product): string | null => {
    if (product.images && product.images.length > 1) {
      return product.images[1];
    }
    return null;
  };

  return (
    <>
      <Link
        href={`/produto/${product.handle}`}
        className="block rounded-lg overflow-hidden relative group cursor-pointer"
        style={{ 
          backgroundColor: '#1d1816', 
          border: '0.5px solid #DFA026',
          boxShadow: hoveredCardId === product.id 
            ? '0 0 12px rgba(223, 160, 38, 0.3)' 
            : '0 0 8px rgba(223, 160, 38, 0.2)',
          transition: 'box-shadow 0.3s ease'
        }}
        onMouseEnter={() => {
          setHoveredCardId(product.id);
          if (product.images && product.images.length > 1) {
            setHoveredProductId(product.id);
          }
        }}
        onMouseLeave={() => {
          setHoveredCardId(null);
          setHoveredProductId(null);
        }}
      >
        {/* Badge */}
        {product.badge && (
          <div className={`absolute top-1 left-1 md:top-2 md:left-2 z-10 px-1 py-0.5 md:px-2 md:py-1 rounded text-[10px] md:text-xs font-bold ${
            product.badge === 'oferta' || product.discount
              ? 'bg-destructive text-destructive-text'
              : 'bg-primary text-primary-text'
          }`}>
            {product.badge === 'oferta' && product.discount ? `OFERTA -${product.discount}%` : 
             product.badge === 'novo' ? 'NOVO' :
             product.badge === 'lançamento' ? 'LANÇAMENTO' :
             product.discount ? `-${product.discount}%` : ''}
          </div>
        )}
        {!product.badge && product.discount && (
          <div className="absolute top-1 right-1 md:top-2 md:right-2 z-10 px-1 py-0.5 md:px-2 md:py-1 rounded text-[10px] md:text-xs font-bold bg-destructive text-destructive-text">
            -{product.discount}%
          </div>
        )}

        {/* Imagem do produto com fade */}
        <div className="h-32 md:h-64 relative group overflow-hidden">
          {/* Imagem principal - sempre visível */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${getPrimaryImage(product)})` }}
          />
          
          {/* Imagem secundária - fade in/out no hover */}
          {getSecondaryImage(product) && (
            <div 
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 ${
                hoveredProductId === product.id ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url(${getSecondaryImage(product)})` }}
            />
          )}

          {/* Action Buttons - aparecem no hover */}
          <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 flex gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button 
              onClick={(e) => handleToggleFavorite(e, product)}
              className={`hidden md:flex w-8 h-8 md:w-10 md:h-10 bg-card border rounded-full items-center justify-center transition-colors ${
                isFavorite(product.id)
                  ? 'border-primary bg-primary'
                  : 'border-border hover:bg-primary hover:border-primary'
              }`}
            >
              <Heart 
                className={`w-4 h-4 md:w-5 md:h-5 ${
                  isFavorite(product.id)
                    ? 'text-primary-text fill-current'
                    : 'text-card-text'
                }`}
              />
            </button>
            <button 
              onClick={(e) => handleAddToCart(e, product)}
              className="bg-primary text-primary-text px-2 py-1 md:px-4 md:py-2 rounded-full text-[10px] md:text-sm font-bold flex items-center gap-0.5 md:gap-1 hover:opacity-90 transition-opacity"
            >
              <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden md:inline">Adicionar ao Baú</span>
              <span className="md:hidden">Baú</span>
            </button>
          </div>
        </div>

        {/* Informações do produto */}
        <div className="p-2 md:p-4">
          <h3 className="text-card-text font-bold mb-1 md:mb-2 hover:text-primary transition-colors uppercase text-xs md:text-base leading-tight md:leading-normal line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2 mb-0.5 md:mb-1">
            {product.originalPrice && (
              <span className="text-muted-text line-through text-[10px] md:text-sm">
                de R$ {product.originalPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
            <span className="text-primary font-bold text-sm md:text-lg">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
          </div>
          
          <p className="text-muted-text text-[10px] md:text-sm">
            ou 12x de R$ {(product.price / 12).toFixed(2).replace('.', ',')} sem juros
          </p>
        </div>
      </Link>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingProduct(null);
        }}
        onSuccess={() => {
          if (pendingProduct) {
            addItem(pendingProduct);
            setPendingProduct(null);
          }
        }}
      />
    </>
  );
}

