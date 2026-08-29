import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({ className, variant = 'rect', width, height }: SkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-[var(--color-bg-secondary)]',
        variant === 'circle' && 'rounded-full',
        variant === 'text' && 'rounded-[4px] h-4',
        variant === 'rect' && 'rounded-[var(--radius-sm)]',
        className
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width={80} />
        <Skeleton variant="rect" width={36} height={36} className="rounded-[var(--radius-sm)]" />
      </div>
      <Skeleton variant="text" width={100} height={32} />
      <Skeleton variant="text" width={60} height={16} />
    </div>
  );
}

export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <tr className="border-b border-[var(--color-border)]">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton variant="text" width={i === 0 ? '80%' : '60%'} />
        </td>
      ))}
    </tr>
  );
}

export function ChartSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width={120} height={20} />
        <div className="flex gap-2">
          <Skeleton variant="rect" width={40} height={28} className="rounded-[var(--radius-sm)]" />
          <Skeleton variant="rect" width={40} height={28} className="rounded-[var(--radius-sm)]" />
          <Skeleton variant="rect" width={40} height={28} className="rounded-[var(--radius-sm)]" />
        </div>
      </div>
      <Skeleton variant="rect" width="100%" height={200} />
    </div>
  );
}
