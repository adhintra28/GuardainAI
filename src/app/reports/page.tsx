import DashboardShell from '@/components/guardian/DashboardShell';
import { getOrCreateUserIdForScans } from '@/lib/authSession';
import { getReportRows } from '@/lib/guardianDynamicData';

export default async function ReportsPage() {
  const userId = await getOrCreateUserIdForScans();
  const rows = await getReportRows(userId);

  return (
    <DashboardShell active="reports">
      <main className="h-screen flex-1 overflow-y-auto bg-background">
        <div className="mx-auto max-w-6xl px-10 py-12">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-headline text-[2rem] font-bold leading-tight tracking-tight text-on-surface">
                Compliance reports
              </h2>
              <p className="mt-2 max-w-xl font-body text-sm text-on-surface-variant">
                Every scan job for this workspace, loaded from the database.
              </p>
            </div>
            <a
              href="/scanner"
              className="flex items-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-2.5 font-label text-sm font-medium text-on-surface shadow-[0_2px_8px_-2px_rgba(42,52,57,0.04)] hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[1.125rem]">add</span>
              New scan
            </a>
          </div>

          <div className="mb-8 flex flex-wrap items-center gap-4">
            <div className="relative max-w-sm flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[1.125rem] text-outline">
                search
              </span>
              <input
                type="search"
                placeholder="Search reports..."
                className="w-full rounded-lg border border-outline-variant/20 bg-surface-container-lowest py-2 pr-4 pl-10 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary-container"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_12px_32px_-4px_rgba(42,52,57,0.03)]">
            <div className="grid grid-cols-12 gap-4 bg-surface-container-low px-6 py-4 font-label text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant">
              <div className="col-span-3">Date &amp; time</div>
              <div className="col-span-3">Report</div>
              <div className="col-span-3">Domain</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            <div className="flex flex-col">
              {rows.length === 0 ? (
                <div className="px-6 py-12 text-center font-body text-sm text-on-surface-variant">
                  No scans yet. Start one from the Scanner.
                </div>
              ) : (
                rows.map((r) => (
                  <div
                    key={r.id}
                    className="group grid grid-cols-12 items-center gap-4 px-6 py-4 transition-colors hover:cursor-pointer hover:bg-surface-container"
                  >
                    <div className="col-span-3">
                      <p className="text-sm font-medium text-on-surface">{r.date}</p>
                      <p className="mt-0.5 font-label text-[0.6875rem] text-on-surface-variant">{r.time}</p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-sm font-medium text-on-surface">{r.title}</p>
                      <p className="mt-0.5 font-label text-[0.6875rem] text-on-surface-variant">{r.sub}</p>
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[1rem] text-outline">{r.domainIcon}</span>
                        <span className="text-sm text-on-surface">{r.domain}</span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded px-2 py-1 font-label text-[0.6875rem] font-medium ${r.statusClass}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${r.dot}`} />
                        {r.status}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
                      <a
                        href="/scanner"
                        className="rounded p-1.5 text-outline hover:bg-surface-container-highest hover:text-primary"
                        aria-label="Open scanner"
                      >
                        <span className="material-symbols-outlined text-[1.125rem]">open_in_new</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-2 flex items-center justify-between bg-surface-container-low/50 px-6 py-4">
              <p className="font-label text-[0.6875rem] text-on-surface-variant">
                {rows.length === 0 ? '0 results' : `Showing ${rows.length} result${rows.length === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>
        </div>
      </main>
    </DashboardShell>
  );
}
