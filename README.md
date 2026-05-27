# Plano de Ação

Aplicação React + Vite para gerenciar planos de ação com KPI, criticidade, prazo, dono e efeito observado.

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`

## Deploy no Vercel

### Opção 1 — Via GitHub (recomendado)

1. Suba o projeto para um repositório no GitHub
2. Acesse [vercel.com](https://vercel.com) e clique em **Add New Project**
3. Importe o repositório
4. O Vercel detecta automaticamente que é um projeto Vite — clique em **Deploy**
5. Pronto! O Vercel gera uma URL pública

### Opção 2 — Via Vercel CLI

```bash
npm install -g vercel
vercel
```

Siga o passo a passo no terminal. Na primeira vez, vai pedir login e configuração do projeto.

## Funcionalidades

- Adicionar, editar e remover ações
- Criticidade: Alta / Média / Baixa
- Status: Pendente / Em andamento / Concluído / Atrasado
- Prazo com alerta visual (vence em 7 dias, atrasado)
- KPI relacionado e efeito observado
- Filtros por criticidade, status e efeito
- Busca por ação ou dono
- Exportar para CSV (compatível com Google Planilhas)
- Cards de resumo com contadores
