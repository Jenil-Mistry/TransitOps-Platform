import type { ReactNode } from 'react';
import { SearchX } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-full bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-text-muted)] mb-4">
        {icon || <SearchX className="w-6 h-6" />}
      </div>
      <h3 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-1">{title}</h3>
      <p className="text-secondary max-w-sm mb-5">{description}</p>
      {action && (
        <Button variant="outline" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
