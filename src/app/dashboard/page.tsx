import DashboardShell from '@/components/guardian/DashboardShell';

export default function DashboardPage() {
  return (
    <DashboardShell active="dashboard">
      <main className="flex-1 overflow-y-auto bg-background p-8 lg:p-12">
        <div className="mx-auto max-w-7xl space-y-10">
          <header className="flex items-end justify-between border-b border-transparent pb-4 shadow-[0_1px_0_0_rgba(169,180,185,0.2)]">
            <div>
              <h2 className="font-headline text-[2rem] font-bold leading-tight tracking-[-0.01em] text-on-surface">
                Overview
              </h2>
              <p className="mt-1 font-body text-sm text-on-surface-variant">
                Real-time compliance posture and active risks across all domains.
              </p>
            </div>
            <button
              type="button"
              className="rounded-lg bg-surface-container-highest px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low"
            >
              Export Report
            </button>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex flex-col justify-between rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_4px_24px_-4px_rgba(42,52,57,0.03)]">
              <div className="mb-4 flex items-start justify-between">
                <span className="font-label text-sm uppercase tracking-wider text-on-surface-variant">
                  Compliance Score
                </span>
                <span className="material-symbols-outlined text-primary">verified_user</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-5xl font-bold tracking-tighter text-on-surface">84%</span>
                <span className="flex items-center font-body text-sm text-secondary-dim">
                  <span className="material-symbols-outlined mr-1 text-[16px]">trending_up</span>
                  +2% this week
                </span>
              </div>
            </div>
            <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_4px_24px_-4px_rgba(42,52,57,0.03)]">
              <div className="relative z-10 mb-4 flex items-start justify-between">
                <span className="font-label text-sm uppercase tracking-wider text-on-surface-variant">
                  Active Risks
                </span>
                <span className="material-symbols-outlined text-error">warning</span>
              </div>
              <div className="relative z-10 flex items-baseline gap-2">
                <span className="font-headline text-5xl font-bold tracking-tighter text-on-surface">12</span>
                <span className="font-body text-sm text-on-surface-variant">requires attention</span>
              </div>
              <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-error-container/20 blur-2xl" />
            </div>
            <div className="flex flex-col justify-between rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_4px_24px_-4px_rgba(42,52,57,0.03)]">
              <div className="mb-4 flex items-start justify-between">
                <span className="font-label text-sm uppercase tracking-wider text-on-surface-variant">
                  Open Issues
                </span>
                <span className="material-symbols-outlined text-secondary">bug_report</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-5xl font-bold tracking-tighter text-on-surface">5</span>
                <span className="font-body text-sm text-on-surface-variant">pending review</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex flex-col rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_4px_24px_-4px_rgba(42,52,57,0.03)] lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-headline text-lg font-bold text-on-surface">Compliance Trends</h3>
                <select className="rounded-lg border-none bg-surface-container px-3 py-1.5 font-body text-sm text-on-surface focus:ring-2 focus:ring-primary">
                  <option>Last 30 Days</option>
                  <option>Last Quarter</option>
                  <option>Year to Date</option>
                </select>
              </div>
              <div className="relative flex min-h-[240px] w-full items-end justify-between border-b border-surface-container-highest px-2 pt-4 pb-6">
                <div className="absolute inset-0 z-0 flex flex-col justify-between pb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-px w-full bg-surface-container-highest" />
                  ))}
                </div>
                <svg                  className="absolute inset-0 z-10 h-full w-full pb-6 pt-4"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path
                    className="opacity-80"
                    d="M0,80 C20,70 30,90 50,60 C70,30 80,40 100,20"
                    fill="none"
                    stroke="#515f74"
                    strokeWidth="2"
                  />
                  <path
                    className="opacity-20"
                    d="M0,80 C20,70 30,90 50,60 C70,30 80,40 100,20 L100,100 L0,100 Z"
                    fill="url(#gradientPrimary)"
                  />
                  <defs>
                    <linearGradient id="gradientPrimary" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#515f74" stopOpacity="1" />
                      <stop offset="100%" stopColor="#515f74" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute bottom-[20%] left-0 z-20 h-2 w-2 rounded-full bg-primary" />
                <div className="absolute bottom-[30%] left-[20%] z-20 h-2 w-2 rounded-full bg-primary" />
                <div className="absolute bottom-[10%] left-[30%] z-20 h-2 w-2 rounded-full bg-primary" />
                <div className="absolute bottom-[40%] left-[50%] z-20 h-2 w-2 rounded-full bg-primary" />
                <div className="absolute bottom-[80%] left-[100%] z-20 ml-[-8px] h-2 w-2 rounded-full border-2 border-primary bg-surface-container-lowest" />
                <div className="absolute bottom-0 left-0 z-20 flex w-full justify-between px-2 font-label text-[10px] text-on-surface-variant">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:col-span-1">
              <div className="relative overflow-hidden rounded-xl border border-primary-container/50 bg-primary-container/30 p-5">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-6xl text-primary">auto_awesome</span>
                </div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
                  <h4 className="font-headline text-sm font-bold text-on-surface">AI Insights</h4>
                </div>
                <p className="relative z-10 font-body text-sm leading-relaxed text-on-surface-variant">
                  Anomaly detected in <span className="font-medium text-on-surface">auth-service-v2</span>.
                  Configuration drift suggests a missing security patch applied in previous deployments.
                  Recommended action: Trigger deep scan.
                </p>
                <button
                  type="button"
                  className="mt-4 flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dim"
                >
                  Review Details <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>

              <div className="flex-1 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_4px_24px_-4px_rgba(42,52,57,0.03)]">
                <h4 className="mb-4 font-headline text-sm font-bold text-on-surface">Recent Activity</h4>
                <div className="space-y-4">
                  {[
                    ['bg-error', 'Critical vulnerability found in legacy-api.', '2 mins ago'],
                    ['bg-secondary', 'SOC2 compliance scan completed successfully.', '1 hour ago'],
                    ['bg-outline-variant', 'System admin updated firewall rulesets.', '3 hours ago'],
                    ['bg-outline-variant', 'New user provisioned: jdoe@company.com.', 'Yesterday'],
                  ].map(([dot, msg, time], i) => (
                    <div key={i} className="flex gap-3">
                      <div className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${dot}`} />
                      <div>
                        <p className="font-body text-sm leading-tight text-on-surface">{msg}</p>
                        <p className="mt-1 font-label text-xs text-on-surface-variant">{time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-4 w-full rounded-lg border border-outline-variant/30 py-2 text-xs font-medium text-on-surface hover:bg-surface-container"
                >
                  View All Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DashboardShell>
  );
}
