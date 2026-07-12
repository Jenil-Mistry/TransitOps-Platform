import { useVehicleStore } from '../store/useVehicleStore';
import { useTripStore } from '../store/useTripStore';
import { useDriverStore } from '../store/useDriverStore';
import BaseCard from '../components/Cards/BaseCard';
import StatCard from '../components/Cards/StatCard';
import VehicleStatusChart from '../components/Charts/VehicleStatusChart';
import RecentTripsTable from '../components/Tables/RecentTripsTable';
import DashboardFilters from '../components/Cards/DashboardFilters';

export default function Dashboard() {
  const { vehicles } = useVehicleStore();
  const { trips } = useTripStore();
  const { drivers } = useDriverStore();

  const activeVehicles = vehicles.filter(v => v.status === 'On Trip').length;
  const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
  const inMaintenance = vehicles.filter(v => v.status === 'In Shop').length;
  
  const activeTrips = trips.filter(t => t.status === 'Dispatched').length;
  const pendingTrips = trips.filter(t => t.status === 'Draft').length;
  
  const driversOnDuty = drivers.filter(d => d.status === 'On Trip').length;
  const fleetUtilization = vehicles.length ? Math.round((activeVehicles / vehicles.length) * 100) : 0;

  const kpis = [
    { label: 'ACTIVE VEHICLES', value: activeVehicles, id: 1 },
    { label: 'AVAILABLE VEHICLES', value: availableVehicles, id: 2 },
    { label: 'VEHICLES IN MAINTENANCE', value: inMaintenance, id: 3 },
    { label: 'ACTIVE TRIPS', value: activeTrips, id: 4 },
    { label: 'PENDING TRIPS', value: pendingTrips, id: 5 },
    { label: 'DRIVERS ON DUTY', value: driversOnDuty, id: 6 },
    { label: 'FLEET UTILIZATION', value: `${fleetUtilization}%`, id: 7, color: 'text-[#111111]' },
  ];

  const vehicleStatusData = [
    { name: 'Available', count: availableVehicles, color: '#111111' },
    { name: 'On Trip', count: activeVehicles, color: '#6B7280' },
    { name: 'In Shop', count: inMaintenance, color: '#9CA3AF' },
    { name: 'Retired', count: vehicles.filter(v => v.status === 'Retired').length, color: '#ECECEC' },
  ];

  return (
    <div className="space-y-6">
      <DashboardFilters />

      {/* KPI Section */}
      <BaseCard bodyClassName="flex items-center overflow-x-auto space-x-6 hide-scrollbar">
        {kpis.map((kpi) => (
          <StatCard key={kpi.id} label={kpi.label} value={kpi.value} color={kpi.color} />
        ))}
      </BaseCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Trips Table */}
        <div className="lg:col-span-2">
          <BaseCard title="Recent Trips">
            <RecentTripsTable trips={trips} vehicles={vehicles} drivers={drivers} />
          </BaseCard>
        </div>

        {/* Vehicle Status Chart */}
        <VehicleStatusChart data={vehicleStatusData} />
      </div>
    </div>
  );
}
