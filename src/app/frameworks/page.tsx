import DashboardShell from '@/components/guardian/DashboardShell';
import { getOrCreateUserIdForScans } from '@/lib/authSession';
import { getFrameworksView } from '@/lib/guardianDynamicData';

export default async function FrameworksPage() {
  const userId = await getOrCreateUserIdForScans();
  const fw = await getFrameworksView(userId);

  const overall = fw.overallPct != null ? `${fw.overallPct}%` : '—';

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
                Compliance frameworks
              </h2>
              <p className="max-w-2xl font-body text-sm text-on-surface-variant">
                Domains and controls from your database, with scores from the latest completed scan per domain.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/scanner"
                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-body text-sm font-medium text-on-primary hover:bg-primary-dim"
              >
                <span className="material-symbols-outlined text-[18px]">document_scanner</span>
                Run scan
              </a>
            </div>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="ghost-border ambient-shadow relative overflow-hidden rounded-lg bg-surface-container-lowest p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-primary">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <span className="rounded bg-primary-fixed-dim px-2 py-1 text-xs font-semibold text-primary">
                  Overall posture
                </span>
              </div>
              <h3 className="mb-1 font-headline text-4xl font-extrabold text-on-surface">{overall}</h3>
              <p className="font-body text-sm text-on-surface-variant">Avg. score (scanned domains)</p>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: fw.overallPct != null ? `${Math.min(fw.overallPct, 100)}%` : '0%' }}
                />
              </div>
            </div>
            <div className="ghost-border ambient-shadow rounded-lg bg-surface-container-lowest p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-container text-on-error-container">
                  <span className="material-symbols-outlined">warning</span>
                </div>
                <span className="rounded bg-error-container px-2 py-1 text-xs font-semibold text-on-error-container">
                  Action needed
                </span>
              </div>
              <h3 className="mb-1 font-headline text-4xl font-extrabold text-on-surface">{fw.failingControls}</h3>
              <p className="font-body text-sm text-on-surface-variant">Failing control checks (latest scans)</p>
              <a href="/alerts" className="mt-4 inline-block text-xs font-medium text-primary hover:underline">
                View alerts →
              </a>
            </div>
            <div className="ghost-border ambient-shadow rounded-lg bg-surface-container-lowest p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-secondary">
                  <span className="material-symbols-outlined">track_changes</span>
                </div>
              </div>
              <h3 className="mb-1 font-headline text-4xl font-extrabold text-on-surface">{fw.activeCount}</h3>
              <p className="font-body text-sm text-on-surface-variant">Domains in catalog</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="mb-6 border-b border-outline-variant/20 pb-4 font-headline text-xl font-bold tracking-tight text-on-surface">
              Domains
            </h3>

            {fw.domains.map((d) => (
              <div key={d.id} className="ghost-border overflow-hidden rounded-lg bg-surface-container-lowest">
                <div className="flex flex-col justify-between gap-4 border-b border-outline-variant/10 p-6 md:flex-row md:items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-surface-container font-headline text-lg font-bold text-primary">
                      {d.initials}
                    </div>
                    <div>
                      <h4 className="font-headline text-lg font-bold text-on-surface">{d.label}</h4>
                      <p className="font-body text-sm text-on-surface-variant">{d.description}</p>
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-end gap-1 md:w-auto">
                    <span className="font-headline text-2xl font-bold text-on-surface">
                      {d.scorePct != null ? `${d.scorePct}%` : '—'}
                    </span>
                    <span
                      className={`font-label text-xs ${
                        d.scoreHint === 'Action needed' ? 'text-error' : 'text-on-surface-variant'
                      }`}
                    >
                      {d.scoreHint}
                    </span>
                  </div>
                </div>
                <div className="bg-surface-bright p-0">
                  <div className="flex items-center justify-between border-b border-outline-variant/10 bg-surface-container-low px-6 py-4">
                    <h5 className="font-headline text-sm font-semibold uppercase tracking-wider text-on-surface">
                      Sample controls
                    </h5>
                    <a href="/reports" className="text-xs font-medium text-primary hover:text-primary-dim">
                      Reports
                    </a>
                  </div>
                  <div className="divide-y divide-outline-variant/10">
                    {d.acts.length === 0 ? (
                      <div className="p-6 font-body text-sm text-on-surface-variant">No controls mapped in seed data.</div>
                    ) : (
                      d.acts.map((act) => (
                        <div
                          key={act.title}
                          className={`flex items-start gap-4 p-6 ${act.ok === false ? 'bg-error-container/5' : ''}`}
                        >
                          <div
                            className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                              act.ok == null
                                ? 'bg-surface-container text-on-surface-variant'
                                : act.ok
                                  ? 'bg-primary-container text-primary'
                                  : 'bg-error-container text-on-error-container'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {act.ok == null ? 'remove' : act.ok ? 'check' : 'close'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h6 className="mb-1 text-sm font-semibold text-on-surface">{act.title}</h6>
                            <p className="mb-3 font-body text-sm text-on-surface-variant">{act.detail}</p>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-surface-container text-on-surface-variant">
                                Control
                              </span>
                              <span
                                className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                                  act.ok == null
                                    ? 'bg-surface-container-highest text-on-surface'
                                    : act.ok
                                      ? 'bg-primary-container text-primary'
                                      : 'bg-error-container text-on-error-container'
                                }`}
                              >
                                {act.ok == null ? 'Unknown' : act.ok ? 'Passed' : 'Action req.'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </DashboardShell>
  );
}
