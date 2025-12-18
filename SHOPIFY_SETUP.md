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

Para que o pagamento funcione corretamente, você precisa configurar a loja para receber pedidos:

### 1. Configurar Gateway de Pagamento

1. Acesse o **Admin do Shopify** (admin.shopify.com)
2. Vá em **Configurações** (Settings) no canto inferior esquerdo
3. Clique em **Pagamentos** (Payments)
4. Escolha uma das opções:
   
   **Opção A - Shopify Payments (Recomendado):**
   - Clique em **Ativar Shopify Payments** ou **Configurar**
   - Preencha as informações da sua conta comercial
   - Adicione informações bancárias para receber pagamentos
   - Complete a verificação de identidade (se solicitado)
   
   **Opção B - Gateway de Teste (Para desenvolvimento):**
   - Role até **Gateway de pagamento de teste**
   - Ative o **Bogus Gateway (for testing)**
   - Isso permite testar o checkout sem processar pagamentos reais

### 2. Configurar Envio/Frete

1. No Admin do Shopify, vá em **Configurações** > **Envio e entrega** (Shipping and delivery)
2. Configure pelo menos um método de envio:
   - **Envio grátis** (se aplicável)
   - **Taxa fixa**
   - **Taxa calculada** (baseada em peso/dimensões)
3. Defina as zonas de envio (países/regiões atendidas)

### 3. Verificar Configurações da Loja

1. Vá em **Configurações** > **Geral**
2. Verifique se:
   - O endereço da loja está preenchido
   - O email de contato está configurado
   - A moeda está definida corretamente

### 4. Testar o Checkout

Após configurar:
- Use o **Bogus Gateway** para testar sem processar pagamentos reais
- Ou configure o **Shopify Payments** com dados reais (após verificação)

**Nota:** Se você está em desenvolvimento/teste, use o **Bogus Gateway** para evitar processar pagamentos reais durante os testes.

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
