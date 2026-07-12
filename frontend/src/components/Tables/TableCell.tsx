import type { ReactNode } from 'react';

export interface TableCellProps {
  children: ReactNode;
  isHeader?: boolean;
  className?: string;
}

export default function TableCell({ children, isHeader = false, className = '' }: TableCellProps) {
  if (isHeader) {
    return <th className={`pb-3 font-medium ${className}`}>{children}</th>;
  }
  return <td className={`py-4 ${className}`}>{children}</td>;
}
