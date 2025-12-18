// Tipos compartilhados para produtos

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  badge?: 'novo' | 'oferta' | 'lançamento';
  image: string;
  images?: string[];
  description?: string;
  handle: string;
  tags?: string; // Tags do produto (string separada por vírgulas)
}

export interface ProductDetail extends Product {
  rating?: number;
  reviews?: number;
  specifications?: string[];
  variants?: Array<{
    id: string;
    title: string;
    price: number;
    available: boolean;
  }>;
}
