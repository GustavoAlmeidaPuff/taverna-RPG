# Solução: Erro ao Finalizar Pedido

## Problema

Ao tentar finalizar o pedido, aparece o erro:
```
Erro ao criar carrinho: input,lines,0,merchandiseId: The merchandise with id gid://shopify/ProductVariant/[ID] does not exist.
```

## Causa

Este erro ocorre porque os produtos no carrinho foram adicionados usando IDs da **Admin API** (IDs numéricos), mas o checkout utiliza a **Storefront API** (IDs no formato GID). 

Após a atualização do sistema, os produtos agora usam IDs da Storefront API para garantir compatibilidade com o checkout.

## Solução para o Usuário

### Opção 1: Limpar o Carrinho (Mais Rápido)

1. Acesse a página de checkout (`/checkout`)
2. Quando aparecer a mensagem de erro, clique em **"Limpar Carrinho"**
3. Retorne à página inicial e adicione os produtos novamente
4. Tente finalizar o pedido novamente

### Opção 2: Remover Produtos Individualmente

1. Remova todos os produtos do carrinho
2. Adicione-os novamente da página de produtos
3. Tente finalizar o pedido novamente

## Solução Técnica Implementada

### O que foi mudado:

1. **Migração para Storefront API**: Todas as funções de busca de produtos agora usam a Storefront API ao invés da Admin API
2. **Validação de Variantes**: Antes de criar o checkout, o sistema valida se todos os IDs de variantes são válidos
3. **Mensagens de Erro Melhoradas**: O usuário agora recebe mensagens claras sobre produtos inválidos
4. **Botão de Limpeza**: Interface para limpar o carrinho rapidamente quando houver produtos inválidos

### Arquivos Modificados:

- `lib/shopify.ts`: 
  - Funções `getAllProducts()`, `getProductByHandle()`, `getProductsByIds()` agora usam Storefront API
  - Adicionada função `validateVariants()` para validar IDs antes do checkout
  - Melhorada função `createCheckout()` com validação e logs

- `components/CheckoutContent.tsx`:
  - Melhoradas mensagens de erro
  - Adicionado botão para limpar carrinho quando houver produtos inválidos

### Como Prevenir no Futuro:

- Sempre use a Storefront API para buscar produtos quando precisar dos IDs para checkout
- Os IDs de variantes agora vêm no formato correto `gid://shopify/ProductVariant/[ID]`
- A validação automática detectará produtos inválidos antes de tentar criar o checkout

## Próximos Passos (Opcional)

Para evitar que usuários com carrinhos antigos tenham problemas, podemos implementar:

1. **Migração Automática**: Detectar IDs antigos e buscar os IDs corretos da Storefront API
2. **Limpeza de Carrinho ao Login**: Limpar carrinhos com mais de X dias
3. **Revalidação ao Carregar**: Verificar se os produtos do carrinho ainda existem e estão disponíveis

## Testando a Solução

1. Limpe o carrinho atual
2. Adicione um produto ao carrinho
3. Vá para o checkout
4. Finalize o pedido
5. Você deve ser redirecionado para o Shopify Checkout sem erros
