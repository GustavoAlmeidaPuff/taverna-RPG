// Helper para usar Storefront API (se configurado futuramente)
// Por enquanto, usando apenas Admin API
async function useStorefrontAPI(query: string, variables: any) {
  // Storefront API desabilitado por enquanto - usando apenas Admin API
  // Para habilitar no futuro, configure SHOPIFY_STOREFRONT_ACCESS_TOKEN
  return null;
}

// Helper para fazer requisições à Admin API REST
async function adminApiRequest(endpoint: string, options: RequestInit = {}) {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN!;
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!;
  
  const url = `https://${storeDomain}/admin/api/2024-10/${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }
  
  return response.json();
}

// Tipos para produtos do Shopify
export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
      };
    }>;
  };
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  badge?: 'novo' | 'oferta' | 'lançamento';
  image: string;
  images?: string[]; // Array de imagens para hover
  description?: string;
  handle: string;
}

// Query GraphQL para buscar todos os produtos
const PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

// Query GraphQL para buscar um produto específico por handle
const PRODUCT_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
          }
        }
      }
    }
  }
`;

// Função para converter produto do Shopify para o formato do nosso app
function transformProduct(shopifyProduct: ShopifyProduct): Product {
  const price = parseFloat(shopifyProduct.priceRange.minVariantPrice.amount);
  const image = shopifyProduct.images.edges[0]?.node?.url || '';
  
  return {
    id: shopifyProduct.id.split('/').pop() || shopifyProduct.id,
    name: shopifyProduct.title,
    price: price,
    image: image,
    description: shopifyProduct.description,
    handle: shopifyProduct.handle,
  };
}

// Buscar todos os produtos via Admin API
export async function getAllProducts(limit: number = 20): Promise<Product[]> {
  try {
    // Usa Admin API para buscar produtos
    const data = await adminApiRequest(`products.json?limit=${limit}`);
    
    const products = data.products || [];
    return products.map((p: any) => {
      const allImages = (p.images || []).map((img: any) => img.src).filter(Boolean);
      return {
        id: p.id.toString(),
        name: p.title,
        price: parseFloat(p.variants[0]?.price || '0'),
        image: allImages[0] || '',
        images: allImages.length > 1 ? allImages : undefined, // Só inclui se tiver mais de uma imagem
        description: p.body_html || '',
        handle: p.handle,
      };
    });
  } catch (error) {
    console.error('Erro ao buscar produtos do Shopify:', error);
    // Retorna array vazio em caso de erro para não quebrar a aplicação
    return [];
  }
}

// Buscar um produto específico por handle via Admin API
export async function getProductByHandle(handle: string): Promise<Product | null> {
  try {
    // Admin API busca produtos por handle usando query string
    const data = await adminApiRequest(`products.json?handle=${handle}`);
    
    const product = data.products?.[0];
    if (!product) return null;
    
    const allImages = (product.images || []).map((img: any) => img.src).filter(Boolean);
    return {
      id: product.id.toString(),
      name: product.title,
      price: parseFloat(product.variants[0]?.price || '0'),
      image: allImages[0] || '',
      images: allImages.length > 1 ? allImages : undefined, // Só inclui se tiver mais de uma imagem
      description: product.body_html || '',
      handle: product.handle,
    };
  } catch (error) {
    console.error('Erro ao buscar produto do Shopify:', error);
    return null;
  }
}

// Buscar um produto por ID
export async function getProductById(id: string): Promise<Product | null> {
  // A Shopify usa handles nas URLs, então podemos tentar usar o ID como handle
  // ou fazer uma query diferente se necessário
  return getProductByHandle(id);
}
