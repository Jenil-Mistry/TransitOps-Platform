import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, Route, PenTool, ReceiptText, Settings, HelpCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuthStore } from '../store/useAuthStore';

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Fleet', path: '/vehicles', icon: Truck },
  { name: 'Drivers', path: '/drivers', icon: Users },
  { name: 'Trips', path: '/trips', icon: Route },
  { name: 'Maintenance', path: '/maintenance', icon: PenTool },
  { name: 'Fuel & Expenses', path: '/expenses', icon: ReceiptText },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const { user } = useAuthStore();

  return (
    <div className="w-24 md:w-64 bg-white border-r border-[#ECECEC] flex flex-col h-full font-sans">
      <div className="p-6 flex items-center space-x-3">
        <div className="w-8 h-8 bg-[#0C0D0D] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">T</span>
        </div>
        <span className="text-xl font-bold text-[#111111] hidden md:block tracking-tight">TransitOps</span>
      </div>

      <div className="px-6 pb-6 hidden md:flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-[#FAFAFA] border border-[#ECECEC] overflow-hidden flex-shrink-0">
          <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} alt="User avatar" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-semibold text-[#111111] truncate">{user?.name}</span>
          <span className="text-xs text-[#6B7280] truncate">{user?.role}</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex md:flex-row flex-col items-center md:justify-start justify-center px-4 py-3 rounded-2xl transition-all duration-200 ease-in-out',
                  isActive
                    ? 'bg-[#0C0D0D] text-white shadow-sm'
                    : 'text-[#6B7280] hover:bg-[#FAFAFA] hover:text-[#111111]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn("w-5 h-5 md:mr-3", "mb-1 md:mb-0")} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] md:text-sm font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 hidden md:block">
        <div className="bg-[#FAFAFA] rounded-2xl p-5 border border-[#ECECEC] relative overflow-hidden transition-all duration-200 hover:card-shadow">
          <div className="absolute top-0 right-0 p-2 opacity-5">
            <Truck className="w-20 h-20 text-[#111111]" />
          </div>
          <h4 className="font-bold text-[#111111] mb-1">Pro Plan</h4>
          <p className="text-xs text-[#6B7280] mb-4">Unlock more features for your logistics needs.</p>
          <button className="w-full h-10 bg-[#FFFFFF] border border-[#ECECEC] text-[#111111] text-xs font-semibold rounded-2xl hover:border-[#111111] transition-all duration-200">
            Upgrade Now
          </button>
        </div>
      </div>
      
      <div className="p-4 flex justify-center md:justify-start">
        <button className="flex items-center text-[#6B7280] hover:text-[#111111] text-sm font-medium transition-colors">
          <HelpCircle className="w-5 h-5 md:mr-2" />
          <span className="hidden md:inline">Help Center</span>
        </button>
      </div>
    </div>
  );
}
