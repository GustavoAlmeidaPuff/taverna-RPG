import Link from 'next/link';
import { Beer, Instagram, Facebook, Youtube, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Taverna Info */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Beer className="text-primary w-6 h-6" />
              <div>
                <div className="text-primary font-bold">TAVERNA</div>
                <div className="text-secondary-text text-sm">RPG STORE</div>
              </div>
            </Link>
            <p className="text-secondary-text text-sm mb-4">
              Sua loja de RPG favorita! Dados, miniaturas, grids e tudo para suas aventuras épicas.
            </p>
            <div className="flex gap-3">
              <Link href="#" className="w-10 h-10 bg-card rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="text-secondary-text w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 bg-card rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="text-secondary-text w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 bg-card rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube className="text-secondary-text w-5 h-5" />
              </Link>
            </div>
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

          {/* Support */}
          <div>
            <h4 className="text-secondary-text font-bold mb-4">SUPORTE</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-secondary-text hover:text-primary transition-colors text-sm">Minha Conta</Link></li>
              <li><Link href="#" className="text-secondary-text hover:text-primary transition-colors text-sm">Meus Pedidos</Link></li>
              <li><Link href="#" className="text-secondary-text hover:text-primary transition-colors text-sm">Trocas e Devoluções</Link></li>
              <li><Link href="#" className="text-secondary-text hover:text-primary transition-colors text-sm">Política de Privacidade</Link></li>
              <li><Link href="#" className="text-secondary-text hover:text-primary transition-colors text-sm">Termos de Uso</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-secondary-text font-bold mb-4">NEWSLETTER</h4>
            <p className="text-secondary-text text-sm mb-4">
              Receba novidades e promoções exclusivas!
            </p>
            {/* PLACEHOLDER FORM - será conectado ao Firebase/Shopify */}
            <div className="flex gap-2 mb-4">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 bg-input border border-border rounded px-4 py-2 text-secondary-text placeholder-muted-text focus:outline-none focus:ring-2 focus:ring-focus-ring"
              />
              <button className="bg-primary text-primary-text px-4 py-2 rounded font-bold hover:opacity-90 transition-opacity">
                Inscrever
              </button>
            </div>
            {/* PLACEHOLDER CONTACT INFO - será conectado ao Firebase */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-secondary-text">
                <Phone className="text-primary w-4 h-4" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-text">
                <Mail className="text-primary w-4 h-4" />
                <span>contato@tavernarpg.com.br</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-text">
                <MapPin className="text-primary w-4 h-4" />
                <span>São Paulo, SP</span>
              </div>
            </div>
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
