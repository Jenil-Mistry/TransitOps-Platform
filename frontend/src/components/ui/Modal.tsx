import type { ReactNode } from 'react';
import { clsx } from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export default function Modal({ isOpen, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        className={clsx(
          'relative w-full mx-4 bg-[var(--color-bg-primary)] rounded-[var(--radius-sm)] border border-[var(--color-border)] overflow-hidden',
          'animate-in fade-in zoom-in-95 duration-200',
          sizeStyles[size]
        )}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--color-border)]">
          <h2 className="text-section-title">{title}</h2>
          {description && <p className="text-secondary mt-1">{description}</p>}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-1)] hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-bg-hover)] flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
