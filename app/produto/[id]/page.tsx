import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

// PLACEHOLDER - será substituído por busca dinâmica do Shopify
export default function ProductDetail({ params }: { params: { id: string } }) {
  // PLACEHOLDER PRODUCT DATA - será conectado ao Shopify
  const product = {
    id: params.id,
    name: "DRAGÃO ANCESTRAL",
    rating: 5,
    reviews: 45,
    price: 299.90,
    description: "Uma peça de colecionador impressionante. Este dragão ancestral foi esculpido com detalhes extraordinários, desde cada escama até as asas majestosas. Uma adição épica para qualquer mesa de RPG.",
    badge: "LANÇAMENTO",
    // PLACEHOLDER IMAGE - será substituída por imagem real do Shopify
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    specifications: [
      "Altura: 15cm | Envergadura: 25cm",
      "Material: Resina premium pintada à mão",
      "Edição limitada numerada",
      "Certificado de autenticidade incluso",
      "Base temática de rocha vulcânica"
    ]
  };

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
              {/* PLACEHOLDER IMAGE - será substituída por imagem real do Shopify */}
              <div 
                className="w-full h-96 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url(${product.image})` }}
              ></div>
              {product.badge && (
                <div className="absolute top-4 left-4 bg-primary text-primary-text px-3 py-1 rounded font-bold text-sm">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* PLACEHOLDER PRODUCT NAME - será conectado ao Shopify */}
              <h1 className="text-4xl font-bold text-text mb-4">{product.name}</h1>
              
              {/* PLACEHOLDER RATING - será conectado ao Firebase para avaliações reais */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-primary text-xl">★</span>
                  ))}
                </div>
                <span className="text-text">
                  {product.rating} ({product.reviews} avaliações)
                </span>
              </div>

              {/* PLACEHOLDER PRICE - será conectado ao Shopify */}
              <p className="text-primary text-4xl font-bold mb-6">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </p>

              {/* PLACEHOLDER DESCRIPTION - será conectado ao Shopify */}
              <p className="text-text mb-6 leading-relaxed">
                {product.description}
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
                    <span>🛒</span>
                    <span>Adicionar ao Baú</span>
                  </button>
                  <button className="w-12 h-12 border border-border rounded-lg flex items-center justify-center hover:bg-input transition-colors">
                    <span className="text-text">❤️</span>
                  </button>
                  <button className="w-12 h-12 border border-border rounded-lg flex items-center justify-center hover:bg-input transition-colors">
                    <span className="text-text">🔗</span>
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card rounded-lg p-4 text-center">
                  <span className="text-primary text-2xl block mb-2">🚚</span>
                  <p className="text-card-text text-sm font-bold">Frete Grátis</p>
                  <p className="text-muted-text text-xs">acima de R$150</p>
                </div>
                <div className="bg-card rounded-lg p-4 text-center">
                  <span className="text-primary text-2xl block mb-2">🛡️</span>
                  <p className="text-card-text text-sm font-bold">Compra Segura</p>
                </div>
                <div className="bg-card rounded-lg p-4 text-center">
                  <span className="text-primary text-2xl block mb-2">↩️</span>
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
              {/* PLACEHOLDER REVIEWS COUNT - será conectado ao Firebase */}
              <button className="pb-4 text-muted-text hover:text-text transition-colors">
                Avaliações ({product.reviews})
              </button>
            </div>
          </div>

          {/* Specifications */}
          <div>
            <h3 className="text-2xl font-bold text-text mb-4">ESPECIFICAÇÕES DO PRODUTO</h3>
            {/* PLACEHOLDER SPECIFICATIONS - será conectado ao Shopify */}
            <ul className="space-y-2">
              {product.specifications.map((spec, index) => (
                <li key={index} className="flex items-center gap-2 text-text">
                  <span className="text-primary">◆</span>
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
