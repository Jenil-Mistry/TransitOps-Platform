import { LayoutDashboard, Truck, Users, Route, PenTool, ReceiptText } from 'lucide-react';
import SidebarLogo from './SidebarLogo';
import SidebarNavigation from './SidebarNavigation';
import type { SidebarNavigationItemProps } from './SidebarNavigationItem';

const navItems: SidebarNavigationItemProps[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Fleet', path: '/vehicles', icon: Truck },
  { name: 'Drivers', path: '/drivers', icon: Users },
  { name: 'Trips', path: '/trips', icon: Route },
  { name: 'Maintenance', path: '/maintenance', icon: PenTool },
  { name: 'Fuel & Expenses', path: '/expenses', icon: ReceiptText },
];

export default function Sidebar() {
  return (
    <div className="w-24 md:w-64 bg-white border-r border-[#ECECEC] flex flex-col h-full font-sans">
      <SidebarLogo />
      <div className="mt-4 flex-1">
        <SidebarNavigation items={navItems} />
      </div>
    </div>
  );
}
