import { useLocation, Link } from 'react-router-dom';
import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';

export interface SidebarNavigationItemProps {
  name: string;
  path: string;
  icon: LucideIcon;
}

export default function SidebarNavigationItem({ name, path, icon: Icon }: SidebarNavigationItemProps) {
  const { pathname } = useLocation();
  const isActive = pathname === path;

  return (
    <Link
      to={path}
      className={clsx(
        'group flex items-center gap-3 px-3 py-2.5 mx-3 rounded-[var(--radius-sm)] text-[14px] font-medium transition-all duration-[150ms] relative',
        isActive
          ? 'bg-[var(--color-5)] text-[var(--color-1)] font-bold border border-[var(--color-4)]'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-5)] hover:text-[var(--color-1)]'
      )}
    >
      {/* Active indicator bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[var(--color-2)] rounded-r-full" />
      )}

      <Icon
        className={clsx(
          'w-[18px] h-[18px] flex-shrink-0 transition-colors duration-[150ms]',
          isActive
            ? 'text-[var(--color-2)]'
            : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-1)]'
        )}
      />

      <span className="hidden md:inline truncate">{name}</span>
    </Link>
  );
}
