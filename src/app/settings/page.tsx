import DashboardShell from '@/components/guardian/DashboardShell';

const subNav = ['Profile', 'Team Management', 'Billing', 'API Keys', 'Security Policies'];

export default function SettingsPage() {
  return (
    <DashboardShell active="settings">
      <main className="flex flex-1 flex-col overflow-y-auto bg-background">
        <header className="flex-shrink-0 px-8 pt-14 pb-8 md:px-12">
          <h1 className="font-headline text-[2rem] font-semibold leading-tight tracking-[-0.01em] text-on-surface">
            Settings
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
            Manage your organization&apos;s compliance parameters, team access, and platform integrations.
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
                <h2 className="font-headline text-lg font-semibold text-on-surface">Personal Information</h2>
                <p className="mt-1 text-sm text-on-surface-variant">Update your photo and personal details here.</p>
              </div>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-outline-variant/20 bg-surface-container">
                    <img
                      alt=""
                      className="h-full w-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgAgc4XUHBCu7xRu-bDb-sO0YNdGrCPwnJwcxhQi8-8rmS1gzKGmAwKj3aPdIVx99IYkvkNETPRMLJH-Lz4gdedPfi_e2vOzRJcdymkoLhwqn2n_9X_Nmjc-qxrasr1F-LEDRBhbfkng9hru4EMswbp-3fw5ukJ4cY2UDpNsVbuY2NcY1QVVJjjGYZRgGO1i4F8JIPL_iNDsHUJIGMmks4ChTnP-o4QDc_oZlgFN9uKguLwGXAM0hSzKOUN5I2a2zYZTCBsfHrA-FK"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="rounded-md bg-surface-container-highest px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container-high"
                    >
                      Change avatar
                    </button>
                    <button
                      type="button"
                      className="rounded-md px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
                    <label className="font-label text-sm font-medium text-on-surface-variant">First Name</label>
                    <input
                      className="w-full rounded-md border border-outline-variant/20 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary-container focus:outline-none"
                      defaultValue="Alexander"
                    />
                  </div>
                  <div className="col-span-2 flex flex-col gap-2 sm:col-span-1">
                    <label className="font-label text-sm font-medium text-on-surface-variant">Last Name</label>
                    <input
                      className="w-full rounded-md border border-outline-variant/20 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary-container focus:outline-none"
                      defaultValue="Chen"
                    />
                  </div>
                  <div className="col-span-2 flex flex-col gap-2">
                    <label className="font-label text-sm font-medium text-on-surface-variant">Email Address</label>
                    <input
                      type="email"
                      className="w-full rounded-md border border-outline-variant/20 bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary-container focus:outline-none"
                      defaultValue="alexander.chen@example.com"
                    />
                  </div>
                  <div className="col-span-2 flex flex-col gap-2">
                    <label className="font-label text-sm font-medium text-on-surface-variant">Role</label>
                    <input
                      disabled
                      className="w-full cursor-not-allowed rounded-md border border-outline-variant/20 bg-surface-container px-3 py-2.5 text-sm text-on-surface-variant"
                      defaultValue="Compliance Director"
                    />
                    <p className="text-[0.6875rem] text-on-surface-variant">
                      Role modifications must be requested through a workspace administrator.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8 shadow-[0_12px_32px_-4px_rgba(42,52,57,0.03)]">
              <div className="mb-6 border-b border-surface-container-high pb-6">
                <h2 className="font-headline text-lg font-semibold text-on-surface">Communication Preferences</h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Manage how Guardian AI alerts you about compliance events.
                </p>
              </div>
              <div className="flex flex-col gap-6">
                {[
                  {
                    title: 'Critical Vulnerability Alerts',
                    desc: 'Receive immediate email notifications for CVSS 9.0+ findings.',
                    on: true,
                  },
                  {
                    title: 'Weekly Digest',
                    desc: 'A summary of framework drifts and resolved issues sent every Monday.',
                    on: true,
                  },
                  {
                    title: 'Product Updates',
                    desc: 'News about new framework support and platform features.',
                    on: false,
                  },
                ].map((row) => (
                  <div key={row.title} className="flex items-center justify-between gap-4 py-2">
                    <div>
                      <p className="text-sm font-medium text-on-surface">{row.title}</p>
                      <p className="mt-0.5 text-xs text-on-surface-variant">{row.desc}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" defaultChecked={row.on} />
                      <div className="peer-checked:bg-primary h-6 w-11 rounded-full bg-surface-container-high after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-outline-variant after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white" />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-4">
              <button
                type="button"
                className="rounded-md bg-transparent px-5 py-2.5 text-sm font-medium text-primary hover:bg-surface-container-highest"
              >
                Discard Changes
              </button>
              <button
                type="button"
                className="relative overflow-hidden rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-on-primary shadow-sm hover:bg-primary-dim"
              >
                Save Settings
              </button>
            </div>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
}
