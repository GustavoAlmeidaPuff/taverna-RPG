import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-bold text-text mb-4">Produto não encontrado</h2>
          <p className="text-muted-text mb-8">
            O produto que você está procurando não existe na Taverna RPG.
          </p>
          <Link 
            href="/" 
            className="bg-primary text-primary-text px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity inline-block"
          >
            Voltar para a Taverna
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

