export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  let style = '';
  switch (status) {
    case 'Available':
    case 'Completed':
      style = 'bg-[var(--color-1)] text-white';
      break;
    case 'On Trip':
    case 'Dispatched':
      style = 'bg-[var(--color-6)] border border-[var(--color-3)] text-[var(--color-1)]';
      break;
    case 'In Shop':
      style = 'bg-[var(--color-2)] text-white';
      break;
    case 'Retired':
    case 'Draft':
      style = 'bg-[var(--color-6)] border border-[var(--color-3)] text-[var(--color-text-muted)]';
      break;
    case 'Cancelled':
      style = 'bg-[var(--color-1)] text-white';
      break;
    default:
      style = 'bg-[var(--color-1)] text-white';
  }

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${style} ${className}`}>
      {status}
    </span>
  );
}
