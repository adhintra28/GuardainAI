# AI Compliance Auditor - Complete Application Scope and Architecture

## 1. Overview

This application is an AI-powered compliance auditing platform designed to analyze business documents, especially GST invoices and bills of lading, and identify compliance issues before those documents are used in downstream tax, customs, logistics, or finance workflows.

The system is built to reduce manual document review by combining:

- AI-based document data extraction
- Deterministic rule validation
- Cross-document consistency checks
- AI-generated explanations and remediation guidance
- Secure authentication and role-based access control
- Asynchronous worker-based processing for scalability

At a high level, the application lets an authenticated user upload one or two trade/compliance documents, sends those files into a background analysis pipeline, validates the extracted business data, and returns a structured compliance report with a score, risk level, issue list, and recommendations.

---

## 2. Problem Statement

Organizations that deal with trade, shipping, tax, and accounting documents often rely on manual review to confirm that paperwork is complete, mathematically correct, and internally consistent.

That manual process is slow and error-prone. Common failures include:

- Missing invoice numbers or document identifiers
- Invalid or missing GSTIN values
- Missing HSN or HS codes
- Incorrect subtotal, tax, and grand total calculations
- Weight inconsistencies in shipping documents
- Quantity mismatches between commercial and logistics documents
- Seller/shipper or buyer/consignee mismatches
- Missing container or port information

These mistakes can lead to:

- Tax filing rejection
- Customs delays
- Port holding costs
- Manual rework
- Compliance risk exposure
- Fraud suspicion

This application exists to detect those issues early and present them in a form that is understandable, auditable, and actionable.

---

## 3. Core Purpose of the Application

The platform acts as a digital compliance auditor.

Instead of only storing uploaded files, it actively interprets them and answers the following questions:

- What data exists in the uploaded invoice and bill of lading?
- Is that data complete?
- Is that data mathematically valid?
- Do the two documents agree with each other?
- What is the compliance risk if problems are found?
- What should the user do to fix each issue?

The result is a structured compliance report that helps a user decide whether a document set is safe to proceed with or must be corrected first.

---

## 4. Scope Priority Matrix

The scope you provided uses three priority levels:

- `Mandatory`: must exist for the solution to satisfy the expected baseline
- `Advantage`: important enhancements that strengthen the solution
- `Amazing`: bonus improvements that increase maturity and presentation value

The following scope items are included from your provided material.

### 4.1 Platform Security Scope

#### Mandatory

- Login
- MFA using OTP via email
- Refresh token and access token based authentication, or JWT-based session model
- Basic RBAC with at least two roles:
- General User
- Admin

#### Advantage

- Login via Google

#### Mandatory Negations / Security Constraints

- PII must not be exposed in frontend API calls
- PII must be encrypted in the database

### 4.2 Observability Scope

#### Advantage

- Logs should be displayable through an observability stack such as:
- Loki + Prometheus + Grafana
- Elasticsearch / Fluent Bit / Kibana

#### Mandatory

- Request tracing across all services
- Tracing across backend and worker async jobs

### 4.3 Scalability Scope

#### Advantage

- Event-driven architecture
- Work must be separated and should not run as an async background task inside the backend process itself
- A queue must exist, for example RabbitMQ or Redis

#### Mandatory

- All components must be dockerized
- All components must run in a single Docker network
- A single `docker-compose.yml` file should orchestrate the system
- Services must be discoverable over that Docker network

#### Amazing

- Minimum two workers running to demonstrate parallelization
- Tasks must be picked atomically
- Idempotency must be maintained
- Additional points if deployed locally in mini-kube / minikube

### 4.4 Maintainability Scope

#### Mandatory / High Importance

- Clean project structure
- `README.md` should clearly cover:
- Problem statement
- Solution
- Tech stack
- How to run
- Screenshots
- MVC should be observed
- Singleton pattern should be used for database or shared client connection management
- REST API structure should be used correctly
- Error logging should be present

---

## 5. What the Current Application Does

The current repository implements a substantial portion of this scope already.

### 5.1 User Journey

1. A user lands on the authentication page.
2. The user signs up, logs in with password plus MFA, logs in via email OTP, or uses Google/GitHub OAuth.
3. Once authenticated, the user is redirected to the compliance dashboard.
4. The user uploads:
- a GST invoice
- a bill of lading
5. The user starts analysis.
6. The backend accepts the files, authenticates the request, computes an idempotency key, and either:
- returns an already completed result for the same file combination, or
- queues a new background analysis job
7. One of the workers picks up the job from Redis/BullMQ.
8. The worker extracts structured data from the uploaded files using OpenAI.
9. The worker performs deterministic compliance checks.
10. If issues exist, an AI reasoning layer generates explanations and suggested fixes.
11. The worker calculates a compliance score and risk level.
12. The report is stored in the database and returned to the UI.
13. The dashboard renders a score panel and an issue list with explanations and remediation guidance.

---

## 6. Functional Modules

### 6.1 Authentication Module

The application supports multiple authentication paths:

- Email + password registration
- Email + password login
- MFA verification with email OTP
- Passwordless email OTP login
- Google OAuth login
- GitHub OAuth login
- Refresh token rotation
- Logout with refresh token revocation
- Session recovery through cookies

This design satisfies the scope expectation for secure login, MFA, JWT-style authentication, and RBAC.

### 6.2 Document Upload Module

The dashboard provides dedicated upload zones for:

- Invoice upload
- Bill of lading upload

Accepted file types include:

- PDF
- PNG
- JPG / JPEG

The upload flow is intentionally simple. Files are not processed on the client. They are submitted to the backend through `FormData`, which keeps the browser responsible only for collection and transfer, not for business logic.

### 6.3 Analysis API Module

The analysis API is the controller entry point for document review.

Its responsibilities are:

- Authenticate the caller
- Read uploaded files
- Generate an idempotency key from file contents
- Prevent cross-user access to an existing hash
- Reuse completed results when the same document set is submitted again
- Create a queued job if needed
- Wait briefly for fast completion
- Return a job ID for polling if background work continues

This is a good fit for a REST-driven controller in an event-driven architecture.

### 6.4 Worker / Queue Module

The worker process is separate from the Next.js API process. This is important because your scope explicitly requires that work should not simply run as a background task inside the backend itself.

The repository uses:

- Redis as the queue backend
- BullMQ as the job abstraction

Two worker containers are defined in `docker-compose.yml`, which directly supports the requirement to demonstrate parallelization.

### 6.5 AI Extraction Module

The extraction service converts raw document input into structured JSON.

For invoices, it extracts:

- invoice number
- invoice date
- seller name
- seller GSTIN
- buyer name
- buyer GSTIN
- line items
- subtotal
- tax
- grand total

For bills of lading, it extracts:

- B/L number
- shipper
- consignee
- notify party
- ports
- goods list
- weight
- container number

PDF files are first converted to text with `pdf-parse`, then passed to OpenAI for schema-constrained JSON extraction.

Image files are passed to OpenAI using image input plus a strict schema prompt.

### 6.6 Validation Engine

The validation layer applies deterministic checks instead of relying only on AI judgment.

Current invoice validations include:

- missing invoice number
- missing invoice date
- missing seller GSTIN
- invalid GSTIN length
- missing HSN codes on items
- subtotal + tax mismatch against grand total

Current bill of lading validations include:

- missing B/L number
- missing shipper or consignee
- missing HS codes on goods
- weight mismatch
- missing loading or discharge port
- missing container number

Cross-document validations include:

- quantity mismatch between invoice items and B/L goods
- seller versus shipper mismatch
- buyer versus consignee mismatch

### 6.7 AI Reasoning Module

After deterministic issues are found, the reasoning service enriches them.

For each issue it generates:

- an explanation of why it matters
- likely business or compliance consequences
- a suggestion for how to fix it

This is important because validation alone tells the user what failed, but reasoning tells the user why it matters operationally.

### 6.8 Reporting Module

The application produces a final compliance report containing:

- `compliance_score`
- `risk_level`
- `issues`
- `summary`
- `recommendation`

The score starts at 100 and is reduced by issue severity:

- `CRITICAL`: -25
- `HIGH`: -15
- `MEDIUM`: -10
- `LOW`: -5

Risk is then classified as:

- `LOW` for higher scores
- `MEDIUM` when score falls below 85
- `HIGH` when score falls below 60

### 6.9 Persistence Module

The database stores:

- users
- refresh tokens
- MFA challenges
- OAuth provider accounts
- queued analysis jobs
- final analysis reports
- uploaded document metadata
- compliance issues

This provides auditability and makes results recoverable.

---

## 7. Application Architecture

### 7.1 Architectural Style

The application follows a hybrid of:

- full-stack web application architecture
- REST API controller design
- event-driven asynchronous processing
- service-oriented internal separation
- MVC-inspired code organization

### 7.2 End-to-End Flow

#### Step 1: Authentication

The user authenticates through one of the supported methods. Successful login issues:

- a short-lived access token
- a longer-lived refresh token

Both are stored as HTTP-only cookies.

#### Step 2: Dashboard Access

Authenticated users can access the main dashboard. Unauthenticated users are redirected to `/auth`.

#### Step 3: Upload Submission

The dashboard sends selected files to `POST /api/analyze`.

#### Step 4: Idempotency and Queueing

The API calculates a SHA-256 hash from the uploaded file contents and uses it as an idempotency key.

This ensures:

- repeated submissions of the same file set do not create duplicate completed jobs
- task execution is safer under retries
- duplicate analysis cost is reduced

#### Step 5: Worker Processing

The queued job is picked by a BullMQ worker using Redis.

The worker:

- marks the job as `PROCESSING`
- reconstructs the file buffers
- runs the analysis pipeline
- stores the report
- marks the job `COMPLETED`

If an error occurs, the worker marks the job as `FAILED`.

#### Step 6: Pipeline Execution

The pipeline:

- extracts structured data
- validates invoice rules
- validates bill of lading rules
- validates cross-document rules
- enriches issues with AI explanations
- calculates compliance score and risk
- encrypts extracted data
- persists the report

#### Step 7: UI Result Rendering

The frontend either receives the result immediately or polls the job status endpoint until the report is available.

---

## 8. MVC Interpretation

Your scope explicitly asks that MVC be observed. In this repository, MVC is not implemented as old-style folders named exactly `models`, `views`, and `controllers`, but the responsibilities are clearly separated in an MVC-like way.

### Model

The model layer is represented by:

- Prisma schema models in `prisma/schema.prisma`
- shared TypeScript document/report types in `src/types/index.ts`

These define the application data contract.

### View

The view layer is represented by:

- `src/app/page.tsx`
- `src/app/auth/page.tsx`
- `src/components/ComplianceDashboard.tsx`
- `src/components/AuthPage.tsx`
- `src/components/UploadZone.tsx`
- `src/components/DashboardScore.tsx`
- `src/components/IssuesList.tsx`

These files handle UI rendering, user interaction, upload controls, score display, and issue visualization.

### Controller

The controller layer is represented by the route handlers under:

- `src/app/api/analyze/...`
- `src/app/api/auth/...`

These handlers receive requests, validate them, coordinate services, and return responses.

### Service / Domain Layer

The service layer contains most of the domain logic:

- `src/services/analysisPipeline.ts`
- `src/services/aiExtractionService.ts`
- `src/services/validationEngine.ts`
- `src/services/aiReasoningService.ts`

This separation improves maintainability and keeps controllers thin.

---

## 9. Security Design

Security is one of the strongest scope requirements, so it deserves detailed explanation.

### 9.1 Login

The platform supports:

- local email/password login
- passwordless email OTP login
- Google OAuth
- GitHub OAuth

This covers the required login requirement and also exceeds the "Google login" advantage item by additionally supporting GitHub.

### 9.2 MFA

For local password-based accounts, MFA is enabled by default at registration.

Login flow:

1. User submits email and password.
2. Password is verified against a bcrypt hash.
3. If MFA is enabled, Supabase sends an OTP email.
4. A challenge record is stored with expiry.
5. The user submits the OTP.
6. The OTP is verified through Supabase.
7. A session is issued only after successful OTP verification.

This directly satisfies the requirement for MFA using email OTP.

### 9.3 Access and Refresh Tokens

The application uses JWT-based access and refresh tokens.

- Access token lifetime: 15 minutes
- Refresh token lifetime: 7 days

Access token responsibilities:

- identify the user
- carry the role
- authorize protected API requests

Refresh token responsibilities:

- allow session continuation
- be rotated securely
- be revoked on logout or replacement

Refresh token hashes are stored in the database rather than storing raw tokens.

### 9.4 Cookie Security

Tokens are stored in cookies with:

- `httpOnly`
- `sameSite=lax`
- `secure` in production

This helps reduce token exposure to client-side JavaScript.

### 9.5 RBAC

The repository defines two roles:

- `USER`
- `ADMIN`

This matches the scope requirement for basic RBAC with General User and Admin.

Route protection includes middleware/proxy checks for:

- authenticated analysis endpoints
- admin-only API namespaces

### 9.6 PII Protection

Your scope explicitly states that PII should not be exposed in frontend API calls and should be encrypted in the database.

The current design supports that goal through:

- server-side processing of uploaded files
- encrypted persistence of extracted document payloads
- `AES-256-GCM` encryption for extracted data before storage
- a required `PII_ENCRYPTION_KEY`

This means extracted document content is not stored in plaintext when persisted as the report payload.

### 9.7 Password Security

Passwords are hashed with bcrypt before database storage.

That prevents raw passwords from being stored or compared directly.

---

## 10. Observability and Tracing

### 10.1 Structured Logging

The repository includes a structured logger that emits JSON log lines with:

- log level
- timestamp
- trace ID
- message
- optional metadata

This is useful for centralized log ingestion and later analysis.

### 10.2 Request Tracing

The app uses an async trace context built around `AsyncLocalStorage`.

Each analysis request gets a trace ID. That trace ID is then reused across:

- the API route
- the queue payload
- the worker execution
- log output

This directly satisfies the scope requirement for tracing across backend and async worker services.

### 10.3 Observability Stack Expectation

Your scope mentions log display through platforms such as:

- Loki + Prometheus + Grafana
- Elasticsearch + Fluent Bit + Kibana

The current repository lays the groundwork for that by emitting structured logs and trace IDs, but it does not yet include those observability containers in `docker-compose.yml`.

So in scope terms:

- structured logging: implemented
- trace correlation: implemented
- full log visualization stack: planned / extension point

---

## 11. Scalability Design

### 11.1 Event-Driven Processing

The application uses an event-driven approach for document analysis:

- API receives work
- API submits a job to a queue
- worker consumes the job
- result is persisted and later returned

This matches the scope requirement for event-driven architecture.

### 11.2 Separate Worker Processes

The analysis work is not performed inline inside the web server as a permanent background task.

Instead:

- Next.js handles request orchestration
- BullMQ handles queue management
- worker services execute heavy analysis

This is exactly the kind of separation your scope asks for.

### 11.3 Queue Technology

The scope allows either RabbitMQ or Redis.

This repository uses:

- Redis
- BullMQ on top of Redis

That fully satisfies the queue requirement.

### 11.4 Parallelization

Two worker containers are defined:

- `compliance-worker-1`
- `compliance-worker-2`

This demonstrates parallel processing capacity and aligns with the "minimum 2 workers" requirement.

### 11.5 Atomic Task Pickup

BullMQ and Redis provide queue semantics that support safe worker job claiming, which addresses the requirement that tasks must be picked atomically.

### 11.6 Idempotency

Idempotency is implemented by hashing uploaded document content and using the result as a unique idempotency key.

This protects the system from:

- duplicate submissions
- accidental repeated processing
- repeated analysis cost for identical input

That directly satisfies one of the "amazing" scope expectations.

### 11.7 Dockerized Components

The repository includes Docker support for:

- Postgres
- Redis
- Next.js app
- Worker 1
- Worker 2

All components are orchestrated from one `docker-compose.yml` file and communicate over Docker service names such as `postgres` and `redis`, which means service discovery on a shared Docker network is already part of the design.

### 11.8 Minikube Readiness

Your scope awards extra credit for local minikube deployment.

The repository does not currently include Kubernetes manifests, Helm charts, or minikube setup files. That means this item is currently not implemented, but the containerized architecture makes it a reasonable next step.

---

## 12. Maintainability Design

### 12.1 Clean Structure

The repository is organized into clearly separated areas:

- `src/app` for routes and pages
- `src/components` for reusable UI
- `src/lib` for infrastructure helpers
- `src/services` for business logic
- `src/worker` for async job processing
- `src/types` for domain contracts
- `prisma` for schema

This is a maintainable and scalable structure for a project of this type.

### 12.2 README Expectations

Your scope requires a README that covers:

- problem statement
- solution
- tech stack
- how to run
- screenshots

The current `README.md` already includes most of these sections, though the screenshot section is still placeholder content.

### 12.3 Singleton Pattern

The repository explicitly uses a singleton for the OpenAI client connection.

This helps:

- avoid repeated client initialization
- reduce connection overhead
- centralize configuration

For database access, Prisma also follows a safe shared-instance pattern in development using a global cached client instance.

### 12.4 REST API Design

The repository uses a REST-like route structure for authentication and analysis:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-mfa`
- `POST /api/auth/otp/start`
- `POST /api/auth/otp/verify`
- `GET /api/auth/oauth/google`
- `GET /api/auth/oauth/github`
- `GET /api/auth/oauth/callback`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/analyze`
- `GET /api/analyze/[jobId]`

This is consistent and maintainable.

### 12.5 Error Logging

The codebase contains centralized logging and explicit failure handling in:

- API routes
- worker failure hooks
- AI extraction
- AI reasoning
- report persistence

This satisfies the maintainability requirement for error logging.

---

## 13. Database Design

The Prisma schema defines the following important models.

### 13.1 `User`

Represents a user account and stores:

- email
- password hash
- role
- MFA enabled flag
- related refresh tokens
- related MFA challenges
- related analysis jobs
- linked provider accounts

### 13.2 `RefreshToken`

Stores hashed refresh tokens for secure session management and revocation.

### 13.3 `MfaChallenge`

Represents a pending MFA challenge with expiry and consumption tracking.

### 13.4 `AuthProviderAccount`

Maps local users to external providers such as:

- local auth
- Google
- GitHub
- email OTP

### 13.5 `AnalysisJob`

Tracks asynchronous analysis execution:

- user ownership
- idempotency key
- job status
- trace ID
- report payload
- encrypted extracted data
- error message

### 13.6 `AnalysisReport`

Stores finalized report details such as:

- compliance score
- risk level
- summary
- extracted data
- issue list

### 13.7 `UploadedDocument`

Stores metadata for files connected to a report.

### 13.8 `ComplianceIssue`

Stores normalized issue information tied to a report.

---

## 14. Frontend Experience

### 14.1 Authentication Screen

The authentication screen is a dedicated page that supports:

- login
- sign up
- email OTP
- Google
- GitHub

It uses a modern dark-themed UI and routes the user into the application only after authentication succeeds.

### 14.2 Dashboard Screen

The dashboard shows:

- the signed-in user identity
- the current role
- two upload zones
- a primary analysis action
- results when available

### 14.3 Upload UX

Each upload zone supports:

- click to upload
- drag and drop
- selected file preview
- removal before submission

### 14.4 Result UX

The result screen contains:

- a visual compliance score dial
- a risk-level badge
- summary text
- recommendation text
- expandable issue cards

Each issue card explains:

- the issue severity
- the issue message
- why it matters
- how to fix it

This is a strong UX for turning compliance output into user action.

---

## 15. API Surface

### 15.1 Authentication Endpoints

- `POST /api/auth/register`
  Creates a new local user, hashes the password, creates a Supabase auth user, and enables MFA by default.

- `POST /api/auth/login`
  Verifies password credentials. If MFA is enabled, starts the OTP challenge flow. Otherwise issues a session immediately.

- `POST /api/auth/verify-mfa`
  Verifies a password-login email OTP challenge and issues auth cookies.

- `POST /api/auth/otp/start`
  Starts passwordless OTP login by sending an email OTP.

- `POST /api/auth/otp/verify`
  Verifies passwordless OTP login, creates or finds the local user identity, and issues cookies.

- `GET /api/auth/oauth/google`
  Starts Google OAuth via Supabase.

- `GET /api/auth/oauth/github`
  Starts GitHub OAuth via Supabase.

- `GET /api/auth/oauth/callback`
  Exchanges the provider code, resolves the local user, and issues app session cookies.

- `POST /api/auth/refresh`
  Rotates refresh tokens and issues a new access token.

- `POST /api/auth/logout`
  Revokes the refresh token and clears cookies.

- `GET /api/auth/me`
  Returns the authenticated user profile.

### 15.2 Analysis Endpoints

- `POST /api/analyze`
  Accepts invoice and/or bill of lading uploads, enforces auth, computes idempotency, queues the job, and may return either a direct result or a queued job response.

- `GET /api/analyze/[jobId]`
  Returns the job status and report for the authenticated owner of that job.

---

## 16. Environment Variables

The application depends on the following environment variables:

- `OPENAI_API_KEY`
  Required for AI extraction and AI reasoning.

- `PII_ENCRYPTION_KEY`
  Required for encryption of extracted document data before persistence.

- `JWT_ACCESS_SECRET`
  Used to sign short-lived access tokens.

- `JWT_REFRESH_SECRET`
  Used to sign long-lived refresh tokens.

- `NEXT_PUBLIC_SUPABASE_URL`
  Supabase project URL used for auth operations.

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  Public Supabase client key.

- `SUPABASE_SERVICE_ROLE_KEY`
  Service-role key used for secure admin operations.

- `DATABASE_URL`
  Primary Prisma/Postgres connection string.

- `DIRECT_URL`
  Direct Postgres connection string, especially useful with Supabase setups.

- `REDIS_URL`
  Redis connection used by BullMQ.

---

## 17. Deployment and Runtime Topology

### 17.1 Local Docker Topology

The provided `docker-compose.yml` defines:

- `postgres`
- `redis`
- `compliance-analyzer`
- `compliance-worker-1`
- `compliance-worker-2`

This topology satisfies the main infrastructure requirement from your scope:

- single compose file
- shared Docker network
- discoverable services
- separated backend and workers
- two workers for concurrency

### 17.2 Container Build Strategy

The `Dockerfile`:

- starts from Node 20 Alpine
- installs dependencies
- copies the source
- generates Prisma client
- builds the Next.js application
- exposes port 3000
- starts the app with `npm start`

This is appropriate for the app container and reusable for worker containers with an alternate command.

---

## 18. Scope-to-Implementation Mapping

The table below is written in prose to show how the repository aligns with your provided scope.

### 18.1 Security Mapping

- Login: implemented
- MFA via email OTP: implemented
- Access token / refresh token / JWT model: implemented
- Basic RBAC with user and admin roles: implemented
- Google login: implemented
- PII not exposed in frontend logic: largely aligned through server-side handling
- PII encrypted in DB: implemented for extracted payload storage

### 18.2 Observability Mapping

- Request tracing across services: implemented
- Tracing across backend and workers: implemented
- Structured logs: implemented
- Loki/Grafana or ELK-style visualization stack: not yet provisioned in repository

### 18.3 Scalability Mapping

- Event-driven architecture: implemented
- Separate async workers instead of backend-only background jobs: implemented
- Queue using Redis: implemented
- Single compose orchestration: implemented
- Shared discoverable Docker services: implemented
- Minimum two workers: implemented
- Atomic task pickup: supported by queue design
- Idempotency: implemented
- Minikube deployment: not yet implemented

### 18.4 Maintainability Mapping

- Clean project structure: implemented
- README with major sections: mostly implemented
- MVC-style separation: implemented in practice
- Singleton/shared client pattern: implemented
- REST API structure: implemented
- Error logging: implemented

---

## 19. Gaps and Next Maturity Improvements

If the goal is to align even more strongly with the scope and move the project from strong prototype to production-ready showcase, the next high-value additions would be:

- add Loki/Grafana or ELK containers to `docker-compose.yml`
- export logs from backend and workers into the selected observability stack
- add Prometheus metrics for API latency, queue depth, worker throughput, and failure rate
- add explicit admin-only routes and admin UI capabilities
- add file-size and mime-type validation on the server side
- encrypt or securely store raw uploaded files if document retention is required
- connect persisted `UploadedDocument` and `ComplianceIssue` records more fully inside the pipeline
- add Kubernetes manifests or Helm charts for minikube deployment
- replace placeholder README screenshots with actual product screenshots
- add automated tests around auth, queueing, and validation edge cases

---

## 20. Conclusion

This application is a secure, AI-assisted compliance analysis system for trade and accounting documents. It is designed around the exact qualities highlighted in your scope:

- secure authentication
- MFA and RBAC
- PII protection
- asynchronous worker-based scalability
- dockerized multi-service deployment
- event-driven processing
- traceable execution
- maintainable project organization
- RESTful backend structure

It already demonstrates a strong architecture for a prototype or assessment project and maps well to the mandatory and advantage-level expectations you provided. The main remaining maturity steps are around full observability stack deployment, richer production hardening, and optional Kubernetes packaging.
