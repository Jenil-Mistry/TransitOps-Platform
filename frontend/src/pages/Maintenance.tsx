import { useState } from 'react';
import { useMaintenanceStore } from '../store/useMaintenanceStore';
import { useVehicleStore } from '../store/useVehicleStore';
import { Plus } from 'lucide-react';
import ScheduleMaintenanceModal from '../components/Modals/ScheduleMaintenanceModal';

export default function Maintenance() {
  const { logs, updateLogStatus } = useMaintenanceStore();
  const { vehicles } = useVehicleStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-[#F59E0B] text-white';
      case 'Closed': return 'bg-[#16A34A] text-white';
      default: return 'bg-[#FAFAFA] border border-[#ECECEC] text-[#111111]';
    }
  };

  const filteredLogs = logs.filter((log) => {
    const v = vehicles.find((v) => v.id === log.vehicleId);
    const regNum = v?.registrationNumber || '';
    const vehicleName = v?.name || '';

    // Status filter
    if (statusFilter !== 'All' && log.status !== statusFilter) {
      return false;
    }

    // Search filter
    if (
      searchTerm &&
      !regNum.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !(log.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-[24px] border border-[#ECECEC] card-shadow gap-4">
        <div className="flex flex-wrap space-x-3 items-center gap-y-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-[#ECECEC] bg-[#FAFAFA] text-[#111111] text-sm rounded-2xl px-4 h-12 focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all"
          >
            <option value="All">Status: All</option>
            <option value="Open">Status: Open</option>
            <option value="Closed">Status: Closed</option>
          </select>
          <div className="relative">
             <input
              type="text"
              placeholder="Search vehicle or description..."
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
          <Plus className="w-4 h-4 mr-2" /> Schedule Maintenance
        </button>
      </div>

      <div className="bg-white rounded-[24px] p-6 border border-[#ECECEC] card-shadow flex-1 overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1 hide-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="text-[#6B7280] border-b border-[#ECECEC]">
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Date</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Vehicle</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Description</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Cost</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Status</th>
                <th className="pb-4 font-medium uppercase text-[10px] tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="text-[#111111]">
              {filteredLogs.map((log) => {
                const v = vehicles.find(v => v.id === log.vehicleId);
                return (
                  <tr key={log.id} className="border-b border-[#ECECEC] last:border-0 hover:bg-neutral-50 transition-colors">
                    <td className="py-4 text-[#6B7280]">{new Date(log.date).toLocaleDateString()}</td>
                    <td className="py-4 font-semibold">{v?.registrationNumber || log.vehicleId}</td>
                    <td className="py-4 text-[#6B7280]">{log.description}</td>
                    <td className="py-4 text-[#6B7280]">₹{log.cost.toLocaleString()}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-4">
                      {log.status === 'Open' ? (
                        <button 
                          onClick={() => updateLogStatus(log.id, 'Closed')}
                          className="px-4 py-2 bg-[#FAFAFA] border border-[#ECECEC] text-[#111111] text-xs font-semibold rounded-xl hover:bg-[#F3F4F6] transition-colors"
                        >
                          Mark Done
                        </button>
                      ) : (
                        <span className="text-xs text-[#9CA3AF] italic">Completed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#9CA3AF]">
                    No maintenance logs found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 pt-4 border-t border-[#ECECEC] flex flex-col space-y-2">
          <div className="flex items-center text-xs font-medium text-[#6B7280]">
            Rule: Maintenance updates vehicle status implicitly.
          </div>
          <div className="flex space-x-4 text-[10px] font-semibold text-[#9CA3AF]">
            <div>Available {'->'} In Shop</div>
            <div>In Shop {'->'} Available</div>
          </div>
        </div>
      </div>

      <ScheduleMaintenanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
