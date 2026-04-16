import DashboardShell from '@/components/guardian/DashboardShell';
import { getOrCreateUserIdForScans } from '@/lib/authSession';
import { buildTrendSvgPath, getDashboardView } from '@/lib/guardianDynamicData';

export default async function DashboardPage() {
  const userId = await getOrCreateUserIdForScans();
  const view = await getDashboardView(userId);
  const trend = buildTrendSvgPath(view.trendScores);

  const scoreLabel = view.complianceScorePct != null ? `${view.complianceScorePct}%` : '—';
  const risksLabel = view.hasData ? String(view.activeRisks) : '—';
  const issuesLabel = view.hasData ? String(view.openIssues) : '—';

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
                Live metrics from your compliance scans (prototype mode — no sign-in required).
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
                <span className="font-headline text-5xl font-bold tracking-tighter text-on-surface">{scoreLabel}</span>
                <span className="flex items-center font-body text-sm text-secondary-dim">
                  <span className="material-symbols-outlined mr-1 text-[16px]">analytics</span>
                  avg. completed scans
                </span>
              </div>
            </div>
            <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_4px_24px_-4px_rgba(42,52,57,0.03)]">
              <div className="relative z-10 mb-4 flex items-start justify-between">
                <span className="font-label text-sm uppercase tracking-wider text-on-surface-variant">
                  Failed checks
                </span>
                <span className="material-symbols-outlined text-error">warning</span>
              </div>
              <div className="relative z-10 flex items-baseline gap-2">
                <span className="font-headline text-5xl font-bold tracking-tighter text-on-surface">{risksLabel}</span>
                <span className="font-body text-sm text-on-surface-variant">from latest reports</span>
              </div>
              <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-error-container/20 blur-2xl" />
            </div>
            <div className="flex flex-col justify-between rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_4px_24px_-4px_rgba(42,52,57,0.03)]">
              <div className="mb-4 flex items-start justify-between">
                <span className="font-label text-sm uppercase tracking-wider text-on-surface-variant">
                  Open issues
                </span>
                <span className="material-symbols-outlined text-secondary">bug_report</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-5xl font-bold tracking-tighter text-on-surface">{issuesLabel}</span>
                <span className="font-body text-sm text-on-surface-variant">failed findings total</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex flex-col rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_4px_24px_-4px_rgba(42,52,57,0.03)] lg:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-headline text-lg font-bold text-on-surface">Compliance trends</h3>
                <span className="font-label text-xs text-on-surface-variant">recent completed scans</span>
              </div>
              <div className="relative flex min-h-[240px] w-full items-end justify-between border-b border-surface-container-highest px-2 pt-4 pb-6">
                <div className="absolute inset-0 z-0 flex flex-col justify-between pb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-px w-full bg-surface-container-highest" />
                  ))}
                </div>
                {trend ? (
                  <svg
                    className="absolute inset-0 z-10 h-full w-full pb-6 pt-4"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <path className="opacity-20" d={trend.area} fill="url(#gradientPrimaryDyn)" />
                    <path
                      className="opacity-80"
                      d={trend.line}
                      fill="none"
                      stroke="#515f74"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                    {trend.points.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r={1.2} className="fill-primary" vectorEffect="non-scaling-stroke" />
                    ))}
                    <defs>
                      <linearGradient id="gradientPrimaryDyn" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#515f74" stopOpacity="1" />
                        <stop offset="100%" stopColor="#515f74" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                ) : (
                  <p className="relative z-10 mx-auto mb-8 font-body text-sm text-on-surface-variant">
                    Complete at least two scans to see a score trend.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6 lg:col-span-1">
              <div className="relative overflow-hidden rounded-xl border border-primary-container/50 bg-primary-container/30 p-5">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <span className="material-symbols-outlined text-6xl text-primary">auto_awesome</span>
                </div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
                  <h4 className="font-headline text-sm font-bold text-on-surface">Latest scan summary</h4>
                </div>
                <p className="relative z-10 font-body text-sm leading-relaxed text-on-surface-variant">
                  {view.insightSummary ?? 'Run a scan from the Scanner to populate this panel.'}
                </p>
                {view.insightTarget ? (
                  <p className="relative z-10 mt-2 font-body text-sm text-on-surface">
                    Notable control: <span className="font-medium">{view.insightTarget}</span>
                  </p>
                ) : null}
                <a
                  href="/scanner"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-dim"
                >
                  New scan <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </a>
              </div>

              <div className="flex-1 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_4px_24px_-4px_rgba(42,52,57,0.03)]">
                <h4 className="mb-4 font-headline text-sm font-bold text-on-surface">Recent activity</h4>
                <div className="space-y-4">
                  {view.recentActivity.length === 0 ? (
                    <p className="font-body text-sm text-on-surface-variant">No scan activity yet.</p>
                  ) : (
                    view.recentActivity.map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${item.dotClass}`} />
                        <div>
                          <p className="font-body text-sm leading-tight text-on-surface">{item.message}</p>
                          <p className="mt-1 font-label text-xs text-on-surface-variant">{item.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <a
                  href="/reports"
                  className="mt-4 flex w-full items-center justify-center rounded-lg border border-outline-variant/30 py-2 text-xs font-medium text-on-surface hover:bg-surface-container"
                >
                  View reports
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DashboardShell>
  );
}
