import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import { useVehicleStore } from '../store/useVehicleStore';
import { useDriverStore } from '../store/useDriverStore';
import { useTripStore } from '../store/useTripStore';
import { useMaintenanceStore } from '../store/useMaintenanceStore';
import { useExpenseStore } from '../store/useExpenseStore';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function DashboardLayout() {
  const { fetchVehicles } = useVehicleStore();
  const { fetchDrivers } = useDriverStore();
  const { fetchTrips } = useTripStore();
  const { fetchLogs } = useMaintenanceStore();
  const { fetchFuelLogs } = useExpenseStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
    fetchTrips();
    fetchLogs();
    fetchFuelLogs();
  }, [fetchVehicles, fetchDrivers, fetchTrips, fetchLogs, fetchFuelLogs]);

  useGSAP(() => {
    if (!mainRef.current) return;
    gsap.fromTo(
      mainRef.current.children,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', clearProps: 'all' }
    );
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-[var(--color-bg-app)] text-[var(--color-text-primary)] font-[var(--font-sans)] overflow-hidden selection:bg-[var(--color-brand)] selection:text-[var(--color-brand-foreground)]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0 border-l border-[var(--color-border-strong)]">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 md:p-8 bg-[var(--color-bg-app)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
