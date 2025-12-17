# Taverna RPG

Este é um projeto Next.js criado com TypeScript, Tailwind CSS e ESLint.

## Como executar

Primeiro, instale as dependências:

```bash
npm install
```

Depois, execute o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## Estrutura do projeto

- `app/` - Contém as páginas e layouts usando o App Router do Next.js
- `components/` - Componentes reutilizáveis (crie conforme necessário)
- `public/` - Arquivos estáticos

## Scripts disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm start` - Inicia o servidor de produção
- `npm run lint` - Executa o ESLint

## Sobre Vite

Este projeto usa o sistema de build padrão do Next.js (Turbopack/Webpack). O Next.js não é compatível com Vite, pois possui seu próprio sistema de build altamente otimizado e integrado ao framework.
