import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-[#9CA3AF]" />
      </div>
      <input
        type="text"
        className="block w-full pl-12 pr-4 h-12 border border-[#ECECEC] rounded-2xl bg-[#FAFAFA] text-[#111111] text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all duration-200"
        placeholder="Search for driver, vehicle, trip..."
      />
    </div>
  );
}
