import type { ReactNode } from 'react';

export interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export default function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <thead className={className}>
      <tr className="text-[var(--color-text-muted)] border-b border-[var(--color-3)]">
        {children}
      </tr>
    </thead>
  );
}
