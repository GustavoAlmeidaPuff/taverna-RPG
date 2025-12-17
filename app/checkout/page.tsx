import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CheckoutContent } from '@/components/CheckoutContent';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link href="/" className="text-secondary-text hover:text-primary mb-6 inline-block">
            ← Voltar para a Taverna
          </Link>
          <CheckoutContent />
        </div>
      </main>
      <Footer />
    </div>
  );
}
