import { useState } from 'react';
import { useTripStore } from '../../store/useTripStore';
import { useVehicleStore } from '../../store/useVehicleStore';
import { useDriverStore } from '../../store/useDriverStore';

export default function TripForm() {
  const { addTrip } = useTripStore();
  const { vehicles } = useVehicleStore();
  const { drivers } = useDriverStore();

  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [plannedDistance, setPlannedDistance] = useState('');

  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !destination || !vehicleId || !driverId || !cargoWeight || !plannedDistance) return;
    
    addTrip({
      source,
      destination,
      vehicleId,
      driverId,
      cargoWeight: Number(cargoWeight),
      plannedDistance: Number(plannedDistance),
    });
    setSource('');
    setDestination('');
    setVehicleId('');
    setDriverId('');
    setCargoWeight('');
    setPlannedDistance('');
  };

  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  const availableDrivers = drivers.filter(d => d.status === 'Available');

  return (
    <div className="bg-white rounded-[24px] p-6 border border-[var(--color-3)]  flex-1 overflow-y-auto hide-scrollbar">
      <h2 className="text-lg font-bold text-[var(--color-1)] tracking-tight mb-6">Create New Trip</h2>
      <form onSubmit={handleCreateTrip} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-[var(--color-1)] mb-2 uppercase tracking-wide">Source</label>
          <input type="text" value={source} onChange={e => setSource(e.target.value)} className="w-full h-12 px-4 bg-white border border-[var(--color-3)] rounded-[var(--radius-sm)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]/20 transition-all placeholder-[var(--color-text-disabled)]" placeholder="Enter origin" required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[var(--color-1)] mb-2 uppercase tracking-wide">Destination</label>
          <input type="text" value={destination} onChange={e => setDestination(e.target.value)} className="w-full h-12 px-4 bg-white border border-[var(--color-3)] rounded-[var(--radius-sm)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]/20 transition-all placeholder-[var(--color-text-disabled)]" placeholder="Enter destination" required />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-1)] mb-2 uppercase tracking-wide">Cargo (kg)</label>
            <input type="number" value={cargoWeight} onChange={e => setCargoWeight(e.target.value)} className="w-full h-12 px-4 bg-white border border-[var(--color-3)] rounded-[var(--radius-sm)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]/20 transition-all placeholder-[var(--color-text-disabled)]" placeholder="Weight" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-1)] mb-2 uppercase tracking-wide">Dist. (km)</label>
            <input type="number" value={plannedDistance} onChange={e => setPlannedDistance(e.target.value)} className="w-full h-12 px-4 bg-white border border-[var(--color-3)] rounded-[var(--radius-sm)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]/20 transition-all placeholder-[var(--color-text-disabled)]" placeholder="Distance" required />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-1)] mb-2 uppercase tracking-wide">Assign Vehicle</label>
          <select value={vehicleId} onChange={e => setVehicleId(e.target.value)} className="w-full h-12 px-4 bg-white border border-[var(--color-3)] rounded-[var(--radius-sm)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]/20 transition-all" required>
            <option value="">Select Vehicle</option>
            {availableVehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNumber} - {v.type}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--color-1)] mb-2 uppercase tracking-wide">Assign Driver</label>
          <select value={driverId} onChange={e => setDriverId(e.target.value)} className="w-full h-12 px-4 bg-white border border-[var(--color-3)] rounded-[var(--radius-sm)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]/20 transition-all" required>
            <option value="">Select Driver</option>
            {availableDrivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.licenseCategory})</option>)}
          </select>
        </div>

        <button type="submit" className="w-full h-12 bg-[var(--color-1)] text-white font-semibold text-sm rounded-[var(--radius-sm)] mt-4 hover:scale-[1.02] transition-all duration-200">
          Dispatch Trip
        </button>
        <p className="text-[10px] text-[var(--color-text-muted)] text-center mt-2">Only 'Available' vehicles and drivers can be assigned.</p>
      </form>
    </div>
  );
}
