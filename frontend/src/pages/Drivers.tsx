import { useState } from 'react';
import { useDriverStore } from '../store/useDriverStore';
import DriverFilters from '../components/Cards/DriverFilters';
import AddDriverButton from '../components/Cards/AddDriverButton';
import DriverTable from '../components/Tables/DriverTable';
import AddDriverModal from '../components/Modals/AddDriverModal';

export default function Drivers() {
  const { drivers } = useDriverStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [classFilter, setClassFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDrivers = drivers.filter((d) => {
    if (classFilter !== 'All' && d.licenseCategory !== classFilter) return false;
    if (statusFilter !== 'All' && d.status !== statusFilter) return false;
    if (
      searchTerm &&
      !d.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !d.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-[24px] border border-[#ECECEC] card-shadow gap-4">
        <DriverFilters
          classFilter={classFilter}
          setClassFilter={setClassFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <AddDriverButton onClick={() => setIsAddModalOpen(true)} />
      </div>

      <div className="bg-white rounded-[24px] p-6 border border-[#ECECEC] card-shadow flex-1 overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1 hide-scrollbar">
          <DriverTable drivers={filteredDrivers} />
        </div>
        
        <div className="mt-4 pt-4 border-t border-[#ECECEC] flex items-center space-x-6">
          <div className="flex items-center text-xs font-medium text-[#6B7280]">
            <span className="px-2 py-1 bg-[#DC2626] text-white rounded-md text-[10px] font-bold mr-2">Suspended</span>
            Rule: Expired license or Suspended status {'->'} blocked from trip assignment.
          </div>
        </div>
      </div>

      <AddDriverModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
