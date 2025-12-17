'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, User, X, Gift, Trash2, Icon } from 'lucide-react';
import { chest } from '@lucide/lab';

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header>
        {/* Top Bar - Preto */}
        <div className="bg-background">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-primary">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 2v6m8-6v6"/>
                <path d="M6 8h12v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8z"/>
                <path d="M10 18v4M14 18v4"/>
                <path d="M12 8v10"/>
              </svg>
            </div>
            <div>
              <div className="text-primary font-bold text-xl">TAVERNA</div>
              <div className="text-secondary-text text-sm">RPG STORE</div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-text w-5 h-5" />
              <input
                type="text"
                placeholder="O que você procura, aventureiro?"
                className="w-full bg-input border border-border rounded-lg py-2 pl-10 pr-4 text-secondary-text placeholder-muted-text focus:outline-none focus:ring-2 focus:ring-focus-ring"
                style={{
                  fontFamily: "'Cinzel', serif"
                }}
              />
            </div>
          </div>

          {/* User and Cart Icons */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-secondary-text hover:text-primary transition-colors">
              <User className="w-5 h-5" />
              <span>Entrar</span>
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative text-secondary-text hover:text-primary transition-colors"
            >
              <Icon iconNode={chest} className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-primary text-primary-text text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                1
              </span>
            </button>
          </div>
        </div>
        </div>

        {/* Navigation Bar - Marrom escuro (Secondary) */}
        <nav className="bg-secondary border-t border-border hidden md:block">
          <div className="container mx-auto px-4">
            <ul className="flex items-center justify-center gap-8 py-3">
              <li>
                <Link href="#" className="flex items-center gap-2 text-secondary-text hover:text-primary transition-colors">
                  <span>⚔️</span>
                  <span>Miniaturas</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 text-secondary-text hover:text-primary transition-colors">
                  <span>🎲</span>
                  <span>Dados de RPG</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 text-secondary-text hover:text-primary transition-colors">
                  <span>🗺️</span>
                  <span>Grids e Mapas</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 text-secondary-text hover:text-primary transition-colors">
                  <span>🏰</span>
                  <span>Cenários</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 text-secondary-text hover:text-primary transition-colors">
                  <span>📖</span>
                  <span>Livros</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-2 text-secondary-text hover:text-primary transition-colors">
                  <span>🎭</span>
                  <span>Acessórios</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Cart Sidebar - será renderizado condicionalmente */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative ml-auto w-full max-w-md bg-background h-full overflow-y-auto">
            <div className="p-6">
              {/* Cart Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Gift className="text-primary w-6 h-6" />
                  <h2 className="text-primary text-xl font-bold">MEU BAÚ</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-secondary-text hover:text-primary"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Items - PLACEHOLDER: será conectado ao Shopify/Firebase */}
              <div className="mb-6">
                <div className="bg-card border border-primary rounded-lg p-4 mb-4">
                  <div className="flex gap-4">
                    {/* PLACEHOLDER IMAGE - será substituída por imagem do produto do Shopify */}
                    <div className="w-20 h-20 bg-muted rounded flex items-center justify-center">
                      <div className="w-12 h-12 bg-muted-text rounded-full flex items-center justify-center">
                        <span className="text-background text-xs">IMG</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      {/* PLACEHOLDER PRODUCT NAME - será conectado ao Shopify */}
                      <h3 className="text-card-text font-bold mb-1">DADOS DE RPG - CONJUNTO AURORA</h3>
                      {/* PLACEHOLDER PRICE - será conectado ao Shopify */}
                      <p className="text-primary font-bold text-lg mb-2">R$ 49,90</p>
                      <div className="flex items-center gap-2">
                        <button className="bg-input border border-border rounded px-2 py-1 text-card-text">-</button>
                        <span className="text-card-text px-2">1</span>
                        <button className="bg-input border border-border rounded px-2 py-1 text-card-text">+</button>
                        <button className="ml-auto text-destructive">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart Footer */}
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-card-text">Total (sem frete):</span>
                  {/* PLACEHOLDER TOTAL - será calculado dinamicamente */}
                  <span className="text-primary font-bold text-xl">R$ 49,90</span>
                </div>
                <div className="flex gap-2 mb-4">
                  <button className="flex-1 border border-primary text-primary py-2 rounded hover:bg-primary hover:text-primary-text transition-colors">
                    Ver meu baú
                  </button>
                  <button className="flex-1 bg-primary text-primary-text py-2 rounded font-bold hover:opacity-90 transition-opacity">
                    FECHAR PEDIDO
                  </button>
                </div>
                <div className="flex items-center gap-2 text-muted-text text-sm">
                  <Gift className="text-primary w-4 h-4" />
                  <span>Frete grátis a partir de R$ 250,00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

