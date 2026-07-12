import { useState } from 'react';
import { useExpenseStore } from '../store/useExpenseStore';
import { useVehicleStore } from '../store/useVehicleStore';
import { useMaintenanceStore } from '../store/useMaintenanceStore';
import { Plus } from 'lucide-react';
import AddFuelModal from '../components/Modals/AddFuelModal';

export default function Expenses() {
  const { fuelLogs } = useExpenseStore();
  const { vehicles } = useVehicleStore();
  const { logs: maintenanceLogs } = useMaintenanceStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('This Month');

  const totalFuel = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
  const totalMaintenance = maintenanceLogs.reduce((sum, log) => sum + log.cost, 0);
  const totalExpenses = totalFuel + totalMaintenance;

  // Combine fuel and maintenance logs into a single feed for filtering
  const combinedLogs = [
    ...fuelLogs.map((log) => ({
      id: `f-${log.id}`,
      type: 'Fuel' as const,
      date: log.date,
      vehicleId: log.vehicleId,
      details: `${log.liters} Liters logged`,
      cost: log.cost,
    })),
    ...maintenanceLogs.map((log) => ({
      id: `m-${log.id}`,
      type: 'Maintenance' as const,
      date: log.date,
      vehicleId: log.vehicleId,
      details: log.description || 'Maintenance service',
      cost: log.cost,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter combined logs by Search, Type, and Time
  const filteredLogs = combinedLogs.filter((log) => {
    const vehicle = vehicles.find((v) => v.id === log.vehicleId);
    const regNum = vehicle?.registrationNumber || '';
    const vehicleName = vehicle?.name || '';
    
    // Search check
    if (
      searchTerm &&
      !regNum.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !log.details.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Type check
    if (typeFilter !== 'All' && log.type !== typeFilter) {
      return false;
    }

    // Time check
    if (timeFilter !== 'All Time') {
      const logDate = new Date(log.date);
      const now = new Date();
      if (timeFilter === 'This Month') {
        if (logDate.getMonth() !== now.getMonth() || logDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      } else if (timeFilter === 'This Year') {
        if (logDate.getFullYear() !== now.getFullYear()) {
          return false;
        }
      }
    }

    return true;
  });

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[24px] p-6 border border-[#ECECEC] card-shadow">
          <div className="text-[10px] font-bold text-[#6B7280] tracking-wider mb-2">TOTAL EXPENSES</div>
          <div className="text-4xl font-extrabold text-[#111111]">₹{totalExpenses.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-[24px] p-6 border border-[#ECECEC] card-shadow">
          <div className="text-[10px] font-bold text-[#6B7280] tracking-wider mb-2">FUEL COSTS</div>
          <div className="text-4xl font-extrabold text-[#111111]">₹{totalFuel.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-[24px] p-6 border border-[#ECECEC] card-shadow">
          <div className="text-[10px] font-bold text-[#6B7280] tracking-wider mb-2">MAINTENANCE COSTS</div>
          <div className="text-4xl font-extrabold text-[#111111]">₹{totalMaintenance.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-[24px] border border-[#ECECEC] card-shadow gap-4">
        <div className="flex flex-wrap space-x-3 items-center gap-y-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] text-sm rounded-2xl px-4 h-12 focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all"
          >
            <option value="All">Type: All (Fuel/Maintenance)</option>
            <option value="Fuel">Type: Fuel</option>
            <option value="Maintenance">Type: Maintenance</option>
          </select>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] text-sm rounded-2xl px-4 h-12 focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all"
          >
            <option value="All Time">Time: All Time</option>
            <option value="This Month">Time: This Month</option>
            <option value="This Year">Time: This Year</option>
          </select>
          <div className="relative">
            <input
              type="text"
              placeholder="Search vehicle or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] text-sm rounded-2xl pl-4 pr-10 h-12 focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all placeholder-[#9CA3AF]"
            />
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-6 h-12 bg-[#0C0D0D] text-white font-semibold text-sm rounded-2xl hover:scale-[1.02] transition-all duration-200"
        >
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
              {filteredLogs.map((log) => {
                const v = vehicles.find((v) => v.id === log.vehicleId);
                return (
                  <tr key={log.id} className="border-b border-[#ECECEC] last:border-0 hover:bg-neutral-50 transition-colors">
                    <td className="py-4 text-[#6B7280]">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        log.type === 'Fuel' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="py-4 font-semibold">{v?.registrationNumber || log.vehicleId}</td>
                    <td className="py-4 text-[#6B7280]">{log.details}</td>
                    <td className="py-4 font-semibold text-right">₹{log.cost.toLocaleString()}</td>
                  </tr>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-[#9CA3AF]">
                    No expense records found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddFuelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
