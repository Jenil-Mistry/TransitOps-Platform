import { Truck } from 'lucide-react';

export default function SidebarLogo() {
  return (
    <div className="px-5 py-5 border-b border-[var(--color-border)]">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[var(--color-brand)] flex items-center justify-center flex-shrink-0">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0 hidden md:block">
          <div className="text-[16px] font-bold text-[var(--color-text-primary)] leading-tight tracking-tight">
            TransitOps
          </div>
          <div className="text-[11px] font-medium text-[var(--color-text-muted)] tracking-wide">
            Fleet Operations
          </div>
        </div>
      </div>
    </div>
  );
}
