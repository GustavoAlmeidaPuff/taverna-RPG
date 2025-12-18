import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Taverna Info */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image 
                src="/images/logo.png" 
                alt="Taverna RPG Store Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
              <div>
                <div className="text-primary font-bold">TAVERNA</div>
                <div className="text-secondary-text text-sm">RPG STORE</div>
              </div>
            </Link>
            <p className="text-secondary-text text-sm mb-4">
              Sua loja de RPG favorita! Dados, miniaturas, grids e tudo para suas aventuras épicas.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-secondary-text font-bold mb-4">NAVEGAÇÃO</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-secondary-text hover:text-primary transition-colors text-sm">Miniaturas</Link></li>
              <li><Link href="#" className="text-secondary-text hover:text-primary transition-colors text-sm">Dados de RPG</Link></li>
              <li><Link href="#" className="text-secondary-text hover:text-primary transition-colors text-sm">Grids e Mapas</Link></li>
              <li><Link href="#" className="text-secondary-text hover:text-primary transition-colors text-sm">Cenários</Link></li>
              <li><Link href="#" className="text-secondary-text hover:text-primary transition-colors text-sm">Livros</Link></li>
              <li><Link href="#" className="text-secondary-text hover:text-primary transition-colors text-sm">Acessórios</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-text text-sm">
            © 2024 Taverna RPG Store. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            {/* PLACEHOLDER PAYMENT LOGOS - serão substituídos por logos reais */}
            <span className="text-muted-text text-sm">VISA</span>
            <span className="text-muted-text text-sm">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


