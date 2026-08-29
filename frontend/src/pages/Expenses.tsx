import { useState } from 'react';
import { useExpenseStore } from '../store/useExpenseStore';
import { useVehicleStore } from '../store/useVehicleStore';
import { useMaintenanceStore } from '../store/useMaintenanceStore';
import { Plus, Search, DollarSign, Fuel, Wrench, TrendingDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import KpiCard from '../components/ui/KpiCard';
import Tabs, { useTabs } from '../components/ui/Tabs';
import EmptyState from '../components/ui/EmptyState';
import AddFuelModal from '../components/Modals/AddFuelModal';

export default function Expenses() {
  const { fuelLogs } = useExpenseStore();
  const { vehicles } = useVehicleStore();
  const { logs: maintenanceLogs } = useMaintenanceStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const { activeTab, setActiveTab } = useTabs('fuel');

  const totalFuel = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
  const totalMaintenance = maintenanceLogs.reduce((sum, log) => sum + log.cost, 0);
  const totalExpenses = totalFuel + totalMaintenance;
  const totalLitres = fuelLogs.reduce((sum, log) => sum + log.liters, 0);

  // Combine fuel and maintenance logs
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

  const filteredLogs = combinedLogs.filter((log) => {
    const vehicle = vehicles.find((v) => v.id === log.vehicleId);
    const regNum = vehicle?.registrationNumber || '';
    const vehicleName = vehicle?.name || '';

    if (searchTerm && !regNum.toLowerCase().includes(searchTerm.toLowerCase()) && !vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) && !log.details.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (typeFilter !== 'All' && log.type !== typeFilter) return false;

    // Tab filter
    if (activeTab === 'fuel' && log.type !== 'Fuel') return false;
    if (activeTab === 'expenses' && log.type === 'Fuel') return false;

    return true;
  });

  const tabs = [
    { id: 'fuel', label: 'Fuel', icon: <Fuel className="w-4 h-4" /> },
    { id: 'expenses', label: 'Expenses', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'all', label: 'All' },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-4 border-b-4 border-[var(--color-border-strong)]">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-[var(--color-text-primary)] leading-none">Fuel & Expenses</h1>
          <p className="text-sm font-mono tracking-widest uppercase text-[var(--color-text-muted)] mt-2">COST ANALYSIS &bull; RESOURCE MANAGEMENT</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Log Fuel Expense
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total Expenses" value={`₹${totalExpenses.toLocaleString()}`} icon={<DollarSign className="w-[18px] h-[18px]" />} />
        <KpiCard label="Fuel Costs" value={`₹${totalFuel.toLocaleString()}`} icon={<Fuel className="w-[18px] h-[18px]" />} subtitle={`${totalLitres.toLocaleString()} L`} />
        <KpiCard label="Maintenance Costs" value={`₹${totalMaintenance.toLocaleString()}`} icon={<Wrench className="w-[18px] h-[18px]" />} />
        <KpiCard label="Avg Cost/KM" value="₹11.2" icon={<TrendingDown className="w-[18px] h-[18px]" />} trend={-3.2} trendLabel="vs last month" />
      </div>

      {/* Tabs + Filters */}
      <div className="border-2 border-[var(--color-border-strong)] bg-[var(--color-bg-primary)] rounded-[var(--radius-sm)] overflow-hidden">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="px-5 border-b-2 border-[var(--color-border-strong)]" />

        <div className="px-5 py-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <Input
              type="text"
              placeholder="Search vehicle or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              {['Date', 'Type', 'Vehicle', 'Details', 'Cost'].map(col => (
                <TableHead key={col} className={col === 'Cost' ? 'text-right' : ''}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => {
              const v = vehicles.find((v) => v.id === log.vehicleId);
              return (
                <TableRow key={log.id}>
                  <TableCell>
                    {new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={log.type === 'Fuel' ? 'info' : 'warning'}>{log.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-sm text-[var(--color-text-primary)]">{v?.registrationNumber || log.vehicleId}</span>
                  </TableCell>
                  <TableCell>{log.details}</TableCell>
                  <TableCell className="text-right">
                    <span className="font-mono font-bold">₹{log.cost.toLocaleString()}</span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredLogs.length === 0 && (
          <EmptyState
            title="No expense records found"
            description="There are no expense records matching your criteria."
            action={{ label: 'Clear Filters', onClick: () => { setSearchTerm(''); setTypeFilter('All'); } }}
          />
        )}
      </div>

      <AddFuelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
