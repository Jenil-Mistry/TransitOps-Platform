import { Filter } from 'lucide-react';

interface DashboardFiltersProps {
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  regionFilter: string;
  setRegionFilter: (value: string) => void;
}

export default function DashboardFilters({
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  regionFilter,
  setRegionFilter,
}: DashboardFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-4 items-center bg-white p-4 rounded-[var(--radius-sm)] border border-[var(--color-3)] ">
      <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase flex items-center tracking-wider mr-2">
        <Filter className="w-4 h-4 mr-1 text-[var(--color-1)]" /> Dashboard Filters
      </span>

      {/* Vehicle Type Filter */}
      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        className="border-[var(--color-3)] bg-[var(--color-6)] text-[var(--color-1)] border text-xs font-semibold rounded-[var(--radius-sm)] px-3 py-2 h-10 focus:ring-1 focus:ring-[var(--color-brand)]/20 transition-all"
      >
        <option value="All">Vehicle Type: All</option>
        <option value="TRUCK">TRUCK</option>
        <option value="VAN">VAN</option>
        <option value="BUS">BUS</option>
        <option value="CAR">CAR</option>
        <option value="BIKE">BIKE</option>
      </select>

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border-[var(--color-3)] bg-[var(--color-6)] text-[var(--color-1)] border text-xs font-semibold rounded-[var(--radius-sm)] px-3 py-2 h-10 focus:ring-1 focus:ring-[var(--color-brand)]/20 transition-all"
      >
        <option value="All">Status: All</option>
        <option value="Available">Available</option>
        <option value="On Trip">On Trip</option>
        <option value="In Shop">In Shop</option>
        <option value="Retired">Retired</option>
      </select>

      {/* Region Filter (Default: India) */}
      <select
        value={regionFilter}
        onChange={(e) => setRegionFilter(e.target.value)}
        className="border-[var(--color-3)] bg-[var(--color-6)] text-[var(--color-1)] border text-xs font-semibold rounded-[var(--radius-sm)] px-3 py-2 h-10 focus:ring-1 focus:ring-[var(--color-brand)]/20 transition-all"
      >
        <option value="India">Region: India (Default)</option>
        <option value="All">Region: All Regions</option>
        <option value="North India">North India</option>
        <option value="South India">South India</option>
        <option value="West India">West India</option>
        <option value="East India">East India</option>
      </select>
    </div>
  );
}
