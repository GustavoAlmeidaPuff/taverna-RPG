import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CheckoutContent } from '@/components/CheckoutContent';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="container mx-auto px-4 py-8">
          <Link href="/" className="text-[#E0DEDC] hover:text-[#DFA026] mb-6 inline-flex items-center gap-2 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar à taverna
          </Link>
          <CheckoutContent />
        </div>
      </main>
      <Footer />
    </div>
  );
}

