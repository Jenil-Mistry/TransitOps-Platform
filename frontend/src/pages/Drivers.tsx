import { useState } from 'react';
import { useDriverStore } from '../store/useDriverStore';
import type { DriverStatus } from '../types';
import { Plus } from 'lucide-react';

export default function Drivers() {
  const { drivers } = useDriverStore();

  const getStatusColor = (status: DriverStatus) => {
    switch (status) {
      case 'Available': return 'bg-[#16A34A] text-white';
      case 'On Trip': return 'bg-[#FAFAFA] border border-[#ECECEC] text-[#111111]';
      case 'Off Duty': return 'bg-[#FAFAFA] text-[#6B7280]';
      case 'Suspended': return 'bg-[#DC2626] text-white';
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center bg-white p-6 rounded-[24px] border border-[#ECECEC] card-shadow">
        <div className="flex space-x-4 items-center">
          <select className="border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] text-sm rounded-2xl px-4 h-12 focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all">
            <option>License Class: All</option>
          </select>
          <select className="border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] text-sm rounded-2xl px-4 h-12 focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all">
            <option>Status: All</option>
          </select>
          <div className="relative">
             <input type="text" placeholder="Search driver name..." className="border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] text-sm rounded-2xl pl-4 pr-10 h-12 focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all placeholder-[#9CA3AF]" />
          </div>
        </div>
        <button className="flex items-center px-6 h-12 bg-[#0C0D0D] text-white font-semibold text-sm rounded-2xl hover:scale-[1.02] transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" /> Add Driver
        </button>
      </div>

      <div className="bg-white rounded-[24px] p-6 border border-[#ECECEC] card-shadow flex-1 overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1 hide-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-[#6B7280] border-b border-[#ECECEC]">
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Name</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">License No.</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Class</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Expiry</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Contact</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Safety Score</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="text-[#111111]">
              {drivers.map((d) => (
                <tr key={d.id} className="border-b border-[#ECECEC] last:border-0 hover:bg-neutral-50 transition-colors">
                  <td className="py-4 font-semibold">{d.name}</td>
                  <td className="py-4 text-[#6B7280]">{d.licenseNumber}</td>
                  <td className="py-4 text-[#6B7280]">{d.licenseCategory}</td>
                  <td className="py-4 text-[#6B7280]">{d.licenseExpiryDate}</td>
                  <td className="py-4 text-[#6B7280]">{d.contactNumber}</td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="w-full bg-[#ECECEC] rounded-full h-2 mr-2 max-w-[100px]">
                        <div className={`h-2 rounded-full ${d.safetyScore > 80 ? 'bg-[#16A34A]' : d.safetyScore > 60 ? 'bg-[#F59E0B]' : 'bg-[#DC2626]'}`} style={{width: `${d.safetyScore}%`}}></div>
                      </div>
                      <span className="text-xs font-semibold text-[#111111]">{d.safetyScore}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(d.status)}`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 pt-4 border-t border-[#ECECEC] flex items-center space-x-6">
          <div className="flex items-center text-xs font-medium text-[#6B7280]">
            <span className="px-2 py-1 bg-[#DC2626] text-white rounded-md text-[10px] font-bold mr-2">Suspended</span>
            Rule: Expired license or Suspended status {'->'} blocked from trip assignment.
          </div>
        </div>
      </div>
    </div>
  );
}
