import { useState } from 'react';
import { X, Users, CheckCircle2 } from 'lucide-react';
import { useDriverStore } from '../../store/useDriverStore';
import type { DriverStatus } from '../../types';

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddDriverModal({ isOpen, onClose }: AddDriverModalProps) {
  const { addDriver } = useDriverStore();

  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseCategory, setLicenseCategory] = useState('Heavy Motor Vehicle (HMV)');
  const [licenseExpiryDate, setLicenseExpiryDate] = useState('2028-12-31');
  const [contactNumber, setContactNumber] = useState('');
  const [safetyScore, setSafetyScore] = useState('100');
  const [status, setStatus] = useState<DriverStatus>('Available');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addDriver({
        name: name.trim(),
        licenseNumber: licenseNumber.trim(),
        licenseCategory: licenseCategory.trim(),
        licenseExpiryDate,
        contactNumber: contactNumber.trim(),
        safetyScore: Number(safetyScore) || 100,
        status,
      });
      // Reset form
      setName('');
      setLicenseNumber('');
      setContactNumber('');
      onClose();
    } catch (err: any) {
      console.error('Error adding driver:', err);
      const serverMsg = err?.response?.data?.error?.message || err?.response?.data?.message || err.message;
      setError(serverMsg || 'Failed to add driver. Ensure license number is unique.');
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
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111111] tracking-tight">Add New Driver & Credentials</h3>
              <p className="text-xs text-[#6B7280]">Register driver profile & license into Neon DB</p>
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
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Jason Statham"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
                License No. (Credential ID) *
              </label>
              <input
                type="text"
                placeholder="e.g. DL-CA-992384"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
                License Category *
              </label>
              <select
                value={licenseCategory}
                onChange={(e) => setLicenseCategory(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
              >
                <option value="Heavy Motor Vehicle (HMV)">Heavy Motor Vehicle (HMV)</option>
                <option value="Light Motor Vehicle (LMV)">Light Motor Vehicle (LMV)</option>
                <option value="Commercial Articulated (Class A)">Commercial Articulated (Class A)</option>
                <option value="Hazardous Materials (HazMat)">Hazardous Materials (HazMat)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
                License Expiry Date *
              </label>
              <input
                type="date"
                value={licenseExpiryDate}
                onChange={(e) => setLicenseExpiryDate(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
                Contact Phone No. *
              </label>
              <input
                type="text"
                placeholder="+1-555-0182"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
                Initial Safety Score (0-100) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="100"
                value={safetyScore}
                onChange={(e) => setSafetyScore(e.target.value)}
                className="w-full h-11 px-3.5 bg-[#FAFAFA] border border-[#ECECEC] rounded-2xl text-sm font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0C0D0D] transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1.5 tracking-wide">
              Initial Duty Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Available', 'Off Duty', 'Suspended'] as DriverStatus[]).map((st) => (
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
              {loading ? 'Saving Driver...' : 'Add Driver Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
