import DataTable from './DataTable';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import TableCell from './TableCell';
import StatusBadge from './StatusBadge';
import type { Trip, Vehicle, Driver } from '../../types';

interface RecentTripsTableProps {
  trips: Trip[];
  vehicles: Vehicle[];
  drivers: Driver[];
}

export default function RecentTripsTable({ trips, vehicles, drivers }: RecentTripsTableProps) {
  return (
    <DataTable>
      <TableHeader>
        <TableCell isHeader>TRIP</TableCell>
        <TableCell isHeader>VEHICLE</TableCell>
        <TableCell isHeader>DRIVER</TableCell>
        <TableCell isHeader>STATUS</TableCell>
        <TableCell isHeader>ETA</TableCell>
      </TableHeader>
      <tbody className="text-[var(--color-1)]">
        {trips.slice(0, 5).map((trip, idx) => {
          const v = vehicles.find(v => v.id === trip.vehicleId);
          const d = drivers.find(d => d.id === trip.driverId);
          return (
            <TableRow key={trip.id}>
              <TableCell className="font-semibold text-[var(--color-1)]">TR00{idx+1}</TableCell>
              <TableCell className="text-[var(--color-text-muted)]">{v?.registrationNumber || '-'}</TableCell>
              <TableCell className="text-[var(--color-text-muted)]">{d?.name || '-'}</TableCell>
              <TableCell>
                <StatusBadge status={trip.status} />
              </TableCell>
              <TableCell className="text-[var(--color-text-muted)]">{trip.status === 'Dispatched' ? '45 min' : '-'}</TableCell>
            </TableRow>
          );
        })}
      </tbody>
    </DataTable>
  );
}
