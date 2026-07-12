import { HelpCircle } from 'lucide-react';

export default function SidebarFooter() {
  return (
    <div className="p-4 flex justify-center md:justify-start">
      <button className="flex items-center text-[#6B7280] hover:text-[#111111] text-sm font-medium transition-colors">
        <HelpCircle className="w-5 h-5 md:mr-2" />
        <span className="hidden md:inline">Help Center</span>
      </button>
    </div>
  );
}
