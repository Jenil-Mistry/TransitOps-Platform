import type { DriverStatus } from '../../types';

interface DriverStatusBadgeProps {
  status: DriverStatus;
}

export default function DriverStatusBadge({ status }: DriverStatusBadgeProps) {
  const getStatusColor = (status: DriverStatus) => {
    switch (status) {
      case 'Available': return 'bg-[var(--color-1)] text-white';
      case 'On Trip': return 'bg-[var(--color-6)] border border-[var(--color-3)] text-[var(--color-1)]';
      case 'Off Duty': return 'bg-[var(--color-6)] text-[var(--color-text-muted)]';
      case 'Suspended': return 'bg-[var(--color-1)] text-white';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}
