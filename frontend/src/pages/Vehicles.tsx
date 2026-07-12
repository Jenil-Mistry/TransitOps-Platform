import { useVehicleStore } from '../store/useVehicleStore';
import VehicleFilters from '../components/Cards/VehicleFilters';
import AddVehicleButton from '../components/Cards/AddVehicleButton';
import VehicleTable from '../components/Tables/VehicleTable';

export default function Vehicles() {
  const { vehicles } = useVehicleStore();

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex justify-between items-center bg-white p-6 rounded-[24px] border border-[#ECECEC] card-shadow">
        <VehicleFilters />
        <AddVehicleButton />
      </div>

      <div className="bg-white rounded-[24px] p-6 border border-[#ECECEC] card-shadow flex-1 overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1 hide-scrollbar">
          <VehicleTable vehicles={vehicles} />
        </div>
        <div className="pt-4 text-xs text-[#9CA3AF] font-medium border-t border-[#ECECEC] mt-4">
          Rule: Registration No. must be unique. Retired/In Shop vehicles are hidden from Trip Dispatcher.
        </div>
      </div>
    </div>
  );
}
