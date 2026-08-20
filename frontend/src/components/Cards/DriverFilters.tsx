interface DriverFiltersProps {
  classFilter: string;
  setClassFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function DriverFilters({
  classFilter,
  setClassFilter,
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
}: DriverFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        value={classFilter}
        onChange={(e) => setClassFilter(e.target.value)}
        className="border border-[var(--color-3)] bg-[var(--color-6)] text-[var(--color-1)] text-xs font-semibold rounded-[var(--radius-sm)] px-3.5 h-11 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 transition-all"
      >
        <option value="All">License Class: All</option>
        <option value="Class A">Class A</option>
        <option value="Class B">Class B</option>
        <option value="Class C">Class C</option>
        <option value="Heavy Vehicle">Heavy Vehicle</option>
        <option value="Commercial">Commercial</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border border-[var(--color-3)] bg-[var(--color-6)] text-[var(--color-1)] text-xs font-semibold rounded-[var(--radius-sm)] px-3.5 h-11 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 transition-all"
      >
        <option value="All">Status: All</option>
        <option value="Available">Available</option>
        <option value="On Trip">On Trip</option>
        <option value="Off Duty">Off Duty</option>
        <option value="Suspended">Suspended</option>
      </select>

      <div className="relative">
        <input
          type="text"
          placeholder="Search driver name or license..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-[var(--color-3)] bg-[var(--color-6)] text-[var(--color-1)] text-xs font-semibold rounded-[var(--radius-sm)] pl-3.5 pr-10 h-11 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20 transition-all placeholder-[var(--color-text-disabled)]"
        />
      </div>
    </div>
  );
}
