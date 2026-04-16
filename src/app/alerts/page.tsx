import DashboardShell from '@/components/guardian/DashboardShell';
import { getOrCreateUserIdForScans } from '@/lib/authSession';
import { getAlertsFromScans } from '@/lib/guardianDynamicData';

export default async function AlertsPage() {
  const userId = await getOrCreateUserIdForScans();
  const alerts = await getAlertsFromScans(userId);

  return (
    <DashboardShell active="alerts">
      <main className="flex-1 overflow-y-auto bg-background p-8 md:p-12 lg:p-16">
        <header className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="mb-2 font-headline text-[2rem] font-bold leading-tight text-on-surface">Security alerts</h2>
            <p className="max-w-2xl font-body text-sm text-on-surface-variant">
              Failed compliance checks from your latest completed scans (derived from stored reports).
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-md border border-outline-variant/20 bg-surface-container-lowest px-4 py-2 font-label text-sm font-medium text-on-surface hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filter
            </button>
            <a
              href="/scanner"
              className="flex items-center gap-2 rounded-md bg-surface-container-highest px-4 py-2 font-label text-sm font-medium text-on-surface hover:bg-surface-variant"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New scan
            </a>
          </div>
        </header>

        <div className="space-y-4">
          {alerts.length === 0 ? (
            <div className="rounded-md border border-outline-variant/10 bg-surface-container-lowest p-8 text-center font-body text-sm text-on-surface-variant">
              No failed findings yet. Run a compliance scan to populate alerts.
            </div>
          ) : (
            alerts.map((a) => (
              <div
                key={a.id}
                className="ambient-shadow flex items-start gap-4 rounded-md border border-outline-variant/10 bg-surface-container-lowest p-5 transition-all hover:bg-surface-container-lowest/80"
              >
                <div className="mt-1">
                  <span className={`material-symbols-outlined ${a.iconClass}`}>warning</span>
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded px-2 py-0.5 font-label text-[0.6875rem] font-bold uppercase tracking-wide ${a.severityClass}`}
                      >
                        {a.severityLabel}
                      </span>
                      <span className="font-headline text-sm font-semibold text-on-surface">{a.title}</span>
                    </div>
                    <span className="font-label text-[0.6875rem] text-on-surface-variant">{a.timeLabel}</span>
                  </div>
                  <p className="mb-3 font-body text-sm text-on-surface-variant">{a.body}</p>
                  <div className="mb-4 flex flex-wrap items-center gap-4 font-label text-xs text-on-surface-variant">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">dns</span> {a.metaLeft}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">policy</span> {a.metaRight}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <p className="font-label text-xs text-on-surface-variant">
            {alerts.length === 0 ? '0 alerts' : `Showing ${alerts.length} alert${alerts.length === 1 ? '' : 's'}`}
          </p>
        </div>
      </main>
    </DashboardShell>
  );
}
