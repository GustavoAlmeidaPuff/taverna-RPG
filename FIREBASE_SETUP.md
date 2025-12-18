# Configuração da Integração Firebase

## Status

✅ **Firebase configurado e conectado!**

O Firebase foi inicializado com as credenciais do projeto `taverna-rpg-store`. Todos os serviços estão prontos para uso.

## Serviços Disponíveis

### 1. Firebase Analytics
Analytics está configurado e funcionando automaticamente. Os dados serão coletados automaticamente.

### 2. Firebase Authentication (Auth)
Pronto para autenticação de usuários (login, registro, etc.)

### 3. Cloud Firestore
Banco de dados NoSQL pronto para armazenar:
- Favoritos/curtidos de produtos
- Histórico de compras
- Avaliações de produtos
- Dados do usuário

## Como usar

### Importar o Firebase

```typescript
import { app, auth, db, analytics } from '@/lib/firebase';
```

### Exemplo: Autenticação de Usuário

```typescript
'use client';

import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Login
const handleLogin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Usuário logado:', userCredential.user);
  } catch (error) {
    console.error('Erro no login:', error);
  }
};

// Cadastro
const handleSignup = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Usuário criado:', userCredential.user);
  } catch (error) {
    console.error('Erro no cadastro:', error);
  }
};
```

### Exemplo: Usar Firestore (Favoritos)

```typescript
'use client';

import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

// Adicionar produto aos favoritos
const addToFavorites = async (productId: string) => {
  if (!auth.currentUser) return;
  
  try {
    await addDoc(collection(db, 'favorites'), {
      userId: auth.currentUser.uid,
      productId: productId,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
  }
};

// Buscar favoritos do usuário
const getFavorites = async () => {
  if (!auth.currentUser) return [];
  
  try {
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', auth.currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    return [];
  }
};

// Remover dos favoritos
const removeFromFavorites = async (favoriteId: string) => {
  try {
    await deleteDoc(doc(db, 'favorites', favoriteId));
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
  }
};
```

### Exemplo: Histórico de Compras

```typescript
'use client';

import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

// Salvar compra no histórico
const savePurchase = async (orderData: any) => {
  if (!auth.currentUser) return;
  
  try {
    await addDoc(collection(db, 'purchases'), {
      userId: auth.currentUser.uid,
      ...orderData,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Erro ao salvar compra:', error);
  }
};

// Buscar histórico de compras
const getPurchaseHistory = async () => {
  if (!auth.currentUser) return [];
  
  try {
    const q = query(
      collection(db, 'purchases'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return [];
  }
};
```

## Estrutura de Dados Sugerida

### Collection: `favorites`
```typescript
{
  userId: string;
  productId: string;
  createdAt: Date;
}
```

### Collection: `purchases`
```typescript
{
  userId: string;
  orderId: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  createdAt: Date;
}
```

### Collection: `reviews`
```typescript
{
  userId: string;
  productId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}
```

## Próximos Passos

1. ✅ Firebase inicializado e configurado
2. ⏳ Criar contexto de autenticação (AuthContext)
3. ⏳ Implementar login/registro
4. ⏳ Implementar sistema de favoritos
5. ⏳ Salvar histórico de compras
6. ⏳ Sistema de avaliações de produtos

## Importante

- O Analytics funciona automaticamente no cliente
- Auth e Firestore podem ser usados tanto no cliente quanto no servidor (com cuidado)
- Sempre verifique se o usuário está autenticado antes de fazer operações no Firestore
- Use `'use client'` em componentes que usam Firebase Auth ou Firestore diretamente