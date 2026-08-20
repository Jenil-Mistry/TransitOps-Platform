import { useState } from 'react';
import { Plus, Search, ChevronDown } from 'lucide-react';
import { useTripStore } from '../store/useTripStore';
import { useVehicleStore } from '../store/useVehicleStore';
import { useDriverStore } from '../store/useDriverStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import EmptyState from '../components/ui/EmptyState';
import TripForm from '../components/Cards/TripForm';

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" | "brand" | "success" | "warning" | "info" => {
  switch (status.toLowerCase()) {
    case 'completed': return 'success';
    case 'dispatched': return 'info';
    case 'draft': return 'outline';
    case 'cancelled': return 'destructive';
    default: return 'default';
  }
};

export default function Trips() {
  const { trips } = useTripStore();
  const { vehicles } = useVehicleStore();
  const { drivers } = useDriverStore();
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredTrips = trips.filter(t => {
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (searchTerm) {
      const vehicle = vehicles.find(v => v.id === t.vehicleId);
      const driver = drivers.find(d => d.id === t.driverId);
      const search = searchTerm.toLowerCase();
      if (
        !t.source.toLowerCase().includes(search) &&
        !t.destination.toLowerCase().includes(search) &&
        !(vehicle?.name || '').toLowerCase().includes(search) &&
        !(driver?.name || '').toLowerCase().includes(search)
      ) return false;
    }
    return true;
  });

  const statusCounts = {
    all: trips.length,
    dispatched: trips.filter(t => t.status === 'Dispatched').length,
    draft: trips.filter(t => t.status === 'Draft').length,
    completed: trips.filter(t => t.status === 'Completed').length,
    cancelled: trips.filter(t => t.status === 'Cancelled').length,
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-4 border-b-4 border-[var(--color-border-strong)]">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-[var(--color-text-primary)] leading-none">Trips</h1>
          <p className="text-sm font-mono tracking-widest uppercase text-[var(--color-text-muted)] mt-2">ACTIVE LOGISTICS &bull; MONITORING</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Trip
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Trip Form (collapsible) */}
        {showForm && (
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <TripForm />
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 space-y-4 min-w-0">
          {/* Filters */}
          <div className="bg-[var(--color-bg-primary)] border-2 border-[var(--color-border-strong)] rounded-[var(--radius-sm)] px-5 py-4 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <Input
                type="text"
                placeholder="Search trips, routes, drivers..."
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
                <option value="All">All ({statusCounts.all})</option>
                <option value="Dispatched">In Transit ({statusCounts.dispatched})</option>
                <option value="Draft">Scheduled ({statusCounts.draft})</option>
                <option value="Completed">Completed ({statusCounts.completed})</option>
                <option value="Cancelled">Cancelled ({statusCounts.cancelled})</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
            </div>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                {['Route', 'Vehicle', 'Driver', 'Status', 'Distance', 'Cargo', 'Created'].map(col => (
                  <TableHead key={col}>{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrips.map(trip => {
                const vehicle = vehicles.find(v => v.id === trip.vehicleId);
                const driver = drivers.find(d => d.id === trip.driverId);

                return (
                  <TableRow key={trip.id}>
                    <TableCell>
                      <div className="font-bold text-sm">{trip.source} &rarr; {trip.destination}</div>
                      <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mt-1">{trip.id}</div>
                    </TableCell>
                    <TableCell>{vehicle?.name || trip.vehicleId}</TableCell>
                    <TableCell>{driver?.name || trip.driverId}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(trip.status)}>{trip.status}</Badge>
                    </TableCell>
                    <TableCell>{trip.plannedDistance} km</TableCell>
                    <TableCell>{trip.cargoWeight.toLocaleString()} kg</TableCell>
                    <TableCell>
                      {new Date(trip.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredTrips.length === 0 && (
            <EmptyState
              title="No trips found"
              description="There are no trips matching your current filters."
              action={{ label: 'Clear Filters', onClick: () => { setSearchTerm(''); setStatusFilter('All'); } }}
            />
          )}

          <div className="px-1 text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
            {filteredTrips.length} OF {trips.length} RECORDS DISPLAYED
          </div>
        </div>
      </div>
    </div>
  );
}
