import type { ReactNode } from 'react';

export interface DataTableProps {
  children: ReactNode;
  className?: string;
}

export default function DataTable({ children, className = '' }: DataTableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left text-sm">
        {children}
      </table>
    </div>
  );
}
