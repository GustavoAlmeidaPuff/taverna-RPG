# Configuração da Integração Shopify

## Passos para configurar

1. **Criar um arquivo `.env.local` na raiz do projeto** com as seguintes variáveis:

```env
SHOPIFY_STORE_DOMAIN=seu-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=seu-token-aqui
SHOPIFY_ADMIN_ACCESS_TOKEN=seu-admin-token-aqui
```

2. **Como obter as credenciais:**

   - **SHOPIFY_STORE_DOMAIN**: O domínio da sua loja Shopify (ex: `minha-loja.myshopify.com`)
   
   - **SHOPIFY_STOREFRONT_ACCESS_TOKEN** (obrigatório para checkout): 
     1. Acesse o admin do Shopify
     2. Vá em **Configurações** > **Apps e canais de venda**
     3. Role até **Desenvolver apps para sua loja**
     4. Crie um novo app (ou use um existente)
     5. Vá em **Configurar** > **Storefront API**
     6. Selecione as permissões necessárias:
        - `unauthenticated_read_product_listings` (ler produtos)
        - `unauthenticated_read_checkouts` (criar checkouts)
        - `unauthenticated_write_checkouts` (criar checkouts)
     7. Instale o app
     8. Copie o **Token de acesso da Storefront API**
   
   - **SHOPIFY_ADMIN_ACCESS_TOKEN** (obrigatório para buscar produtos):
     1. No mesmo app criado acima
     2. Vá em **Configurar** > **Admin API**
     3. Selecione as permissões necessárias:
        - `read_products` (ler produtos)
        - `read_product_listings` (ler listagens de produtos)
     4. Instale o app
     5. Copie o **Token de acesso da Admin API**

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
- **POST** `/api/checkout` - Cria um checkout no Shopify e retorna a URL de pagamento

### Criar Checkout (Integração de Pagamento)

O checkout está integrado! Quando o usuário clica em "FINALIZAR PEDIDO" na página de checkout:

1. O sistema valida que todos os produtos têm `variantId`
2. Cria um checkout no Shopify usando a Storefront API
3. Redireciona o usuário para a página de pagamento do Shopify
4. O usuário completa o pagamento diretamente no Shopify

**Exemplo de uso programático:**

```typescript
import { createCheckout } from '@/lib/shopify';

const checkout = await createCheckout([
  {
    variantId: '123456789', // ID da variante do produto
    quantity: 2
  }
]);

// Redirecionar para checkout.checkoutUrl
window.location.href = checkout.checkoutUrl;
```

## Configuração do Shopify Payments

Para que o pagamento funcione corretamente:

1. **Configure o Shopify Payments** na sua loja:
   - Acesse **Configurações** > **Pagamentos** no admin do Shopify
   - Configure o Shopify Payments (ou outro gateway de pagamento)
   - Certifique-se de que está ativo e configurado

2. **Teste o checkout**:
   - Use o modo de teste do Shopify para testar sem processar pagamentos reais
   - No admin do Shopify, vá em **Configurações** > **Pagamentos**
   - Ative o modo de teste para testar o fluxo completo

## Funcionalidades Implementadas

✅ Busca de produtos via Admin API
✅ Busca de produtos via Storefront API (queries GraphQL)
✅ Carrinho de compras
✅ **Checkout integrado com Shopify Payments**
✅ Redirecionamento para página de pagamento do Shopify
✅ Suporte a variantes de produtos

## Próximos passos (opcionais)

1. Implementar webhooks para processar pedidos completados
2. Salvar histórico de compras no Firestore após pagamento
3. Implementar busca e filtros avançados
4. Adicionar suporte a múltiplas variantes na seleção do produto
