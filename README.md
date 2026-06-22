# Guardian AI

Welcome to the Guardian AI repository. This document serves as the primary understanding and architectural overview 

---

## 📖 Project Overview

Guardian AI is a full-stack B2B SaaS platform engineered to automate enterprise compliance auditing and regulatory risk assessment. By enabling multi-format document ingestion, the system allows users to select specific compliance domains (seeded from regulatory "acts") and run an automated, AI-driven policy validation pass. The output provides the user with an actionable risk severity score, issue categorization, and per-act summaries. 

The architecture is designed to be highly resilient, featuring a dual-mode execution engine that can handle heavy-compute enterprise workloads asynchronously via background queues, while maintaining synchronous fallbacks for constrained serverless environments.

---

## ✨ Core Features

*   **Multi-Format Document Ingestion:** Supports automated text extraction from PDFs (via `pdf-parse`), Markdown, JSON, HTML, and plain text.
*   **Structured AI Extraction:** Utilizes the OpenAI SDK and Zod to enforce strictly structured, deterministic JSON outputs from the LLM, ensuring consistent risk scoring and issue mapping.
*   **Dual-Mode Execution Engine:** 
    *   *Asynchronous Mode:* Leverages BullMQ and Redis for heavy document processing, decoupled from the main API thread.
    *   *Synchronous Mode:* In-process API execution fallback (`COMPLIANCE_SCAN_SYNC=true`) for environments without Redis.
*   **Multi-Tenant Ready:** Integrated with Clerk for seamless authentication and workspace management.
*   **Real-time Polling & Dashboards:** Front-end workspace that polls job statuses and renders risk data dynamically.

---

## 🛠️ Technology Stack

**Frontend Ecosystem**
*   **Framework:** Next.js 16 (App Router) & React 19
*   **Styling:** Tailwind CSS v4
*   **State & Auth:** Clerk (`@clerk/nextjs`)

**Backend & Infrastructure**
*   **Language:** TypeScript / Node.js 20+
*   **Database:** PostgreSQL (managed via Prisma ORM)
*   **Queues & Workers:** BullMQ + ioredis
*   **AI/LLM:** OpenAI API (`gpt-4o-mini` default), Zod for schema validation
*   **Utilities:** `pdf-parse`, `uuid`

---

## 🔄 The Process: Architectural Flow

1.  **Ingestion & Auth:** A user authenticates via Clerk (or defaults to the anonymous prototype user) and accesses the `/scanner` workspace.
2.  **Domain Selection:** The UI fetches available compliance domains (`GET /api/compliance-domains`) seeded in the PostgreSQL database.
3.  **Upload & Job Creation:** The user uploads files (`multipart/form-data` to `POST /api/scans`). The system securely stores the payload and instantiates an `AnalysisJob` in the database with a `PENDING` status.
4.  **Pipeline Execution (The Orchestration):**
    *   *If Async:* The API enqueues the job to Redis. The BullMQ worker (`src/worker/analyzeWorker.ts`) picks it up.
    *   *If Sync:* The API calls `complianceScanPipeline.ts` directly.
5.  **LLM Processing:** The pipeline extracts text, chunks it if necessary, and prompts the LLM to validate the text against the selected domain's act titles, returning a Zod-validated JSON report.
6.  **Resolution & Polling:** The `AnalysisJob` is updated to `COMPLETED` or `FAILED`. The frontend utilizes polling (`GET /api/scans/[jobId]`) to detect the state change and render the final compliance report.

---

## 🪝 Routing & State (History & Hooks)

To manage complex scanner states and navigation seamlessly, we utilize Next.js App Router paradigms:

*   **Routing (`useRouter` / `usePathname`):** Replaces legacy `useHistory` patterns. We utilize `next/navigation` hooks to programmatically push users to the dashboard upon successful scan completion or to handle deep-linking into specific scan reports.
*   **Search Params (`useSearchParams`):** Used to persist non-sensitive state in the URL (e.g., currently selected framework tabs or active filters on the dashboard), allowing users to share links to specific views.
*   **Custom Polling Hooks:** The scanner workspace abstracts the `setInterval` logic into a custom React hook that manages the loading state, error boundaries, and data hydration while waiting for the BullMQ worker to finish.

---

## 📊 Coordination & Measurements

To ensure system reliability and team velocity, we measure and track the following:

*   **Job Status Tracking:** Every `AnalysisJob` is strictly state-managed (`PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`). This allows us to measure queue latency and LLM execution times.
*   **Observability & Monitoring:** System monitoring (such as Prometheus) can track routing efficiency, LLM API latency, and queue depths in real-time, allowing us to scale the Redis workers horizontally when enterprise workloads spike.
*   **Team Coordination:** All database schema changes must be pushed via Prisma migrations (`npm run db:migrate:deploy`). Ensure local environments are seeded (`npm run db:seed`) to prevent 503 errors on the domain endpoints.

---

## 🧠 What I Learned

*   **Resilient Async Architecture:** Designing the fallback mechanism between BullMQ and synchronous serverless execution taught me how to architect applications that can survive infrastructure constraints (e.g., deploying to environments without a Redis cache).
*   **Deterministic LLM Outputs:** Forcing an LLM to act predictably for enterprise B2B software is challenging. Utilizing `Zod` in tandem with the OpenAI SDK was crucial for generating strictly typed data structures instead of raw text strings.
*   **Multi-tenant Data Modeling:** Building the Prisma schema to accommodate both authenticated Clerk users and anonymous prototype sessions required careful thought regarding data ownership and row-level security concepts.

---

## 📁 File Structure

```text
prototype/
├── prisma/
│   ├── schema.prisma         # Database schema definitions
│   └── seed.ts               # Seed data for compliance domains/acts
├── src/
│   ├── app/                  # Next.js App Router pages & API routes
│   │   ├── api/
│   │   │   ├── compliance-domains/
│   │   │   └── scans/
│   │   ├── auth/             # Clerk authentication routes
│   │   ├── dashboard/
│   │   ├── scanner/
│   │   ├── layout.tsx
│   │   └── page.tsx          # Marketing Landing Page
│   ├── components/           # Reusable React components
│   │   ├── guardian/         # Shell, sidebar, global UI
│   │   └── scanner/          # Upload UI, domain picker, polling logic
│   ├── lib/                  # Utilities, auth sessions, constants
│   ├── services/             # Core business logic (Jobs, LLM Pipelines)
│   ├── types/                # TypeScript interfaces and Zod schemas
│   ├── worker/               # BullMQ consumers
│   └── middleware.ts         # Clerk auth and route protection
├── docker-compose.yml        # Local PostgreSQL infrastructure
├── Dockerfile                # Production Node.js image
├── package.json
└── README.md
```
---
## Onboarding & Local Setup

Prerequisites
Node.js 20+

PostgreSQL (Local or via Docker)

*  **OpenAI API Key

*  **1. Environment Configuration
Copy .env.example to .env and configure your API keys (OpenAI, Clerk).

*  **2. Database Initialization
*  **Spin up the local database and apply the schema:


*  **npm install
*  **npm run db:up           # Starts Postgres on port 5433 via Docker
*  **npx prisma db push      # Pushes schema
*  **npm run db:seed         # Seeds compliance domains
*  3. Running the App (Synchronous Mode - Default)
By default, the app runs without a worker to simplify local development.

Bash
npm run dev
Access the application at http://localhost:3000.

4. Running the App (Asynchronous Worker Mode)
To test queue logic, you must have Redis running locally.

Set REDIS_URL in your .env.

Set USE_BULLMQ_IN_DEV=true and ensure COMPLIANCE_SCAN_SYNC=false.

In terminal one: npm run dev

In terminal two: npm run worker
