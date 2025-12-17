import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Star } from 'lucide-react';
import { getProductByHandle } from '@/lib/shopify';
import { notFound } from 'next/navigation';

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <div className="relative">
              <div 
                className="w-full h-96 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url(${product.image || '/images/placeholder.png'})` }}
              ></div>
              {product.badge && (
                <div className="absolute top-4 left-4 bg-primary text-primary-text px-3 py-1 rounded font-bold text-sm">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-4xl font-bold text-text mb-4">{product.name}</h1>
              
              {/* Rating - será conectado ao Firebase para avaliações reais futuramente */}
              {reviews > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-primary fill-current' : 'text-muted-text'}`} />
                    ))}
                  </div>
                  <span className="text-text">
                    {rating} ({reviews} avaliações)
                  </span>
                </div>
              )}

              <p className="text-primary text-4xl font-bold mb-6">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </p>

              <p className="text-text mb-6 leading-relaxed">
                {description}
              </p>

              {/* Quantity and Actions */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 border border-border rounded">
                    <button className="px-4 py-2 text-text hover:bg-input">-</button>
                    <span className="px-4 py-2 text-text">1</span>
                    <button className="px-4 py-2 text-text hover:bg-input">+</button>
                  </div>
                  <button className="flex-1 bg-primary text-primary-text px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Adicionar ao Baú</span>
                  </button>
                  <button className="w-12 h-12 border border-border rounded-lg flex items-center justify-center hover:bg-input transition-colors">
                    <Heart className="text-text w-5 h-5" />
                  </button>
                  <button className="w-12 h-12 border border-border rounded-lg flex items-center justify-center hover:bg-input transition-colors">
                    <Share2 className="text-text w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card rounded-lg p-4 text-center">
                  <Truck className="text-primary w-8 h-8 mx-auto mb-2" />
                  <p className="text-card-text text-sm font-bold">Frete Grátis</p>
                  <p className="text-muted-text text-xs">acima de R$150</p>
                </div>
                <div className="bg-card rounded-lg p-4 text-center">
                  <Shield className="text-primary w-8 h-8 mx-auto mb-2" />
                  <p className="text-card-text text-sm font-bold">Compra Segura</p>
                </div>
                <div className="bg-card rounded-lg p-4 text-center">
                  <RotateCcw className="text-primary w-8 h-8 mx-auto mb-2" />
                  <p className="text-card-text text-sm font-bold">Devolução em 30 dias</p>
                </div>
              </div>
            </div>
          </div>

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
            <div className="text-text leading-relaxed whitespace-pre-line">
              {description}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

