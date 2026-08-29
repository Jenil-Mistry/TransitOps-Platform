import { LayoutDashboard, Truck, Users, Route, Wrench, ReceiptText, BarChart3, Settings } from 'lucide-react';
import SidebarLogo from './SidebarLogo';
import SidebarNavigation from './SidebarNavigation';
import type { SidebarNavigationItemProps } from './SidebarNavigationItem';
import { useAuthStore } from '../../store/useAuthStore';
import type { Role } from '../../types';
import Avatar from '../ui/Avatar';

// All possible navigation items with role access lists
const allNavItems: (SidebarNavigationItemProps & { roles: Role[] })[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'] },
  { name: 'Fleet', path: '/vehicles', icon: Truck, roles: ['Fleet Manager', 'Driver'] },
  { name: 'Drivers', path: '/drivers', icon: Users, roles: ['Fleet Manager', 'Driver', 'Safety Officer'] },
  { name: 'Trips', path: '/trips', icon: Route, roles: ['Fleet Manager', 'Driver', 'Safety Officer'] },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench, roles: ['Fleet Manager', 'Financial Analyst'] },
  { name: 'Fuel & Expenses', path: '/expenses', icon: ReceiptText, roles: ['Fleet Manager', 'Financial Analyst'] },
  { name: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['Fleet Manager', 'Financial Analyst'] },
  { name: 'Settings', path: '/settings', icon: Settings, roles: ['Fleet Manager'] },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuthStore();
  const userRole = user?.role || 'Fleet Manager';
  const userName = user?.name || 'Admin Fleet';

  // Filter items for the current user's role
  const seen = new Set<string>();
  const navItems: SidebarNavigationItemProps[] = allNavItems
    .filter((item) => item.roles.includes(userRole))
    .filter((item) => {
      if (seen.has(item.path)) return false;
      seen.add(item.path);
      return true;
    })
    .map(({ roles, ...rest }) => rest);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[240px] bg-[var(--color-bg-primary)] border-r-2 border-[var(--color-border-strong)]
          flex flex-col h-full font-[var(--font-sans)]
          transition-transform duration-[var(--transition-slow)] ease-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <SidebarLogo />

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <SidebarNavigation items={navItems} />
        </div>

        {/* User section at bottom */}
        <div className="px-4 py-4 border-t-2 border-[var(--color-border-strong)]">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar name={userName} size="sm" />
            <div className="min-w-0 hidden md:block">
              <div className="text-[13px] font-medium text-[var(--color-text-primary)] truncate">{userName}</div>
              <div className="text-[11px] text-[var(--color-text-muted)] truncate">{userRole}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
