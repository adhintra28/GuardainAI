export type DashboardNavId =
  | 'dashboard'
  | 'scanner'
  | 'domains'
  | 'solutions'
  | 'frameworks'
  | 'reports'
  | 'alerts'
  | 'settings';

export const DASHBOARD_NAV: {
  id: DashboardNavId;
  label: string;
  href: string;
  icon: string;
}[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { id: 'scanner', label: 'Scanner', href: '/scanner', icon: 'security_update_good' },
  { id: 'domains', label: 'Domains', href: '/domains', icon: 'language' },
  { id: 'solutions', label: 'Solutions', href: '/solutions', icon: 'hub' },
  { id: 'frameworks', label: 'Frameworks', href: '/frameworks', icon: 'account_tree' },
  { id: 'reports', label: 'Reports', href: '/reports', icon: 'assessment' },
  { id: 'alerts', label: 'Alerts', href: '/alerts', icon: 'notifications_active' },
  { id: 'settings', label: 'Settings', href: '/settings', icon: 'settings' },
];
