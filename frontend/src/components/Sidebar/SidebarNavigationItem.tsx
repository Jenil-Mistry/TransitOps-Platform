import { NavLink } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ElementType } from 'react';

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export interface SidebarNavigationItemProps {
  name: string;
  path: string;
  icon: ElementType;
}

export default function SidebarNavigationItem({ name, path, icon: Icon }: SidebarNavigationItemProps) {
  return (
    <NavLink
      to={path}
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
          <span className="text-[10px] md:text-sm font-medium">{name}</span>
        </>
      )}
    </NavLink>
  );
}
