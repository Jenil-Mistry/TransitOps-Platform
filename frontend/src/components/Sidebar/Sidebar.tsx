import { LayoutDashboard, Truck, Users, Route, PenTool, ReceiptText, Settings } from 'lucide-react';
import SidebarLogo from './SidebarLogo';
import SidebarProfile from './SidebarProfile';
import SidebarNavigation from './SidebarNavigation';
import SidebarUpgradeCard from './SidebarUpgradeCard';
import SidebarFooter from './SidebarFooter';
import type { SidebarNavigationItemProps } from './SidebarNavigationItem';

const navItems: SidebarNavigationItemProps[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Fleet', path: '/vehicles', icon: Truck },
  { name: 'Drivers', path: '/drivers', icon: Users },
  { name: 'Trips', path: '/trips', icon: Route },
  { name: 'Maintenance', path: '/maintenance', icon: PenTool },
  { name: 'Fuel & Expenses', path: '/expenses', icon: ReceiptText },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <div className="w-24 md:w-64 bg-white border-r border-[#ECECEC] flex flex-col h-full font-sans">
      <SidebarLogo />
      <SidebarProfile />
      <SidebarNavigation items={navItems} />
      <SidebarUpgradeCard />
      <SidebarFooter />
    </div>
  );
}
