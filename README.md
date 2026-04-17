# Guardian AI (prototype)

Guardian AI is a Next.js app for **AI-assisted compliance scanning**. Users pick a **compliance domain** (seeded from regulatory “acts”), upload **one or more documents** (PDFs, plain text, Markdown, JSON, HTML, etc.), and get a **score, risk level, and per-act findings** with summaries. A public **marketing site** lives at `/`; the **scanner** and **dashboard** use a shared shell and work in **prototype mode without sign-in**, while **Clerk** is wired in for real authentication.

## What’s in the repo today

- **Landing** at `/` — marketing homepage (Guardian AI positioning).
- **Scanner** at `/scanner` — domain selection, multi-file upload, scan results (via `ScannerWorkspace`).
- **Dashboard** at `/dashboard` — overview metrics derived from completed scans.
- **Other UI routes** — reports, alerts, settings, frameworks, domains, solutions, pricing, about, docs (prototype/navigation shells as implemented under `src/app/`).
- **Clerk** — `ClerkProvider` in `src/app/layout.tsx`, sign-in at `/auth`, sign-up at `/auth/sign-up`, `clerkMiddleware` in `src/middleware.ts` (auth is optional; API routes still resolve a user for jobs).
- **Postgres + Prisma** — jobs, domains, acts, and scan results. Seed populates domains/acts from `src/lib/scannerDomains.ts`.
- **OpenAI** — `complianceScanPipeline` extracts text (PDF via `pdf-parse`) and runs a structured LLM pass over the domain’s act titles.
- **Background processing (optional)** — BullMQ + Redis + `npm run worker` when not running scans synchronously.

## User flow

1. Open `/` or go straight to `/scanner`.
2. Optionally sign in with Clerk (`/auth`); otherwise scans attach to a shared anonymous prototype user.
3. Choose a compliance domain (loaded from `GET /api/compliance-domains`; requires DB + seed).
4. Upload files and submit — `POST /api/scans` creates a job, runs the pipeline **inline or queued** (see below).
5. Poll `GET /api/scans/[jobId]` for `status`, `report`, and errors.

## Tech stack

- Next.js **16** (App Router), React **19**, TypeScript
- Tailwind CSS **4**
- **Clerk** (`@clerk/nextjs`) for authentication UI and sessions
- **Prisma** + PostgreSQL
- **BullMQ** + **ioredis** (optional when using the worker)
- **OpenAI** SDK, **Zod**, **pdf-parse**, **uuid**

## Architecture (high level)

### Frontend

- `src/app/page.tsx` — landing page.
- `src/app/scanner/page.tsx` — scanner entry; `src/components/scanner/ScannerWorkspace.tsx` — upload, domain pick, polling, results.
- `src/components/guardian/*` — marketing header/footer, dashboard shell, sidebar, Clerk auth panels.

### API

- `POST /api/scans` — `multipart/form-data`: required `domainId`, one or more `files`. Stores uploads under `UPLOAD_DIR` (default `./uploads`), creates an `AnalysisJob`, then completes **synchronously** or enqueues to Redis.
- `GET /api/scans/[jobId]` — job status and `report` for the current scan user.
- `GET /api/compliance-domains` — domains and act titles from the database (503 if DB not migrated/seeded).

### Services & worker

- `src/services/complianceScanPipeline.ts` — text extraction + LLM structured findings + score/risk.
- `src/services/complianceScanJob.ts` — loads job, runs pipeline, persists `report` on `AnalysisJob`.
- `src/worker/analyzeWorker.ts` — BullMQ consumer calling `executeComplianceScan`.

### Auth & users

- `src/lib/authSession.ts` — maps Clerk users to `User` rows by email, or uses a fixed anonymous email for unsigned scans.

### Infra

- `docker-compose.yml` — **PostgreSQL16** only (`guardian` DB, host port **5433**). No Redis/app/worker services in compose.
- `Dockerfile` — production-style Node20 image that builds and runs `next start`.

## Sync vs queued scans

- **`COMPLIANCE_SCAN_SYNC=true`** — run the full scan in the API process (recommended on hosts without Redis, e.g. Railway).
- **Development** — scans run **inline by default** so you do not need Redis or a worker unless you set `USE_BULLMQ_IN_DEV=true`.
- **Production-style queue** — unset `COMPLIANCE_SCAN_SYNC` (or set to `false`), run Redis, start `npm run worker`. If the queue is unavailable, `POST /api/scans` falls back to synchronous execution.

## Project structure

```text
prototype/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── compliance-domains/
│   │   │   └── scans/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── scanner/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── guardian/
│   │   └── scanner/
│   ├── lib/
│   ├── services/
│   ├── types/
│   ├── worker/
│   └── middleware.ts
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

## Environment variables

Copy `.env.example` to `.env`. Important values:

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | LLM calls for compliance evaluation |
| `OPENAI_COMPLIANCE_MODEL` | Model name (default in example: `gpt-4o-mini`) |
| `PII_ENCRYPTION_KEY` | Used where sensitive payloads are encrypted (see codebase) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | Clerk |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Match app routes (`/auth`, `/auth/sign-up`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis when using BullMQ + worker |
| `COMPLIANCE_SCAN_SYNC` | `true` to force in-process scans |
| `USE_BULLMQ_IN_DEV` | Set to opt into the queue in development |

Railway-focused notes in `.env.example` explain using a **public** Postgres URL from a laptop vs private network URLs.

## Local development

### Prerequisites

- Node.js **20+** and npm
- PostgreSQL (local or Docker)
- OpenAI API key
- Clerk application keys (for sign-in; scans still work without login in prototype mode)
- Redis + worker **only** if you disable sync / enable BullMQ in dev

### Quick start (Postgres via Docker)

1. `npm install`
2. Copy `.env.example` → `.env` and set `DATABASE_URL` (for compose: `postgresql://postgres:postgres@127.0.0.1:5433/guardian?schema=public`).
3. `npm run db:up` — starts Postgres (`docker compose up -d`).
4. `npx prisma db push` and `npm run db:seed` — schema + compliance domains/acts.
5. `npm run dev` — [http://localhost:3000](http://localhost:3000).

### Worker + Redis (optional)

1. Run Redis locally and set `REDIS_URL`.
2. Set `USE_BULLMQ_IN_DEV=true` and ensure `COMPLIANCE_SCAN_SYNC` is not forcing sync (or use production-like env).
3. In a second terminal: `npm run worker`.

### Scripts

- `npm run dev` — Next.js dev server
- `npm run build` / `npm run start` — production build and server
- `npm run lint` — ESLint
- `npm run worker` — BullMQ worker
- `npm run db:up` — Docker Compose Postgres
- `npm run db:push` — `prisma db push`
- `npm run db:seed` — seed domains/acts
- `npm run db:migrate:deploy` — `prisma migrate deploy`

## Data model (Prisma)

Notable models:

- `User` — still used for job ownership (Clerk users upserted by email; anonymous prototype user for unsigned scans).
- `ComplianceDomain` / `ComplianceAct` — domain picker and act titles passed to the LLM.
- `AnalysisJob` — status, trace id, optional `complianceDomainId`, `inputFiles` JSON, `report` JSON.
- `AnalysisReport`, `UploadedDocument`, `ComplianceIssue` — present in schema for richer reporting flows.

Enums include `JobStatus`, `DocumentType`, `IssueSeverity`, `UserRole`, `AuthProvider`.

## API summary

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/compliance-domains` | List domains and compliance act titles |
| `POST` | `/api/scans` | Start scan (`domainId` + `files`) |
| `GET` | `/api/scans/[jobId]` | Job + report payload |

## Setup gotchas

- **Domains 503** — run `npx prisma db push` and `npm run db:seed`.
- **Scans slow or timeout** — LLM work can take a long time; `maxDuration` is raised on the scan route for serverless-style hosts.
- **File types** — API allows PDF and text-like types (not legacy invoice/BOL-only image flows unless you add MIME support).
- **Queue** — background completion needs Redis + worker unless sync mode is on.

Prototype demo: [Google Drive](https://drive.google.com/file/d/1tP-t-uOOy7EDftMf66LXbCvF-K929tca/view?usp=sharing)
