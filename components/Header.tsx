'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, User, X, Gift, Trash2, Menu, Icon, LogOut } from 'lucide-react';
import { chest } from '@lucide/lab';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/lib/shopify';
import AuthModal from '@/components/AuthModal';

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartClosing, setIsCartClosing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuClosing, setIsMobileMenuClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCart();
  const { user, signOut } = useAuth();

  // Funções para fechar com animação
  const closeCart = () => {
    setIsCartClosing(true);
    setTimeout(() => {
      setIsCartOpen(false);
      setIsCartClosing(false);
    }, 300);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsMobileMenuClosing(false);
    }, 300);
  };

  // Função de busca com debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data.products || []);
        setIsSearchOpen(true);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // Debounce de 300ms

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Fechar resultados ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleProductClick = (handle: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    router.push(`/produto/${handle}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/busca?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header>
        {/* Top Bar - Preto */}
        <div className="bg-background">
          <div className="container mx-auto px-4 py-4">
            {/* Primeira linha - Menu, Logo e Carrinho (Mobile) / Menu, Logo, Search, User, Carrinho (Desktop) */}
            <div className="flex items-center justify-between mb-3 md:mb-0">
              {/* Menu Hamburger - Mobile */}
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(true);
                  setIsMobileMenuClosing(false);
                }}
                className="md:hidden text-secondary-text hover:text-primary transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

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

              {/* Search Bar - Desktop (na mesma linha) */}
              <div className="hidden md:block flex-1 max-w-2xl mx-8">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-text w-5 h-5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="O que você procura, aventureiro?"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => searchQuery && setIsSearchOpen(true)}
                    className="w-full bg-input border border-border rounded-lg py-2 pl-10 pr-4 text-secondary-text placeholder-muted-text focus:outline-none focus:ring-2 focus:ring-focus-ring"
                    style={{
                      fontFamily: "'Cinzel', serif"
                    }}
                  />
                  {/* Resultados da busca */}
                  {isSearchOpen && (
                    <div
                      ref={searchContainerRef}
                      className="absolute top-full left-0 right-0 mt-2 bg-[#1d1816] border border-[#DFA026] rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
                    >
                      {isSearching ? (
                        <div className="p-4 text-center text-secondary-text">
                          <p>Buscando...</p>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <>
                          <div className="p-2 border-b border-[#DFA026]/20">
                            <p className="text-sm text-secondary-text">
                              {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          {searchResults.map((product) => (
                            <button
                              key={product.id}
                              onClick={() => handleProductClick(product.handle)}
                              className="w-full p-4 hover:bg-[#2a1f1a] transition-colors text-left flex items-center gap-4 border-b border-[#DFA026]/10 last:border-b-0"
                            >
                              {product.image && (
                                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-700">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-secondary-text font-bold text-sm mb-1 truncate">
                                  {product.name}
                                </h3>
                                <p className="text-[#DFA026] font-bold">
                                  R$ {product.price.toFixed(2).replace('.', ',')}
                                </p>
                              </div>
                            </button>
                          ))}
                          {searchQuery && (
                            <div className="p-2 border-t border-[#DFA026]/20">
                              <button
                                type="submit"
                                className="w-full text-center text-[#DFA026] hover:text-[#E0B64D] transition-colors text-sm font-semibold"
                              >
                                Ver todos os resultados para &quot;{searchQuery}&quot;
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="p-4 text-center text-secondary-text">
                          <p>Nenhum produto encontrado</p>
                        </div>
                      )}
                    </div>
                  )}
                </form>
              </div>

              {/* User and Cart Icons */}
              <div className="flex items-center gap-4">
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => router.push('/conta')}
                      className="hidden md:flex items-center gap-2 text-secondary-text hover:text-primary transition-colors"
                    >
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || 'Usuário'}
                          className="w-8 h-8 rounded-full border-2 border-[#DFA026]"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#DFA026] flex items-center justify-center">
                          <span className="text-[#120f0d] font-bold text-sm">
                            {user.displayName?.[0] || user.email?.[0] || 'U'}
                          </span>
                        </div>
                      )}
                      <span className="max-w-[100px] truncate">
                        {user.displayName || 'Usuário'}
                      </span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="hidden md:flex items-center gap-2 text-secondary-text hover:text-primary transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>Entrar</span>
                  </button>
                )}
                <button 
                  onClick={() => {
                    setIsCartOpen(true);
                    setIsCartClosing(false);
                  }}
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

            {/* Search Bar - Mobile (abaixo da logo) */}
            <div className="md:hidden">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-text w-5 h-5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => searchQuery && setIsSearchOpen(true)}
                  className="w-full bg-input border border-border rounded-lg py-2 pl-10 pr-4 text-secondary-text placeholder-muted-text focus:outline-none focus:ring-2 focus:ring-focus-ring"
                  style={{
                    fontFamily: "'Cinzel', serif"
                  }}
                />
                {/* Resultados da busca - Mobile */}
                {isSearchOpen && (
                  <div
                    ref={searchContainerRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-[#1d1816] border border-[#DFA026] rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
                  >
                    {isSearching ? (
                      <div className="p-4 text-center text-secondary-text">
                        <p>Buscando...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <>
                        <div className="p-2 border-b border-[#DFA026]/20">
                          <p className="text-sm text-secondary-text">
                            {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product.handle)}
                            className="w-full p-4 hover:bg-[#2a1f1a] transition-colors text-left flex items-center gap-4 border-b border-[#DFA026]/10 last:border-b-0"
                          >
                            {product.image && (
                              <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-700">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-secondary-text font-bold text-sm mb-1 truncate">
                                {product.name}
                              </h3>
                              <p className="text-[#DFA026] font-bold">
                                R$ {product.price.toFixed(2).replace('.', ',')}
                              </p>
                            </div>
                          </button>
                        ))}
                        {searchQuery && (
                          <div className="p-2 border-t border-[#DFA026]/20">
                            <button
                              type="submit"
                              className="w-full text-center text-[#DFA026] hover:text-[#E0B64D] transition-colors text-sm font-semibold"
                            >
                              Ver todos os resultados para &quot;{searchQuery}&quot;
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-4 text-center text-secondary-text">
                        <p>Nenhum produto encontrado</p>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Navigation Bar - Marrom escuro (Secondary) */}
        <nav 
          className="hidden md:block"
          style={{
            backgroundColor: '#2d2621',
            borderTop: '1px solid #59514c',
            borderBottom: '1px solid #59514c'
          }}
        >
          <div className="container mx-auto px-4">
            <ul className="flex items-center justify-center gap-8 py-3">
              <li>
                <Link 
                  href="#" 
                  className="flex items-center gap-2 transition-colors"
                  style={{
                    fontFamily: 'var(--font-cinzel), serif',
                    color: '#dcdcdc',
                    fontSize: '14px',
                    fontWeight: 400,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  <span>⚔️</span>
                  <span>Miniaturas</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="flex items-center gap-2 transition-colors"
                  style={{
                    fontFamily: 'var(--font-cinzel), serif',
                    color: '#dcdcdc',
                    fontSize: '14px',
                    fontWeight: 400,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  <span>🎲</span>
                  <span>Dados de RPG</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="flex items-center gap-2 transition-colors"
                  style={{
                    fontFamily: 'var(--font-cinzel), serif',
                    color: '#dcdcdc',
                    fontSize: '14px',
                    fontWeight: 400,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  <span>🗺️</span>
                  <span>Grids e Mapas</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="flex items-center gap-2 transition-colors"
                  style={{
                    fontFamily: 'var(--font-cinzel), serif',
                    color: '#dcdcdc',
                    fontSize: '14px',
                    fontWeight: 400,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  <span>🏰</span>
                  <span>Cenários</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="flex items-center gap-2 transition-colors"
                  style={{
                    fontFamily: 'var(--font-cinzel), serif',
                    color: '#dcdcdc',
                    fontSize: '14px',
                    fontWeight: 400,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  <span>📖</span>
                  <span>Livros</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="flex items-center gap-2 transition-colors"
                  style={{
                    fontFamily: 'var(--font-cinzel), serif',
                    color: '#dcdcdc',
                    fontSize: '14px',
                    fontWeight: 400,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
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
          <div 
            className={`fixed inset-0 bg-black bg-opacity-50 ${isCartClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
            onClick={closeCart}
          ></div>
          <div className={`relative ml-auto w-full max-w-md bg-[#201915] h-full overflow-y-auto border-l border-gray-700 ${isCartClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}>
            <div className="p-6">
              {/* Cart Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Icon iconNode={chest} className="w-6 h-6 text-[#e8b430]" />
                  <h2 className="text-[#e8b430] text-xl font-bold uppercase">MEU BAÚ</h2>
                </div>
                <button 
                  onClick={closeCart}
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

      {/* Mobile Menu Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="relative mr-auto w-full max-w-xs bg-[#201915] h-full overflow-y-auto border-r border-[#DFA026] transform transition-transform duration-300 ease-in-out animate-slide-in-left">
            <div className="p-6">
              {/* Menu Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Image 
                    src="/images/logo.png" 
                    alt="Taverna RPG Store" 
                    width={32} 
                    height={32}
                    className="object-contain"
                  />
                  <h2 
                    className="text-[#DFA026] text-xl font-bold uppercase"
                    style={{
                      fontFamily: 'var(--font-cinzel), serif',
                      textShadow: '0 0 10px rgba(223, 160, 38, 0.5)'
                    }}
                  >
                    TAVERNA
                  </h2>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#2a1f1a] flex items-center justify-center hover:bg-[#332520] transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Menu Categories */}
              <nav className="mb-6">
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="#" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-secondary-text hover:text-primary hover:bg-[#2a1f1a] transition-colors px-4 py-3 rounded-lg"
                    >
                      <span className="text-2xl">⚔️</span>
                      <span className="font-medium">MINIATURAS</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-secondary-text hover:text-primary hover:bg-[#2a1f1a] transition-colors px-4 py-3 rounded-lg"
                    >
                      <span className="text-2xl">🎲</span>
                      <span className="font-medium">DADOS DE RPG</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-secondary-text hover:text-primary hover:bg-[#2a1f1a] transition-colors px-4 py-3 rounded-lg"
                    >
                      <span className="text-2xl">🗺️</span>
                      <span className="font-medium">GRIDS E MAPAS</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-secondary-text hover:text-primary hover:bg-[#2a1f1a] transition-colors px-4 py-3 rounded-lg"
                    >
                      <span className="text-2xl">🏰</span>
                      <span className="font-medium">CENÁRIOS</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-secondary-text hover:text-primary hover:bg-[#2a1f1a] transition-colors px-4 py-3 rounded-lg"
                    >
                      <span className="text-2xl">📖</span>
                      <span className="font-medium">LIVROS</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="#" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-secondary-text hover:text-primary hover:bg-[#2a1f1a] transition-colors px-4 py-3 rounded-lg"
                    >
                      <span className="text-2xl">🎭</span>
                      <span className="font-medium">ACESSÓRIOS</span>
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Login/Register Button or User Info */}
              <div className="border-t border-[#DFA026]/20 pt-6">
                {user ? (
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        router.push('/conta');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-[#2a1f1a] rounded-lg hover:bg-[#332520] transition-colors text-left"
                    >
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || 'Usuário'}
                          className="w-12 h-12 rounded-full border-2 border-[#DFA026] flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#DFA026] flex items-center justify-center flex-shrink-0">
                          <span className="text-[#120f0d] font-bold text-xl">
                            {user.displayName?.[0] || user.email?.[0] || 'U'}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[#ebe8e0] font-semibold truncate">
                          {user.displayName || 'Usuário'}
                        </p>
                        <p className="text-[#ebe8e0]/60 text-sm truncate">
                          {user.email}
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={async () => {
                        await signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-3 bg-[#1d1816] border-2 border-[#DFA026] text-[#DFA026] py-3 rounded-lg font-bold hover:bg-[#2a1f1a] transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sair</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-3 bg-[#DFA026] text-[#201915] py-3 rounded-lg font-bold hover:bg-[#E0B64D] transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span>Entrar / Cadastrar</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}

