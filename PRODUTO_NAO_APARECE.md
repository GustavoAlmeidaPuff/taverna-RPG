# Por que meu produto não aparece no site?

## Problema Resolvido

✅ **Limite de produtos aumentado de 20 para 100**

## Verificações no Shopify

Se mesmo após aumentar o limite o produto não aparecer, verifique:

### 1. **Status do Produto**

No painel do Shopify:

1. Vá em **Produtos** → Encontre o produto
2. Verifique o status:
   - ✅ **Active** (Ativo) - Produto visível
   - ❌ **Draft** (Rascunho) - Produto invisível
   - ❌ **Archived** (Arquivado) - Produto invisível

**Como corrigir**: Clique no produto e mude o status para "Active"

### 2. **Disponibilidade de Vendas (Sales Channels)**

O produto precisa estar disponível no canal de vendas correto:

1. Abra o produto no Shopify
2. Role até a seção **"Product availability"** (Disponibilidade do produto)
3. Verifique se está marcado:
   - ✅ **Online Store** (se usa vitrine do Shopify)
   - ✅ **Headless** (se usa API customizada)
   - ✅ Ou o nome do seu app personalizado

**Como corrigir**:
```
1. Clique em "Manage"
2. Marque o canal de vendas apropriado
3. Salve as alterações
```

### 3. **Permissões da Storefront API**

Verifique se o token tem as permissões corretas:

1. No Shopify Admin, vá em **Settings** → **Apps and sales channels**
2. Encontre seu App (ou "Storefront API access")
3. Verifique as permissões:
   - ✅ `unauthenticated_read_product_listings` (para listar produtos)
   - ✅ `unauthenticated_read_product_inventory` (para ver estoque)

### 4. **Variantes Disponíveis**

O produto precisa ter pelo menos uma variante:

1. Abra o produto
2. Vá em **Variants** (Variantes)
3. Certifique-se de que há pelo menos uma variante
4. Verifique se a variante tem preço configurado

### 5. **Imagens do Produto**

Embora não obrigatório, é recomendado:

1. Produto deve ter pelo menos uma imagem
2. Imagem deve estar em formato suportado (JPG, PNG, WebP)

## Como Testar

### Teste 1: Verificar no Terminal

Após aumentar o limite, verifique no terminal (onde o Next.js está rodando):

```
📦 X produtos encontrados no Shopify
```

Se aparecer um número menor que o esperado, o problema está no Shopify.

### Teste 2: Testar Diretamente na API

Você pode testar se o produto está acessível via API:

1. Abra o **GraphiQL Explorer** no Shopify:
   - Admin → Apps → Desenvolvimento → Storefront API
   
2. Execute esta query:
```graphql
{
  products(first: 100) {
    edges {
      node {
        id
        title
        handle
        availableForSale
        publishedAt
      }
    }
  }
}
```

3. Procure seu produto na lista
4. Se não aparecer, o problema está na configuração do Shopify

### Teste 3: Verificar por Handle

Se você sabe o handle do produto (URL amigável), teste:

```
http://localhost:3000/api/products/[handle-do-produto]
```

Por exemplo:
```
http://localhost:3000/api/products/dados-rpg-hexagonais
```

## Limites Técnicos

### Limite da Storefront API
- **Máximo por consulta**: 250 produtos
- **Atual no sistema**: 100 produtos

Se você tem mais de 100 produtos e quer mostrar todos:

1. Aumente o limite em `app/page.tsx`:
```typescript
const products = await getAllProducts(250); // máximo permitido
```

2. Ou implemente paginação (recomendado para muitos produtos)

## Logs de Debug

Para ajudar a identificar problemas, foram adicionados logs:

### No Servidor (Terminal)

```bash
📦 5 produtos encontrados no Shopify
```

Isso mostra quantos produtos foram retornados pela API.

### Verificar Produto Específico

Se quiser ver todos os dados de um produto:

1. Abra `lib/shopify.ts`
2. Adicione este log temporariamente na função `getAllProducts`:

```typescript
console.log('Produtos:', products.map(p => ({
  nome: p.name,
  handle: p.handle,
  variantId: p.variantId
})));
```

## Casos Comuns

### ❌ "Tenho 10 produtos mas só aparecem 4"
**Causa**: Limite muito baixo  
**Solução**: Aumentar limite para 100 (já corrigido)

### ❌ "Produto aparece no Shopify mas não no site"
**Causa**: Produto não publicado no canal de vendas  
**Solução**: Ativar "Online Store" ou "Headless" no produto

### ❌ "Produto é rascunho"
**Causa**: Status = Draft  
**Solução**: Mudar status para Active

### ❌ "Produto sem variante"
**Causa**: Produto sem variante ou preço  
**Solução**: Adicionar variante com preço

### ❌ "Produto arquivado"
**Causa**: Status = Archived  
**Solução**: Desarquivar e ativar produto

## Paginação (Futuro)

Para muitos produtos (100+), considere implementar paginação:

```typescript
// Buscar produtos com cursor de paginação
const firstPage = await getAllProducts(50);
const secondPage = await getAllProducts(50, lastCursor);
```

## Resumo da Correção

### ✅ O que foi feito:
1. Limite aumentado de 20 → 100 produtos
2. Log adicionado para mostrar quantos produtos foram encontrados
3. Documentação de troubleshooting criada

### 📋 Próximos passos:
1. Recarregue a página inicial
2. Verifique no terminal: `📦 X produtos encontrados`
3. Se o número estiver correto, o produto deve aparecer
4. Se não, verifique a configuração no Shopify (status, canal de vendas)

---

**Arquivos Modificados**:
- `lib/shopify.ts` (limite aumentado + logs)
- `app/page.tsx` (limite aumentado para 100)
