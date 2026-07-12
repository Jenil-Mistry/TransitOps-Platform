import { Filter } from 'lucide-react';

export default function DashboardFilters() {
  return (
    <div className="flex space-x-4 mb-4 items-center">
      <span className="text-sm font-semibold text-[#6B7280] uppercase flex items-center">
        <Filter className="w-4 h-4 mr-1" /> Filters
      </span>
      <select className="border-[#ECECEC] bg-[#FAFAFA] border text-sm rounded-xl px-3 py-2 focus:ring-1 focus:ring-[#0C0D0D] transition-all">
        <option>Vehicle Type: All</option>
      </select>
      <select className="border-[#ECECEC] bg-[#FAFAFA] border text-sm rounded-xl px-3 py-2 focus:ring-1 focus:ring-[#0C0D0D] transition-all">
        <option>Status: All</option>
      </select>
      <select className="border-[#ECECEC] bg-[#FAFAFA] border text-sm rounded-xl px-3 py-2 focus:ring-1 focus:ring-[#0C0D0D] transition-all">
        <option>Region: All</option>
      </select>
    </div>
  );
}
