import { useState } from 'react';
import { useDriverStore } from '../store/useDriverStore';
import { Plus, Search, ChevronDown, MoreHorizontal, Users, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import KpiCard from '../components/ui/KpiCard';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import AddDriverModal from '../components/Modals/AddDriverModal';

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" | "brand" | "success" | "warning" | "info" => {
  switch (status.toLowerCase()) {
    case 'available': return 'success';
    case 'on trip': return 'info';
    case 'off duty': return 'outline';
    case 'suspended': return 'destructive';
    default: return 'default';
  }
};

export default function Drivers() {
  const { drivers } = useDriverStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [classFilter, setClassFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDrivers = drivers.filter((d) => {
    if (classFilter !== 'All' && d.licenseCategory !== classFilter) return false;
    if (statusFilter !== 'All' && d.status !== statusFilter) return false;
    if (
      searchTerm &&
      !d.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !d.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-[var(--color-success)]';
    if (score >= 75) return 'text-[var(--color-warning)]';
    return 'text-[var(--color-danger)]';
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-4 border-b-4 border-[var(--color-border-strong)]">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-[var(--color-text-primary)] leading-none">Drivers</h1>
          <p className="text-sm font-mono tracking-widest uppercase text-[var(--color-text-muted)] mt-2">OPERATORS &bull; ASSIGNMENTS &bull; SAFETY</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Driver
        </Button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total Operators" value={drivers.length} icon={<Users className="w-[18px] h-[18px]" />} />
        <KpiCard label="Available" value={drivers.filter(d => d.status === 'Available').length} icon={<div className="w-3 h-3 border-2 border-[var(--color-success)] bg-[var(--color-success-soft)]" />} />
        <KpiCard label="On Trip" value={drivers.filter(d => d.status === 'On Trip').length} icon={<div className="w-3 h-3 border-2 border-[var(--color-info)] bg-[var(--color-info-soft)]" />} />
        <KpiCard label="Suspended" value={drivers.filter(d => d.status === 'Suspended').length} icon={<div className="w-3 h-3 border-2 border-[var(--color-danger)] bg-[var(--color-danger-soft)]" />} />
      </div>

      {/* Filters */}
      <div className="bg-[var(--color-bg-primary)] border-2 border-[var(--color-border-strong)] rounded-[var(--radius-sm)] px-5 py-4 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <Input
            type="text"
            placeholder="Search drivers..."
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
            <option value="Off Duty">Off Duty</option>
            <option value="Suspended">Suspended</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="h-11 pl-3 pr-8 bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border-strong)] rounded-[var(--radius-sm)] text-sm font-mono text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-brand)] appearance-none cursor-pointer"
          >
            <option value="All">All License Classes</option>
            <option value="LMV">LMV</option>
            <option value="HMV">HMV</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)] pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 space-y-4 min-w-0">
        <Table>
          <TableHeader>
            <TableRow>
              {['Driver', 'License', 'Category', 'Status', 'Contact', 'Safety Score', 'License Expiry', 'Actions'].map(col => (
                <TableHead key={col}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDrivers.map(driver => (
              <TableRow key={driver.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={driver.name} size="sm" />
                    <span className="font-bold text-sm text-[var(--color-text-primary)]">{driver.name}</span>
                  </div>
                </TableCell>
                <TableCell>{driver.licenseNumber}</TableCell>
                <TableCell>{driver.licenseCategory}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(driver.status)}>{driver.status}</Badge>
                </TableCell>
                <TableCell>{driver.contactNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Shield className={`w-4 h-4 ${getScoreColor(driver.safetyScore)}`} />
                    <span className={`font-bold ${getScoreColor(driver.safetyScore)}`}>{driver.safetyScore}/100</span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(driver.licenseExpiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredDrivers.length === 0 && (
          <EmptyState
            title="No drivers found"
            description="There are no drivers matching your current filters."
            action={{ label: 'Clear Filters', onClick: () => { setSearchTerm(''); setStatusFilter('All'); setClassFilter('All'); } }}
          />
        )}

        <div className="px-1 text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider flex justify-between">
          <span>{filteredDrivers.length} OF {drivers.length} DRIVERS DISPLAYED</span>
          <span>SUSPENDED DRIVERS BLOCKED FROM ASSIGNMENT</span>
        </div>
      </div>

      <AddDriverModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
