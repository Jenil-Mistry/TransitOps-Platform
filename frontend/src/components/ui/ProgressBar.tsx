import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  showValue?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const colorStyles = {
  brand: 'bg-[var(--color-2)]',
  success: 'bg-[var(--color-1)]',
  warning: 'bg-[var(--color-2)]',
  danger: 'bg-[var(--color-1)]',
  info: 'bg-[var(--color-1)]',
  purple: 'bg-[var(--color-1)]',
};

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2',
};

export default function ProgressBar({
  value,
  max = 100,
  label,
  color = 'brand',
  showValue = false,
  size = 'sm',
  className,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={clsx('w-full', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-[13px] font-medium text-[var(--color-text-primary)]">{label}</span>}
          {showValue && <span className="text-caption">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={clsx('w-full bg-[var(--color-5)] rounded-[var(--radius-sm)] overflow-hidden', sizeStyles[size])}>
        <div
          className={clsx('h-full rounded-[var(--radius-sm)] transition-all duration-[200ms] ease-out', colorStyles[color])}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
