import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import { useVehicleStore } from '../store/useVehicleStore';
import { useDriverStore } from '../store/useDriverStore';
import { useTripStore } from '../store/useTripStore';
import { useMaintenanceStore } from '../store/useMaintenanceStore';
import { useExpenseStore } from '../store/useExpenseStore';

export default function DashboardLayout() {
  const { fetchVehicles } = useVehicleStore();
  const { fetchDrivers } = useDriverStore();
  const { fetchTrips } = useTripStore();
  const { fetchLogs } = useMaintenanceStore();
  const { fetchFuelLogs } = useExpenseStore();

  useEffect(() => {
    // Automatically fetch real data from backend API on mount across all modules
    fetchVehicles();
    fetchDrivers();
    fetchTrips();
    fetchLogs();
    fetchFuelLogs();
  }, [fetchVehicles, fetchDrivers, fetchTrips, fetchLogs, fetchFuelLogs]);

  return (
    <div className="flex h-screen bg-[#ECF4EE] text-[#111111] font-sans overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
