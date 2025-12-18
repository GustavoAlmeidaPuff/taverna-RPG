// Helper para fazer requisições à Storefront API
async function storefrontApiRequest(query: string, variables: any = {}) {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN!;
  const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
  
  if (!accessToken) {
    throw new Error('SHOPIFY_STOREFRONT_ACCESS_TOKEN não configurado');
  }
  
  const url = `https://${storeDomain}/api/2024-10/graphql.json`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify Storefront API error: ${response.statusText} - ${errorText}`);
  }
  
  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`Shopify GraphQL errors: ${JSON.stringify(data.errors)}`);
  }
  
  return data.data;
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
  variantId?: string; // ID da variante do produto no Shopify (necessário para checkout)
  shopifyProductId?: string; // ID do produto no Shopify (formato gid://shopify/Product/...)
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
      const variant = p.variants?.[0];
      return {
        id: p.id.toString(),
        name: p.title,
        price: parseFloat(variant?.price || '0'),
        image: allImages[0] || '',
        images: allImages.length > 1 ? allImages : undefined, // Só inclui se tiver mais de uma imagem
        description: p.body_html || '',
        handle: p.handle,
        variantId: variant?.id?.toString(), // ID da variante para checkout
        shopifyProductId: `gid://shopify/Product/${p.id}`, // ID no formato GraphQL
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
    const variant = product.variants?.[0];
    return {
      id: product.id.toString(),
      name: product.title,
      price: parseFloat(variant?.price || '0'),
      image: allImages[0] || '',
      images: allImages.length > 1 ? allImages : undefined, // Só inclui se tiver mais de uma imagem
      description: product.body_html || '',
      handle: product.handle,
      variantId: variant?.id?.toString(), // ID da variante para checkout
      shopifyProductId: `gid://shopify/Product/${product.id}`, // ID no formato GraphQL
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

// Interface para itens do checkout
export interface CheckoutLineItem {
  variantId: string;
  quantity: number;
}

// Interface para resposta do checkout
export interface CheckoutResponse {
  checkoutUrl: string;
  checkoutId: string;
}

// Mutation GraphQL para criar carrinho (Cart API)
const CREATE_CART_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 250) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Criar checkout no Shopify usando Cart API
export async function createCheckout(lineItems: CheckoutLineItem[]): Promise<CheckoutResponse> {
  try {
    // Converter variant IDs para o formato GraphQL (gid://shopify/ProductVariant/...)
    const formattedLineItems = lineItems.map(item => {
      // Se o variantId já está no formato gid, usar diretamente
      // Caso contrário, assumir que é um ID numérico e converter
      let variantId = item.variantId;
      if (!variantId.startsWith('gid://')) {
        variantId = `gid://shopify/ProductVariant/${item.variantId}`;
      }
      
      return {
        merchandiseId: variantId,
        quantity: item.quantity,
      };
    });

    const data = await storefrontApiRequest(CREATE_CART_MUTATION, {
      input: {
        lines: formattedLineItems,
      },
    });

    if (data.cartCreate.userErrors?.length > 0) {
      const errors = data.cartCreate.userErrors
        .map((e: any) => `${e.field}: ${e.message}`)
        .join(', ');
      throw new Error(`Erro ao criar carrinho: ${errors}`);
    }

    const cart = data.cartCreate.cart;
    
    if (!cart || !cart.checkoutUrl) {
      throw new Error('Carrinho criado mas URL de checkout não retornada');
    }

    return {
      checkoutUrl: cart.checkoutUrl,
      checkoutId: cart.id,
    };
  } catch (error) {
    console.error('Erro ao criar checkout do Shopify:', error);
    throw error;
  }
}

// Buscar variante de produto por ID do produto (Admin API)
export async function getProductVariantId(productId: string): Promise<string | null> {
  try {
    // Buscar produto via Admin API para obter variant ID
    const data = await adminApiRequest(`products/${productId}.json`);
    const product = data.product;
    
    if (!product || !product.variants || product.variants.length === 0) {
      return null;
    }
    
    // Retornar o ID da primeira variante disponível
    const variant = product.variants[0];
    return variant.id.toString();
  } catch (error) {
    console.error('Erro ao buscar variante do produto:', error);
    return null;
  }
}
