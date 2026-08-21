import { useLocation } from 'react-router-dom';
import { Menu, Plus, Sun, Moon } from 'lucide-react';
import NotificationButton from './NotificationButton';
import ProfileDropdown from './ProfileDropdown';
import Button from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of your fleet operations' },
  '/vehicles': { title: 'Fleet', subtitle: 'Manage vehicles, availability and operational status' },
  '/drivers': { title: 'Drivers', subtitle: 'Manage drivers and their assignments' },
  '/trips': { title: 'Trips', subtitle: 'Monitor and manage fleet trips' },
  '/maintenance': { title: 'Maintenance', subtitle: 'Track and schedule vehicle maintenance' },
  '/expenses': { title: 'Fuel & Expenses', subtitle: 'Monitor fuel costs and expenses' },
  '/analytics': { title: 'Analytics', subtitle: 'Fleet performance insights and reports' },
  '/settings': { title: 'Settings', subtitle: 'Application preferences and configuration' },
  '/profile': { title: 'Profile', subtitle: 'Your account details' },
};

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { pathname } = useLocation();
  const pageInfo = pageTitles[pathname] || { title: 'TransitOps', subtitle: '' };
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-16 bg-[var(--color-bg-primary)] border-b border-[var(--color-border)] flex items-center justify-between px-6 flex-shrink-0">
      {/* Left: Menu + Page context */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block min-w-0">
          <h1 className="text-[16px] font-semibold text-[var(--color-text-primary)] leading-tight">{pageInfo.title}</h1>
          <p className="text-[12px] text-[var(--color-text-muted)] truncate">{pageInfo.subtitle}</p>
        </div>
      </div>


      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <NotificationButton />

        <Button
          size="sm"
          className="hidden sm:inline-flex"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Trip
        </Button>

        <div className="pl-3 border-l-2 border-[var(--color-border-strong)]">
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
}