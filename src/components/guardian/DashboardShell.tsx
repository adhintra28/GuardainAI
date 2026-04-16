import type { ReactNode } from 'react';
import type { DashboardNavId } from './dashboard-nav';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardShell({
  active,
  children,
}: {
  active: DashboardNavId;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      <DashboardSidebar active={active} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
