import DashboardShell from '@/components/guardian/DashboardShell';

export default function FrameworksPage() {
  return (
    <DashboardShell active="frameworks">
      <main className="relative flex-1 overflow-y-auto bg-surface">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-lowest px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary font-headline text-xs font-bold text-on-primary">
              G
            </div>
            <span className="font-headline font-bold tracking-tight text-on-surface">Guardian AI</span>
          </div>
          <button type="button" className="text-on-surface-variant">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 md:py-12">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="mb-2 font-headline text-3xl font-extrabold tracking-tight text-on-surface">
                Compliance Frameworks
              </h2>
              <p className="max-w-2xl font-body text-sm text-on-surface-variant">
                Manage and track your organization&apos;s adherence to global security standards and privacy regulations.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                className="ghost-border flex items-center gap-2 rounded-md bg-surface-container-lowest px-4 py-2 font-body text-sm font-medium text-on-surface hover:bg-surface-container-highest"
              >
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Filter
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-body text-sm font-medium text-on-primary hover:bg-primary-dim"
              >
                <span className="material-symbols-outlined text-[18px]">library_add</span>
                Add Framework
              </button>
            </div>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="ghost-border ambient-shadow relative overflow-hidden rounded-lg bg-surface-container-lowest p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-primary">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <span className="rounded bg-primary-fixed-dim px-2 py-1 text-xs font-semibold text-primary">
                  Overall Posture
                </span>
              </div>
              <h3 className="mb-1 font-headline text-4xl font-extrabold text-on-surface">87%</h3>
              <p className="font-body text-sm text-on-surface-variant">Total Compliance Score</p>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
                <div className="h-full w-[87%] rounded-full bg-primary" />
              </div>
            </div>
            <div className="ghost-border ambient-shadow rounded-lg bg-surface-container-lowest p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-container text-on-error-container">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <span className="rounded bg-error-container px-2 py-1 text-xs font-semibold text-on-error-container">
                  Action Needed
                </span>
              </div>
              <h3 className="mb-1 font-headline text-4xl font-extrabold text-on-surface">12</h3>
              <p className="font-body text-sm text-on-surface-variant">Failing Controls</p>
              <a href="/alerts" className="mt-4 inline-block text-xs font-medium text-primary hover:underline">
                View critical alerts →
              </a>
            </div>
            <div className="ghost-border ambient-shadow rounded-lg bg-surface-container-lowest p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-secondary">
                  <span className="material-symbols-outlined">track_changes</span>
                </div>
              </div>
              <h3 className="mb-1 font-headline text-4xl font-extrabold text-on-surface">4</h3>
              <p className="font-body text-sm text-on-surface-variant">Active Frameworks</p>
              <div className="mt-4 flex gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-outline" />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="mb-6 border-b border-outline-variant/20 pb-4 font-headline text-xl font-bold tracking-tight text-on-surface">
              Active Frameworks
            </h3>

            <div className="ghost-border overflow-hidden rounded-lg bg-surface-container-lowest">
              <div className="flex cursor-pointer flex-col justify-between gap-4 border-b border-outline-variant/10 p-6 hover:bg-surface-bright md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-surface-container font-headline text-lg font-bold text-primary">
                    EU
                  </div>
                  <div>
                    <h4 className="font-headline text-lg font-bold text-on-surface">GDPR</h4>
                    <p className="font-body text-sm text-on-surface-variant">General Data Protection Regulation</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between gap-8 md:w-auto md:justify-end">
                  <div className="flex flex-col items-end">
                    <span className="font-headline text-2xl font-bold text-on-surface">92%</span>
                    <span className="font-label text-xs text-on-surface-variant">Compliant</span>
                  </div>
                  <span className="material-symbols-outlined rotate-180 text-outline transition-transform">expand_more</span>
                </div>
              </div>
              <div className="bg-surface-bright p-0">
                <div className="flex items-center justify-between border-b border-outline-variant/10 bg-surface-container-low px-6 py-4">
                  <h5 className="font-headline text-sm font-semibold uppercase tracking-wider text-on-surface">
                    Key Controls
                  </h5>
                  <button type="button" className="text-xs font-medium text-primary hover:text-primary-dim">
                    View Full Report
                  </button>
                </div>
                <div className="divide-y divide-outline-variant/10">
                  <div className="flex items-start gap-4 p-6">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-container text-primary">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                    <div className="flex-1">
                      <h6 className="mb-1 text-sm font-semibold text-on-surface">
                        Data Processing Agreements (Article 28)
                      </h6>
                      <p className="mb-3 font-body text-sm text-on-surface-variant">
                        Ensure active DPAs are in place with all third-party sub-processors.
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-surface-container text-on-surface-variant">
                          Vendor Mgmt
                        </span>
                        <span className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-primary-container text-primary">
                          Passed
                        </span>
                      </div>
                    </div>
                    <button type="button" className="text-outline hover:text-on-surface">
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                  </div>
                  <div className="flex items-start gap-4 bg-error-container/5 p-6">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-error-container text-on-error-container">
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </div>
                    <div className="flex-1">
                      <h6 className="mb-1 text-sm font-semibold text-on-surface">Data Subject Access Requests (DSAR)</h6>
                      <p className="mb-3 font-body text-sm text-on-surface-variant">
                        Automated workflow for responding to user data deletion requests within 30 days is failing on
                        legacy database nodes.
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-surface-container text-on-surface-variant">
                          Privacy
                        </span>
                        <span className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-error-container text-on-error-container">
                          Action Req
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ghost-border rounded px-3 py-1.5 text-xs font-medium text-on-surface hover:bg-surface-container"
                    >
                      Review
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="ghost-border overflow-hidden rounded-lg bg-surface-container-lowest">
              <div className="flex cursor-pointer flex-col justify-between gap-4 p-6 hover:bg-surface-bright md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-surface-container font-headline text-lg font-bold text-primary">
                    US
                  </div>
                  <div>
                    <h4 className="font-headline text-lg font-bold text-on-surface">HIPAA</h4>
                    <p className="font-body text-sm text-on-surface-variant">
                      Health Insurance Portability and Accountability Act
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between gap-8 md:w-auto md:justify-end">
                  <div className="flex flex-col items-end">
                    <span className="font-headline text-2xl font-bold text-on-surface">100%</span>
                    <span className="font-label text-xs text-on-surface-variant">Compliant</span>
                  </div>
                  <span className="material-symbols-outlined text-outline transition-transform">expand_more</span>
                </div>
              </div>
            </div>

            <div className="ghost-border overflow-hidden rounded-lg bg-surface-container-lowest">
              <div className="flex cursor-pointer flex-col justify-between gap-4 p-6 hover:bg-surface-bright md:flex-row md:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-surface-container font-headline text-lg font-bold text-primary">
                    ISO
                  </div>
                  <div>
                    <h4 className="font-headline text-lg font-bold text-on-surface">ISO 27001</h4>
                    <p className="font-body text-sm text-on-surface-variant">Information Security Management System</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between gap-8 md:w-auto md:justify-end">
                  <div className="flex flex-col items-end">
                    <span className="font-headline text-2xl font-bold text-on-surface">64%</span>
                    <span className="font-label text-xs text-error">In Progress</span>
                  </div>
                  <span className="material-symbols-outlined text-outline transition-transform">expand_more</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DashboardShell>
  );
}
