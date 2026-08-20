import { useState } from 'react';
import { useVehicleStore } from '../store/useVehicleStore';
import { Plus, Search, Truck, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import KpiCard from '../components/ui/KpiCard';
import EmptyState from '../components/ui/EmptyState';
import AddVehicleModal from '../components/Modals/AddVehicleModal';

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" | "brand" | "success" | "warning" | "info" => {
  switch (status.toLowerCase()) {
    case 'available': return 'success';
    case 'on trip': return 'info';
    case 'in shop': return 'warning';
    case 'retired': return 'outline';
    default: return 'default';
  }
};

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

  const activeCount = vehicles.filter(v => v.status === 'On Trip').length;
  const availableCount = vehicles.filter(v => v.status === 'Available').length;
  const maintenanceCount = vehicles.filter(v => v.status === 'In Shop').length;
  const retiredCount = vehicles.filter(v => v.status === 'Retired').length;

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-4 border-b-4 border-[var(--color-border-strong)]">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-[var(--color-text-primary)] leading-none">Fleet</h1>
          <p className="text-sm font-mono tracking-widest uppercase text-[var(--color-text-muted)] mt-2">VEHICLES &bull; STATUS &bull; OPERATIONS</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KpiCard label="Total" value={vehicles.length} icon={<Truck className="w-[18px] h-[18px]" />} />
        <KpiCard label="Active" value={activeCount} icon={<div className="w-3 h-3 border-2 border-[var(--color-info)] bg-[var(--color-info-soft)]" />} />
        <KpiCard label="Available" value={availableCount} icon={<div className="w-3 h-3 border-2 border-[var(--color-success)] bg-[var(--color-success-soft)]" />} />
        <KpiCard label="Maintenance" value={maintenanceCount} icon={<div className="w-3 h-3 border-2 border-[var(--color-warning)] bg-[var(--color-warning-soft)]" />} />
        <KpiCard label="Retired" value={retiredCount} icon={<div className="w-3 h-3 border-2 border-[var(--color-text-muted)] bg-transparent" />} />
      </div>

      {/* Filters */}
      <div className="bg-[var(--color-bg-primary)] border-2 border-[var(--color-border-strong)] rounded-[var(--radius-sm)] px-5 py-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <Input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 pl-3 pr-8 bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border-strong)] rounded-[var(--radius-sm)] text-sm font-mono text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)] appearance-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-11 pl-3 pr-8 bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border-strong)] rounded-[var(--radius-sm)] text-sm font-mono text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)] appearance-none cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Truck">Truck</option>
            <option value="Heavy Truck">Heavy Truck</option>
            <option value="Mini Truck">Mini Truck</option>
            <option value="Container">Container</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 space-y-4 min-w-0">
        <Table>
          <TableHeader>
            <TableRow>
              {['Vehicle', 'Registration', 'Type', 'Status', 'Odometer', 'Max Load', 'Region', 'Actions'].map(col => (
                <TableHead key={col}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.map(vehicle => (
              <TableRow key={vehicle.id}>
                <TableCell>
                  <span className="font-bold text-sm text-[var(--color-text-primary)]">{vehicle.name}</span>
                </TableCell>
                <TableCell>{vehicle.registrationNumber}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(vehicle.status)}>{vehicle.status}</Badge>
                </TableCell>
                <TableCell>{vehicle.odometer.toLocaleString()} km</TableCell>
                <TableCell>{vehicle.maxLoadCapacity.toLocaleString()} kg</TableCell>
                <TableCell>{vehicle.region || '—'}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredVehicles.length === 0 && (
          <EmptyState
            title="No vehicles found"
            description="There are no vehicles matching your current filters."
            action={{ label: 'Clear Filters', onClick: () => { setSearchTerm(''); setStatusFilter('All'); setTypeFilter('All'); } }}
          />
        )}

        <div className="px-1 text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider flex justify-between">
          <span>{filteredVehicles.length} OF {vehicles.length} VEHICLES DISPLAYED</span>
          <span>RETIRED/IN SHOP VEHICLES HIDDEN FROM DISPATCH</span>
        </div>
      </div>

      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
