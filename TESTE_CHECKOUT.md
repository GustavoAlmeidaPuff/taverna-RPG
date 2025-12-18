# Como Testar o Checkout Corrigido

## Problema Resolvido

✅ **Erro**: `The merchandise with id gid://shopify/ProductVariant/[ID] does not exist`

## Soluções Implementadas

### 1. Migração para Storefront API
- Todos os produtos agora são buscados usando a Storefront API
- IDs de variantes agora estão no formato correto: `gid://shopify/ProductVariant/[ID]`

### 2. Validação Automática de Produtos
- O carrinho valida automaticamente os IDs ao carregar
- IDs antigos (numéricos) são atualizados automaticamente para o formato GID
- Produtos que não existem mais são identificados antes do checkout

### 3. Melhorias na Interface
- Mensagens de erro mais claras
- Botão para limpar carrinho quando há produtos inválidos
- Logs detalhados para debug

## Como Testar

### Passo 1: Limpar Carrinho Antigo (Se Necessário)

Se você já tem produtos no carrinho com IDs antigos:

1. Acesse `/checkout`
2. Se aparecer erro, clique em "Limpar Carrinho"
3. Ou remova os produtos manualmente

### Passo 2: Adicionar Produtos

1. Acesse a página inicial (`/`)
2. Escolha um produto
3. Clique em "Adicionar ao Baú"
4. Verifique se o produto aparece no carrinho (ícone do baú no header)

### Passo 3: Verificar Variantes

Se o produto tiver variantes:

1. Acesse a página do produto
2. Selecione uma variante
3. Adicione ao carrinho
4. Verifique se a variante correta aparece no carrinho

### Passo 4: Finalizar Pedido

1. Acesse `/checkout`
2. Verifique se os produtos estão listados corretamente
3. Clique em "FINALIZAR PEDIDO"
4. Você deve ser redirecionado para o Shopify Checkout
5. Complete o pagamento (ou teste no modo sandbox)

## Verificando os Logs

### Console do Navegador (F12)

Procure por mensagens como:
```
Criando checkout com itens: [...]
Itens formatados: [...]
Validação de variantes - válidas: [...], inválidas: [...]
Checkout criado com sucesso: [ID]
```

### Console do Servidor (Terminal)

Procure por:
```
POST /api/checkout 200 in XXXms
```

Se houver erro:
```
Erro ao criar checkout do Shopify: Error: ...
```

## Casos de Teste

### ✅ Teste 1: Produto Simples (Sem Variantes)
- [ ] Adicionar produto ao carrinho
- [ ] Verificar ID da variante no formato GID
- [ ] Finalizar pedido com sucesso

### ✅ Teste 2: Produto com Variantes
- [ ] Selecionar variante específica
- [ ] Adicionar ao carrinho
- [ ] Verificar nome da variante no carrinho
- [ ] Finalizar pedido com sucesso

### ✅ Teste 3: Múltiplos Produtos
- [ ] Adicionar 3+ produtos diferentes
- [ ] Atualizar quantidades
- [ ] Remover um produto
- [ ] Finalizar pedido com produtos restantes

### ✅ Teste 4: Carrinho Persistente
- [ ] Adicionar produtos ao carrinho
- [ ] Fazer logout
- [ ] Fazer login novamente
- [ ] Verificar se carrinho foi restaurado
- [ ] IDs devem ser automaticamente validados/atualizados

### ✅ Teste 5: Produto Inválido (Simulação)
Se um produto foi deletado do Shopify:
- [ ] Sistema deve identificar na validação
- [ ] Mensagem de erro clara
- [ ] Opção de limpar carrinho

## Troubleshooting

### Erro: "Alguns produtos não estão mais disponíveis"

**Causa**: Produto foi deletado do Shopify ou ID está incorreto

**Solução**:
1. Clique em "Limpar Carrinho"
2. Adicione os produtos novamente
3. Tente finalizar novamente

### Erro: "URL de checkout não retornada"

**Causa**: Problema na criação do carrinho no Shopify

**Solução**:
1. Verifique as variáveis de ambiente (`.env.local`):
   - `SHOPIFY_STORE_DOMAIN`
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
2. Verifique se o token tem permissões de leitura/escrita

### Carrinho Vazio Após Recarregar

**Causa**: Firebase não configurado ou usuário não autenticado

**Solução**:
1. Faça login primeiro
2. Adicione produtos
3. Carrinho deve persistir entre sessões

## Monitoramento

### Métricas de Sucesso
- Taxa de conversão (checkout iniciado → checkout completado)
- Tempo médio até checkout
- Erros de validação de produtos

### Logs Importantes
```javascript
// Produto com ID antigo sendo atualizado
console.log(`Produto ${name} tem ID antigo: ${oldId}. Buscando produto atualizado...`);

// Validação bem-sucedida
console.log('Validação de variantes - válidas:', valid, 'inválidas:', invalid);

// Checkout criado
console.log('Checkout criado com sucesso:', cartId);
```

## Próximos Passos

### Melhorias Futuras
- [ ] Cache de produtos para melhor performance
- [ ] Notificação ao usuário quando produto ficar indisponível
- [ ] Atualização de preços em tempo real
- [ ] Sincronização de estoque

### Monitoramento Contínuo
- [ ] Configurar alertas para erros de checkout
- [ ] Dashboard com métricas de conversão
- [ ] Logs estruturados para análise

---

**Data da Correção**: 18/12/2025
**Arquivos Modificados**: 
- `lib/shopify.ts`
- `contexts/CartContext.tsx`
- `components/CheckoutContent.tsx`

