import { useState } from 'react';
import { Check } from 'lucide-react';

export default function Settings() {
  const [depotName, setDepotName] = useState('Gandhinagar Depot GJN');
  const [currency, setCurrency] = useState('INR (Rs)');
  const [distanceUnit, setDistanceUnit] = useState('Kilometers (km)');
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white rounded-[24px] p-8 border border-[#ECECEC] card-shadow">
        <h2 className="text-xl font-bold text-[#111111] mb-6 tracking-tight">General Settings</h2>
        
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#111111] mb-2 uppercase tracking-wide">Depot Name / Org Name</label>
            <input type="text" value={depotName} onChange={e => setDepotName(e.target.value)} className="w-full h-12 px-4 bg-white border border-[#ECECEC] rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all placeholder-[#9CA3AF]" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-2 uppercase tracking-wide">Currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} className="w-full h-12 px-4 bg-white border border-[#ECECEC] rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all">
                <option>INR (Rs)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#111111] mb-2 uppercase tracking-wide">Distance Unit</label>
              <select value={distanceUnit} onChange={e => setDistanceUnit(e.target.value)} className="w-full h-12 px-4 bg-white border border-[#ECECEC] rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all">
                <option>Kilometers (km)</option>
                <option>Miles (mi)</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-[#ECECEC]">
            <h3 className="text-sm font-bold text-[#111111] mb-4 tracking-tight">Notifications</h3>
            <label className="flex items-center space-x-3 cursor-pointer">
              <div 
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${emailAlerts ? 'bg-[#0C0D0D] border-[#0C0D0D]' : 'border-[#ECECEC] bg-white'}`}
              >
                {emailAlerts && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
              <span className="text-sm text-[#111111] font-medium">Enable Email Alerts for Trip Completions</span>
            </label>
          </div>

          <div className="pt-6">
            <button className="h-12 px-8 bg-[#0C0D0D] text-white font-semibold text-sm rounded-2xl hover:scale-[1.02] transition-all duration-200">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
