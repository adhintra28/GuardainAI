import Link from 'next/link';
import DashboardShell from '@/components/guardian/DashboardShell';

export default function DocsPage() {
  return (
    <DashboardShell active="docs">
      <main className="flex-1 overflow-y-auto bg-background p-8 lg:p-12">
        <div className="mx-auto max-w-3xl space-y-10">
          <header className="border-b border-outline-variant/20 pb-8">
            <h1 className="font-headline text-3xl font-bold tracking-tight text-on-surface md:text-4xl">Documentation</h1>
            <p className="mt-3 font-body text-on-surface-variant">
              How to use Guardian AI in this prototype: scanner, APIs, and local setup.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-md border border-outline-variant/30 px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">home</span>
                Landing page
              </Link>
              <Link
                href="/scanner"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-dim"
              >
                <span className="material-symbols-outlined text-[18px]">document_scanner</span>
                Open scanner
              </Link>
            </div>
          </header>

          <section className="space-y-4">
            <h2 className="font-headline text-xl font-bold text-on-surface">Compliance scanner</h2>
            <p className="font-body text-sm leading-relaxed text-on-surface-variant">
              Go to <Link className="font-medium text-primary hover:underline" href="/scanner">/scanner</Link>. Choose a
              target domain, then upload PDF, plain text, Markdown, CSV, or JSON. The app runs a compliance assessment
              and shows score, risk level, and per-control findings.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-headline text-xl font-bold text-on-surface">HTTP API</h2>
            <ul className="space-y-3 font-body text-sm text-on-surface-variant">
              <li>
                <code className="rounded bg-surface-container px-1.5 py-0.5 text-on-surface">GET /api/compliance-domains</code>
                — List domains and mapped control titles (from the database).
              </li>
              <li>
                <code className="rounded bg-surface-container px-1.5 py-0.5 text-on-surface">POST /api/scans</code> —
                Multipart form: <code className="text-on-surface">domainId</code> (string) and{' '}
                <code className="text-on-surface">files</code> (one or more files). Returns{' '}
                <code className="text-on-surface">jobId</code> and status.
              </li>
              <li>
                <code className="rounded bg-surface-container px-1.5 py-0.5 text-on-surface">GET /api/scans/[jobId]</code>
                — Poll job status and read the <code className="text-on-surface">report</code> when completed.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-headline text-xl font-bold text-on-surface">Local environment</h2>
            <p className="font-body text-sm leading-relaxed text-on-surface-variant">
              Copy <code className="text-on-surface">.env.example</code> to <code className="text-on-surface">.env</code>.
              You need <code className="text-on-surface">DATABASE_URL</code> (Postgres), optional{' '}
              <code className="text-on-surface">OPENAI_API_KEY</code> for full LLM analysis, and{' '}
              <code className="text-on-surface">COMPLIANCE_SCAN_SYNC=true</code> or Redis +{' '}
              <code className="text-on-surface">npm run worker</code> for async scans. Run{' '}
              <code className="text-on-surface">npx prisma db push</code> and <code className="text-on-surface">npm run db:seed</code>{' '}
              so domains exist. With Docker: <code className="text-on-surface">npm run db:up</code> then push and seed.
            </p>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}
