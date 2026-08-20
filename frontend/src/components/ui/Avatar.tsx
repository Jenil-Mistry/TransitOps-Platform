import { clsx } from 'clsx';

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles = {
  sm: 'w-7 h-7 text-[11px]',
  md: 'w-9 h-9 text-[13px]',
  lg: 'w-11 h-11 text-[15px]',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Deterministic color from name
function getColor(name: string): string {
  const colors = [
    'bg-[var(--color-1)] text-[var(--color-6)]',
    'bg-[var(--color-2)] text-[var(--color-1)]',
    'bg-[var(--color-3)] text-[var(--color-1)]',
    'bg-[var(--color-4)] text-[var(--color-1)]',
    'bg-[var(--color-5)] text-[var(--color-1)]',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={clsx('rounded-full object-cover flex-shrink-0', sizeStyles[size], className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center font-semibold flex-shrink-0 select-none',
        sizeStyles[size],
        getColor(name),
        className
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
