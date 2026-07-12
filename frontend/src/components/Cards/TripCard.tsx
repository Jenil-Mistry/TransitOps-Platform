import { useTripStore } from '../../store/useTripStore';
import { useVehicleStore } from '../../store/useVehicleStore';
import { useDriverStore } from '../../store/useDriverStore';
import type { Trip, TripStatus } from '../../types';

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  const { updateTripStatus } = useTripStore();
  const { vehicles } = useVehicleStore();
  const { drivers } = useDriverStore();

  const v = vehicles.find(v => v.id === trip.vehicleId);
  const d = drivers.find(d => d.id === trip.driverId);

  const getStatusStyle = (status: TripStatus) => {
    switch (status) {
      case 'Draft': return 'bg-[#FAFAFA] border border-[#ECECEC] text-[#6B7280]';
      case 'Dispatched': return 'bg-[#FAFAFA] border border-[#ECECEC] text-[#111111]';
      case 'Completed': return 'bg-[#16A34A] text-white';
      case 'Cancelled': return 'bg-[#DC2626] text-white';
    }
  };

  return (
    <div className="border border-[#ECECEC] rounded-2xl p-5 hover:border-[#111111]/20 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="font-bold text-[#111111]">TRIP-{trip.id.toUpperCase()}</span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(trip.status)}`}>
              {trip.status}
            </span>
          </div>
          <div className="text-xs text-[#6B7280] font-medium">Created: {new Date(trip.createdAt).toLocaleString()}</div>
        </div>
        {trip.status === 'Dispatched' && (
          <button 
            onClick={() => updateTripStatus(trip.id, 'Completed')}
            className="px-4 py-2 bg-[#FAFAFA] border border-[#ECECEC] text-[#111111] text-xs font-semibold rounded-xl hover:bg-[#F3F4F6] transition-colors"
          >
            Mark Completed
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 bg-[#FAFAFA] p-4 rounded-xl border border-[#ECECEC]">
        <div>
          <div className="text-[10px] uppercase font-bold text-[#9CA3AF] mb-1">Route</div>
          <div className="text-sm font-semibold text-[#111111]">{trip.source} <span className="mx-2 text-[#9CA3AF]">→</span> {trip.destination}</div>
          <div className="text-xs text-[#6B7280] mt-1">{trip.plannedDistance} km</div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-[#9CA3AF] mb-1">Details</div>
          <div className="text-sm text-[#111111]">
            <span className="font-medium">Vehicle:</span> {v?.registrationNumber}
          </div>
          <div className="text-sm text-[#111111]">
            <span className="font-medium">Driver:</span> {d?.name}
          </div>
        </div>
      </div>

      {trip.status === 'Completed' && trip.completedAt && (
        <div className="text-xs text-[#16A34A] font-semibold bg-[#16A34A]/10 p-3 rounded-xl">
          Completed at: {new Date(trip.completedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
}
