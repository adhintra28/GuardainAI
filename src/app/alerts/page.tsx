import DashboardShell from '@/components/guardian/DashboardShell';

export default function AlertsPage() {
  return (
    <DashboardShell active="alerts">
      <main className="flex-1 overflow-y-auto bg-background p-8 md:p-12 lg:p-16">
        <header className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="mb-2 font-headline text-[2rem] font-bold leading-tight text-on-surface">Security Alerts</h2>
            <p className="max-w-2xl font-body text-sm text-on-surface-variant">
              Review and resolve compliance anomalies across your connected infrastructure.
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
            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-surface-container-highest px-4 py-2 font-label text-sm font-medium text-on-surface hover:bg-surface-variant"
            >
              <span className="material-symbols-outlined text-[18px]">done_all</span>
              Mark All Read
            </button>
          </div>
        </header>

        <div className="space-y-4">
          <div className="ambient-shadow flex items-start gap-4 rounded-md border border-outline-variant/10 bg-surface-container-lowest p-5 transition-all hover:bg-surface-container-lowest/80">
            <div className="mt-1">
              <span className="material-symbols-outlined fill text-error">warning</span>
            </div>
            <div className="flex-1">
              <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded bg-error-container px-2 py-0.5 font-label text-[0.6875rem] font-bold uppercase tracking-wide text-on-error-container">
                    Critical
                  </span>
                  <span className="font-headline text-sm font-semibold text-on-surface">
                    Unauthorized IAM Role Access Detected
                  </span>
                </div>
                <span className="font-label text-[0.6875rem] text-on-surface-variant">10 mins ago</span>
              </div>
              <p className="mb-3 font-body text-sm text-on-surface-variant">
                Unusual cross-account access detected for role{' '}
                <code className="text-on-surface">arn:aws:iam::123456789012:role/ProductionDataAdmin</code> originating
                from an unrecognized IP range.
              </p>
              <div className="mb-4 flex flex-wrap items-center gap-4 font-label text-xs text-on-surface-variant">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">dns</span> us-east-1
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">policy</span> SOC2-CC6.1
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded bg-primary px-3 py-1.5 text-xs font-medium text-on-primary hover:bg-primary-dim"
                >
                  Investigate
                </button>
                <button
                  type="button"
                  className="rounded px-3 py-1.5 text-xs font-medium text-primary hover:bg-surface-container"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-md border border-outline-variant/10 bg-surface-container-lowest p-5 transition-all hover:bg-surface-container-lowest/80">
            <div className="mt-1">
              <span className="material-symbols-outlined text-[#d97706]">error</span>
            </div>
            <div className="flex-1">
              <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded bg-[#fef3c7] px-2 py-0.5 font-label text-[0.6875rem] font-bold uppercase tracking-wide text-[#92400e]">
                    High
                  </span>
                  <span className="font-headline text-sm font-semibold text-on-surface">
                    S3 Bucket Public Access Block Disabled
                  </span>
                </div>
                <span className="font-label text-[0.6875rem] text-on-surface-variant">2 hours ago</span>
              </div>
              <p className="mb-3 font-body text-sm text-on-surface-variant">
                Public access block settings were removed from{' '}
                <code className="text-on-surface">customer-backups-eu-west</code>. Data may be exposed.
              </p>
              <div className="mb-4 flex flex-wrap items-center gap-4 font-label text-xs text-on-surface-variant">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">storage</span> eu-west-2
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">gavel</span> GDPR-Art.32
                </div>
              </div>
              <button
                type="button"
                className="rounded border border-transparent bg-surface-container-highest px-3 py-1.5 text-xs font-medium text-on-surface hover:bg-surface-variant"
              >
                Resolve Automatically
              </button>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-md border border-outline-variant/10 bg-surface-container-lowest p-5 transition-all hover:bg-surface-container-lowest/80">
            <div className="mt-1">
              <span className="material-symbols-outlined text-secondary">info</span>
            </div>
            <div className="flex-1">
              <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded bg-secondary-container px-2 py-0.5 font-label text-[0.6875rem] font-bold uppercase tracking-wide text-on-secondary-container">
                    Medium
                  </span>
                  <span className="font-headline text-sm font-semibold text-on-surface">MFA Disabled for Root Account</span>
                </div>
                <span className="font-label text-[0.6875rem] text-on-surface-variant">Yesterday</span>
              </div>
              <p className="mb-3 font-body text-sm text-on-surface-variant">
                Multi-factor authentication is currently disabled for a newly created administrative account.
              </p>
              <div className="mb-4 flex flex-wrap items-center gap-4 font-label text-xs text-on-surface-variant">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">account_circle</span> Global
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified_user</span> CIS-1.2
                </div>
              </div>
              <button
                type="button"
                className="rounded border border-transparent bg-surface-container-highest px-3 py-1.5 text-xs font-medium text-on-surface hover:bg-surface-variant"
              >
                View Details
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <p className="font-label text-xs text-on-surface-variant">Showing 1-3 of 24 Alerts</p>
        </div>
      </main>
    </DashboardShell>
  );
}
