import DashboardShell from '@/components/guardian/DashboardShell';
import { getOrCreateUserIdForScans } from '@/lib/authSession';
import { ANONYMOUS_SCAN_USER_EMAIL } from '@/lib/guardianDynamicData';
import { db } from '@/lib/db';

const subNav = ['Profile', 'Team Management', 'Billing', 'API Keys', 'Security Policies'];

function initialsFromEmail(email: string): string {
  const local = email.split('@')[0] ?? '?';
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return local.slice(0, 2).toUpperCase() || '?';
}

export default async function SettingsPage() {
  const userId = await getOrCreateUserIdForScans();
  const [user, jobCount] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    db.analysisJob.count({ where: { userId } }),
  ]);

  const email = user?.email ?? '—';
  const isAnon = email === ANONYMOUS_SCAN_USER_EMAIL;
  const roleLabel = user?.role === 'ADMIN' ? 'Administrator' : 'User';
  const memberSince = user?.createdAt
    ? user.createdAt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (
    <DashboardShell active="settings">
      <main className="flex flex-1 flex-col overflow-y-auto bg-background">
        <header className="flex-shrink-0 px-8 pt-14 pb-8 md:px-12">
          <h1 className="font-headline text-[2rem] font-semibold leading-tight tracking-[-0.01em] text-on-surface">
            Settings
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
            Workspace profile from the database. Authentication is optional in this prototype.
          </p>
        </header>

        <div className="flex flex-1 flex-col gap-16 px-8 pb-16 md:flex-row md:px-12">
          <nav className="flex w-full shrink-0 flex-row flex-wrap gap-1.5 md:w-56 md:flex-col md:pt-2">
            {subNav.map((label) => (
              <button
                key={label}
                type="button"
                className={`flex items-center justify-between rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                  label === 'Profile'
                    ? 'bg-surface-container-highest text-on-surface'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                {label}
                {label === 'Profile' && (
                  <span className="material-symbols-outlined text-[16px] text-primary">chevron_right</span>
                )}
              </button>
            ))}
          </nav>

          <section className="flex max-w-[48rem] flex-1 flex-col gap-10">
            <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-[0_12px_32px_-4px_rgba(42,52,57,0.03)]">
              <div className="mb-8 border-b border-surface-container-high pb-6">
                <h2 className="font-headline text-lg font-semibold text-on-surface">Workspace profile</h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Data loaded for the current scanning workspace user.
                </p>
              </div>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-outline-variant/20 bg-primary-container font-headline text-lg font-bold text-primary">
                    {initialsFromEmail(email)}
                  </div>
                  <div>
                    <p className="font-body text-sm text-on-surface-variant">
                      {isAnon
                        ? 'You are using the shared prototype workspace until sign-in is enabled.'
                        : 'Signed-in workspace user.'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 flex flex-col gap-2">
                    <label className="font-label text-sm font-medium text-on-surface-variant">Email</label>
                    <input
                      readOnly
                      className="w-full cursor-default rounded-md border border-outline-variant/20 bg-surface-container px-3 py-2.5 text-sm text-on-surface"
                      value={email}
                    />
                  </div>
                  <div className="col-span-2 flex flex-col gap-2">
                    <label className="font-label text-sm font-medium text-on-surface-variant">Role</label>
                    <input
                      readOnly
                      disabled
                      className="w-full cursor-not-allowed rounded-md border border-outline-variant/20 bg-surface-container px-3 py-2.5 text-sm text-on-surface-variant"
                      value={roleLabel}
                    />
                  </div>
                  <div className="col-span-2 flex flex-col gap-2">
                    <label className="font-label text-sm font-medium text-on-surface-variant">Workspace member since</label>
                    <input
                      readOnly
                      className="w-full cursor-default rounded-md border border-outline-variant/20 bg-surface-container px-3 py-2.5 text-sm text-on-surface"
                      value={memberSince}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-[0_12px_32px_-4px_rgba(42,52,57,0.03)]">
              <div className="mb-6 border-b border-surface-container-high pb-6">
                <h2 className="font-headline text-lg font-semibold text-on-surface">Workspace activity</h2>
                <p className="mt-1 text-sm text-on-surface-variant">Counts from your analysis jobs.</p>
              </div>
              <p className="font-body text-sm text-on-surface">
                Total scans: <span className="font-semibold">{jobCount}</span>
              </p>
            </div>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}
