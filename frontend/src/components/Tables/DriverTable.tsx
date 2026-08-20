import DataTable from './DataTable';
import TableHeader from './TableHeader';
import TableCell from './TableCell';
import DriverRow from './DriverRow';
import type { Driver } from '../../types';

interface DriverTableProps {
  drivers: Driver[];
}

export default function DriverTable({ drivers }: DriverTableProps) {
  return (
    <DataTable>
      <TableHeader className="sticky top-0 bg-white z-10">
        <TableCell isHeader className="pb-4 uppercase text-[10px] tracking-wider">Name</TableCell>
        <TableCell isHeader className="pb-4 uppercase text-[10px] tracking-wider">License No.</TableCell>
        <TableCell isHeader className="pb-4 uppercase text-[10px] tracking-wider">Class</TableCell>
        <TableCell isHeader className="pb-4 uppercase text-[10px] tracking-wider">Expiry</TableCell>
        <TableCell isHeader className="pb-4 uppercase text-[10px] tracking-wider">Contact</TableCell>
        <TableCell isHeader className="pb-4 uppercase text-[10px] tracking-wider">Safety Score</TableCell>
        <TableCell isHeader className="pb-4 uppercase text-[10px] tracking-wider">Status</TableCell>
      </TableHeader>
      <tbody className="text-[var(--color-1)]">
        {drivers.map(d => (
          <DriverRow key={d.id} driver={d} />
        ))}
      </tbody>
    </DataTable>
  );
}
