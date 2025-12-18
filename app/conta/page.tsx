'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Product } from '@/lib/shopify';
import { 
  User, 
  Lock, 
  Package, 
  Heart, 
  ChevronRight, 
  ArrowLeft,
  Edit2,
  Check,
  X,
  ShoppingCart
} from 'lucide-react';
import { chest } from '@lucide/lab';
import { Icon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface UserData {
  displayName: string;
  email: string;
  photoURL: string;
  favorites: string[];
}

export default function ContaPage() {
  const router = useRouter();
  const { user, loading: authLoading, isFavorite, removeFavorite } = useAuth();
  const { getItemCount, addItem } = useCart();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'dados' | 'baú' | 'compras' | 'favoritos' | 'senha'>('dados');
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  // Verificar se o usuário fez login com email/senha (não Google)
  const isEmailPasswordUser = () => {
    if (!user || !user.providerData) return false;
    // Verifica se há um provider de email/senha (password)
    return user.providerData.some(provider => provider.providerId === 'password');
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }

    if (user) {
      loadUserData();
      // Se o usuário não for de email/senha e estiver na aba 'senha', redireciona para 'dados'
      if (activeTab === 'senha' && !isEmailPasswordUser()) {
        setActiveTab('dados');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router, activeTab]);

  // Recarregar produtos favoritos quando userData.favorites mudar
  useEffect(() => {
    if (userData?.favorites && userData.favorites.length > 0) {
      loadFavoriteProducts(userData.favorites);
    } else if (userData?.favorites && userData.favorites.length === 0) {
      setFavoriteProducts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.favorites]);

  const loadUserData = async () => {
    if (!user || !db) return;

    try {
      setLoading(true);
      
      // Buscar dados do Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData({
          displayName: data.displayName || user.displayName || '',
          email: data.email || user.email || '',
          photoURL: data.photoURL || user.photoURL || '',
          favorites: data.favorites || []
        });
      } else {
        setUserData({
          displayName: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || '',
          favorites: []
        });
      }

      // Buscar histórico de compras (placeholder - estrutura futura)
      // TODO: Implementar quando houver integração com pedidos
      setOrders([]);

      setNewName(user.displayName || '');
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavoriteProducts = async (favoriteIds: string[]) => {
    if (favoriteIds.length === 0) {
      setFavoriteProducts([]);
      return;
    }

    try {
      setLoadingFavorites(true);
      
      // Chamar API route do servidor para buscar produtos
      const response = await fetch('/api/products/ids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: favoriteIds }),
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar produtos favoritos');
      }

      const data = await response.json();
      setFavoriteProducts(data.products || []);
    } catch (error) {
      console.error('Erro ao carregar produtos favoritos:', error);
      setFavoriteProducts([]);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!user || !user.email) {
      setPasswordError('Usuário não encontrado');
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      setPasswordError('As senhas não coincidem');
      return;
    }

    if (passwordData.new.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      // Reautenticar usuário antes de mudar senha
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.current
      );
      
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordData.new);

      setPasswordSuccess(true);
      setPasswordData({ current: '', new: '', confirm: '' });
      
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error('Erro ao mudar senha:', error);
      if (error.code === 'auth/wrong-password') {
        setPasswordError('Senha atual incorreta');
      } else if (error.code === 'auth/weak-password') {
        setPasswordError('A nova senha é muito fraca');
      } else {
        setPasswordError('Erro ao mudar senha. Tente novamente.');
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-secondary-text">Carregando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        {/* Header da página */}
        <div className="mb-6 md:mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-secondary-text hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </Link>
          <h1 
            className="text-3xl md:text-4xl font-bold text-primary uppercase"
            style={{
              fontFamily: 'var(--font-cinzel), serif',
              textShadow: '0 0 10px rgba(223, 160, 38, 0.5)'
            }}
          >
            Minha Conta
          </h1>
        </div>

        {/* Perfil resumido no topo */}
        <div className="bg-card border-2 border-[#DFA026] rounded-lg p-6 md:p-8 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {userData?.photoURL ? (
                <img
                  src={userData.photoURL}
                  alt={userData.displayName || 'Usuário'}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#DFA026] object-cover"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#DFA026] flex items-center justify-center border-4 border-[#DFA026]">
                  <span className="text-[#120f0d] font-bold text-3xl md:text-4xl">
                    {userData?.displayName?.[0] || userData?.email?.[0] || 'U'}
                  </span>
                </div>
              )}
            </div>
            
            {/* Informações */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-secondary-text mb-2">
                {userData?.displayName || 'Usuário'}
              </h2>
              <p className="text-secondary-text/60 mb-4">{userData?.email}</p>
              
              {/* Estatísticas rápidas */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
                <div className="text-center">
                  <div className="text-primary font-bold text-xl">{getItemCount()}</div>
                  <div className="text-secondary-text/60 text-sm">Itens no Baú</div>
                </div>
                <div className="text-center">
                  <div className="text-primary font-bold text-xl">{userData?.favorites?.length || 0}</div>
                  <div className="text-secondary-text/60 text-sm">Favoritos</div>
                </div>
                <div className="text-center">
                  <div className="text-primary font-bold text-xl">{orders.length}</div>
                  <div className="text-secondary-text/60 text-sm">Compras</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de navegação */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-6 md:mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('dados')}
            className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'dados'
                ? 'text-primary border-primary'
                : 'text-secondary-text border-transparent hover:text-primary'
            }`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Dados da Conta</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('baú')}
            className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'baú'
                ? 'text-primary border-primary'
                : 'text-secondary-text border-transparent hover:text-primary'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon iconNode={chest} className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Meu Baú</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('compras')}
            className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'compras'
                ? 'text-primary border-primary'
                : 'text-secondary-text border-transparent hover:text-primary'
            }`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Histórico de Compras</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('favoritos')}
            className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'favoritos'
                ? 'text-primary border-primary'
                : 'text-secondary-text border-transparent hover:text-primary'
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Favoritos</span>
            </div>
          </button>
          {isEmailPasswordUser() && (
            <button
              onClick={() => setActiveTab('senha')}
              className={`px-4 md:px-6 py-2 md:py-3 font-semibold transition-colors border-b-2 ${
                activeTab === 'senha'
                  ? 'text-primary border-primary'
                  : 'text-secondary-text border-transparent hover:text-primary'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">Alterar Senha</span>
              </div>
            </button>
          )}
        </div>

        {/* Conteúdo das tabs */}
        <div className="bg-card border-2 border-[#DFA026] rounded-lg p-6 md:p-8">
          {activeTab === 'dados' && (
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-bold text-secondary-text mb-6">Dados da Conta</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-secondary-text font-semibold mb-2">Nome</label>
                  <div className="flex items-center gap-3">
                    {editingName ? (
                      <>
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="flex-1 bg-input border border-border rounded-lg px-4 py-2 text-secondary-text focus:outline-none focus:ring-2 focus:ring-[#DFA026]"
                        />
                        <button
                          onClick={() => {
                            // TODO: Implementar atualização do nome no Firestore
                            setEditingName(false);
                          }}
                          className="p-2 bg-primary text-primary-text rounded-lg hover:opacity-90 transition-opacity"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            setNewName(userData?.displayName || '');
                            setEditingName(false);
                          }}
                          className="p-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={userData?.displayName || ''}
                          disabled
                          className="flex-1 bg-input border border-border rounded-lg px-4 py-2 text-secondary-text opacity-60"
                        />
                        <button
                          onClick={() => setEditingName(true)}
                          className="p-2 bg-primary text-primary-text rounded-lg hover:opacity-90 transition-opacity"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-secondary-text font-semibold mb-2">E-mail</label>
                  <input
                    type="email"
                    value={userData?.email || ''}
                    disabled
                    className="w-full bg-input border border-border rounded-lg px-4 py-2 text-secondary-text opacity-60"
                  />
                  <p className="text-sm text-secondary-text/60 mt-1">O e-mail não pode ser alterado</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'baú' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-secondary-text">Meu Baú</h3>
                <Link
                  href="/checkout"
                  className="flex items-center gap-2 bg-primary text-primary-text px-4 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity"
                >
                  <Icon iconNode={chest} className="w-5 h-5" />
                  <span>Ir para o Baú</span>
                </Link>
              </div>
              <p className="text-secondary-text">
                Você tem <span className="font-bold text-primary">{getItemCount()}</span> item{getItemCount() !== 1 ? 's' : ''} no seu baú.
              </p>
              <Link
                href="/checkout"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Ver todos os itens
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {activeTab === 'compras' && (
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-bold text-secondary-text mb-6">Histórico de Compras</h3>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-secondary-text/30 mx-auto mb-4" />
                  <p className="text-secondary-text mb-2">Nenhuma compra realizada ainda</p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    Começar a comprar
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* TODO: Listar pedidos quando houver integração com sistema de pedidos */}
                </div>
              )}
            </div>
          )}

          {activeTab === 'favoritos' && (
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-bold text-secondary-text mb-6">Meus Favoritos</h3>
              {userData?.favorites && userData.favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-secondary-text/30 mx-auto mb-4" />
                  <p className="text-secondary-text mb-2">Você ainda não tem favoritos</p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    Explorar produtos
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : loadingFavorites ? (
                <div className="text-center py-12">
                  <p className="text-secondary-text">Carregando produtos favoritos...</p>
                </div>
              ) : favoriteProducts.length === 0 && userData?.favorites && userData.favorites.length > 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-secondary-text/30 mx-auto mb-4" />
                  <p className="text-secondary-text mb-2">Não foi possível carregar os produtos favoritos</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-secondary-text mb-4">
                    Você tem {favoriteProducts.length} produto{favoriteProducts.length !== 1 ? 's' : ''} favoritado{favoriteProducts.length !== 1 ? 's' : ''}.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {favoriteProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/produto/${product.handle}`}
                        className="block rounded-lg overflow-hidden relative group cursor-pointer"
                        style={{ 
                          backgroundColor: '#1d1816', 
                          border: '0.5px solid #DFA026',
                          boxShadow: '0 0 8px rgba(223, 160, 38, 0.2)',
                          transition: 'box-shadow 0.3s ease'
                        }}
                      >
                        {/* Badge */}
                        {product.badge && (
                          <div className={`absolute top-2 left-2 z-10 px-2 py-1 rounded text-xs font-bold ${
                            product.badge === 'oferta' || product.discount
                              ? 'bg-destructive text-destructive-text'
                              : 'bg-primary text-primary-text'
                          }`}>
                            {product.badge === 'oferta' && product.discount ? `OFERTA -${product.discount}%` : 
                             product.badge === 'novo' ? 'NOVO' :
                             product.badge === 'lançamento' ? 'LANÇAMENTO' :
                             product.discount ? `-${product.discount}%` : ''}
                          </div>
                        )}

                        {/* Imagem do produto */}
                        <div className="h-48 md:h-64 relative overflow-hidden">
                          <img
                            src={product.image || '/images/placeholder.png'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />

                          {/* Action Buttons */}
                          <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (isFavorite(product.id)) {
                                  removeFavorite(product.id);
                                  setFavoriteProducts(prev => prev.filter(p => p.id !== product.id));
                                }
                              }}
                              className="w-10 h-10 bg-card border border-primary bg-primary rounded-full items-center justify-center flex"
                            >
                              <Heart className="w-5 h-5 text-primary-text fill-current" />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addItem(product);
                              }}
                              className="bg-primary text-primary-text px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1 hover:opacity-90 transition-opacity"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <span className="hidden md:inline">Adicionar</span>
                            </button>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="text-card-text font-bold mb-2 hover:text-primary transition-colors uppercase text-sm leading-tight line-clamp-2">
                            {product.name}
                          </h3>
                          
                          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                            {product.originalPrice && (
                              <span className="text-muted-text line-through text-sm">
                                de R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                              </span>
                            )}
                            <span className="text-primary font-bold text-lg">
                              R$ {product.price.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                          <p className="text-muted-text text-sm">
                            ou 12x de R$ {(product.price / 12).toFixed(2).replace('.', ',')} sem juros
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'senha' && isEmailPasswordUser() && (
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-bold text-secondary-text mb-6">Alterar Senha</h3>
              
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-secondary-text font-semibold mb-2">
                    Senha Atual
                  </label>
                  <input
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                    className="w-full bg-input border border-border rounded-lg px-4 py-2 text-secondary-text focus:outline-none focus:ring-2 focus:ring-[#DFA026]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-secondary-text font-semibold mb-2">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                    className="w-full bg-input border border-border rounded-lg px-4 py-2 text-secondary-text focus:outline-none focus:ring-2 focus:ring-[#DFA026]"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-secondary-text font-semibold mb-2">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                    className="w-full bg-input border border-border rounded-lg px-4 py-2 text-secondary-text focus:outline-none focus:ring-2 focus:ring-[#DFA026]"
                    required
                    minLength={6}
                  />
                </div>

                {passwordError && (
                  <div className="bg-red-900/30 border border-red-600 text-red-400 px-4 py-2 rounded-lg">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="bg-green-900/30 border border-green-600 text-green-400 px-4 py-2 rounded-lg">
                    Senha alterada com sucesso!
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-text py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
                >
                  Alterar Senha
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
