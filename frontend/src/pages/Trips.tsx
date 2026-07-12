import { useState } from 'react';
import { useTripStore } from '../store/useTripStore';
import { useVehicleStore } from '../store/useVehicleStore';
import { useDriverStore } from '../store/useDriverStore';
import type { TripStatus } from '../types';

export default function Trips() {
  const { trips, addTrip, updateTripStatus } = useTripStore();
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

  const getStatusStyle = (status: TripStatus) => {
    switch (status) {
      case 'Draft': return 'bg-[#FAFAFA] border border-[#ECECEC] text-[#6B7280]';
      case 'Dispatched': return 'bg-[#FAFAFA] border border-[#ECECEC] text-[#111111]';
      case 'Completed': return 'bg-[#16A34A] text-white';
      case 'Cancelled': return 'bg-[#DC2626] text-white';
    }
  };

  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  const availableDrivers = drivers.filter(d => d.status === 'Available');

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Create Trip Form */}
      <div className="w-full lg:w-1/3 flex flex-col">
        <div className="bg-white rounded-[24px] p-6 border border-[#ECECEC] card-shadow flex-1 overflow-y-auto hide-scrollbar">
          <h2 className="text-lg font-bold text-[#111111] tracking-tight mb-6">Create New Trip</h2>
          <form onSubmit={handleCreateTrip} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-2 uppercase tracking-wide">Source</label>
              <input type="text" value={source} onChange={e => setSource(e.target.value)} className="w-full h-12 px-4 bg-white border border-[#ECECEC] rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all placeholder-[#9CA3AF]" placeholder="Enter origin" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-2 uppercase tracking-wide">Destination</label>
              <input type="text" value={destination} onChange={e => setDestination(e.target.value)} className="w-full h-12 px-4 bg-white border border-[#ECECEC] rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all placeholder-[#9CA3AF]" placeholder="Enter destination" required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-2 uppercase tracking-wide">Cargo (kg)</label>
                <input type="number" value={cargoWeight} onChange={e => setCargoWeight(e.target.value)} className="w-full h-12 px-4 bg-white border border-[#ECECEC] rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all placeholder-[#9CA3AF]" placeholder="Weight" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#111111] mb-2 uppercase tracking-wide">Dist. (km)</label>
                <input type="number" value={plannedDistance} onChange={e => setPlannedDistance(e.target.value)} className="w-full h-12 px-4 bg-white border border-[#ECECEC] rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all placeholder-[#9CA3AF]" placeholder="Distance" required />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-2 uppercase tracking-wide">Assign Vehicle</label>
              <select value={vehicleId} onChange={e => setVehicleId(e.target.value)} className="w-full h-12 px-4 bg-white border border-[#ECECEC] rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all" required>
                <option value="">Select Vehicle</option>
                {availableVehicles.map(v => <option key={v.id} value={v.id}>{v.registrationNumber} - {v.type}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-2 uppercase tracking-wide">Assign Driver</label>
              <select value={driverId} onChange={e => setDriverId(e.target.value)} className="w-full h-12 px-4 bg-white border border-[#ECECEC] rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all" required>
                <option value="">Select Driver</option>
                {availableDrivers.map(d => <option key={d.id} value={d.id}>{d.name} ({d.licenseCategory})</option>)}
              </select>
            </div>

            <button type="submit" className="w-full h-12 bg-[#0C0D0D] text-white font-semibold text-sm rounded-2xl mt-4 hover:scale-[1.02] transition-all duration-200">
              Dispatch Trip
            </button>
            <p className="text-[10px] text-[#9CA3AF] text-center mt-2">Only 'Available' vehicles and drivers can be assigned.</p>
          </form>
        </div>
      </div>

      {/* Trip Timeline View */}
      <div className="w-full lg:w-2/3 flex flex-col">
        <div className="bg-white rounded-[24px] p-6 border border-[#ECECEC] card-shadow flex-1 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#111111] tracking-tight">Trip Dispatcher & Lifecycle</h2>
            <select className="border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] text-sm rounded-2xl px-4 h-10 focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all">
              <option>Status: All</option>
            </select>
          </div>
          
          <div className="overflow-y-auto flex-1 hide-scrollbar pr-2 space-y-4">
            {trips.length === 0 ? (
              <div className="text-center text-[#6B7280] py-10">No trips found. Create one to get started.</div>
            ) : trips.map(trip => {
              const v = vehicles.find(v => v.id === trip.vehicleId);
              const d = drivers.find(d => d.id === trip.driverId);
              return (
                <div key={trip.id} className="border border-[#ECECEC] rounded-2xl p-5 hover:border-[#111111]/20 transition-all">
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
