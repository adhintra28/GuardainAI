import DashboardShell from '@/components/guardian/DashboardShell';

export default function SolutionsPage() {
  return (
    <DashboardShell active="solutions">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-lowest px-6 py-3 shadow-[0_4px_24px_-4px_rgba(42,52,57,0.04)] md:hidden">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl text-primary">shield</span>
          <span className="font-headline text-lg font-bold tracking-tighter text-on-surface">Guardian AI</span>
        </div>
        <button type="button" className="text-on-surface-variant hover:text-on-surface" aria-label="Menu">
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 overflow-y-auto px-6 py-12 md:py-20">
        <section className="flex max-w-2xl flex-col gap-4 border-l-0 pl-0 md:border-l-4 md:border-transparent md:pl-8">
          <p className="font-label text-sm font-semibold uppercase tracking-wider text-primary">Solutions Archive</p>
          <h2 className="font-headline text-4xl font-extrabold leading-tight tracking-tight text-on-surface md:text-5xl">
            Enterprise Core Services
          </h2>
          <p className="max-w-xl font-body text-base leading-relaxed text-on-surface-variant md:text-lg">
            Rigorous, automated frameworks designed to enforce compliance and mitigate operational risk at scale.
          </p>
        </section>

        <section className="grid auto-rows-min grid-cols-1 gap-6 md:grid-cols-12">
          <div className="group relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-[0_4px_24px_-4px_rgba(42,52,57,0.03)] transition-all duration-300 hover:shadow-[0_12px_32px_-4px_rgba(42,52,57,0.08)] md:col-span-8 md:p-10">
            <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary-container/30 blur-3xl transition-transform duration-500 group-hover:scale-110" />
            <div className="relative z-10 mb-8 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded bg-surface-container">
                <span className="material-symbols-outlined text-2xl text-primary">radar</span>
              </div>
              <span className="rounded-full bg-surface-container-high px-3 py-1 font-label text-xs text-on-surface-variant">
                Core Offering
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="mb-3 font-headline text-2xl font-bold tracking-tight text-on-surface">Continuous Monitoring</h3>
              <p className="mb-6 max-w-lg font-body text-sm leading-relaxed text-on-surface-variant md:text-base">
                Real-time telemetry and state analysis across all infrastructure layers. Detect anomalies and enforce policy
                adherence without manual intervention.
              </p>
              <a href="/scanner" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-on-surface">
                View Technical Specs <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>

          <div className="group flex flex-col justify-between rounded-lg bg-surface-container-low p-8 transition-all duration-300 hover:bg-surface-container md:col-span-4">
            <div className="mb-8 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-surface-container-highest">
                <span className="material-symbols-outlined text-xl text-on-surface">troubleshoot</span>
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-headline text-xl font-semibold text-on-surface">Risk Assessment</h3>
              <p className="mb-6 font-body text-sm leading-relaxed text-on-surface-variant">
                Quantifiable vulnerability scoring mapped against industry benchmarks (SOC2, ISO27001).
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors group-hover:text-primary">
                Explore Metrics{' '}
                <span className="material-symbols-outlined text-sm opacity-0 transition-all duration-200 group-hover:ml-0 group-hover:opacity-100">
                  arrow_forward
                </span>
              </span>
            </div>
          </div>

          <div className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-[0_4px_24px_-4px_rgba(42,52,57,0.03)] transition-all duration-300 hover:shadow-[0_12px_32px_-4px_rgba(42,52,57,0.08)] md:col-span-5">
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-secondary-container/30 blur-3xl" />
            <div className="relative z-10 mb-8 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-secondary-container text-secondary">
                <span className="material-symbols-outlined text-xl">fact_check</span>
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="mb-2 font-headline text-xl font-semibold text-on-surface">Automated Audits</h3>
              <p className="mb-6 font-body text-sm leading-relaxed text-on-surface-variant">
                Programmatic extraction of evidence artifacts. Reduce audit preparation time by 80% through deterministic
                logging.
              </p>
              <a href="/reports" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface">
                Documentation <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>

          <div className="group flex flex-col overflow-hidden rounded-lg bg-surface-container md:col-span-7 md:flex-row">
            <div className="relative min-h-[200px] md:min-h-full md:w-1/2">
              <img
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-80 grayscale mix-blend-multiply transition-all duration-500 group-hover:grayscale-0"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA0Ek49p262oVGPbecRxjM0tBMMPHDOZW082wt0Ooze9YPH2QmB6CM2JEZRvGrrXQZtB97A0LwnU3gzb0pLMnOidoM--pz-njqh1BE4e23NEKM9-rjpmH_BggZmNDwSdn0tAUEjcoHtmpkEGZQr-hymyPeTuSe9QWusgqJUXNkl8YNHBREZLhd4kffuXMvQGqnHz79Zc3elr68keMFNHo-clqV6vJ-4d6P7BIyxxRVL3-XwPsMEbTKY7kajvbQMm-dRi1c-ZRav7CD"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
            </div>
            <div className="flex flex-col justify-center bg-surface-container-low p-8 md:w-1/2">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded bg-surface-container-highest">
                <span className="material-symbols-outlined text-xl text-on-surface">architecture</span>
              </div>
              <h3 className="mb-2 font-headline text-xl font-semibold text-on-surface">Strategic Consulting</h3>
              <p className="mb-6 font-body text-sm leading-relaxed text-on-surface-variant">
                Expert guidance on compliance architecture and remediation strategies for complex enterprise environments.
              </p>
              <a href="/about" className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface">
                Connect with Experts <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </a>
            </div>
          </div>
        </section>

        <section className="mt-8 flex flex-col items-start justify-between gap-6 border-t border-surface-container-high pt-12 md:flex-row md:items-center">
          <div>
            <h4 className="font-headline text-lg font-semibold text-on-surface">Ready to formalize your compliance posture?</h4>
            <p className="mt-1 text-sm text-on-surface-variant">Initiate a secure environment scan today.</p>
          </div>
          <a
            href="/scanner"
            className="flex items-center gap-2 whitespace-nowrap rounded bg-primary px-6 py-3 font-medium text-on-primary shadow-sm hover:bg-primary-dim"
          >
            Initialize Scan <span className="material-symbols-outlined text-sm">play_arrow</span>
          </a>
        </section>
      </main>
    </DashboardShell>
  );
}
