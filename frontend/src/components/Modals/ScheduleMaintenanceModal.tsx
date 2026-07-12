import { useState } from 'react';
import { X, PenTool, CheckCircle2 } from 'lucide-react';
import { useMaintenanceStore } from '../../store/useMaintenanceStore';
import { useVehicleStore } from '../../store/useVehicleStore';

interface ScheduleMaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICE_TYPES = [
  'Oil Change',
  'Brake Inspection',
  'Tire Replacement',
  'Engine Overhaul',
  'Transmission Service',
  'Battery Replacement',
  'General Inspection',
  'Electrical Repair',
];

export default function ScheduleMaintenanceModal({ isOpen, onClose }: ScheduleMaintenanceModalProps) {
  const { addLog } = useMaintenanceStore();
  const { vehicles } = useVehicleStore();

  const [vehicleId, setVehicleId] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>(['General Inspection']);
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('500');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Only show vehicles that are strictly Available (NOT those already marked In Shop, On Trip, or Retired)
  const eligibleVehicles = vehicles.filter(
    (v) => v.status === 'Available'
  );

  if (!isOpen) return null;

  const toggleService = (st: string) => {
    if (selectedServices.includes(st)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((item) => item !== st));
      }
    } else {
      setSelectedServices([...selectedServices, st]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!vehicleId) {
      setError('Please select an available vehicle.');
      setLoading(false);
      return;
    }

    if (selectedServices.length === 0) {
      setError('Please select at least one service type.');
      setLoading(false);
      return;
    }

    try {
      const combinedServiceType = selectedServices.join(', ');
      await addLog({
        vehicleId,
        date: new Date().toISOString(),
        description: `[${combinedServiceType}] ${description}`.trim(),
        cost: Number(cost) || 0,
        status: 'Open',
      });
      // Reset form
      setVehicleId('');
      setSelectedServices(['General Inspection']);
      setDescription('');
      setCost('500');
      onClose();
    } catch (err: any) {
      console.error('Error scheduling maintenance:', err);
      const serverMsg = err?.response?.data?.error?.message || err?.response?.data?.message || err.message;
      setError(serverMsg || 'Failed to schedule maintenance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-[28px] border border-[#ECECEC] w-full max-w-lg card-shadow overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#ECECEC] flex items-center justify-between bg-[#FAFAFA]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#0C0D0D] text-white flex items-center justify-center shadow-sm">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111111] tracking-tight">Schedule Maintenance</h3>
              <p className="text-xs text-[#6B7280]">Available vehicle will be moved to "In Shop" automatically</p>
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
              Select Available Vehicle *
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
              required
            >
              <option value="">-- Choose an available vehicle --</option>
              {eligibleVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.registrationNumber} — {v.name} ({v.status})
                </option>
              ))}
            </select>
            {eligibleVehicles.length === 0 && (
              <p className="mt-1.5 text-[10px] text-[#F59E0B] font-semibold">
                ⚠ No available vehicles found. Vehicles currently In Shop, On Trip, or Retired cannot be scheduled.
              </p>
            )}
          </div>

          {/* Multiple Service Type Selection */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wide">
                Service Types (Select Multiple) *
              </label>
              <span className="text-[10px] text-[#9CA3AF] font-medium">
                {selectedServices.length} selected
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SERVICE_TYPES.map((st) => {
                const isSelected = selectedServices.includes(st);
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => toggleService(st)}
                    className={`h-9 text-[11px] font-semibold rounded-xl border transition-all flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#0C0D0D] text-white border-[#0C0D0D] shadow-sm'
                        : 'bg-[#FAFAFA] text-[#6B7280] border-[#ECECEC] hover:bg-white hover:text-[#111111]'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3 h-3 mr-1 text-green-400" />}
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
              Additional Notes / Problem Details
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe all issues (e.g. Brake grinding sound, oil leak on right side)..."
              rows={3}
              className="w-full px-3.5 py-2.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all resize-none"
            />
          </div>

          {/* Estimated Cost */}
          <div>
            <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
              Estimated Total Cost (₹) *
            </label>
            <input
              type="number"
              min="0"
              placeholder="500"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
              required
            />
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
              {loading ? 'Scheduling...' : 'Schedule Maintenance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
