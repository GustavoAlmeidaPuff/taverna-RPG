import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getProductByHandle } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import ProductDescription from '@/components/ProductDescription';
import ProductDetailContent from '@/components/ProductDetailContent';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://taverna-rpg-store.vercel.app';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProductByHandle(params.id);
  
  if (!product) {
    return {
      title: 'Produto não encontrado',
    };
  }

  const productUrl = `${siteUrl}/produto/${product.handle}`;
  const productImage = product.image || `${siteUrl}/images/logo.png`;
  
  // Criar descrição rica com preço para melhor visualização no WhatsApp
  const price = product.originalPrice || product.price;
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
  
  const productDescription = product.description 
    ? product.description.replace(/<[^>]*>/g, '').substring(0, 200)
    : `${product.name} – Confira na Taverna RPG Store. Dados, miniaturas e acessórios para suas aventuras épicas!`;
  
  const currency = 'BRL';

  return {
    title: `${product.name} | ${formattedPrice} - Taverna RPG Store`,
    description: productDescription,
    openGraph: {
      type: 'website',
      url: productUrl,
      title: product.name,
      description: formattedPrice,
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      siteName: 'Taverna RPG Store',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: formattedPrice,
      images: [productImage],
    },
    alternates: {
      canonical: productUrl,
    },
    other: {
      'product:price:amount': price.toFixed(2),
      'product:price:currency': currency,
      'og:price:amount': price.toFixed(2),
      'og:price:currency': currency,
    },
  };
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  // Buscar produto real do Shopify usando o handle
  const product = await getProductByHandle(params.id);
  
  if (!product) {
    notFound();
  }
  
  // Se não tiver descrição, usar texto padrão
  const description = product.description || 'Produto disponível na Taverna RPG.';
  
  // Placeholder para avaliações (será conectado ao Firebase futuramente)
  const rating = 5;
  const reviews = 0;

  // Structured Data (JSON-LD) para SEO
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: description.replace(/<[^>]*>/g, '').substring(0, 500),
    image: product.image ? [product.image] : [`${siteUrl}/images/logo.png`],
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Taverna RPG Store',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/produto/${product.handle}`,
      priceCurrency: 'BRL',
      price: product.price.toFixed(2),
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Taverna RPG Store',
      },
    },
    ...(reviews > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating,
        reviewCount: reviews,
      },
    }),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        {/* Structured Data para o produto */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        
        <div className="container mx-auto px-4 py-8">
          {/* Back Link */}
          <Link href="/" className="text-secondary-text hover:text-primary mb-6 inline-block">
            ← Voltar para a Taverna
          </Link>

          {/* Product Detail Content (Gallery + Variants) */}
          <ProductDetailContent product={product} rating={rating} reviews={reviews} />

          {/* Tabs */}
          <div className="border-b border-border mb-6">
            <div className="flex gap-8">
              <button className="pb-4 border-b-2 border-primary text-text font-bold">
                Detalhes
              </button>
              {reviews > 0 && (
                <button className="pb-4 text-muted-text hover:text-text transition-colors">
                  Avaliações ({reviews})
                </button>
              )}
            </div>
          </div>

          {/* Description/Details */}
          <div>
            <h3 className="text-2xl font-bold text-text mb-4">DETALHES DO PRODUTO</h3>
            {description ? (
              <ProductDescription 
                description={description}
              />
            ) : (
              <p className="text-text">Nenhuma descrição disponível para este produto.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

