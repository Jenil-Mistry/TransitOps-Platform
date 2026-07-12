interface VehicleFiltersProps {
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function VehicleFilters({
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
}: VehicleFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        className="border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] text-xs font-semibold rounded-2xl px-3.5 h-11 focus:outline-none focus:ring-2 focus:ring-[#0C0D0D] transition-all"
      >
        <option value="All">Type: All</option>
        <option value="TRUCK">TRUCK</option>
        <option value="VAN">VAN</option>
        <option value="BUS">BUS</option>
        <option value="CAR">CAR</option>
        <option value="BIKE">BIKE</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] text-xs font-semibold rounded-2xl px-3.5 h-11 focus:outline-none focus:ring-2 focus:ring-[#0C0D0D] transition-all"
      >
        <option value="All">Status: All</option>
        <option value="Available">Available</option>
        <option value="On Trip">On Trip</option>
        <option value="In Shop">In Shop</option>
        <option value="Retired">Retired</option>
      </select>

      <div className="relative">
        <input
          type="text"
          placeholder="Search reg. no or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] text-xs font-semibold rounded-2xl pl-3.5 pr-10 h-11 focus:outline-none focus:ring-2 focus:ring-[#0C0D0D] transition-all placeholder-[#9CA3AF]"
        />
      </div>
    </div>
  );
}
