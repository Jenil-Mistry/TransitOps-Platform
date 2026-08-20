import type { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export interface BaseCardProps {
  title?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  noPadding?: boolean;
  className?: string;
  bodyClassName?: string;
}

export default function BaseCard({
  title,
  children,
  actions,
  footer,
  noPadding = false,
  className,
  bodyClassName
}: BaseCardProps) {
  const hasHeader = title || actions;

  return (
    <div className={cn("bg-white rounded-[24px] border border-[var(--color-3)]  flex flex-col", className)}>
      {hasHeader && (
        <div className="flex justify-between items-center px-6 pt-6 mb-4">
          {title && (typeof title === 'string' ? <h3 className="text-sm font-bold text-[var(--color-1)] tracking-tight m-0">{title}</h3> : title)}
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className={cn(noPadding ? '' : 'p-6', hasHeader && !noPadding ? 'pt-0' : '', bodyClassName)}>
        {children}
      </div>
      {footer && (
        <div className="border-t border-[var(--color-3)] p-6">
          {footer}
        </div>
      )}
    </div>
  );
}
