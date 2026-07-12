import type { ReactNode } from 'react';

export interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export default function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <thead className={className}>
      <tr className="text-[#6B7280] border-b border-[#ECECEC]">
        {children}
      </tr>
    </thead>
  );
}
