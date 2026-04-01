# Elegibilidade — Frontend

Interface moderna para o Sistema Inteligente de Elegibilidade de Atendimento.

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · TanStack Query · React Dropzone

---

## Pré-requisitos

- Node.js 18+
- Backend rodando em `https://api-elegibilidade.duckdns.org`

---

## Instalação e uso

```bash
npm install
npm run dev   # http://localhost:3000
```

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Dashboard com métricas gerais |
| `/busca` | Consulta por CNPJ |
| `/importacao` | Upload CSV + histórico |
| `/clientes/:id` | Detalhe do cliente |

## Integração

O `next.config.js` faz proxy automático de `/api/*` → `http://localhost:8081/api/*`.
