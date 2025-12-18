# 🎨 Paleta de Cores - Taverna RPG Store

Este documento contém a paleta de cores completa utilizada no projeto Taverna RPG Store.

## Cores Principais

### Background (Fundo)
- **Background Principal**: `#120f0d` (Preto muito escuro)
  - Usado como cor de fundo principal do site
  - Definido em `globals.css` no body

### Texto
- **Texto Principal**: `#ebe8e0` (Bege claro/creme)
  - Cor padrão do texto no body
  - Definido em `globals.css`
- **Texto Secundário**: `#EAE7DF` (Bege claro)
  - Usado em títulos e textos secundários
  - Exemplo: "EQUIPE SUA" no Hero

### Primary (Dourado - Cor de Destaque)
- **Primary Principal**: `#DFA026` (Dourado)
  - Cor principal de destaque
  - Usado em botões, links, badges, preços
  - Exemplo: "AVENTURA" no Hero, botões principais
- **Primary Alternativo**: `#E0B64D` (Dourado mais claro)
  - Variação do dourado principal
  - Usado em bordas e elementos decorativos
- **Primary Mencionado no README**: `#e8b430` (Dourado médio)
  - Variação adicional da cor primária

### Secondary (Marrom Escuro)
- **Secondary Principal**: `#32241b` (Marrom escuro)
  - Usado em barras de navegação e elementos secundários
  - Mencionado no README
- **Secondary Alternativo**: `#382A1C` (Marrom escuro com tom mais quente)
  - Usado em badges e elementos decorativos

### Card (Cartões)
- **Card Background**: `#1d1816` (Cinza escuro com tom marrom)
  - Cor de fundo dos cards de produtos
  - Mencionado no README

## Cores Adicionais

### Gradientes e Overlays
- **Gradiente Hero**: 
  - `rgba(24, 10, 3, 0.95)` → `rgba(38, 19, 9, 0.7)` → `transparent`
  - Overlay escuro com tom marrom para o banner hero
- **Overlay Botão**: `rgba(0, 0, 0, 0.7)`
  - Overlay preto semi-transparente para botões secundários

### Efeitos de Texto
- **Text Shadow Dourado**: 
  - `rgba(255, 224, 102, 0.5)` (sombra principal)
  - `rgba(255, 224, 102, 0.3)` (sombra secundária)
  - Usado no título "AVENTURA" para efeito de brilho

## Sistema de Cores no Tailwind

O projeto utiliza classes Tailwind customizadas que devem ser definidas no `tailwind.config.ts`:

### Cores de Fundo
- `bg-background` → `#120f0d`
- `bg-secondary` → `#32241b` ou `#382A1C`
- `bg-card` → `#1d1816`
- `bg-input` → Cor de fundo de inputs
- `bg-primary` → `#DFA026`

### Cores de Texto
- `text-text` → `#ebe8e0` ou `#EAE7DF`
- `text-primary` → `#DFA026`
- `text-secondary-text` → Cor para textos secundários
- `text-card-text` → Cor para textos em cards
- `text-muted-text` → Cor para textos desabilitados/menos importantes
- `text-primary-text` → Cor para texto sobre fundo primary (geralmente preto ou branco)

### Cores de Borda
- `border-border` → Cor padrão de bordas
- `border-primary` → `#DFA026` ou `#E0B64D`

### Cores de Estado
- `text-destructive` / `bg-destructive` → Cor para ações destrutivas (ex: badges de oferta)
- `text-destructive-text` → Texto sobre fundo destructive
- `focus-ring` → Cor do anel de foco em inputs

## Uso das Cores

### Hierarquia Visual
1. **Primary (Dourado)**: Elementos de destaque, CTAs, preços, links importantes
2. **Background (Preto)**: Fundo principal, cria contraste
3. **Card (Cinza escuro)**: Elementos de conteúdo, produtos
4. **Secondary (Marrom)**: Navegação, elementos secundários
5. **Texto (Bege)**: Legibilidade sobre fundos escuros

### Acessibilidade
- O contraste entre o texto bege (`#ebe8e0`) e o fundo preto (`#120f0d`) garante boa legibilidade
- O dourado (`#DFA026`) sobre fundo escuro também mantém contraste adequado
- Sempre verifique o contraste ao adicionar novas cores

## Notas de Implementação

- Algumas cores estão definidas inline no código (ex: `text-[#DFA026]`)
- Idealmente, todas as cores devem ser centralizadas no `tailwind.config.ts`
- As cores podem ter pequenas variações dependendo do contexto de uso
- O tema geral é escuro (dark theme) com acentos dourados

