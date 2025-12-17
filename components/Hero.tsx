import { Beer, Dice6 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[600px] flex items-center bg-background">
      {/* PLACEHOLDER BACKGROUND IMAGE - será substituída por imagem real da taverna */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1920&q=80")'
        }}
      ></div>
      
      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-2xl">
          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-2 border border-primary rounded px-4 py-2 mb-6">
            <Beer className="text-primary w-5 h-5" />
            <span className="text-secondary-text">BEM-VINDO À TAVERNA</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-secondary-text">EQUIPE SUA </span>
            <span className="text-primary">AVENTURA</span>
          </h1>

          {/* Description */}
          <p className="text-secondary-text text-lg mb-8 leading-relaxed">
            Dados épicos, miniaturas lendárias e tudo que você precisa para suas campanhas de RPG. Entre e descubra os tesouros da Taverna!
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button className="bg-primary text-primary-text px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
              EXPLORAR PRODUTOS
            </button>
            <button className="border border-border text-secondary-text px-8 py-3 rounded-lg font-bold hover:border-primary hover:text-primary transition-colors">
              NOVIDADES
            </button>
          </div>

          {/* Promo Banner */}
          <div className="bg-card border border-border rounded-lg p-4 inline-flex items-center gap-3">
            <Dice6 className="text-primary w-8 h-8" />
            <div>
              <p className="text-card-text font-bold">ROLOU CRÍTICO!</p>
              <p className="text-muted-text text-sm">Até 30% OFF em dados selecionados</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
