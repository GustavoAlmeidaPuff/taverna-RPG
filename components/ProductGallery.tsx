'use client';

import { useState, useRef, useEffect } from 'react';

interface ProductGalleryProps {
  images: string[];
  badge?: 'novo' | 'oferta' | 'lançamento';
  productName: string;
  primaryImage?: string; // Imagem principal que pode ser atualizada (ex: quando variante muda)
}

export default function ProductGallery({ images, badge, productName, primaryImage }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Garantir que sempre tenha pelo menos uma imagem
  const allImages = images && images.length > 0 ? images : ['/images/placeholder.png'];
  
  // Se primaryImage for fornecida e estiver na lista, usar ela como primeira
  const displayImages = primaryImage && !allImages.includes(primaryImage) 
    ? [primaryImage, ...allImages] 
    : allImages;
  
  const currentImage = displayImages[selectedIndex];

  // Resetar índice quando primaryImage mudar
  useEffect(() => {
    if (primaryImage) {
      // Encontrar o índice da primaryImage em displayImages
      const index = displayImages.findIndex(img => img === primaryImage);
      if (index !== -1) {
        setSelectedIndex(index);
      } else {
        // Se a primaryImage não está na lista, resetar para 0 
        // (ela será adicionada ao início do array)
        setSelectedIndex(0);
      }
    }
  }, [primaryImage]); // Remover displayImages das dependências para evitar loops

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ 
      x: Math.max(0, Math.min(100, x)), 
      y: Math.max(0, Math.min(100, y)) 
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swipe para a esquerda - próxima imagem
        setSelectedIndex((prev) => (prev + 1) % displayImages.length);
      } else {
        // Swipe para a direita - imagem anterior
        setSelectedIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Miniaturas Verticais (Desktop) */}
        {displayImages.length > 1 && (
          <div className="order-2 lg:order-1 hidden lg:block flex-shrink-0">
            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto scrollbar-hide">
              {displayImages.map((image, index) => (
                <button
                  key={`desktop-thumb-${index}`}
                  onClick={() => setSelectedIndex(index)}
                  type="button"
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedIndex === index
                      ? 'border-primary ring-2 ring-primary/50'
                      : 'border-border hover:border-primary/50 opacity-75 hover:opacity-100'
                  }`}
                  aria-label={`Ver imagem ${index + 1} de ${displayImages.length}`}
                  aria-pressed={selectedIndex === index}
                >
                  <img
                    src={image}
                    alt={`${productName} - Miniatura ${index + 1}`}
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Imagem Principal */}
        <div className="order-1 lg:order-2 flex-1">
          <div
            className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg overflow-hidden bg-card cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => {
              setIsZoomed(false);
              setMousePosition({ x: 50, y: 50 });
            }}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={currentImage}
              alt={productName}
              className="w-full h-full object-contain"
              style={{
                transform: isZoomed 
                  ? `scale(2.5) translate(${(50 - mousePosition.x) * 0.4}%, ${(50 - mousePosition.y) * 0.4}%)` 
                  : 'scale(1)',
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                transition: isZoomed ? 'none' : 'transform 0.3s ease-out',
              }}
            />
            
            {/* Badge */}
            {badge && (
              <div className="absolute top-4 left-4 bg-primary text-primary-text px-3 py-1 rounded font-bold text-sm z-10">
                {badge === 'oferta' ? 'OFERTA' : 
                 badge === 'novo' ? 'NOVO' : 
                 'LANÇAMENTO'}
              </div>
            )}
          </div>

          {/* Miniaturas Horizontais (Mobile) */}
          {displayImages.length > 1 && (
            <div className="mt-4 lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {displayImages.map((image, index) => (
                <button
                  key={`mobile-thumb-${index}`}
                  onClick={() => setSelectedIndex(index)}
                  type="button"
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all touch-manipulation cursor-pointer ${
                    selectedIndex === index
                      ? 'border-primary ring-2 ring-primary/50'
                      : 'border-border active:border-primary opacity-75 active:opacity-100'
                  }`}
                  aria-label={`Ver imagem ${index + 1} de ${displayImages.length}`}
                  aria-pressed={selectedIndex === index}
                >
                  <img
                    src={image}
                    alt={`${productName} - Miniatura ${index + 1}`}
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
