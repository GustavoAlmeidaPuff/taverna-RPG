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

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  available: boolean;
  image?: string; // Imagem específica da variante
  variantId: string; // ID da variante do produto no Shopify (necessário para checkout)
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
  variantTitle?: string; // Título/nome da variante selecionada (para exibição no carrinho)
  shopifyProductId?: string; // ID do produto no Shopify (formato gid://shopify/Product/...)
  tags?: string; // Tags do produto (string separada por vírgulas)
  variants?: ProductVariant[]; // Array de variantes do produto
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
      tags
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
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            image {
              url
              altText
            }
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

// Query GraphQL para buscar produtos pela Storefront API
const STOREFRONT_PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          tags
          priceRange {
            minVariantPrice {
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

// Buscar todos os produtos via Storefront API (para ter IDs compatíveis com checkout)
export async function getAllProducts(limit: number = 100): Promise<Product[]> {
  try {
    // Usa Storefront API para garantir IDs compatíveis
    const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, {
      first: limit,
    });
    
    const products = data.products?.edges || [];
    console.log(`📦 ${products.length} produtos encontrados no Shopify`);
    
    return products.map((edge: any) => {
      const p = edge.node;
      const allImages = (p.images?.edges || []).map((img: any) => img.node.url).filter(Boolean);
      const variant = p.variants?.edges?.[0]?.node;
      
      return {
        id: p.id.split('/').pop() || p.id,
        name: p.title,
        price: parseFloat(variant?.price?.amount || '0'),
        image: allImages[0] || '',
        images: allImages.length > 1 ? allImages : undefined,
        description: p.description || '',
        handle: p.handle,
        variantId: variant?.id, // ID da variante no formato GID correto
        shopifyProductId: p.id,
        tags: p.tags?.join(', ') || '',
      };
    });
  } catch (error) {
    console.error('Erro ao buscar produtos do Shopify:', error);
    // Retorna array vazio em caso de erro para não quebrar a aplicação
    return [];
  }
}

// Buscar um produto específico por handle via Storefront API
export async function getProductByHandle(handle: string): Promise<Product | null> {
  try {
    // Usa Storefront API para garantir IDs compatíveis com checkout
    const data = await storefrontApiRequest(PRODUCT_QUERY, {
      handle: handle,
    });
    
    const product = data.product;
    if (!product) return null;
    
    const allImages = (product.images?.edges || []).map((img: any) => img.node.url).filter(Boolean);
    const firstVariant = product.variants?.edges?.[0]?.node;
    
    // Processar todas as variantes
    const variants: ProductVariant[] = (product.variants?.edges || []).map((edge: any) => {
      const variant = edge.node;
      
      return {
        id: variant.id,
        title: variant.title || 'Padrão',
        price: parseFloat(variant.price?.amount || '0'),
        available: variant.availableForSale,
        image: variant.image?.url || allImages[0],
        variantId: variant.id, // ID no formato GID correto
      };
    });
    
    return {
      id: product.id.split('/').pop() || product.id,
      name: product.title,
      price: parseFloat(firstVariant?.price?.amount || '0'),
      image: allImages[0] || '',
      images: allImages.length > 1 ? allImages : undefined,
      description: product.description || '',
      handle: product.handle,
      variantId: firstVariant?.id, // ID da primeira variante no formato GID correto
      shopifyProductId: product.id,
      tags: product.tags?.join(', ') || '',
      variants: variants.length > 1 ? variants : undefined,
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

// Query GraphQL para buscar múltiplos produtos por IDs
const PRODUCTS_BY_IDS_QUERY = `
  query getProductsByIds($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        handle
        description
        tags
        priceRange {
          minVariantPrice {
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
`;

// Buscar múltiplos produtos por IDs usando Storefront API
export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  
  try {
    // Converter IDs para formato GID se necessário
    const formattedIds = ids.map(id => {
      if (id.startsWith('gid://')) {
        return id;
      }
      return `gid://shopify/Product/${id}`;
    });

    const data = await storefrontApiRequest(PRODUCTS_BY_IDS_QUERY, {
      ids: formattedIds,
    });

    const nodes = data.nodes || [];
    return nodes
      .filter((node: any) => node !== null) // Filtrar IDs que não existem
      .map((p: any) => {
        const allImages = (p.images?.edges || []).map((img: any) => img.node.url).filter(Boolean);
        const variant = p.variants?.edges?.[0]?.node;
        
        return {
          id: p.id.split('/').pop() || p.id,
          name: p.title,
          price: parseFloat(variant?.price?.amount || '0'),
          image: allImages[0] || '',
          images: allImages.length > 1 ? allImages : undefined,
          description: p.description || '',
          handle: p.handle,
          variantId: variant?.id, // ID no formato GID correto
          shopifyProductId: p.id,
          tags: p.tags?.join(', ') || '',
        };
      });
  } catch (error) {
    console.error('Erro ao buscar produtos por IDs:', error);
    return [];
  }
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

// Query para validar variantes antes de criar o carrinho
const VALIDATE_VARIANTS_QUERY = `
  query validateVariants($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on ProductVariant {
        id
        availableForSale
        product {
          id
          title
        }
      }
    }
  }
`;

// Validar variantes antes de criar checkout
async function validateVariants(variantIds: string[]): Promise<{ valid: string[], invalid: string[] }> {
  try {
    const formattedIds = variantIds.map(id => {
      if (!id.startsWith('gid://')) {
        return `gid://shopify/ProductVariant/${id}`;
      }
      return id;
    });

    const data = await storefrontApiRequest(VALIDATE_VARIANTS_QUERY, {
      ids: formattedIds,
    });

    const valid: string[] = [];
    const invalid: string[] = [];

    data.nodes.forEach((node: any, index: number) => {
      if (node && node.id && node.availableForSale) {
        valid.push(formattedIds[index]);
      } else {
        invalid.push(formattedIds[index]);
      }
    });

    return { valid, invalid };
  } catch (error) {
    console.error('Erro ao validar variantes:', error);
    throw error;
  }
}

// Criar checkout no Shopify usando Cart API
export async function createCheckout(lineItems: CheckoutLineItem[]): Promise<CheckoutResponse> {
  try {
    console.log('Criando checkout com itens:', lineItems);

    // Garantir que todos os IDs estejam no formato GID correto
    const formattedLineItems = lineItems.map(item => {
      let variantId = item.variantId;
      
      // Se não estiver no formato GID, converter
      if (!variantId.startsWith('gid://')) {
        variantId = `gid://shopify/ProductVariant/${item.variantId}`;
      }
      
      return {
        merchandiseId: variantId,
        quantity: item.quantity,
        originalId: item.variantId,
      };
    });

    console.log('Itens formatados:', formattedLineItems);

    // Validar variantes antes de criar o carrinho
    const variantIds = formattedLineItems.map(item => item.merchandiseId);
    const { valid, invalid } = await validateVariants(variantIds);

    console.log('Validação de variantes - válidas:', valid, 'inválidas:', invalid);

    if (invalid.length > 0) {
      const invalidDetails = invalid.map(id => {
        const item = lineItems.find(i => {
          const variantId = i.variantId.startsWith('gid://') 
            ? i.variantId 
            : `gid://shopify/ProductVariant/${i.variantId}`;
          return variantId === id;
        });
        return {
          variantId: id,
          originalId: item?.variantId || id
        };
      });
      
      console.error('Variantes inválidas detalhadas:', invalidDetails);
      
      throw new Error(
        `Alguns produtos no carrinho não estão mais disponíveis ou foram removidos da loja. ` +
        `IDs problemáticos: ${invalidDetails.map(d => d.originalId).join(', ')}. ` +
        `Por favor, limpe seu carrinho e adicione os produtos novamente.`
      );
    }

    const data = await storefrontApiRequest(CREATE_CART_MUTATION, {
      input: {
        lines: formattedLineItems.map(item => ({
          merchandiseId: item.merchandiseId,
          quantity: item.quantity,
        })),
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

    console.log('Checkout criado com sucesso:', cart.id);

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
