# Compliance Auditor

Compliance Auditor is a full-stack document analysis app for GST invoices and bills of lading. Users authenticate, upload one or both documents, and receive an AI-assisted compliance report with a score, risk level, detected issues, and remediation guidance.

## Current Project Status

The repository currently includes:

- A protected Next.js dashboard at `/` for authenticated users.
- A dedicated auth experience at `/auth` with email/password login, signup, email OTP login, and Google/GitHub OAuth.
- JWT-based session handling with access and refresh cookies.
- Prisma-backed persistence for users, auth state, analysis jobs, reports, and issues.
- A BullMQ + Redis job pipeline for async document analysis.
- OpenAI-powered extraction and reasoning layered on top of deterministic validation rules.
- Docker support for local Postgres, Redis, the Next.js app, and two worker containers.

## What The App Does

1. A user signs in through local auth, email OTP, or Supabase-backed OAuth.
2. The dashboard accepts invoice and bill of lading uploads in `PDF`, `PNG`, or `JPG` format.
3. `POST /api/analyze` stores an idempotent job and enqueues work in Redis.
4. The worker extracts structured data from the documents, validates invoice and B/L rules, then performs cross-document checks when both files are present.
5. If issues are found, an AI reasoning step adds explanations and suggestions.
6. The API returns either an immediate report or a queued `jobId`, and the client polls `GET /api/analyze/[jobId]` until the job completes.

## Tech Stack

- `Next.js 16` with App Router
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `Prisma` with PostgreSQL
- `BullMQ` with Redis
- `Supabase Auth` and `@supabase/ssr`
- `OpenAI SDK`
- `pdf-parse`
- `jsonwebtoken` + `bcryptjs`

## Key Features

- Auth-gated dashboard with redirect-based route protection.
- Local accounts with password hashing and optional MFA challenge flow.
- Passwordless login via email OTP.
- Google and GitHub OAuth through Supabase.
- Idempotent analysis job creation based on uploaded file content hashes.
- Background processing with retry/backoff behavior.
- Rule-based validation plus AI-generated explanations.
- Encrypted persistence of extracted document payloads.
- Structured logging and trace IDs across API and worker paths.

## Architecture Overview

### Frontend

- `src/app/page.tsx` loads the authenticated dashboard.
- `src/app/auth/page.tsx` serves the auth experience.
- `src/components/ComplianceDashboard.tsx` handles file upload, submission, polling, and result rendering.
- `src/components/UploadZone.tsx`, `DashboardScore.tsx`, and `IssuesList.tsx` implement the main UI pieces.

### API Layer

- `src/app/api/analyze/route.ts` validates auth, accepts uploads, creates or reuses idempotent jobs, and optionally waits for fast completion.
- `src/app/api/analyze/[jobId]/route.ts` returns job status for the current user.
- `src/app/api/auth/**/route.ts` implements registration, login, MFA verification, OTP login, OAuth flows, token refresh, logout, and current-user lookup.

### Services And Workers

- `src/services/aiExtractionService.ts` parses and extracts structured document data.
- `src/services/validationEngine.ts` runs deterministic document and cross-document checks.
- `src/services/aiReasoningService.ts` enriches issues with explanations and suggestions.
- `src/services/analysisPipeline.ts` orchestrates extraction, validation, reasoning, scoring, and persistence.
- `src/worker/analyzeWorker.ts` consumes BullMQ jobs and updates analysis job state.

### Data And Infrastructure

- `prisma/schema.prisma` defines users, tokens, MFA challenges, provider accounts, jobs, reports, uploaded documents, and compliance issues.
- `src/lib/auth.ts`, `authCookies.ts`, `authSession.ts`, and `currentUser.ts` handle token signing, cookie storage, and session lookup.
- `src/lib/queue.ts` and `redis.ts` configure BullMQ.
- `src/lib/pii.ts` encrypts extracted payloads before storage.
- `docker-compose.yml` provisions Postgres, Redis, the app container, and two worker containers.

## Project Structure

```text
prototype/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   └── auth/
│   │   ├── auth/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── AuthPage.tsx
│   │   ├── ComplianceDashboard.tsx
│   │   ├── DashboardScore.tsx
│   │   ├── IssuesList.tsx
│   │   └── UploadZone.tsx
│   ├── lib/
│   ├── services/
│   ├── types/
│   └── worker/
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

## Environment Variables

Copy `.env.example` to `.env` and set:

```env
OPENAI_API_KEY="sk-your-openai-api-key-here"
PII_ENCRYPTION_KEY="replace-with-a-strong-random-secret"
JWT_ACCESS_SECRET="replace-with-a-strong-random-secret"
JWT_REFRESH_SECRET="replace-with-another-strong-random-secret"
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
DATABASE_URL="postgresql://postgres:password@localhost:5432/compliance?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/compliance?schema=public"
REDIS_URL="redis://localhost:6379"
```

### Notes

- `OPENAI_API_KEY` is required for extraction and issue reasoning.
- `PII_ENCRYPTION_KEY` is used to encrypt extracted payloads before storing them.
- `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` sign app-issued auth tokens.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` must all come from the same Supabase project.
- Configure Google and GitHub providers in Supabase if you want OAuth enabled locally.
- Set the OAuth callback URL to `/api/auth/oauth/callback`.
- When using hosted Supabase Postgres, use the pooler URL for `DATABASE_URL` and the direct connection string for `DIRECT_URL`.

## Local Development

### Prerequisites

- `Node.js 20+`
- `npm`
- A running `PostgreSQL` database
- A running `Redis` instance
- A configured `Supabase` project
- A valid `OpenAI` API key

### Option 1: Run With Docker

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` from `.env.example` and fill in all required values.

3. Start the stack:

   ```bash
   docker compose up --build
   ```

4. In another shell, apply the Prisma schema if your database is empty:

   ```bash
   npx prisma db push
   ```

5. Open [http://localhost:3000](http://localhost:3000).

### Option 2: Run App And Worker Separately

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start Postgres and Redis however you prefer.

3. Create `.env` from `.env.example`.

4. Apply the schema:

   ```bash
   npx prisma db push
   ```

5. Start the Next.js app:

   ```bash
   npm run dev
   ```

6. Start the worker in a second terminal:

   ```bash
   npm run worker
   ```

7. Visit [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev` starts the Next.js development server.
- `npm run build` builds the production app.
- `npm run start` runs the production server.
- `npm run lint` runs ESLint.
- `npm run worker` starts the BullMQ analysis worker.

## Auth API Routes

- `POST /api/auth/register` creates a local user and a matching Supabase auth user.
- `POST /api/auth/login` authenticates email/password and may return an MFA challenge.
- `POST /api/auth/verify-mfa` verifies the MFA OTP for password login.
- `POST /api/auth/otp/start` sends an email OTP.
- `POST /api/auth/otp/verify` verifies the email OTP and signs the user in.
- `GET /api/auth/oauth/google` starts Google OAuth.
- `GET /api/auth/oauth/github` starts GitHub OAuth.
- `GET /api/auth/oauth/callback` completes OAuth and issues app cookies.
- `POST /api/auth/refresh` rotates the refresh token.
- `POST /api/auth/logout` revokes the current session.
- `GET /api/auth/me` returns the current authenticated user.

## Analysis API Routes

- `POST /api/analyze` uploads one or two documents and creates or reuses an analysis job.
- `GET /api/analyze/[jobId]` returns the current job state and completed report when available.

## Data Model Summary

The current Prisma schema includes:

- `User`
- `RefreshToken`
- `MfaChallenge`
- `AuthProviderAccount`
- `AnalysisJob`
- `AnalysisReport`
- `UploadedDocument`
- `ComplianceIssue`

Enums currently in use:

- `UserRole`
- `AuthProvider`
- `JobStatus`
- `DocumentType`
- `IssueSeverity`

## Typical User Flow

1. Open `/auth`.
2. Sign up or log in.
3. Upload an invoice, a bill of lading, or both.
4. Trigger analysis.
5. Wait for immediate completion or queued background completion.
6. Review the compliance score, risk level, issue list, and recommendations.

## Known Setup Gotchas

- The app depends on both Supabase and Prisma-backed Postgres configuration, so incomplete env setup will usually fail auth before analysis.
- `POST /api/analyze` requires valid auth cookies or a bearer token.
- Background analysis will not complete unless Redis and at least one worker are running.
- OAuth flows require provider configuration in Supabase, not just local environment variables.

<img width="1600" height="731" alt="WhatsApp Image 2026-04-16 at 5 14 15 PM" src="https://github.com/user-attachments/assets/e51d787e-6007-4dee-b692-0dbb0e5c8b5f" />
<img width="1600" height="759" alt="WhatsApp Image 2026-04-16 at 5 15 55 PM" src="https://github.com/user-attachments/assets/cfc0722c-fefc-4e95-a2b8-7a7116357426" />
<img width="1578" height="819" alt="WhatsApp Image 2026-04-16 at 5 16 13 PM" src="https://github.com/user-attachments/assets/81da537c-a3b6-49bb-80f7-d9f532bd66ff" />

prototype demo:https://drive.google.com/file/d/1hSyPnS2rHhU0KTJgVbSPwikZKAQpdWk3/view?usp=drive_link

