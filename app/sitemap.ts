import { MetadataRoute } from 'next';
import { getAllProducts } from '@/lib/shopify';

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
    console.error('Erro ao gerar sitemap de produtos:', error);
    // Continua sem produtos se houver erro
  }

  return [...staticPages, ...productPages];
}
