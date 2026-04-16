import DashboardShell from '@/components/guardian/DashboardShell';
import { getOrCreateUserIdForScans } from '@/lib/authSession';
import { getDomainCards } from '@/lib/guardianDynamicData';

export default async function DomainsPage() {
  const userId = await getOrCreateUserIdForScans();
  const cards = await getDomainCards(userId);

  return (
    <DashboardShell active="domains">
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex items-end justify-between px-8 pt-10 pb-8">
          <div>
            <h2 className="font-headline text-[2rem] font-bold leading-tight tracking-[-0.01em] text-on-surface">
              Domains
            </h2>
            <p className="mt-2 max-w-2xl font-body text-sm text-on-surface-variant">
              Compliance domains from your database, merged with your latest scan status per domain.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline-variant">
                search
              </span>
              <input
                type="search"
                placeholder="Search domains..."
                className="w-64 rounded-md border border-outline-variant/20 bg-surface-container-lowest py-2 pr-4 pl-9 font-body text-sm text-on-surface placeholder:text-outline-variant focus:border-primary focus:ring-2 focus:ring-primary-container focus:outline-none"
              />
            </div>
            <button
              type="button"
              className="rounded-md border border-outline-variant/20 bg-surface-container-lowest p-2 text-on-surface-variant hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-8 pb-12">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {cards.map((c) => (
              <div
                key={c.id}
                className="group relative rounded-md border border-outline-variant/10 bg-surface-container-lowest p-6 transition-all duration-200 hover:shadow-[0_12px_32px_-4px_rgba(42,52,57,0.06)]"
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-container text-primary">
                      <span className="material-symbols-outlined">{c.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-headline text-lg font-semibold tracking-tight text-on-surface">{c.name}</h3>
                      <p className="mt-0.5 font-label text-[0.6875rem] uppercase tracking-wide text-on-surface-variant">
                        {c.env}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 rounded-sm px-2.5 py-1 font-label text-[0.6875rem] font-medium ${c.statusClass}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                    {c.status}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-end justify-between border-b border-surface-container pb-3">
                    <span className="text-sm text-on-surface-variant">Frameworks / controls</span>
                    <span className="max-w-[55%] text-right text-sm font-medium text-on-surface">{c.frameworks}</span>
                  </div>
                  <div className="flex items-end justify-between border-b border-surface-container pb-3">
                    <span className="text-sm text-on-surface-variant">Last activity</span>
                    <span className="text-sm font-medium text-on-surface">{c.scanned}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="text-sm text-on-surface-variant">Open findings</span>
                    <span className={`text-sm font-medium ${c.findingsClass}`}>{c.findings}</span>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-2 border-t border-surface-container/50 pt-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <a
                    href="/scanner"
                    className="rounded px-3 py-1.5 text-xs font-medium text-primary hover:bg-surface-container"
                  >
                    New scan
                  </a>
                  <a
                    href="/reports"
                    className="rounded bg-surface-container-highest px-3 py-1.5 text-xs font-medium text-on-surface hover:bg-surface-dim"
                  >
                    Reports
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </DashboardShell>
  );
}
