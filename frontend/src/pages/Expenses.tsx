import { useExpenseStore } from '../store/useExpenseStore';
import { useVehicleStore } from '../store/useVehicleStore';
import { useMaintenanceStore } from '../store/useMaintenanceStore';
import { Plus } from 'lucide-react';

export default function Expenses() {
  const { fuelLogs } = useExpenseStore();
  const { vehicles } = useVehicleStore();
  const { logs: maintenanceLogs } = useMaintenanceStore();

  const totalFuel = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
  const totalMaintenance = maintenanceLogs.reduce((sum, log) => sum + log.cost, 0);
  const totalExpenses = totalFuel + totalMaintenance;

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[24px] p-6 border border-[#ECECEC] card-shadow">
          <div className="text-[10px] font-bold text-[#6B7280] tracking-wider mb-2">TOTAL EXPENSES</div>
          <div className="text-4xl font-extrabold text-[#111111]">${totalExpenses.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-[24px] p-6 border border-[#ECECEC] card-shadow">
          <div className="text-[10px] font-bold text-[#6B7280] tracking-wider mb-2">FUEL COSTS</div>
          <div className="text-4xl font-extrabold text-[#111111]">${totalFuel.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-[24px] p-6 border border-[#ECECEC] card-shadow">
          <div className="text-[10px] font-bold text-[#6B7280] tracking-wider mb-2">MAINTENANCE COSTS</div>
          <div className="text-4xl font-extrabold text-[#111111]">${totalMaintenance.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-6 rounded-[24px] border border-[#ECECEC] card-shadow">
        <div className="flex space-x-4 items-center">
          <select className="border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] text-sm rounded-2xl px-4 h-12 focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all">
            <option>Type: All (Fuel/Maintenance)</option>
          </select>
          <select className="border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] text-sm rounded-2xl px-4 h-12 focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all">
            <option>Time: This Month</option>
          </select>
        </div>
        <button className="flex items-center px-6 h-12 bg-[#0C0D0D] text-white font-semibold text-sm rounded-2xl hover:scale-[1.02] transition-all duration-200">
          <Plus className="w-4 h-4 mr-2" /> Log Fuel Expense
        </button>
      </div>

      <div className="bg-white rounded-[24px] p-6 border border-[#ECECEC] card-shadow flex-1 overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1 hide-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-[#6B7280] border-b border-[#ECECEC]">
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Date</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Type</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Vehicle</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Details</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="text-[#111111]">
              {/* Mixed Logs for Demo */}
              {fuelLogs.map((log) => {
                const v = vehicles.find(v => v.id === log.vehicleId);
                return (
                  <tr key={`f-${log.id}`} className="border-b border-[#ECECEC] last:border-0 hover:bg-neutral-50 transition-colors">
                    <td className="py-4 text-[#6B7280]">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-[#FAFAFA] border border-[#ECECEC] text-[#111111] rounded-full text-[10px] font-bold uppercase tracking-wider">Fuel</span>
                    </td>
                    <td className="py-4 font-semibold">{v?.registrationNumber}</td>
                    <td className="py-4 text-[#6B7280]">{log.liters} Liters logged</td>
                    <td className="py-4 font-semibold text-right">${log.cost.toLocaleString()}</td>
                  </tr>
                );
              })}
              {maintenanceLogs.map((log) => {
                const v = vehicles.find(v => v.id === log.vehicleId);
                return (
                  <tr key={`m-${log.id}`} className="border-b border-[#ECECEC] last:border-0 hover:bg-neutral-50 transition-colors">
                    <td className="py-4 text-[#6B7280]">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 bg-[#FAFAFA] border border-[#ECECEC] text-[#111111] rounded-full text-[10px] font-bold uppercase tracking-wider">Maintenance</span>
                    </td>
                    <td className="py-4 font-semibold">{v?.registrationNumber}</td>
                    <td className="py-4 text-[#6B7280]">{log.description}</td>
                    <td className="py-4 font-semibold text-right">${log.cost.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
