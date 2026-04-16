import Link from 'next/link';
import type { DashboardNavId } from './dashboard-nav';
import { DASHBOARD_NAV } from './dashboard-nav';
import { DashboardUserSection } from './DashboardUserSection';

type DashboardSidebarProps = {
  active: DashboardNavId;
  /** Settings pinned above CTA on some mocks; default: settings last in list */
  settingsAboveCta?: boolean;
};

export default function DashboardSidebar({ active }: DashboardSidebarProps) {
  const main = DASHBOARD_NAV.filter((i) => i.id !== 'settings');
  const settings = DASHBOARD_NAV.find((i) => i.id === 'settings')!;

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-outline-variant/20 bg-surface-container-low py-6 px-4">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-on-primary">
          <span className="material-symbols-outlined text-xl fill">shield</span>
        </div>
        <div>
          <p className="font-headline text-lg font-bold tracking-tight text-on-surface">Guardian AI</p>
          <p className="text-[0.6875rem] font-medium uppercase tracking-widest text-on-surface-variant">
            Enterprise Compliance
          </p>
        </div>
      </div>

      <Link
        href="/scanner"
        className="mb-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 px-4 text-sm font-medium text-on-primary shadow-sm transition-colors hover:bg-primary-dim"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        New Scan
      </Link>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {main.map((item) => {
          const isActive = active === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container/50 hover:text-on-surface'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${isActive ? 'fill text-primary' : ''}`}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}

        <Link
          href={settings.href}
          className={`mt-auto flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
            active === 'settings'
              ? 'bg-surface-container-lowest text-on-surface shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container/50 hover:text-on-surface'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[20px] ${active === 'settings' ? 'fill' : ''}`}
          >
            settings
          </span>
          {settings.label}
        </Link>
      </nav>

      <DashboardUserSection />
    </aside>
  );
}
