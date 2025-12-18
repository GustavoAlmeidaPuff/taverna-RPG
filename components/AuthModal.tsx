'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectUrl?: string;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, redirectUrl, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
      setError('');
      setEmail('');
      setPassword('');
      setName('');
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!name.trim()) {
          setError('Por favor, insira seu nome.');
          setLoading(false);
          return;
        }
        await signUp(email, password, name);
      }
      
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !isClosing) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black z-50 ${
          isClosing ? 'animate-fade-out' : 'animate-fade-in'
        }`}
        style={{ opacity: isClosing ? 0 : 0.7 }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`bg-[#1d1816] border-2 border-[#DFA026] rounded-lg shadow-2xl w-full max-w-md pointer-events-auto transition-all duration-300 ${
            isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#DFA026]/20">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="Taverna RPG"
                width={40}
                height={40}
                className="object-contain"
              />
              <h2
                className="text-2xl font-bold text-[#DFA026]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {isLogin ? 'Entrar' : 'Cadastrar'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-[#ebe8e0] hover:text-[#DFA026] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Botão Google */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full mb-6 px-4 py-3 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar com Google
            </button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#DFA026]/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1d1816] text-[#ebe8e0]/60">ou</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-[#ebe8e0] text-sm font-semibold mb-2">
                    Nome
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#DFA026]/50 w-5 h-5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      disabled={loading}
                      className="w-full bg-[#120f0d] border border-[#DFA026]/30 rounded-lg py-3 pl-10 pr-4 text-[#ebe8e0] placeholder-[#ebe8e0]/30 focus:outline-none focus:border-[#DFA026] transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[#ebe8e0] text-sm font-semibold mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#DFA026]/50 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    disabled={loading}
                    required
                    className="w-full bg-[#120f0d] border border-[#DFA026]/30 rounded-lg py-3 pl-10 pr-4 text-[#ebe8e0] placeholder-[#ebe8e0]/30 focus:outline-none focus:border-[#DFA026] transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#ebe8e0] text-sm font-semibold mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#DFA026]/50 w-5 h-5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    required
                    minLength={6}
                    className="w-full bg-[#120f0d] border border-[#DFA026]/30 rounded-lg py-3 pl-10 pr-4 text-[#ebe8e0] placeholder-[#ebe8e0]/30 focus:outline-none focus:border-[#DFA026] transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-bold hover:opacity-90 transition-opacity uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #e8a64a 0%, #d6891f 50%, #c77a1a 100%)',
                  color: '#2c1810',
                  border: '1px solid rgba(0, 0, 0, 0.25)',
                  fontFamily: "'Garamond', 'Palatino Linotype', 'Palatino', 'Times New Roman', serif",
                  letterSpacing: '0.03em',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 2px rgba(0, 0, 0, 0.2)'
                }}
              >
                {loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Cadastrar'}
              </button>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                disabled={loading}
                className="text-[#DFA026] hover:text-[#E0B64D] transition-colors text-sm disabled:opacity-50"
              >
                {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

