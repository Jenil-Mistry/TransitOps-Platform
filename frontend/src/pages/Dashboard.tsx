import { Truck, Navigation, Users, Wrench, Fuel, Activity, Calendar, Download } from 'lucide-react';
import { useVehicleStore } from '../store/useVehicleStore';
import { useTripStore } from '../store/useTripStore';
import { useDriverStore } from '../store/useDriverStore';
import { useAuthStore } from '../store/useAuthStore';
import KpiCard from '../components/ui/KpiCard';
import LiveFleetMap from '../components/Charts/LiveFleetMap';
import FleetHealthCard from '../components/Cards/FleetHealthCard';
import FuelConsumptionChart from '../components/Charts/FuelConsumptionChart';
import TripPerformanceChart from '../components/Charts/TripPerformanceChart';
import ActivityFeed from '../components/Cards/ActivityFeed';
import AlertsCard from '../components/Cards/AlertsCard';
import Button from '../components/ui/Button';
import { mockDashboardKpis } from '../data/mockData';

export default function Dashboard() {
  const { vehicles } = useVehicleStore();
  const { trips } = useTripStore();
  const { drivers } = useDriverStore();
  const { user } = useAuthStore();

  // Use real data when available, fallback to mock
  const hasRealData = vehicles.length > 0;

  const activeVehicles = hasRealData
    ? vehicles.filter(v => v.status === 'On Trip').length
    : mockDashboardKpis.totalVehicles.active;
  const totalVehicles = hasRealData ? vehicles.length : mockDashboardKpis.totalVehicles.value;
  const activeTrips = hasRealData
    ? trips.filter(t => t.status === 'Dispatched').length
    : mockDashboardKpis.activeTrips.value;
  const totalDrivers = hasRealData ? drivers.length : mockDashboardKpis.drivers.value;
  const availableDrivers = hasRealData
    ? drivers.filter(d => d.status === 'Available').length
    : mockDashboardKpis.drivers.available;
  const fleetUtilization = hasRealData && vehicles.length
    ? Math.round((activeVehicles / totalVehicles) * 100)
    : mockDashboardKpis.fleetUtilization.value;

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const userName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-4 border-b-4 border-[var(--color-border-strong)]">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-[var(--color-text-primary)] leading-none">{greeting}, {userName}</h1>
          <p className="text-sm font-mono tracking-widest uppercase text-[var(--color-text-muted)] mt-2">SYSTEM OVERVIEW &bull; TERMINAL ACTIVE</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Today
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards - 6 cards in responsive grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard
          label="Total Vehicles"
          value={totalVehicles}
          icon={<Truck className="w-[18px] h-[18px]" />}
          subtitle={`${activeVehicles} active`}
          trend={mockDashboardKpis.totalVehicles.trend}
          trendLabel="vs last month"
        />
        <KpiCard
          label="Active Trips"
          value={activeTrips}
          icon={<Navigation className="w-[18px] h-[18px]" />}
          subtitle={`${mockDashboardKpis.activeTrips.arrivingSoon} arriving soon`}
          trend={mockDashboardKpis.activeTrips.trend}
          trendLabel="vs last month"
        />
        <KpiCard
          label="Drivers"
          value={totalDrivers}
          icon={<Users className="w-[18px] h-[18px]" />}
          subtitle={`${availableDrivers} available`}
        />
        <KpiCard
          label="Maintenance"
          value={mockDashboardKpis.maintenance.value}
          icon={<Wrench className="w-[18px] h-[18px]" />}
          subtitle={`${mockDashboardKpis.maintenance.overdue} overdue`}
        />
        <KpiCard
          label="Fuel Cost"
          value={mockDashboardKpis.fuelCost.label}
          icon={<Fuel className="w-[18px] h-[18px]" />}
          subtitle={mockDashboardKpis.fuelCost.period}
          trend={mockDashboardKpis.fuelCost.trend}
          trendLabel="vs last month"
        />
        <KpiCard
          label="Fleet Utilization"
          value={`${fleetUtilization}%`}
          icon={<Activity className="w-[18px] h-[18px]" />}
          trend={mockDashboardKpis.fleetUtilization.trend}
          trendLabel="vs last month"
        />
      </div>

      {/* Main Grid: Map + Fleet Health (65/35) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        <LiveFleetMap />
        <FleetHealthCard />
      </div>

      {/* Analytics Row: Fuel + Trip Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FuelConsumptionChart />
        <TripPerformanceChart />
      </div>

      {/* Bottom Row: Activity + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityFeed />
        <AlertsCard />
      </div>
    </div>
  );
}
