'use client';

import { useState, useRef } from 'react';

interface ProductGalleryProps {
  images: string[];
  badge?: 'novo' | 'oferta' | 'lançamento';
  productName: string;
}

export default function ProductGallery({ images, badge, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Garantir que sempre tenha pelo menos uma imagem
  const allImages = images && images.length > 0 ? images : ['/images/placeholder.png'];
  const currentImage = allImages[selectedIndex];

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
        setSelectedIndex((prev) => (prev + 1) % allImages.length);
      } else {
        // Swipe para a direita - imagem anterior
        setSelectedIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
      {/* Miniaturas Verticais (apenas se tiver mais de uma imagem) - Desktop */}
      {allImages.length > 1 && (
        <div className="hidden lg:flex flex-col gap-2 flex-shrink-0">
          <div className="overflow-y-auto max-h-[500px] pr-1 scrollbar-hide">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`flex-shrink-0 w-16 h-16 xl:w-20 xl:h-20 rounded-lg overflow-hidden border-2 transition-all mb-2 ${
                  selectedIndex === index
                    ? 'border-primary ring-2 ring-primary/50'
                    : 'border-border hover:border-primary/50 opacity-75 hover:opacity-100'
                }`}
                aria-label={`Ver imagem ${index + 1} de ${allImages.length}`}
              >
                <img
                  src={image}
                  alt={`${productName} - Imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Imagem Principal com Zoom */}
      <div className="flex-1">
        <div
          className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-lg overflow-hidden bg-card cursor-zoom-in touch-none"
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
          <div
            className="w-full h-full bg-cover bg-center transition-all duration-300 ease-out"
            style={{
              backgroundImage: `url(${currentImage})`,
              backgroundSize: isZoomed ? '250%' : 'cover',
              backgroundPosition: isZoomed 
                ? `${mousePosition.x}% ${mousePosition.y}%` 
                : 'center',
            }}
          />
          
          {/* Badge */}
          {badge && (
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-primary text-primary-text px-2 py-1 sm:px-3 sm:py-1 rounded font-bold text-xs sm:text-sm z-10">
              {badge === 'oferta' ? 'OFERTA' : 
               badge === 'novo' ? 'NOVO' : 
               'LANÇAMENTO'}
            </div>
          )}
        </div>

        {/* Miniaturas Horizontais (Mobile e Tablet) */}
        {allImages.length > 1 && (
          <div className="mt-3 lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedIndex === index
                    ? 'border-primary ring-2 ring-primary/50 scale-105'
                    : 'border-border hover:border-primary/50 opacity-75 hover:opacity-100'
                }`}
                aria-label={`Ver imagem ${index + 1} de ${allImages.length}`}
              >
                <img
                  src={image}
                  alt={`${productName} - Imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
