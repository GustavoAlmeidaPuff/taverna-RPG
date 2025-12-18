# Fluxo de Registro de Compra

## Diagrama do Fluxo

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USUÁRIO CLICA "FINALIZAR PEDIDO"                        │
│    (CheckoutContent.tsx)                                    │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. VALIDAÇÕES                                               │
│    ✓ Usuário logado?                                        │
│    ✓ Todos itens têm variantId?                            │
│    ✓ Preparar dados: [{variantId, quantity}, ...]          │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. CHAMADA API: POST /api/checkout                         │
│    (app/api/checkout/route.ts)                              │
│    Body: { items: [{variantId, quantity}] }                │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. CRIAÇÃO CHECKOUT NO SHOPIFY                             │
│    (lib/shopify.ts - createCheckout())                      │
│    - Converte variantIds para formato GraphQL              │
│    - Cria cart via Storefront API                          │
│    - Retorna: { checkoutUrl, checkoutId }                  │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. SALVAR DADOS TEMPORÁRIOS                                 │
│    (CheckoutContent.tsx)                                    │
│    - Salva checkoutId e dados no localStorage              │
│    - NÃO salva no histórico ainda (aguarda confirmação)   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. REDIRECIONAMENTO                                        │
│    window.location.href = checkoutUrl                       │
│    → Usuário vai para checkout do Shopify                   │
│    → Faz pagamento no Shopify                               │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. CONFIRMAÇÃO DE PAGAMENTO                                 │
│    (Duas formas de confirmação)                            │
│                                                              │
│    A) Página de Retorno (/checkout/success)                 │
│       - Verifica status do checkout via API                │
│       - Se pago: salva no histórico                        │
│                                                              │
│    B) Webhook do Shopify (/api/webhooks/shopify)            │
│       - Recebe notificação quando pedido é pago            │
│       - Salva no histórico automaticamente                  │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. REGISTRO NO HISTÓRICO (APENAS SE PAGO)                  │
│    (CartContext.tsx - addOrderToHistory())                  │
│    Collection: users/{userId}/orders/{orderId}               │
│    Dados:                                                    │
│    {                                                         │
│      items: [...],      // Array completo dos itens         │
│      total: 150.00,     // Valor total                      │
│      checkoutUrl: "...", // URL do checkout                 │
│      orderId: "...",     // ID do pedido                     │
│      shopifyOrderId: "...", // ID do Shopify                │
│      createdAt: Timestamp,                                  │
│      status: 'completed' // APENAS quando pago confirmado   │
│    }                                                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. LIMPAR CARRINHO                                          │
│    (CartContext.tsx - clearCart())                          │
│    - Remove itens do estado local                           │
│    - Limpa users/{userId}/cart/current no Firestore        │
│    - Remove dados temporários do localStorage               │
└─────────────────────────────────────────────────────────────┘
```

## Estrutura de Dados no Firestore

### Carrinho (antes do checkout)
```
users/
  {userId}/
    cart/
      current/
        items: CartItem[]
        updatedAt: Timestamp
```

### Histórico de Pedidos (após checkout)
```
users/
  {userId}/
    orders/
      {orderId}/          ← ID gerado automaticamente pelo Firestore
        items: CartItem[]  ← Array completo com todos os dados
        total: number      ← Valor total do pedido
        checkoutUrl: string ← URL do checkout do Shopify
        createdAt: Timestamp ← Data/hora do pedido
        status: string     ← 'pending' | 'completed' | 'cancelled'
```

## Status do Pedido

- **pending**: Pedido criado, aguardando pagamento no Shopify
- **completed**: Pedido pago e finalizado (atualizado via webhook ou manualmente)
- **cancelled**: Pedido cancelado

## Pontos Importantes

1. **Histórico Apenas Após Pagamento**: O pedido só é salvo no histórico DEPOIS que o pagamento for confirmado pelo Shopify
2. **Dados Temporários**: Informações do checkout são salvas no localStorage temporariamente até confirmação
3. **Dupla Verificação**: Sistema verifica pagamento via:
   - Página de retorno (`/checkout/success`) que consulta status
   - Webhook do Shopify que notifica quando pedido é pago
4. **Carrinho Limpo**: Após salvar no histórico, o carrinho é limpo automaticamente
5. **Dados Completos**: Todos os dados do produto (nome, preço, variante, etc.) são salvos no histórico
6. **Status 'completed'**: Pedidos no histórico sempre têm status 'completed' (pagamento confirmado)

## Configuração do Webhook no Shopify

Para receber notificações automáticas quando um pedido é pago:

1. Acesse o Admin do Shopify
2. Vá em **Configurações** > **Notificações**
3. Role até **Webhooks**
4. Clique em **Criar webhook**
5. Configure:
   - **Evento**: `Pedido pago` ou `orders/paid`
   - **Formato**: JSON
   - **URL**: `https://seu-dominio.com/api/webhooks/shopify`
6. Salve o webhook

## Próximos Passos (Melhorias Futuras)

1. ✅ **Webhook do Shopify**: Implementado - recebe notificações quando pedido é pago
2. **Página de Histórico**: Exibir pedidos anteriores para o usuário
3. **Notificações**: Avisar quando pedido for confirmado
4. **Rastreamento**: Integrar com sistema de rastreamento de entrega
5. **Retry Logic**: Tentar novamente se verificação falhar
