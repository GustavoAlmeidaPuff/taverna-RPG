# Configuração da Integração Shopify

## Passos para configurar

1. **Criar um arquivo `.env.local` na raiz do projeto** com as seguintes variáveis:

```env
SHOPIFY_STORE_DOMAIN=seu-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=seu-token-aqui
```

2. **Como obter as credenciais:**

   - **SHOPIFY_STORE_DOMAIN**: O domínio da sua loja Shopify (ex: `minha-loja.myshopify.com`)
   
   - **SHOPIFY_STOREFRONT_ACCESS_TOKEN**: 
     1. Acesse o admin do Shopify
     2. Vá em **Configurações** > **Apps e canais de venda**
     3. Role até **Desenvolver apps para sua loja**
     4. Crie um novo app (ou use um existente)
     5. Vá em **Configurar** > **Storefront API**
     6. Selecione as permissões necessárias (ler produtos, coleções, etc.)
     7. Instale o app
     8. Copie o **Token de acesso da Storefront API**

## Como usar

### Buscar todos os produtos

```typescript
import { getAllProducts } from '@/lib/shopify';

const products = await getAllProducts(20); // limita a 20 produtos
```

### Buscar um produto específico

```typescript
import { getProductByHandle } from '@/lib/shopify';

// O handle é a URL amigável do produto (ex: "dragao-ancestral")
const product = await getProductByHandle('dragao-ancestral');
```

### Usar as APIs REST

- **GET** `/api/products` - Lista todos os produtos
- **GET** `/api/products/[handle]` - Busca um produto específico pelo handle

## Próximos passos

1. Substituir os dados placeholder em `app/page.tsx` e `app/produto/[id]/page.tsx` pelas funções do Shopify
2. Implementar busca e filtros
3. Adicionar carrinho de compras
4. Integrar checkout do Shopify
