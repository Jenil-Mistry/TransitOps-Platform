import { useState } from 'react';
import { useVehicleStore } from '../store/useVehicleStore';
import VehicleFilters from '../components/Cards/VehicleFilters';
import AddVehicleButton from '../components/Cards/AddVehicleButton';
import VehicleTable from '../components/Tables/VehicleTable';
import AddVehicleModal from '../components/Modals/AddVehicleModal';

export default function Vehicles() {
  const { vehicles } = useVehicleStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVehicles = vehicles.filter((v) => {
    if (typeFilter !== 'All' && v.type !== typeFilter) return false;
    if (statusFilter !== 'All' && v.status !== statusFilter) return false;
    if (
      searchTerm &&
      !v.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !v.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-[24px] border border-[#ECECEC] card-shadow gap-4">
        <VehicleFilters
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <AddVehicleButton onClick={() => setIsAddModalOpen(true)} />
      </div>

      <div className="bg-white rounded-[24px] p-6 border border-[#ECECEC] card-shadow flex-1 overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1 hide-scrollbar">
          <VehicleTable vehicles={filteredVehicles} />
        </div>
        <div className="pt-4 text-xs text-[#9CA3AF] font-medium border-t border-[#ECECEC] mt-4">
          Rule: Registration No. must be unique. Retired/In Shop vehicles are hidden from Trip Dispatcher.
        </div>
      </div>

      <AddVehicleModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
