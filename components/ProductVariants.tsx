'use client';

import { useState, useEffect } from 'react';
import { ProductVariant } from '@/lib/shopify';

interface ProductVariantsProps {
  variants: ProductVariant[];
  selectedVariantId?: string;
  onVariantSelect: (variant: ProductVariant) => void;
  productName: string;
}

export default function ProductVariants({ 
  variants, 
  selectedVariantId, 
  onVariantSelect,
  productName 
}: ProductVariantsProps) {
  // Usar selectedVariantId como fonte de verdade quando disponível
  // Caso contrário, usar estado local
  const [internalSelectedId, setInternalSelectedId] = useState<string>(
    selectedVariantId || variants[0]?.id || ''
  );
  
  // Sincronizar estado interno quando selectedVariantId mudar
  useEffect(() => {
    if (selectedVariantId) {
      setInternalSelectedId(selectedVariantId);
    }
  }, [selectedVariantId]);
  
  // Se selectedVariantId for fornecido, usar ele; caso contrário, usar estado interno
  const selectedId = selectedVariantId !== undefined ? selectedVariantId : internalSelectedId;

  const handleVariantClick = (variant: ProductVariant) => {
    // Atualizar estado local sempre (para feedback visual imediato)
    setInternalSelectedId(variant.id);
    // Sempre notificar o pai
    onVariantSelect(variant);
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

  if (variants.length <= 1) {
    return null; // Não mostra se tiver apenas uma variante
  }

  return (
    <div className="mb-6">
      <div className="mb-3">
        <p className="text-text font-semibold text-sm mb-2">
          {variants.length} {variants.length === 1 ? 'variante' : 'variantes'}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {variants.map((variant) => {
          // Comparar IDs como strings para garantir correspondência
          const isSelected = String(selectedId) === String(variant.id);
          const variantColor = getVariantColor(variant.title);
          
          return (
            <button
              key={variant.id}
              onClick={() => handleVariantClick(variant)}
              disabled={!variant.available}
              className={`
                flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border-2 transition-all
                ${isSelected 
                  ? 'border-primary bg-card ring-2 ring-primary/50' 
                  : 'border-border bg-background hover:border-primary/50'
                }
                ${!variant.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Ícone/Imagem da Variante */}
              <div className="flex-shrink-0">
                {variant.image ? (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 border-border">
                    <img
                      src={variant.image}
                      alt={`${productName} - ${variant.title}`}
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
              <div className="flex-1 text-left min-w-0">
                <p className={`font-semibold text-sm sm:text-base ${isSelected ? 'text-primary' : 'text-text'} truncate`}>
                  {variant.title}
                </p>
                <p className="text-xs sm:text-sm text-muted-text">
                  R$ {variant.price.toFixed(2).replace('.', ',')}
                  {!variant.available && ' - Indisponível'}
                </p>
              </div>
              
              {/* Indicador de Seleção */}
              {isSelected && (
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary-text" />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
