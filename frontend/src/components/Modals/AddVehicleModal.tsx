import { useState } from 'react';
import { X, Truck, CheckCircle2 } from 'lucide-react';
import { useVehicleStore } from '../../store/useVehicleStore';
import type { VehicleStatus } from '../../types';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddVehicleModal({ isOpen, onClose }: AddVehicleModalProps) {
  const { addVehicle } = useVehicleStore();

  const [registrationNumber, setRegistrationNumber] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('Truck');
  const [maxLoadCapacity, setMaxLoadCapacity] = useState('10000');
  const [odometer, setOdometer] = useState('15000');
  const [acquisitionCost, setAcquisitionCost] = useState('50000');
  const [status, setStatus] = useState<VehicleStatus>('Available');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addVehicle({
        registrationNumber: registrationNumber.trim(),
        name: name.trim(),
        type,
        maxLoadCapacity: Number(maxLoadCapacity),
        odometer: Number(odometer),
        acquisitionCost: Number(acquisitionCost),
        status,
      });
      // Reset form
      setRegistrationNumber('');
      setName('');
      onClose();
    } catch (err: any) {
      console.error('Error adding vehicle:', err);
      const serverMsg = err?.response?.data?.error?.message || err?.response?.data?.message || err.message;
      setError(serverMsg || 'Failed to add vehicle. Ensure registration number is unique.');
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
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111111] tracking-tight">Add New Fleet Vehicle</h3>
              <p className="text-xs text-[#6B7280]">Register a new asset into your Neon database</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#ECECEC] flex items-center justify-center text-[#6B7280] hover:text-[#111111] hover:bg-[#FAFAFA] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center">
              <span className="font-semibold mr-1">Error:</span> {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
                Registration No. *
              </label>
              <input
                type="text"
                placeholder="e.g. TRK-404-CA"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
                Vehicle Name / Model *
              </label>
              <input
                type="text"
                placeholder="e.g. Volvo FH16"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
                Vehicle Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
              >
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Refrigerated Truck">Refrigerated Truck</option>
                <option value="Flatbed Trailer">Flatbed Trailer</option>
                <option value="Tanker">Tanker</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
                Max Load Capacity (kg) *
              </label>
              <input
                type="number"
                placeholder="10000"
                value={maxLoadCapacity}
                onChange={(e) => setMaxLoadCapacity(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
                Current Odometer (km) *
              </label>
              <input
                type="number"
                placeholder="15000"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
                Acquisition Cost ($) *
              </label>
              <input
                type="number"
                placeholder="50000"
                value={acquisitionCost}
                onChange={(e) => setAcquisitionCost(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
              Initial Operational Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Available', 'In Shop', 'Retired'] as VehicleStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`h-10 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center ${
                    status === st
                      ? 'bg-[#0C0D0D] text-white border-[#0C0D0D] shadow-sm'
                      : 'bg-[#FAFAFA] text-[#6B7280] border-[#ECECEC] hover:bg-white hover:text-[#111111]'
                  }`}
                >
                  {status === st && <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-400" />}
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
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
              {loading ? 'Saving to Database...' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
