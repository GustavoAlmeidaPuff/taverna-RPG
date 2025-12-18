'use client';

import { useState } from 'react';
import { ShoppingCart, Heart, Share2, Check, Copy } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Product, ProductVariant } from '@/lib/shopify';
import AuthModal from '@/components/AuthModal';
import VariantSelectionModal from '@/components/VariantSelectionModal';

interface ProductActionsProps {
  product: Product;
  selectedVariant?: ProductVariant;
}

export default function ProductActions({ product, selectedVariant }: ProductActionsProps) {
  const { addItem } = useCart();
  const { user, isFavorite, addFavorite, removeFavorite } = useAuth();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleAddToCart = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // Se o produto tem variantes, mostrar modal de seleção
    if (product.variants && product.variants.length > 1) {
      setShowVariantModal(true);
      return;
    }
    
    // Criar um produto com a variante selecionada
    const productToAdd: Product = {
      ...product,
      variantId: selectedVariant?.variantId || product.variantId,
      price: selectedVariant?.price || product.price,
      image: selectedVariant?.image || product.image,
      variantTitle: selectedVariant?.title, // Salvar o título da variante se houver
    };
    
    for (let i = 0; i < quantity; i++) {
      addItem(productToAdd);
    }

    // Mostrar notificação de sucesso
    const message = quantity > 1 
      ? `${quantity}x ${product.name} adicionado${quantity > 1 ? 's' : ''} ao baú!`
      : `${product.name} adicionado ao baú!`;
    showToast(message, 'success');
  };

  const handleAddVariantToCart = (variant: ProductVariant, variantQuantity: number) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    // Criar um produto com a variante selecionada
    const productToAdd: Product = {
      ...product,
      variantId: variant.variantId,
      price: variant.price,
      image: variant.image || product.image,
      variantTitle: variant.title, // Salvar o título da variante
    };
    
    for (let i = 0; i < variantQuantity; i++) {
      addItem(productToAdd);
    }

    // Mostrar notificação de sucesso
    const message = variantQuantity > 1 
      ? `${variantQuantity}x ${product.name} - ${variant.title} adicionado${variantQuantity > 1 ? 's' : ''} ao baú!`
      : `${product.name} - ${variant.title} adicionado ao baú!`;
    showToast(message, 'success');
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleToggleFavorite = async () => {
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

  const handleShare = async () => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const productUrl = `${siteUrl}/produto/${product.handle}`;
    
    // Formatar preço
    const price = selectedVariant?.price || product.originalPrice || product.price;
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
    
    // Mensagem pré-moldada da loja de RPG
    const shareMessage = `🎲 *Taverna!*\n\n*${product.name}*\n${formattedPrice}\n\n${product.description ? product.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 'Confira este produto incrível para suas aventuras épicas!'}\n\n🔗 ${productUrl}?utm_source=share&utm_medium=whatsapp`;
    
    // URL do WhatsApp com mensagem pré-preenchida
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    
    // Tentar usar Web Share API se disponível (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareMessage,
          url: productUrl,
        });
        return;
      } catch (error) {
        // Usuário cancelou ou erro no compartilhamento
        if ((error as Error).name !== 'AbortError') {
          console.error('Erro ao compartilhar:', error);
        }
        // Continuar com fallback
      }
    }
    
    // Fallback: Abrir WhatsApp Web ou copiar link
    if (window.innerWidth <= 768) {
      // Mobile: abrir WhatsApp diretamente
      window.open(whatsappUrl, '_blank');
    } else {
      // Desktop: copiar link para área de transferência
      try {
        await navigator.clipboard.writeText(shareMessage);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      } catch (error) {
        // Fallback para navegadores antigos
        const textArea = document.createElement('textarea');
        textArea.value = shareMessage;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          setLinkCopied(true);
          setTimeout(() => setLinkCopied(false), 2000);
        } catch (err) {
          console.error('Erro ao copiar:', err);
        }
        document.body.removeChild(textArea);
      }
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-4">
        {/* Primeira linha: Quantidade e Botão Principal */}
        <div className="flex items-center gap-4 flex-1 w-full sm:w-auto">
          {/* Botões de Quantidade */}
          <div 
            className="flex items-center border rounded-lg overflow-hidden flex-shrink-0"
            style={{
              borderColor: '#DFA026',
              backgroundColor: '#1d1816'
            }}
          >
            <button 
              onClick={decrementQuantity}
              className="px-3 sm:px-4 py-3 text-secondary-text hover:bg-[#2a1f1a] transition-colors font-bold text-lg"
              style={{
                fontFamily: "'Garamond', 'Palatino Linotype', 'Palatino', 'Times New Roman', serif"
              }}
            >
              -
            </button>
            <span 
              className="px-4 sm:px-6 py-3 text-secondary-text font-bold text-lg border-l border-r"
              style={{
                borderColor: '#DFA026',
                fontFamily: "'Garamond', 'Palatino Linotype', 'Palatino', 'Times New Roman', serif"
              }}
            >
              {quantity}
            </span>
            <button 
              onClick={incrementQuantity}
              className="px-3 sm:px-4 py-3 text-secondary-text hover:bg-[#2a1f1a] transition-colors font-bold text-lg"
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
            className="flex-1 sm:flex-1 px-4 sm:px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity uppercase flex items-center justify-center gap-2 text-sm sm:text-base"
            style={{
              background: 'linear-gradient(135deg, #e8a64a 0%, #d6891f 50%, #c77a1a 100%)',
              color: '#2c1810',
              border: '1px solid rgba(0, 0, 0, 0.25)',
              fontFamily: "'Garamond', 'Palatino Linotype', 'Palatino', 'Times New Roman', serif",
              letterSpacing: '0.03em',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.2)'
            }}
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">Adicionar ao Baú</span>
          </button>
        </div>
        
        {/* Segunda linha (mobile) / Continua na mesma linha (desktop): Botões de Ação */}
        <div className="flex items-center gap-4 sm:gap-2 lg:gap-4 justify-center sm:justify-start">
          {/* Botão Favorito */}
          <button 
            onClick={handleToggleFavorite}
            className="w-12 h-12 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0"
            style={{
              backgroundColor: isFavorite(product.id) ? '#DF9F26' : '#221A16',
              border: '1px solid #DF9F26',
              color: isFavorite(product.id) ? '#2c1810' : '#DF9F26'
            }}
          >
            <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
          </button>
          
          {/* Botão Compartilhar */}
          <button 
            onClick={handleShare}
            className="w-12 h-12 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0 relative"
            style={{
              backgroundColor: linkCopied ? '#DF9F26' : '#221A16',
              border: '1px solid #DF9F26',
              color: linkCopied ? '#2c1810' : '#DF9F26'
            }}
            title={linkCopied ? 'Link copiado!' : 'Compartilhar produto'}
          >
            {linkCopied ? (
              <Check className="w-5 h-5" />
            ) : (
              <Share2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          // Após login bem-sucedido, verificar se precisa mostrar modal de variantes
          if (product.variants && product.variants.length > 1) {
            setShowVariantModal(true);
          } else {
            // Adiciona o item ao carrinho diretamente
            const productToAdd: Product = {
              ...product,
              variantId: selectedVariant?.variantId || product.variantId,
              price: selectedVariant?.price || product.price,
              image: selectedVariant?.image || product.image,
            };
            for (let i = 0; i < quantity; i++) {
              addItem(productToAdd);
            }
            
            // Mostrar notificação de sucesso
            const message = quantity > 1 
              ? `${quantity}x ${product.name} adicionado${quantity > 1 ? 's' : ''} ao baú!`
              : `${product.name} adicionado ao baú!`;
            showToast(message, 'success');
          }
        }}
      />

      {/* Variant Selection Modal */}
      <VariantSelectionModal
        isOpen={showVariantModal}
        onClose={() => setShowVariantModal(false)}
        product={product}
        onAddToCart={handleAddVariantToCart}
      />
    </div>
  );
}

