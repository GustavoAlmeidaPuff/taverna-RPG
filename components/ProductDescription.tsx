'use client';

import { useState } from 'react';

interface ProductDescriptionProps {
  description: string;
  className?: string;
}

export default function ProductDescription({ description, className = '' }: ProductDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description) {
    return null;
  }

  return (
    <div className={className}>
      <div 
        className={`text-text leading-relaxed prose prose-invert max-w-none ${
          !isExpanded ? 'line-clamp-4' : ''
        }`}
        dangerouslySetInnerHTML={{ __html: description }}
        style={{
          color: '#ebe8e0'
        }}
      />
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-primary hover:underline font-semibold text-sm cursor-pointer"
        style={{
          fontFamily: "'Garamond', 'Palatino Linotype', 'Palatino', 'Times New Roman', serif"
        }}
      >
        {isExpanded ? 'mostrar menos' : 'mostrar mais'}
      </button>
    </div>
  );
}

