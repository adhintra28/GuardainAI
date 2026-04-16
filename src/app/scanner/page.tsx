import DashboardShell from '@/components/guardian/DashboardShell';
import ScannerWorkspace from '@/components/scanner/ScannerWorkspace';

export default function ScannerPage() {
  return (
    <DashboardShell active="scanner">
      <main className="flex h-screen flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-low px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-on-primary">
              <span className="material-symbols-outlined text-sm">shield</span>
            </div>
            <h1 className="font-headline text-base font-bold tracking-tight text-on-surface">Scanner</h1>
          </div>
          <button type="button" className="text-on-surface-variant">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-8 md:px-12 md:py-12">
          <div className="mx-auto max-w-5xl space-y-12">
            <div className="space-y-2">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
                Compliance Scanner
              </h2>
              <p className="max-w-2xl font-body text-sm text-on-surface-variant">
                Upload architectural diagrams, configuration files, or policy documents for an automated
                compliance assessment against enterprise frameworks.
              </p>
            </div>

            <ScannerWorkspace />
          </div>
        </div>
      </main>
    </DashboardShell>
  );
}
