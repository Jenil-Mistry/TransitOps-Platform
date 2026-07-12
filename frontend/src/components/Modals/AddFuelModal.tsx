import { useState } from 'react';
import { X, Fuel } from 'lucide-react';
import { useExpenseStore } from '../../store/useExpenseStore';
import { useVehicleStore } from '../../store/useVehicleStore';
import { useTripStore } from '../../store/useTripStore';

interface AddFuelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddFuelModal({ isOpen, onClose }: AddFuelModalProps) {
  const { addFuelLog } = useExpenseStore();
  const { vehicles } = useVehicleStore();
  const { trips } = useTripStore();

  const [vehicleId, setVehicleId] = useState('');
  const [tripId, setTripId] = useState('');
  const [liters, setLiters] = useState('150');
  const [cost, setCost] = useState('12000');
  const [odometer, setOdometer] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!vehicleId) {
      setError('Please select a vehicle.');
      setLoading(false);
      return;
    }

    try {
      await addFuelLog({
        vehicleId,
        tripId: tripId || undefined,
        liters: Number(liters) || 0,
        cost: Number(cost) || 0,
        date: new Date(date).toISOString(),
      });
      // Reset form
      setVehicleId('');
      setTripId('');
      setLiters('150');
      setCost('12000');
      setOdometer('');
      onClose();
    } catch (err: any) {
      console.error('Error logging fuel expense:', err);
      const serverMsg = err?.response?.data?.error?.message || err?.response?.data?.message || err.message;
      setError(serverMsg || 'Failed to log fuel expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter trips for the selected vehicle if one is selected
  const eligibleTrips = vehicleId
    ? trips.filter((t) => t.vehicleId === vehicleId)
    : trips;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-[28px] border border-[#ECECEC] w-full max-w-lg card-shadow overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#ECECEC] flex items-center justify-between bg-[#FAFAFA]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#0C0D0D] text-white flex items-center justify-center shadow-sm">
              <Fuel className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111111] tracking-tight">Log Fuel Expense</h3>
              <p className="text-xs text-[#6B7280]">Record fuel fill-up and cost into your Neon DB</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#ECECEC] flex items-center justify-center text-[#6B7280] hover:text-[#111111] hover:bg-[#FAFAFA] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center">
              <span className="font-semibold mr-1">Error:</span> {error}
            </div>
          )}

          {/* Vehicle Selection */}
          <div>
            <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
              Select Vehicle *
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
              required
            >
              <option value="">-- Choose a vehicle --</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.registrationNumber} — {v.name} ({v.type})
                </option>
              ))}
            </select>
          </div>

          {/* Trip Selection (Optional) */}
          <div>
            <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
              Associated Trip (Optional)
            </label>
            <select
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
            >
              <option value="">-- No trip associated / Standalone --</option>
              {eligibleTrips.map((t) => (
                <option key={t.id} value={t.id}>
                  Trip #{t.id.slice(-6)} ({t.status}) — {t.origin} to {t.destination}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Liters */}
            <div>
              <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
                Volume (Liters) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="150"
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
                required
              />
            </div>

            {/* Cost in Rupee */}
            <div>
              <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
                Total Cost (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="12000"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
                required
              />
            </div>

            {/* Odometer */}
            <div>
              <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
                Odometer Reading (km)
              </label>
              <input
                type="number"
                placeholder="e.g. 15400"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[#ECECEC]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 h-11 rounded-2xl bg-[#FAFAFA] border border-[#ECECEC] text-[#6B7280] hover:text-[#111111] text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 h-11 rounded-2xl bg-[#0C0D0D] text-white hover:scale-[1.02] text-xs font-bold transition-all shadow-sm disabled:opacity-50 flex items-center"
            >
              {loading ? 'Saving to Database...' : 'Log Fuel Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
