import { useState } from 'react';
import { useVehicleStore } from '../store/useVehicleStore';
import { Plus, Filter } from 'lucide-react';
import type { VehicleStatus } from '../types';

export default function Vehicles() {
  const { vehicles, addVehicle, deleteVehicle } = useVehicleStore();

  const getStatusColor = (status: VehicleStatus) => {
    switch (status) {
      case 'Available': return 'bg-[#16A34A] text-white';
      case 'On Trip': return 'bg-[#FAFAFA] border border-[#ECECEC] text-[#111111]';
      case 'In Shop': return 'bg-[#F59E0B] text-white';
      case 'Retired': return 'bg-[#FAFAFA] border border-[#ECECEC] text-[#6B7280]';
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center bg-white p-6 rounded-[24px] border border-[#ECECEC] card-shadow">
        <div className="flex space-x-4 items-center">
          <select className="border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] text-sm rounded-2xl px-4 h-12 focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all">
            <option>Type: All</option>
          </select>
          <select className="border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] text-sm rounded-2xl px-4 h-12 focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all">
            <option>Status: All</option>
          </select>
          <div className="relative">
             <input type="text" placeholder="Search reg. no..." className="border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] text-sm rounded-2xl pl-4 pr-10 h-12 focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all placeholder-[#9CA3AF]" />
          </div>
        </div>
        <button className="flex items-center px-6 h-12 bg-[#0C0D0D] text-white font-semibold text-sm rounded-2xl hover:scale-[1.02] transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" /> Add Vehicle
        </button>
      </div>

      <div className="bg-white rounded-[24px] p-6 border border-[#ECECEC] card-shadow flex-1 overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1 hide-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-[#6B7280] border-b border-[#ECECEC]">
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Reg. No. (Unique)</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Name/Model</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Type</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Capacity</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Odometer</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Acq. Cost</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="text-[#111111]">
              {vehicles.map((v) => (
                <tr key={v.id} className="border-b border-[#ECECEC] last:border-0 hover:bg-neutral-50 transition-colors">
                  <td className="py-4 font-semibold">{v.registrationNumber}</td>
                  <td className="py-4 text-[#6B7280]">{v.name}</td>
                  <td className="py-4 text-[#6B7280]">{v.type}</td>
                  <td className="py-4 text-[#6B7280]">{v.maxLoadCapacity} kg</td>
                  <td className="py-4 text-[#6B7280]">{v.odometer.toLocaleString()} km</td>
                  <td className="py-4 text-[#6B7280]">${v.acquisitionCost.toLocaleString()}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(v.status)}`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pt-4 text-xs text-[#9CA3AF] font-medium border-t border-[#ECECEC] mt-4">
          Rule: Registration No. must be unique. Retired/In Shop vehicles are hidden from Trip Dispatcher.
        </div>
      </div>
    </div>
  );
}
