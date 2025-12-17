import Link from 'next/link';

export default function Categories() {
  // PLACEHOLDER DATA - será conectado ao Shopify para buscar categorias reais
  const categories = [
    {
      id: 1,
      name: "Dados de RPG",
      icon: "🎲",
      count: 234,
      // PLACEHOLDER IMAGE - será substituída por imagem real do Shopify
      image: "https://images.unsplash.com/photo-1606166188517-4a72b4c8b5b8?w=400&q=80"
    },
    {
      id: 2,
      name: "Miniaturas",
      icon: "⚔️",
      count: 567,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80"
    },
    {
      id: 3,
      name: "Grids e Mapas",
      icon: "🗺️",
      count: 89,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
    },
    {
      id: 4,
      name: "Dragões",
      icon: "🐉",
      count: 45,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80"
    }
  ];

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-text mb-2">CATEGORIAS</h2>
            <p className="text-muted-text">Encontre o que precisa para sua jornada</p>
          </div>
          <Link href="#" className="text-primary hover:underline">
            Ver todas →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/categoria/${category.id}`}
              className="bg-card rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
            >
              {/* PLACEHOLDER IMAGE - será substituída por imagem real do Shopify */}
              <div 
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${category.image})` }}
              ></div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{category.icon}</span>
                  <h3 className="text-card-text font-bold">{category.name}</h3>
                </div>
                {/* PLACEHOLDER COUNT - será calculado dinamicamente do Shopify */}
                <p className="text-muted-text text-sm">{category.count} itens</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

