'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Criar documento do usuário no Firestore
  const createUserDocument = async (user: User, additionalData?: any) => {
    if (!user || !db) return;

    const userRef = doc(db, 'users', user.uid);
    
    try {
      const snapshot = await getDoc(userRef);

      if (!snapshot.exists()) {
        const { email, displayName, photoURL } = user;
        const createdAt = serverTimestamp();

        await setDoc(userRef, {
          email,
          displayName: displayName || additionalData?.name || '',
          photoURL: photoURL || '',
          createdAt,
          favorites: [],
          ...additionalData
        });
      }
    } catch (error: any) {
      console.error('Erro ao criar documento do usuário:', error);
      // Não lança erro aqui, apenas loga, pois o login foi bem-sucedido
      // O documento pode ser criado depois
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      throw new Error('Firebase Auth não está disponível');
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(getErrorMessage(error.code));
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!auth) {
      throw new Error('Firebase Auth não está disponível');
    }
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualizar perfil com nome
      await updateProfile(user, { displayName: name });
      
      // Criar documento no Firestore
      await createUserDocument(user, { name });
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      throw new Error(getErrorMessage(error.code));
    }
  };

  const signInWithGoogle = async () => {
    if (!auth) {
      throw new Error('Firebase Auth não está disponível');
    }
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      
      // Criar documento no Firestore se não existir (não bloqueia o login se falhar)
      createUserDocument(user).catch(err => {
        console.error('Erro ao criar documento do usuário após login Google:', err);
      });
    } catch (error: any) {
      console.error('Erro no login com Google:', error);
      
      // Trata erros específicos do Firebase
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Login cancelado.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup bloqueado. Permita popups para este site.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Outro popup já está aberto.');
      }
      
      throw new Error(getErrorMessage(error.code) || 'Erro ao fazer login com Google.');
    }
  };

  const signOut = async () => {
    if (!auth) {
      return;
    }
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mensagens de erro traduzidas
function getErrorMessage(errorCode: string): string {
  const errorMessages: { [key: string]: string } = {
    'auth/email-already-in-use': 'Este e-mail já está em uso.',
    'auth/invalid-email': 'E-mail inválido.',
    'auth/operation-not-allowed': 'Operação não permitida.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/user-disabled': 'Esta conta foi desabilitada.',
    'auth/user-not-found': 'Usuário não encontrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/popup-closed-by-user': 'Login cancelado.',
  };

  return errorMessages[errorCode] || 'Erro ao processar sua solicitação.';
}
