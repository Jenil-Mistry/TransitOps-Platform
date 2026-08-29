import { useState } from 'react';
import { useMaintenanceStore } from '../store/useMaintenanceStore';
import { useVehicleStore } from '../store/useVehicleStore';
import { Plus, Search, ChevronDown, Wrench, AlertTriangle, Clock, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import KpiCard from '../components/ui/KpiCard';
import EmptyState from '../components/ui/EmptyState';
import ScheduleMaintenanceModal from '../components/Modals/ScheduleMaintenanceModal';

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" | "brand" | "success" | "warning" | "info" => {
  switch (status.toLowerCase()) {
    case 'open': return 'warning';
    case 'closed': return 'success';
    default: return 'default';
  }
};

export default function Maintenance() {
  const { logs, updateLogStatus } = useMaintenanceStore();
  const { vehicles } = useVehicleStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter((log) => {
    const v = vehicles.find((v) => v.id === log.vehicleId);
    const regNum = v?.registrationNumber || '';
    const vehicleName = v?.name || '';

    if (statusFilter !== 'All' && log.status !== statusFilter) return false;
    if (
      searchTerm &&
      !regNum.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !(log.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const openCount = logs.filter(l => l.status === 'Open').length;
  const closedCount = logs.filter(l => l.status === 'Closed').length;
  const totalCost = logs.reduce((sum, l) => sum + l.cost, 0);

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-4 border-b-4 border-[var(--color-border-strong)]">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-[var(--color-text-primary)] leading-none">Maintenance</h1>
          <p className="text-sm font-mono tracking-widest uppercase text-[var(--color-text-muted)] mt-2">FLEET HEALTH &bull; REPAIRS &bull; LOGS</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Maintenance
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="In Maintenance" value={openCount} icon={<Wrench className="w-[18px] h-[18px]" />} />
        <KpiCard label="Overdue" value={0} icon={<AlertTriangle className="w-[18px] h-[18px]" />} />
        <KpiCard label="Completed" value={closedCount} icon={<Clock className="w-[18px] h-[18px]" />} />
        <KpiCard label="Monthly Cost" value={`₹${totalCost.toLocaleString()}`} icon={<DollarSign className="w-[18px] h-[18px]" />} />
      </div>

      {/* Filters */}
      <div className="bg-[var(--color-bg-primary)] border-2 border-[var(--color-border-strong)] rounded-[var(--radius-sm)] px-5 py-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <Input
            type="text"
            placeholder="Search vehicle or description..."
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
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 space-y-4 min-w-0">
        <Table>
          <TableHeader>
            <TableRow>
              {['Date', 'Vehicle', 'Description', 'Cost', 'Status', 'Action'].map(col => (
                <TableHead key={col}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => {
              const v = vehicles.find(v => v.id === log.vehicleId);
              return (
                <TableRow key={log.id}>
                  <TableCell>
                    {new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-sm text-[var(--color-text-primary)]">{v?.registrationNumber || log.vehicleId}</span>
                  </TableCell>
                  <TableCell>{log.description}</TableCell>
                  <TableCell>
                    <span className="font-mono font-bold">₹{log.cost.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(log.status)}>{log.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {log.status === 'Open' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateLogStatus(log.id, 'Closed')}
                        className="h-8"
                      >
                        Mark Done
                      </Button>
                    ) : (
                      <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-bold">Completed</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredLogs.length === 0 && (
          <EmptyState
            title="No maintenance logs found"
            description="There are no maintenance records matching your criteria."
            action={{ label: 'Clear Filters', onClick: () => { setSearchTerm(''); setStatusFilter('All'); } }}
          />
        )}

        <div className="px-1 text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
          MAINTENANCE UPDATES VEHICLE STATUS: AVAILABLE &harr; IN SHOP
        </div>
      </div>

      <ScheduleMaintenanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
