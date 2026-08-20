export default function TripFilters() {
  return (
    <select className="border border-[var(--color-3)] bg-[var(--color-6)] text-[var(--color-1)] text-sm rounded-[var(--radius-sm)] px-4 h-10 focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]/20 transition-all">
      <option>Status: All</option>
    </select>
  );
}
