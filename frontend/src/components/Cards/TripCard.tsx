import { useState } from 'react';
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

  const [completing, setCompleting] = useState(false);
  const [fuelConsumed, setFuelConsumed] = useState(Math.round((trip.plannedDistance || 100) / 8));
  const [finalOdometer, setFinalOdometer] = useState(55000);

  const v = vehicles.find(v => v.id === trip.vehicleId);
  const d = drivers.find(d => d.id === trip.driverId);

  const getStatusStyle = (status: TripStatus) => {
    switch (status) {
      case 'Draft': return 'bg-[var(--color-6)] border border-[var(--color-3)] text-[var(--color-text-muted)]';
      case 'Dispatched': return 'bg-[var(--color-6)] border border-[var(--color-3)] text-[var(--color-1)]';
      case 'Completed': return 'bg-[var(--color-1)] text-white';
      case 'Cancelled': return 'bg-[var(--color-1)] text-white';
    }
  };

  const handleDispatch = () => {
    updateTripStatus(trip.id, 'Dispatched');
  };

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTripStatus(trip.id, 'Completed', {
      fuelConsumed: Number(fuelConsumed),
      finalOdometer: Number(finalOdometer),
    });
    setCompleting(false);
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this trip?')) {
      updateTripStatus(trip.id, 'Cancelled');
    }
  };

  return (
    <div className="border border-[var(--color-3)] rounded-[var(--radius-sm)] p-5 hover:border-[var(--color-1)]/20 transition-all bg-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="font-bold text-[var(--color-1)]">TRIP-{trip.id.substring(0, 8).toUpperCase()}</span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(trip.status)}`}>
              {trip.status}
            </span>
          </div>
          <div className="text-xs text-[var(--color-text-muted)] font-medium">Created: {new Date(trip.createdAt).toLocaleString()}</div>
        </div>

        <div className="flex items-center space-x-2">
          {trip.status === 'Draft' && (
            <button 
              onClick={handleDispatch}
              className="px-4 py-2 bg-[var(--color-1)] text-white text-xs font-semibold rounded-[var(--radius-sm)] hover:scale-105 transition-all"
            >
              Dispatch Trip
            </button>
          )}

          {trip.status === 'Dispatched' && !completing && (
            <>
              <button 
                onClick={() => setCompleting(true)}
                className="px-4 py-2 bg-[var(--color-1)] text-white text-xs font-semibold rounded-[var(--radius-sm)] hover:bg-[var(--color-success-soft)] text-[var(--color-success)] transition-colors"
              >
                Mark Completed
              </button>
              <button 
                onClick={handleCancel}
                className="px-3 py-2 bg-[var(--color-danger-soft)] text-red-600 border border-[var(--color-danger)] text-xs font-semibold rounded-[var(--radius-sm)] hover:bg-red-100 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {completing && (
        <form onSubmit={handleCompleteSubmit} className="mb-4 bg-[var(--color-6)] border border-[var(--color-3)] p-4 rounded-[var(--radius-sm)] space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--color-1)]">Complete Trip Details</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-[var(--color-text-muted)] mb-1 uppercase">Fuel Consumed (Liters)</label>
              <input 
                type="number" 
                value={fuelConsumed} 
                onChange={e => setFuelConsumed(Number(e.target.value))}
                className="w-full h-9 px-3 bg-white border border-[var(--color-3)] rounded-[var(--radius-sm)] text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]/20"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[var(--color-text-muted)] mb-1 uppercase">Final Odometer (km)</label>
              <input 
                type="number" 
                value={finalOdometer} 
                onChange={e => setFinalOdometer(Number(e.target.value))}
                className="w-full h-9 px-3 bg-white border border-[var(--color-3)] rounded-[var(--radius-sm)] text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]/20"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-1">
            <button 
              type="button" 
              onClick={() => setCompleting(false)}
              className="px-3 py-1.5 bg-white border border-[var(--color-3)] text-[var(--color-text-muted)] text-xs font-semibold rounded-lg hover:bg-[var(--color-6)]"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-3 py-1.5 bg-[var(--color-1)] text-white text-xs font-semibold rounded-lg hover:scale-105 transition-all"
            >
              Submit & Complete
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4 bg-[var(--color-6)] p-4 rounded-[var(--radius-sm)] border border-[var(--color-3)]">
        <div>
          <div className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] mb-1">Route</div>
          <div className="text-sm font-semibold text-[var(--color-1)]">{trip.source} <span className="mx-2 text-[var(--color-text-muted)]">→</span> {trip.destination}</div>
          <div className="text-xs text-[var(--color-text-muted)] mt-1">{trip.plannedDistance} km</div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] mb-1">Details</div>
          <div className="text-sm text-[var(--color-1)]">
            <span className="font-medium">Vehicle:</span> {v?.registrationNumber || trip.vehicleId}
          </div>
          <div className="text-sm text-[var(--color-1)]">
            <span className="font-medium">Driver:</span> {d?.name || trip.driverId}
          </div>
        </div>
      </div>

      {trip.status === 'Completed' && trip.completedAt && (
        <div className="text-xs text-[var(--color-1)] font-semibold bg-[var(--color-1)]/10 p-3 rounded-[var(--radius-sm)] flex justify-between items-center">
          <span>Completed at: {new Date(trip.completedAt).toLocaleString()}</span>
          {trip.fuelConsumed && <span>Fuel Used: {trip.fuelConsumed} L</span>}
        </div>
      )}
    </div>
  );
}
