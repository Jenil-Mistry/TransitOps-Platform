import TableRow from './TableRow';
import TableCell from './TableCell';
import VehicleStatusBadge from './VehicleStatusBadge';
import type { Vehicle } from '../../types';

interface VehicleRowProps {
  vehicle: Vehicle;
}

export default function VehicleRow({ vehicle }: VehicleRowProps) {
  return (
    <TableRow>
      <TableCell className="font-semibold">{vehicle.registrationNumber}</TableCell>
      <TableCell className="text-[#6B7280]">{vehicle.name}</TableCell>
      <TableCell className="text-[#6B7280]">{vehicle.type}</TableCell>
      <TableCell className="text-[#6B7280]">{vehicle.maxLoadCapacity} kg</TableCell>
      <TableCell className="text-[#6B7280]">{vehicle.odometer.toLocaleString()} km</TableCell>
      <TableCell className="text-[#6B7280]">₹{vehicle.acquisitionCost.toLocaleString()}</TableCell>
      <TableCell>
        <VehicleStatusBadge status={vehicle.status} />
      </TableCell>
    </TableRow>
  );
}
