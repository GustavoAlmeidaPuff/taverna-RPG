# Taverna RPG Store

Clone visual exato do site [Taverna RPG Store](https://taverna-rpg-ui.lovable.app), uma loja e-commerce de produtos de RPG de mesa.

## 🎯 Objetivo

Este projeto é uma réplica visual 1:1 do site original, criado como base para futura integração com:
- **Shopify** - Para gerenciamento de produtos, estoque e pedidos
- **Firebase Auth** - Para autenticação de usuários
- **Firestore** - Para salvar curtidos, histórico de compras, avaliações, etc.

## ⚠️ Importante - Placeholders

**TODOS os conteúdos, produtos, imagens e textos são PLACEHOLDERS.**

O código contém comentários indicando onde os dados serão conectados futuramente. Nenhum dado real está sendo usado no momento.

## 🎨 Paleta de Cores

O projeto utiliza uma paleta de cores específica definida no `tailwind.config.ts`:

- **Primary**: `#e8b430` (Dourado)
- **Secondary**: `#32241b` (Marrom escuro)
- **Background**: `#120f0d` (Preto)
- **Card**: `#1d1816` (Cinza escuro)
- E outras cores conforme especificado

## 🚀 Como executar

Primeiro, instale as dependências:

```bash
npm install
```

Depois, execute o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## 📁 Estrutura do projeto

```
tavernaRPG/
├── app/
│   ├── api/
│   │   └── products/         # APIs REST para produtos Shopify
│   ├── page.tsx              # Página principal
│   ├── produto/[id]/page.tsx # Página de detalhes do produto
│   ├── layout.tsx             # Layout principal
│   └── globals.css            # Estilos globais
├── lib/
│   ├── shopify.ts            # Cliente e funções Shopify
│   └── types.ts              # Tipos TypeScript
├── components/
│   ├── Header.tsx            # Cabeçalho com logo, busca e navegação
│   ├── Hero.tsx              # Seção hero com banner principal
│   ├── Features.tsx          # Seção de características (frete, segurança, etc)
│   ├── Categories.tsx        # Seção de categorias
│   ├── Products.tsx          # Componente de listagem de produtos
│   ├── PaymentPromo.tsx      # Seção de promoção de pagamento
│   └── Footer.tsx            # Rodapé completo
└── public/
    └── images/               # Imagens estáticas (placeholders)
```

## 🛠️ Scripts disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm start` - Inicia o servidor de produção
- `npm run lint` - Executa o ESLint

## 🔌 Integração com Shopify

A integração com Shopify foi configurada! Veja o arquivo `SHOPIFY_SETUP.md` para instruções detalhadas de configuração.

**O que foi implementado:**
- ✅ Cliente Shopify Storefront API configurado
- ✅ Funções para buscar produtos (`getAllProducts`, `getProductByHandle`)
- ✅ APIs REST (`/api/products`, `/api/products/[handle]`)
- ✅ Tipos TypeScript para produtos

**Para usar:**
1. Crie um arquivo `.env.local` com suas credenciais Shopify
2. Configure `SHOPIFY_STORE_DOMAIN` e `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
3. Use as funções em `lib/shopify.ts` ou as APIs REST para buscar produtos

## 📝 Próximos Passos

1. **Integração com Shopify** (em progresso)
   - ✅ Estrutura base configurada
   - ⏳ Conectar produtos reais nas páginas
   - ⏳ Implementar carrinho de compras funcional
   - ⏳ Integrar checkout

2. **Integração com Firebase**
   - Autenticação de usuários (Firebase Auth)
   - Salvar favoritos/curtidos (Firestore)
   - Histórico de compras (Firestore)
   - Sistema de avaliações (Firestore)

3. **Melhorias**
   - Substituir imagens placeholder por imagens reais
   - Implementar busca funcional
   - Adicionar filtros de produtos
   - Implementar paginação

## 🎨 Design

O design foi replicado exatamente como está no site original, mantendo:
- Cores exatas da paleta fornecida
- Espaçamentos e proporções idênticos
- Tipografia e tamanhos de fonte
- Layout e estrutura visual

## 📄 Licença

Este projeto é uma réplica do site original criado na Lovable.
