import { clsx } from 'clsx';

type BadgeVariant = 'active' | 'idle' | 'maintenance' | 'critical' | 'available' | 'onTrip' | 'offDuty' | 'suspended' | 'completed' | 'inTransit' | 'scheduled' | 'delayed' | 'cancelled' | 'overdue' | 'inProgress' | 'open' | 'closed' | 'draft' | 'dispatched' | 'low' | 'medium' | 'high' | 'info' | 'warning' | 'fuel';

interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
  dot?: boolean;
}

const variantMap: Record<BadgeVariant, { bg: string; text: string; defaultLabel: string }> = {
  active: { bg: 'bg-[var(--color-5)]', text: 'text-[var(--color-1)]', defaultLabel: 'Active' },
  available: { bg: 'bg-[var(--color-5)]', text: 'text-[var(--color-1)]', defaultLabel: 'Available' },
  onTrip: { bg: 'bg-[var(--color-5)]', text: 'text-[var(--color-1)]', defaultLabel: 'On Trip' },
  inTransit: { bg: 'bg-[var(--color-5)]', text: 'text-[var(--color-1)]', defaultLabel: 'In Transit' },
  dispatched: { bg: 'bg-[var(--color-5)]', text: 'text-[var(--color-1)]', defaultLabel: 'Dispatched' },
  idle: { bg: 'bg-[var(--color-4)]', text: 'text-[var(--color-1)]', defaultLabel: 'Idle' },
  maintenance: { bg: 'bg-[var(--color-3)]', text: 'text-[var(--color-1)]', defaultLabel: 'Maintenance' },
  inProgress: { bg: 'bg-[var(--color-3)]', text: 'text-[var(--color-1)]', defaultLabel: 'In Progress' },
  critical: { bg: 'bg-[var(--color-2)]', text: 'text-[var(--color-1)]', defaultLabel: 'Critical' },
  overdue: { bg: 'bg-[var(--color-2)]', text: 'text-[var(--color-1)]', defaultLabel: 'Overdue' },
  suspended: { bg: 'bg-[var(--color-1)]', text: 'text-[var(--color-6)]', defaultLabel: 'Suspended' },
  cancelled: { bg: 'bg-[var(--color-1)]', text: 'text-[var(--color-6)]', defaultLabel: 'Cancelled' },
  delayed: { bg: 'bg-[var(--color-4)]', text: 'text-[var(--color-1)]', defaultLabel: 'Delayed' },
  warning: { bg: 'bg-[var(--color-4)]', text: 'text-[var(--color-1)]', defaultLabel: 'Warning' },
  offDuty: { bg: 'bg-[var(--color-5)]', text: 'text-[var(--color-text-muted)]', defaultLabel: 'Off Duty' },
  completed: { bg: 'bg-[var(--color-5)]', text: 'text-[var(--color-1)]', defaultLabel: 'Completed' },
  scheduled: { bg: 'bg-[var(--color-5)]', text: 'text-[var(--color-1)]', defaultLabel: 'Scheduled' },
  open: { bg: 'bg-[var(--color-4)]', text: 'text-[var(--color-1)]', defaultLabel: 'Open' },
  closed: { bg: 'bg-[var(--color-5)]', text: 'text-[var(--color-1)]', defaultLabel: 'Closed' },
  draft: { bg: 'bg-[var(--color-5)]', text: 'text-[var(--color-text-muted)]', defaultLabel: 'Draft' },
  low: { bg: 'bg-[var(--color-5)]', text: 'text-[var(--color-1)]', defaultLabel: 'Low' },
  medium: { bg: 'bg-[var(--color-4)]', text: 'text-[var(--color-1)]', defaultLabel: 'Medium' },
  high: { bg: 'bg-[var(--color-2)]', text: 'text-[var(--color-1)]', defaultLabel: 'High' },
  info: { bg: 'bg-[var(--color-5)]', text: 'text-[var(--color-1)]', defaultLabel: 'Info' },
  fuel: { bg: 'bg-[var(--color-5)]', text: 'text-[var(--color-1)]', defaultLabel: 'Fuel' },
};

export default function StatusBadge({ variant, label, className, dot = false }: StatusBadgeProps) {
  const style = variantMap[variant] || variantMap.info;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] text-[12px] font-medium leading-none',
        style.bg,
        style.text,
        className
      )}
    >
      {dot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full bg-current flex-shrink-0')} />
      )}
      {label || style.defaultLabel}
    </span>
  );
}

// Utility to get badge variant from status string
export function getStatusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    'Active': 'active',
    'Available': 'available',
    'On Trip': 'onTrip',
    'In Transit': 'inTransit',
    'In Shop': 'maintenance',
    'Idle': 'idle',
    'Maintenance': 'maintenance',
    'Critical': 'critical',
    'Retired': 'offDuty',
    'Off Duty': 'offDuty',
    'Suspended': 'suspended',
    'Completed': 'completed',
    'Scheduled': 'scheduled',
    'Delayed': 'delayed',
    'Cancelled': 'cancelled',
    'Overdue': 'overdue',
    'In Progress': 'inProgress',
    'Open': 'open',
    'Closed': 'closed',
    'Draft': 'draft',
    'Dispatched': 'dispatched',
    'Low': 'low',
    'Medium': 'medium',
    'High': 'high',
  };
  return map[status] || 'info';
}
