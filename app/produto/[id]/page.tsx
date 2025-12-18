import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getProductByHandle } from '@/lib/shopify';
import { notFound } from 'next/navigation';
import ProductDescription from '@/components/ProductDescription';
import ProductDetailContent from '@/components/ProductDetailContent';

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
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

