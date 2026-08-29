import { Truck } from 'lucide-react';

export default function SidebarUpgradeCard() {
  return (
    <div className="p-4 hidden md:block">
      <div className="bg-[var(--color-6)] rounded-[var(--radius-sm)] p-5 border border-[var(--color-3)] relative overflow-hidden transition-all duration-200 hover:">
        <div className="absolute top-0 right-0 p-2 opacity-5">
          <Truck className="w-20 h-20 text-[var(--color-1)]" />
        </div>
        <h4 className="font-bold text-[var(--color-1)] mb-1">Pro Plan</h4>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">Unlock more features for your logistics needs.</p>
        <button className="w-full h-10 bg-[var(--color-6)] border border-[var(--color-3)] text-[var(--color-1)] text-xs font-semibold rounded-[var(--radius-sm)] hover:border-[var(--color-1)] transition-all duration-200">
          Upgrade Now
        </button>
      </div>
    </div>
  );
}
