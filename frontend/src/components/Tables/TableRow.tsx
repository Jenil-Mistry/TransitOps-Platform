import type { ReactNode } from 'react';

export interface TableRowProps {
  children: ReactNode;
  className?: string;
}

export default function TableRow({ children, className = '' }: TableRowProps) {
  return (
    <tr className={`border-b border-gray-50 last:border-0 hover:bg-neutral-50 transition-colors ${className}`}>
      {children}
    </tr>
  );
}
