'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/shopify';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  getTotal: () => number;
  getItemCount: () => number;
  clearCart: () => Promise<void>;
  addOrderToHistory: (orderData: {
    items: CartItem[];
    total: number;
    checkoutUrl: string;
    orderId?: string;
    shopifyOrderId?: string;
  }) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Função helper para gerar ID único do item no carrinho
// Se houver variantId, usa produto + variante, senão usa apenas o ID do produto
export function getCartItemId(product: Product): string {
  if (product.variantId) {
    return `${product.id}-${product.variantId}`;
  }
  return product.id;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Carregar carrinho do Firestore
  const loadCart = async (userId: string) => {
    if (!db) {
      setLoading(false);
      return;
    }

    try {
      const cartRef = doc(db, 'users', userId, 'cart', 'current');
      const cartSnap = await getDoc(cartRef);
      
      if (cartSnap.exists()) {
        const cartData = cartSnap.data();
        setItems(cartData.items || []);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Salvar carrinho no Firestore
  const saveCart = async (cartItems: CartItem[]) => {
    if (!user || !db) return;

    try {
      const cartRef = doc(db, 'users', user.uid, 'cart', 'current');
      await setDoc(cartRef, {
        items: cartItems,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  };

  // Carregar carrinho quando usuário fizer login
  useEffect(() => {
    if (user && db) {
      loadCart(user.uid);
    } else {
      setItems([]);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const addItem = async (product: Product) => {
    const newItems = [...items];
    const cartItemId = getCartItemId(product);
    const existingItem = newItems.find((item) => getCartItemId(item) === cartItemId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      newItems.push({ ...product, quantity: 1 });
    }
    
    setItems(newItems);
    await saveCart(newItems);
  };

  const removeItem = async (productId: string) => {
    const newItems = items.filter((item) => getCartItemId(item) !== productId);
    setItems(newItems);
    await saveCart(newItems);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }
    
    const newItems = items.map((item) =>
      getCartItemId(item) === productId ? { ...item, quantity } : item
    );
    
    setItems(newItems);
    await saveCart(newItems);
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = async () => {
    setItems([]);
    if (user && db) {
      try {
        const cartRef = doc(db, 'users', user.uid, 'cart', 'current');
        await setDoc(cartRef, { items: [], updatedAt: serverTimestamp() }, { merge: true });
      } catch (error) {
        console.error('Erro ao limpar carrinho:', error);
      }
    }
  };

  // Salvar pedido confirmado no histórico de compras
  // Esta função só deve ser chamada quando o pagamento for confirmado pelo Shopify
  const addOrderToHistory = async (orderData: {
    items: CartItem[];
    total: number;
    checkoutUrl: string;
    orderId?: string;
    shopifyOrderId?: string;
  }) => {
    if (!user || !db) return;

    try {
      const ordersRef = collection(db, 'users', user.uid, 'orders');
      await addDoc(ordersRef, {
        items: orderData.items,
        total: orderData.total,
        checkoutUrl: orderData.checkoutUrl,
        orderId: orderData.orderId,
        shopifyOrderId: orderData.shopifyOrderId,
        createdAt: serverTimestamp(),
        status: 'completed', // Pedido confirmado e pago
      });

      // Limpar carrinho após salvar no histórico
      await clearCart();
    } catch (error) {
      console.error('Erro ao salvar histórico de compras:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        getTotal,
        getItemCount,
        clearCart,
        addOrderToHistory,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
