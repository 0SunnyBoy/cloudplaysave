# CloudPlayGames

Loja digital de jogos com SPA React, API REST em Express + Sequelize + SQLite.

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| Node.js | 18+ |
| npm | 9+ |
| Docker Desktop |
---

## Como rodar — Monolito

```bash
npm install
npm start
```

Acesse: http://localhost:3000

O banco `database.sqlite` é criado automaticamente com 16 jogos na primeira execução.

---

## Como rodar — Microsserviços

```bash
cd microservices
npm run install:all
npm run start:all
```

Acesse: http://localhost:3000

| Serviço | Porta | Banco |
|---|---|---|
| api-gateway | 3000 | — |
| auth-service | 4001 | auth.sqlite |
| catalog-service | 4002 | catalog.sqlite |
| order-service | 4003 | orders.sqlite |

Verifique se todos subiram: http://localhost:3000/api/health

---

## Como rodar — Docker

**Monolito (1 container):**

```bash
docker compose --profile monolith up --build
```

**Microsserviços (4 containers):**

```bash
docker compose --profile microservices up --build
```

Acesse: http://localhost:3000

Para parar:

```bash
docker compose down
```

Os bancos SQLite ficam salvos em volumes Docker e sobrevivem ao `down`.
Para apagar tudo: `docker compose down -v`

---

## Estrutura do projeto

```
├── server.js              entrypoint do monolito
├── index.html             SPA React (CDN, sem build)
├── sw.js                  Service Worker (PWA)
├── src/
│   ├── config/
│   │   ├── database.js    Sequelize + SQLite
│   │   └── seed.js        16 jogos iniciais
│   ├── models/            Repository Pattern (UserModel, GameModel, OrderModel)
│   ├── controllers/       lógica de negócio (Auth, Game, Order)
│   ├── routes/            binding HTTP → controller
│   └── middleware/
│       └── auth.js        validação do JWT
├── microservices/
│   ├── api-gateway/       porta 3000 — proxy reverso + SPA
│   ├── auth-service/      porta 4001 — cadastro e login
│   ├── catalog-service/   porta 4002 — catálogo de jogos
│   └── order-service/     porta 4003 — pedidos
├── docs/
├── docker-compose.yml
└── Dockerfile
```

---

## Endpoints da API

### Públicos

| Método | Rota | Descrição |
|---|---|---|
| POST | /api/auth/register | Cadastro (senha com bcrypt) |
| POST | /api/auth/login | Login → retorna JWT |
| GET | /api/games | Lista jogos (?genre= ?badge= ?search=) |
| GET | /api/games/:id | Detalhe de um jogo |

### Protegidos — header `Authorization: Bearer <token>`

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/auth/me | Dados do usuário logado |
| POST | /api/checkout | Cria pedido |
| GET | /api/checkout/history | Histórico de pedidos |

---

## Dependências

```json
"express":      "^5.2.1",
"cors":         "^2.8.6",
"bcryptjs":     "^3.0.3",
"jsonwebtoken": "^9.0.3",
"sequelize":    "^6.37.8",
"sqlite3":      "^5.1.7"
```
