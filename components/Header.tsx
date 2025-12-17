'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, User, X, Gift, Trash2, Icon } from 'lucide-react';
import { chest } from '@lucide/lab';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCart();

  return (
    <>
      <header>
        {/* Top Bar - Preto */}
        <div className="bg-background">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/images/logo.png" 
              alt="Taverna RPG Store Logo" 
              width={48} 
              height={48}
              className="object-contain"
            />
            <div>
              <div 
                className="font-bold text-xl"
                style={{
                  fontFamily: 'var(--font-cinzel), serif',
                  color: '#DFA026',
                  textShadow: '0 0 10px rgba(223, 160, 38, 0.5), 0 0 20px rgba(223, 160, 38, 0.3)'
                }}
              >
                TAVERNA
              </div>
              <div 
                className="text-sm"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  color: '#EAE7DF',
                  letterSpacing: '0.15em',
                  fontWeight: 500
                }}
              >
                RPG STORE
              </div>
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
              {getItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-text text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
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

      {/* Cart Sidebar - Meu Baú */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative ml-auto w-full max-w-md bg-[#201915] h-full overflow-y-auto border-l border-gray-700">
            <div className="p-6">
              {/* Cart Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Icon iconNode={chest} className="w-6 h-6 text-[#e8b430]" />
                  <h2 className="text-[#e8b430] text-xl font-bold uppercase">MEU BAÚ</h2>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#2a1f1a] flex items-center justify-center hover:bg-[#332520] transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="mb-6">
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Seu baú está vazio</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="bg-[#2a1f1a] rounded-lg p-4 mb-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 rounded flex items-center justify-center flex-shrink-0 bg-gray-700 overflow-hidden">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* Product Name */}
                          <h3 className="text-white font-bold text-sm mb-1 uppercase">{item.name}</h3>
                          {/* Product Price */}
                          <p className="text-[#e8b430] font-bold text-lg mb-3">
                            R$ {item.price.toFixed(2).replace('.', ',')}
                          </p>
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-gray-600 rounded">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="bg-[#201915] text-white px-3 py-1.5 hover:bg-[#2a1f1a] transition-colors"
                              >
                                -
                              </button>
                              <span className="text-white px-4 py-1.5">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="bg-[#201915] text-white px-3 py-1.5 hover:bg-[#2a1f1a] transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="ml-auto text-[#e8b430] hover:text-[#f0c855] transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {items.length > 0 && (
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white text-sm">Total (sem frete):</span>
                    <span className="text-[#e8b430] font-bold text-xl">
                      R$ {getTotal().toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div className="flex gap-3 mb-4">
                    <Link 
                      href="/checkout"
                      className="flex-1 border border-[#e8b430] text-[#e8b430] py-2.5 rounded font-semibold hover:bg-[#e8b430] hover:text-[#201915] transition-colors text-center"
                    >
                      Ver meu baú
                    </Link>
                    <Link
                      href="/checkout"
                      className="flex-1 bg-[#e8b430] text-[#201915] py-2.5 rounded font-bold hover:opacity-90 transition-opacity text-center"
                    >
                      FECHAR PEDIDO
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Gift className="text-[#e8b430] w-4 h-4" />
                    <span>Frete grátis a partir de R$ 250,00</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

