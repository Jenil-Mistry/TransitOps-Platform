import { useTripStore } from '../../store/useTripStore';
import TripCard from './TripCard';
import TripFilters from './TripFilters';

export default function TripList() {
  const { trips } = useTripStore();

  return (
    <div className="bg-white rounded-[24px] p-6 border border-[var(--color-3)]  flex-1 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-[var(--color-1)] tracking-tight">Trip Dispatcher & Lifecycle</h2>
        <TripFilters />
      </div>
      
      <div className="overflow-y-auto flex-1 hide-scrollbar pr-2 space-y-4">
        {trips.length === 0 ? (
          <div className="text-center text-[var(--color-text-muted)] py-10">No trips found. Create one to get started.</div>
        ) : trips.map(trip => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
}
