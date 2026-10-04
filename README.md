# Multi-Tenant Enterprise AI Copilot

An enterprise SaaS platform where companies subscribe, upload their private documents, and let their employees search and chat against that knowledge base — fully isolated per company, with streamed, cited answers.

---

## Table of contents

- [Architecture overview](#architecture-overview)
- [Tech stack](#tech-stack)
- [Multi-tenancy & data isolation](#multi-tenancy--data-isolation)
- [Core features](#core-features)
- [Project structure](#project-structure)
- [Environment variables](#environment-variables)
- [Local development setup](#local-development-setup)
- [Docker (local)](#docker-local)
- [Production deployment (AWS)](#production-deployment-aws)
- [Database migrations](#database-migrations)
- [Known limitations / follow-ups](#known-limitations--follow-ups)

---

## Architecture overview

```
Browser
   │
   │  https://yourapp.com/*          https://yourapp.com/api/*
   ▼                                          ▼
┌─────────────────────────────────────────────────┐
│                Nginx (reverse proxy)             │
│   - single public entry point (ports 80/443)     │
│   - terminates SSL, routes by path               │
└──────────────┬───────────────────┬───────────────┘
               │                   │
       everything else        path starts with /api
               ▼                   ▼
      ┌─────────────┐      ┌───────────────┐
      │   Next.js   │      │ Node/Express  │
      │  (port 3000)│      │  (port 5000)  │
      └─────────────┘      └───────┬───────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼                               ▼
            ┌───────────────┐              ┌─────────────────┐
            │   PostgreSQL   │              │  FastAPI (8000)  │
            │  (AWS RDS in   │              │  internal only   │
            │   production)  │              └─────────┬────────┘
            └───────────────┘                          ▼
                                              ┌─────────────────┐
                                              │  Qdrant (6333)  │
                                              │  internal only  │
                                              └─────────────────┘
```

**Only Nginx is ever reachable from the public internet.** FastAPI, Qdrant, and Postgres have no authentication of their own by design — they trust whatever calls them — so they must never be exposed directly. This is enforced both at the Docker network level (`expose` vs `ports`) and, in AWS, at the security-group level.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router, TypeScript, Tailwind CSS v4) |
| Backend / orchestration | Node.js, Express, Prisma ORM |
| Database | PostgreSQL (AWS RDS in production) |
| AI / retrieval service | FastAPI (Python) |
| Vector database | Qdrant |
| LLM provider | Groq (OpenAI-compatible API) |
| Payments | Razorpay |
| Reverse proxy | Nginx |
| Containerization | Docker, Docker Compose |
| Hosting | AWS EC2 (app), AWS RDS (database) |

---

## Multi-tenancy & data isolation

Every company (tenant) that signs up gets fully isolated document search:

- Every document chunk stored in Qdrant carries a `company_id` (tenant ID) in its payload.
- Every search — semantic, BM25, and hybrid — filters by `company_id` **in the same query** as the similarity search, never as a post-filter step.
- `company_id` is always taken from the authenticated user's verified JWT (`req.user.tenantId`), **never** from client-supplied request data, at every layer (document upload, chat, search).
- BM25 keyword search uses one index per tenant, loaded only for that tenant's queries.
- The FastAPI AI service has no authentication of its own — it trusts whatever `companyId` arrives in a request. This is safe **only** because FastAPI is never exposed publicly; Node is the sole trusted gatekeeper in front of it.

---

## Core features

### Document ingestion & retrieval
- Document upload (any file type FastAPI's extraction pipeline supports) → chunked → embedded → stored in Qdrant with tenant-scoped metadata.
- Hybrid search (semantic + BM25 keyword) with tenant isolation enforced at the query level.
- Chat responses are streamed token-by-token from the LLM, with a trailing `__CITATIONS__` marker carrying source document/page references, relayed live through Node to the browser.

### Conversation memory
- Conversations and messages are stored in Postgres, scoped to `userId` + `tenantId`.
- A 24-hour TTL: conversations are filtered out of "active" queries once past that window, and a nightly cron job physically deletes expired rows (cascading to their messages).

### Admin dashboard
- Role-gated (`TENANT_ADMIN` only), both client-side (UX) and server-side (`authorize()` middleware — the actual enforcement).
- Document upload with a persisted `Document` table (name, chunk count, status, uploader) for a visible document list.
- Bulk employee onboarding via Excel upload (`Name`, `Email`, `Role`, `Password` columns) — passwords are hashed with bcrypt before storage; no invite-email step.

### Billing & subscriptions
- Public landing page, single pricing plan.
- Signup flow: company + admin details are staged in a `PendingSignup` row, a Razorpay order is created, and the real `Tenant` + admin `User` + `Subscription` are only created **after** Razorpay's payment signature is cryptographically verified server-side — never before payment completes.
- Subscription expiry is enforced in three places:
  1. **Login** — a lapsed non-admin cannot log in at all; an admin can (specifically so they can reach the renewal flow).
  2. **Per-request middleware** (`checkSubscription`) — returns `402` on every product route once `expiresAt` has passed, regardless of whether the JWT itself is still valid.
  3. **Nightly cron** — flips `status` to `expired` for reporting/query purposes (the live `expiresAt` comparison is the actual source of truth, not this field).
- On `402`, the frontend routes a `TENANT_ADMIN` to a renewal page and a regular employee to `/login` with an explanatory message — the session is cleared either way.

---

## Project structure

```
.
├── backend/              # Node/Express — auth, business logic, orchestration
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middlewares/
│   ├── prisma/           # schema.prisma + migrations
│   └── Dockerfile
├── AI-services/          # FastAPI — retrieval, chunking, embeddings, LLM calls
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── chunking/
│   │   ├── embeddings/
│   │   ├── vector_store/
│   │   ├── retrieval/
│   │   └── LLM/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/             # Next.js — UI
│   ├── app/
│   │   ├── (auth)/login, (auth)/signup
│   │   ├── (protected)/chat, (protected)/admin, (protected)/subscription
│   │   └── page.tsx      # landing page / role-based redirect
│   ├── lib/api/          # apiClient, types
│   ├── components/
│   └── Dockerfile
├── nginx/
│   └── nginx.conf
├── docker-compose.yml        # local development (Postgres as a container)
├── docker-compose.prod.yml   # production (points at AWS RDS, no local Postgres)
└── README.md
```

---

## Environment variables

### `backend/.env`

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Postgres connection string. **No surrounding quotes** — `--env-file`/`env_file:` pass values literally; URL-encode special characters in the password (`@` → `%40`, etc.) |
| `JWT_SECRET` | Used to sign/verify auth tokens |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | From the Razorpay dashboard — test mode (`rzp_test_...`) during development |
| `SUBSCRIPTION_AMOUNT_INR` | **In paise**, not rupees (e.g., `499900` = ₹4,999) |

### `AI-services/.env`

| Variable | Notes |
|---|---|
| `LLM_api_key` | Groq API key |
| `QDRANT_HOST` / `QDRANT_PORT` | `qdrant` / `6333` when networked via Docker Compose |

### Project root `.env` (for `docker-compose.prod.yml` variable substitution only — never committed)

| Variable | Notes |
|---|---|
| `RDS_ENDPOINT` | RDS instance endpoint |
| `RDS_PASSWORD` | URL-encoded if it contains special characters |

### Frontend build argument (not a runtime `.env`)

`NEXT_PUBLIC_API_URL` is baked into the compiled JS **at build time** via `--build-arg`, since Next.js inlines `NEXT_PUBLIC_*` variables into the client bundle. A relative value (`/api`) is used so the same build works on `localhost` and in production without rebuilding.

> **Lesson learned the hard way:** values in `.env` files must have **no surrounding quotes** when consumed via Docker's `--env-file`/`env_file:` — unlike libraries such as `dotenv`, Docker does not strip them, and a literal `"` character breaks downstream parsers (e.g., Prisma's connection-string validator).

---

## Local development setup

### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### AI service
```bash
cd AI-services
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Qdrant can run embedded (`path="./qdrant_data"`) for quick local iteration, but switch to a real Qdrant server/container before anything resembling concurrent access — embedded mode locks the storage directory to a single process.

---

## Docker (local)

```bash
docker compose up --build
```

Brings up Postgres, Qdrant, backend, AI service, frontend, and Nginx, networked together by service name (no `localhost`/`host.docker.internal` needed once everything is containerized). Access the app at:

```
http://localhost
```

(port 80, via Nginx — not `:3000` or `:5000` directly; those are intentionally not published to the host)

---

## Production deployment (AWS)

### Infrastructure
- **RDS**: standalone PostgreSQL (not Aurora — Aurora has different, less favorable free-tier terms), `db.t3.micro`, **public access disabled**, reachable only from the EC2 instance's security group.
- **EC2**: Ubuntu, sized to comfortably run five containers at once (`t3.medium` recommended — the AI service alone, with `torch`/`transformers`-adjacent dependencies, is heavy). **30GB+ of EBS storage** — the default 8GB is not enough once all images are built.
- **Security groups**: only ports 22 (SSH, restricted to your own IP), 80, and 443 are open to the internet. Every internal port (5000, 8000, 6333, 5432) stays closed at the AWS network level, on top of Docker's own `expose`-only isolation.

### Deploying
```bash
git clone <repo-url>
cd <repo>
# create backend/.env and AI-services/.env directly on the server (not in git)
# create a root-level .env with RDS_ENDPOINT and RDS_PASSWORD (not in git)
sudo docker compose -f docker-compose.prod.yml up --build -d
sudo docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

### Persistent data
`qdrant_data` and `uploaded_docs` are Docker named volumes — without them, re-creating the `ai-service` container (e.g., on every `--build`) silently wipes all previously uploaded source documents, even though Qdrant's own embeddings (in the separately-volumed `qdrant_data`) survive. Both must be declared as named volumes in `docker-compose.prod.yml`.

---

## Database migrations

Standard Prisma flow:
```bash
npx prisma migrate dev --name <description>     # local, interactive
npx prisma migrate deploy                         # production, non-interactive
```

If the live database ever drifts from migration history (e.g., a column added via `db push` or a manual edit), **do not** run `prisma migrate reset` without confirming it's safe — it drops the whole schema. Prefer `prisma db pull` to sync the schema file, then a `migrate dev --create-only` + `migrate resolve --applied` pair to record the drift as a proper migration without re-running already-applied SQL.

---

## Known limitations / follow-ups

- Uploaded source documents live on a single EC2 instance's Docker volume. Fine for one server; migrating to **S3** removes the single-point-of-disk-space constraint and is the natural next step before scaling past one instance.
- Postgres connection pooling, horizontal scaling of the backend, and ECS/Fargate migration are not yet addressed — the current deployment is a single EC2 instance running the full stack via Docker Compose.
- Employee bulk-upload distributes plaintext passwords via an Excel file — acceptable for controlled internal onboarding, but worth revisiting if that file's distribution channel isn't tightly controlled.
- No automated test suite yet.