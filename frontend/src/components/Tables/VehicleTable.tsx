import DataTable from './DataTable';
import TableHeader from './TableHeader';
import TableCell from './TableCell';
import VehicleRow from './VehicleRow';
import type { Vehicle } from '../../types';

interface VehicleTableProps {
  vehicles: Vehicle[];
}

export default function VehicleTable({ vehicles }: VehicleTableProps) {
  return (
    <DataTable>
      <TableHeader className="sticky top-0 bg-white z-10">
        <TableCell isHeader className="pb-4 uppercase text-[10px] tracking-wider">Reg. No. (Unique)</TableCell>
        <TableCell isHeader className="pb-4 uppercase text-[10px] tracking-wider">Name/Model</TableCell>
        <TableCell isHeader className="pb-4 uppercase text-[10px] tracking-wider">Type</TableCell>
        <TableCell isHeader className="pb-4 uppercase text-[10px] tracking-wider">Capacity</TableCell>
        <TableCell isHeader className="pb-4 uppercase text-[10px] tracking-wider">Odometer</TableCell>
        <TableCell isHeader className="pb-4 uppercase text-[10px] tracking-wider">Acq. Cost</TableCell>
        <TableCell isHeader className="pb-4 uppercase text-[10px] tracking-wider">Status</TableCell>
      </TableHeader>
      <tbody className="text-[var(--color-1)]">
        {vehicles.map((v) => (
          <VehicleRow key={v.id} vehicle={v} />
        ))}
      </tbody>
    </DataTable>
  );
}
