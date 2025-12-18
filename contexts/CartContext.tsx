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

  // Validar e atualizar IDs de variantes se necessário
  const validateAndUpdateCart = async (cartItems: CartItem[]) => {
    if (!user || !db) return cartItems;

    let needsUpdate = false;
    const updatedItems: CartItem[] = [];

    for (const item of cartItems) {
      // Se o variantId não está no formato GID, precisa ser atualizado
      if (item.variantId && !item.variantId.startsWith('gid://')) {
        console.log(`Produto ${item.name} tem ID antigo: ${item.variantId}. Buscando produto atualizado...`);
        
        try {
          // Buscar produto atualizado usando o handle
          const response = await fetch(`/api/products/${item.handle}`);
          if (response.ok) {
            const data = await response.json();
            const updatedProduct = data.product;
            
            if (updatedProduct && updatedProduct.variantId) {
              console.log(`Produto ${item.name} atualizado com novo ID: ${updatedProduct.variantId}`);
              updatedItems.push({
                ...item,
                variantId: updatedProduct.variantId,
                shopifyProductId: updatedProduct.shopifyProductId,
              });
              needsUpdate = true;
            } else {
              console.warn(`Produto ${item.name} não encontrado, mantendo no carrinho`);
              updatedItems.push(item);
            }
          } else {
            console.warn(`Erro ao buscar produto ${item.name}, mantendo no carrinho`);
            updatedItems.push(item);
          }
        } catch (error) {
          console.error(`Erro ao validar produto ${item.name}:`, error);
          updatedItems.push(item);
        }
      } else {
        updatedItems.push(item);
      }
    }

    // Se houve atualizações, salvar o carrinho atualizado
    if (needsUpdate) {
      console.log('Carrinho atualizado com novos IDs');
      await saveCart(updatedItems);
      return updatedItems;
    }

    return cartItems;
  };

  // Carregar e validar carrinho quando usuário fizer login
  useEffect(() => {
    const loadAndValidateCart = async () => {
      if (user && db) {
        try {
          const cartRef = doc(db, 'users', user.uid, 'cart', 'current');
          const cartSnap = await getDoc(cartRef);
          
          if (cartSnap.exists()) {
            const cartData = cartSnap.data();
            const loadedItems = cartData.items || [];
            
            // Validar e atualizar IDs se necessário
            const validatedItems = await validateAndUpdateCart(loadedItems);
            setItems(validatedItems);
          } else {
            setItems([]);
          }
        } catch (error) {
          console.error('Erro ao carregar carrinho:', error);
          setItems([]);
        } finally {
          setLoading(false);
        }
      } else {
        setItems([]);
        setLoading(false);
      }
    };

    loadAndValidateCart();
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

