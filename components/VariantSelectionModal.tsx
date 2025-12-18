'use client';

import { useState, useEffect } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { Product, ProductVariant } from '@/lib/shopify';

interface VariantSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAddToCart: (variant: ProductVariant, quantity: number) => void;
}

export default function VariantSelectionModal({
  isOpen,
  onClose,
  product,
  onAddToCart,
}: VariantSelectionModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isClosing, setIsClosing] = useState(false);

  // Inicializar com a primeira variante disponível quando o modal abrir
  useEffect(() => {
    if (isOpen && product.variants && product.variants.length > 0) {
      const firstAvailable = product.variants.find(v => v.available) || product.variants[0];
      setSelectedVariant(firstAvailable);
      setQuantity(1);
      setIsClosing(false);
    }
  }, [isOpen, product.variants]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setSelectedVariant(null);
      setQuantity(1);
    }, 300);
  };

  const handleAdd = () => {
    if (!selectedVariant) return;
    onAddToCart(selectedVariant, quantity);
    handleClose();
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Função para extrair a cor do título da variante
  const getVariantColor = (title: string): string => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('café') || titleLower.includes('marrom')) return '#8B4513';
    if (titleLower.includes('roxo') || titleLower.includes('purple')) return '#9370DB';
    if (titleLower.includes('preto') || titleLower.includes('black')) return '#000000';
    if (titleLower.includes('verde') || titleLower.includes('green')) return '#228B22';
    if (titleLower.includes('azul') || titleLower.includes('blue')) return '#4169E1';
    if (titleLower.includes('vermelho') || titleLower.includes('red')) return '#DC143C';
    if (titleLower.includes('amarelo') || titleLower.includes('yellow')) return '#FFD700';
    if (titleLower.includes('branco') || titleLower.includes('white')) return '#FFFFFF';
    return '#DFA026'; // Cor padrão (dourado)
  };

  if (!isOpen && !isClosing) return null;

  if (!product.variants || product.variants.length === 0) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black z-50 ${
          isClosing ? 'animate-fade-out' : 'animate-fade-in'
        }`}
        style={{ opacity: isClosing ? 0 : 0.7 }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`bg-[#1d1816] border-2 border-[#DFA026] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col pointer-events-auto transition-all duration-300 ${
            isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#DFA026]/20 flex-shrink-0">
            <div>
              <h2
                className="text-xl sm:text-2xl font-bold text-[#DFA026] mb-1"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Selecione a Variante
              </h2>
              <p className="text-[#ebe8e0] text-xs sm:text-sm truncate">{product.name}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-[#ebe8e0] hover:text-[#DFA026] transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* Lista de Variantes - Grid 2 colunas */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {product.variants.map((variant) => {
                const isSelected = selectedVariant?.id === variant.id;
                const variantColor = getVariantColor(variant.title);
                
                return (
                  <button
                    key={variant.id}
                    onClick={() => variant.available && setSelectedVariant(variant)}
                    disabled={!variant.available}
                    className={`
                      flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all
                      ${isSelected 
                        ? 'bg-card' 
                        : 'border-border bg-background hover:border-primary/50'
                      }
                      ${!variant.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    style={isSelected ? {
                      borderColor: '#DFA026',
                      borderWidth: '3px',
                      boxShadow: '0 0 0 3px rgba(223, 160, 38, 0.4), 0 4px 16px rgba(223, 160, 38, 0.6), 0 0 24px rgba(223, 160, 38, 0.4)'
                    } : {}}
                  >
                    {/* Ícone/Imagem da Variante */}
                    <div className="flex-shrink-0">
                      {variant.image ? (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 border-border">
                          <img
                            src={variant.image}
                            alt={`${product.name} - ${variant.title}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div 
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center border-2 border-border"
                          style={{ backgroundColor: `${variantColor}20` }}
                        >
                          <div 
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded"
                            style={{ backgroundColor: variantColor }}
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Informações da Variante */}
                    <div className="flex-1 w-full text-center min-w-0">
                      <p className={`font-semibold text-xs sm:text-sm ${isSelected ? 'text-primary' : 'text-text'} truncate`}>
                        {variant.title}
                      </p>
                      <p className="text-xs text-muted-text">
                        R$ {variant.price.toFixed(2).replace('.', ',')}
                      </p>
                      {!variant.available && (
                        <p className="text-xs text-red-400 mt-1">Indisponível</p>
                      )}
                    </div>
                    
                    {/* Indicador de Seleção */}
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary-text" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quantidade */}
            <div className="mb-6">
              <p className="text-[#ebe8e0] text-sm font-semibold mb-3">Quantidade</p>
              <div 
                className="flex items-center border rounded-lg overflow-hidden w-fit"
                style={{
                  borderColor: '#DFA026',
                  backgroundColor: '#1d1816'
                }}
              >
                <button 
                  onClick={decrementQuantity}
                  className="px-3 sm:px-4 py-2 sm:py-3 text-secondary-text hover:bg-[#2a1f1a] transition-colors font-bold text-base sm:text-lg"
                  style={{
                    fontFamily: "'Garamond', 'Palatino Linotype', 'Palatino', 'Times New Roman', serif"
                  }}
                >
                  -
                </button>
                <span 
                  className="px-4 sm:px-6 py-2 sm:py-3 text-secondary-text font-bold text-base sm:text-lg border-l border-r"
                  style={{
                    borderColor: '#DFA026',
                    fontFamily: "'Garamond', 'Palatino Linotype', 'Palatino', 'Times New Roman', serif"
                  }}
                >
                  {quantity}
                </span>
                <button 
                  onClick={incrementQuantity}
                  className="px-3 sm:px-4 py-2 sm:py-3 text-secondary-text hover:bg-[#2a1f1a] transition-colors font-bold text-base sm:text-lg"
                  style={{
                    fontFamily: "'Garamond', 'Palatino Linotype', 'Palatino', 'Times New Roman', serif"
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Botão Adicionar */}
            <button 
              onClick={handleAdd}
              disabled={!selectedVariant || !selectedVariant.available}
              className="w-full px-4 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity uppercase flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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
              <span>Adicionar ao Baú</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

