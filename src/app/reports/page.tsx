import DashboardShell from '@/components/guardian/DashboardShell';

const rows = [
  {
    date: 'Oct 24, 2023',
    time: '14:32 UTC',
    title: 'SOC 2 Annual Audit',
    sub: 'Comprehensive Scan',
    domainIcon: 'language' as const,
    domain: 'app.guardian.ai',
    status: 'Passed',
    statusClass: 'bg-primary-container text-on-primary-container',
    dot: 'bg-primary',
  },
  {
    date: 'Oct 21, 2023',
    time: '09:15 UTC',
    title: 'Infrastructure Review',
    sub: 'Vulnerability Assessment',
    domainIcon: 'dns' as const,
    domain: 'eu-west-1.aws',
    status: '3 Critical',
    statusClass: 'bg-error-container text-on-error-container',
    dot: 'bg-error',
  },
  {
    date: 'Oct 18, 2023',
    time: '16:45 UTC',
    title: 'GDPR Data Mapping',
    sub: 'Privacy Impact',
    domainIcon: 'storage' as const,
    domain: 'db-prod-main',
    status: 'In Progress',
    statusClass: 'bg-surface-container-highest text-on-surface',
    dot: 'bg-outline',
  },
  {
    date: 'Oct 15, 2023',
    time: '11:00 UTC',
    title: 'ISO 27001 Readiness',
    sub: 'Gap Analysis',
    domainIcon: 'corporate_fare' as const,
    domain: 'Internal Systems',
    status: 'Passed',
    statusClass: 'bg-primary-container text-on-primary-container',
    dot: 'bg-primary',
  },
];

export default function ReportsPage() {
  return (
    <DashboardShell active="reports">
      <main className="h-screen flex-1 overflow-y-auto bg-background">
        <div className="mx-auto max-w-6xl px-10 py-12">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-headline text-[2rem] font-bold leading-tight tracking-tight text-on-surface">
                Compliance Reports
              </h2>
              <p className="mt-2 max-w-xl font-body text-sm text-on-surface-variant">
                Review historical scan data, track framework adherence, and generate audit-ready documentation
                across all connected domains.
              </p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-2.5 font-label text-sm font-medium text-on-surface shadow-[0_2px_8px_-2px_rgba(42,52,57,0.04)] hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[1.125rem]">download</span>
              Export Report
            </button>
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
            <div className="flex items-center gap-3">
              <select className="appearance-none rounded-lg border border-outline-variant/20 bg-surface-container-lowest bg-[length:1em_1em] bg-[right_0.75rem_center] bg-no-repeat px-4 py-2 pr-10 text-sm text-on-surface-variant shadow-[0_2px_8px_-2px_rgba(42,52,57,0.02)] focus:border-primary focus:ring-2 focus:ring-primary-container">
                <option>All Frameworks</option>
                <option>SOC 2 Type II</option>
                <option>ISO 27001</option>
                <option>GDPR</option>
              </select>
              <select className="appearance-none rounded-lg border border-outline-variant/20 bg-surface-container-lowest px-4 py-2 pr-10 text-sm text-on-surface-variant shadow-[0_2px_8px_-2px_rgba(42,52,57,0.02)] focus:border-primary focus:ring-2 focus:ring-primary-container">
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>This Year</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_12px_32px_-4px_rgba(42,52,57,0.03)]">
            <div className="grid grid-cols-12 gap-4 bg-surface-container-low px-6 py-4 font-label text-[0.6875rem] font-semibold uppercase tracking-wider text-on-surface-variant">
              <div className="col-span-3">Date & Time</div>
              <div className="col-span-3">Report Type</div>
              <div className="col-span-3">Target Domain</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            <div className="flex flex-col">
              {rows.map((r) => (
                <div
                  key={r.date + r.title}
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
                    <button
                      type="button"
                      className="rounded p-1.5 text-outline hover:bg-surface-container-highest hover:text-primary"
                    >
                      <span className="material-symbols-outlined text-[1.125rem]">more_vert</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-between bg-surface-container-low/50 px-6 py-4">
              <p className="font-label text-[0.6875rem] text-on-surface-variant">Showing 1 to 4 of 24 results</p>
              <div className="flex items-center gap-1">
                <button type="button" className="p-1 text-outline hover:text-on-surface disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-[1.125rem]">chevron_left</span>
                </button>
                <button type="button" className="p-1 text-outline hover:text-on-surface">
                  <span className="material-symbols-outlined text-[1.125rem]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </DashboardShell>
  );
}
