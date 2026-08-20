import { HelpCircle } from 'lucide-react';

export default function SidebarFooter() {
  return (
    <div className="p-4 flex justify-center md:justify-start">
      <button className="flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-1)] text-sm font-medium transition-colors">
        <HelpCircle className="w-5 h-5 md:mr-2" />
        <span className="hidden md:inline">Help Center</span>
      </button>
    </div>
  );
}
