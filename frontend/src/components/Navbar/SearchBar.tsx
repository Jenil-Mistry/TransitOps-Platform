import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
      <input
        type="text"
        placeholder="Search vehicles, drivers, trips..."
        className="w-full h-9 pl-9 pr-16 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[13px] text-[var(--color-text-primary)] placeholder-[var(--color-text-disabled)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 focus:border-[var(--color-brand)] transition-all"
      />
      <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-[4px] text-[10px] font-medium text-[var(--color-text-muted)]">
        ⌘K
      </kbd>
    </div>
  );
}
