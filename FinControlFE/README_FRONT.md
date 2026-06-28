# FinControlFE — Front-end (somente UI/JS)

Este diretório contém apenas a camada de front-end (HTML/CSS/JS) preparada para plugar o back-end depois.

## Arquivos
- `index.html` — Login / Cadastro
- `dashboard.html` — Dashboard placeholder
- `receitas.html` — Lista placeholder de receitas (consome `/api/receitas`)
- `despesas.html` — Lista placeholder de despesas (consome `/api/despesas`)
- `categorias.html` — CRUD mínimo de categorias
- `cartoes.html` — CRUD mínimo de cartões
- `metas.html` — CRUD mínimo de metas
- `investimentos.html` — CRUD mínimo de investimentos
- `fluxo-caixa.html` — Fluxo de caixa
- `relatorios.html` — Relatórios
- `perfil.html` — Perfil (GET/PUT)
- `quem-somos.html` — Página estática

## Notas
- O `app.js` define `FinConfig.API_BASE` (por padrão `http://localhost:3000/api`).
- As páginas chamam `api()` do `app.js` e enviam token no header `Authorization: Bearer <token>`.

