import { LayoutDashboard, Truck, Users, Route, PenTool, ReceiptText, Shield } from 'lucide-react';
import SidebarLogo from './SidebarLogo';
import SidebarNavigation from './SidebarNavigation';
import type { SidebarNavigationItemProps } from './SidebarNavigationItem';
import { useAuthStore } from '../../store/useAuthStore';
import type { Role } from '../../types';

// Full list of all possible nav items
const allNavItems: (SidebarNavigationItemProps & { roles: Role[] })[] = [
  // Dashboard — shared among ALL roles
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'] },

  // Fleet Manager: fleet assets, maintenance, vehicle lifecycle
  { name: 'Fleet', path: '/vehicles', icon: Truck, roles: ['Fleet Manager'] },
  { name: 'Maintenance', path: '/maintenance', icon: PenTool, roles: ['Fleet Manager'] },

  // Driver (Dispatcher): creates trips, assigns vehicles/drivers
  { name: 'Trips', path: '/trips', icon: Route, roles: ['Driver'] },
  { name: 'Fleet', path: '/vehicles', icon: Truck, roles: ['Driver'] },
  { name: 'Drivers', path: '/drivers', icon: Users, roles: ['Driver'] },

  // Safety Officer: driver compliance, license validity, safety scores
  { name: 'Drivers', path: '/drivers', icon: Users, roles: ['Safety Officer'] },
  { name: 'Trips', path: '/trips', icon: Route, roles: ['Safety Officer'] },

  // Financial Analyst: expenses, fuel consumption, maintenance costs
  { name: 'Fuel & Expenses', path: '/expenses', icon: ReceiptText, roles: ['Financial Analyst'] },
  { name: 'Maintenance', path: '/maintenance', icon: PenTool, roles: ['Financial Analyst'] },
];

export default function Sidebar() {
  const { user } = useAuthStore();
  const userRole = user?.role || 'Fleet Manager';

  // Filter items for the current user's role, then deduplicate by path
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
    <div className="w-24 md:w-64 bg-white border-r border-[#ECECEC] flex flex-col h-full font-sans">
      <SidebarLogo />
      <div className="mt-4 flex-1">
        <SidebarNavigation items={navItems} />
      </div>

      {/* Role Badge at bottom */}
      <div className="px-4 py-4 border-t border-[#ECECEC]">
        <div className="flex items-center space-x-2 px-3 py-2.5 rounded-xl bg-[#FAFAFA] border border-[#ECECEC]">
          <Shield className="w-4 h-4 text-[#6B7280] flex-shrink-0" />
          <span className="text-[10px] md:text-xs font-semibold text-[#6B7280] truncate">{userRole}</span>
        </div>
      </div>
    </div>
  );
}
