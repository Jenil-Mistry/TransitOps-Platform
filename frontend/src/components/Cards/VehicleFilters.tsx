export default function VehicleFilters() {
  return (
    <div className="flex space-x-4 items-center">
      <select className="border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] text-sm rounded-2xl px-4 h-12 focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all">
        <option>Type: All</option>
      </select>
      <select className="border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] text-sm rounded-2xl px-4 h-12 focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all">
        <option>Status: All</option>
      </select>
      <div className="relative">
         <input type="text" placeholder="Search reg. no..." className="border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] text-sm rounded-2xl pl-4 pr-10 h-12 focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all placeholder-[#9CA3AF]" />
      </div>
    </div>
  );
}
