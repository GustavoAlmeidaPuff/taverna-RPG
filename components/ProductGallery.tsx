'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

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
        nextImage();
      } else {
        // Swipe para a direita - imagem anterior
        prevImage();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="relative">
      {/* Imagem Principal com Zoom */}
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

        {/* Navegação - Setas (apenas se tiver mais de uma imagem) */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background active:bg-background/90 text-text p-1.5 sm:p-2 rounded-full transition-colors z-10 shadow-lg"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background active:bg-background/90 text-text p-1.5 sm:p-2 rounded-full transition-colors z-10 shadow-lg"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
            </button>
          </>
        )}
      </div>

      {/* Miniaturas (apenas se tiver mais de uma imagem) */}
      {allImages.length > 1 && (
        <div className="mt-3 sm:mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
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
  );
}
