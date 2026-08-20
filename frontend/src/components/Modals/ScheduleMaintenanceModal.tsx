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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-1)]/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-[28px] border border-[var(--color-3)] w-full max-w-lg  overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--color-3)] flex items-center justify-between bg-[var(--color-6)]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-[var(--color-1)] text-white flex items-center justify-center ">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--color-1)] tracking-tight">Schedule Maintenance</h3>
              <p className="text-xs text-[var(--color-text-muted)]">Available vehicle will be moved to "In Shop" automatically</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[var(--color-3)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-1)] hover:bg-[var(--color-6)] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-[var(--color-danger-soft)] border border-[var(--color-danger)] text-[var(--color-danger)] text-xs rounded-[var(--radius-sm)] flex items-center">
              <span className="font-semibold mr-1">Error:</span> {error}
            </div>
          )}

          {/* Vehicle Selection */}
          <div>
            <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase mb-1.5 tracking-wide">
              Select Available Vehicle *
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full h-11 px-3.5 bg-[var(--color-6)] border border-[var(--color-3)] rounded-[var(--radius-sm)] text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[var(--color-brand)]/20 transition-all"
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
              <p className="mt-1.5 text-[10px] text-[var(--color-2)] font-semibold">
                ⚠ No available vehicles found. Vehicles currently In Shop, On Trip, or Retired cannot be scheduled.
              </p>
            )}
          </div>

          {/* Multiple Service Type Selection */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wide">
                Service Types (Select Multiple) *
              </label>
              <span className="text-[10px] text-[var(--color-text-muted)] font-medium">
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
                    className={`h-9 text-[11px] font-semibold rounded-[var(--radius-sm)] border transition-all flex items-center justify-center ${
                      isSelected
                        ? 'bg-[var(--color-1)] text-white border-[var(--color-1)] '
                        : 'bg-[var(--color-6)] text-[var(--color-text-muted)] border-[var(--color-3)] hover:bg-white hover:text-[var(--color-1)]'
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
            <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase mb-1.5 tracking-wide">
              Additional Notes / Problem Details
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe all issues (e.g. Brake grinding sound, oil leak on right side)..."
              rows={3}
              className="w-full px-3.5 py-2.5 bg-[var(--color-6)] border border-[var(--color-3)] rounded-[var(--radius-sm)] text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[var(--color-brand)]/20 transition-all resize-none"
            />
          </div>

          {/* Estimated Cost */}
          <div>
            <label className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase mb-1.5 tracking-wide">
              Estimated Total Cost (₹) *
            </label>
            <input
              type="number"
              min="0"
              placeholder="500"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full h-11 px-3.5 bg-[var(--color-6)] border border-[var(--color-3)] rounded-[var(--radius-sm)] text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[var(--color-brand)]/20 transition-all"
              required
            />
          </div>

          {/* Footer */}
          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-[var(--color-3)]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 h-11 rounded-[var(--radius-sm)] bg-[var(--color-6)] border border-[var(--color-3)] text-[var(--color-text-muted)] hover:text-[var(--color-1)] text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 h-11 rounded-[var(--radius-sm)] bg-[var(--color-1)] text-white hover:scale-[1.02] text-xs font-bold transition-all  disabled:opacity-50 flex items-center"
            >
              {loading ? 'Scheduling...' : 'Schedule Maintenance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
