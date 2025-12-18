import { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/shopify';

// Forçar geração dinâmica do sitemap
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidar a cada hora

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taverna-rpg-store.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // Buscar produtos do Shopify
  let productPages: MetadataRoute.Sitemap = [];
  
  try {
    const products = await getAllProducts(1000); // Buscar até 1000 produtos
    
    productPages = products.map((product) => ({
      url: `${siteUrl}/produto/${product.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Erro ao buscar produtos do Shopify:', error);
    // Continua sem produtos se houver erro
    // Isso permite que o sitemap seja gerado mesmo se a API do Shopify estiver indisponível
  }

  return [...staticPages, ...productPages];
}
