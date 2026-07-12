import TableRow from './TableRow';
import TableCell from './TableCell';
import SafetyScore from './SafetyScore';
import DriverStatusBadge from './DriverStatusBadge';
import type { Driver } from '../../types';

interface DriverRowProps {
  driver: Driver;
}

export default function DriverRow({ driver }: DriverRowProps) {
  return (
    <TableRow>
      <TableCell className="font-semibold">{driver.name}</TableCell>
      <TableCell className="text-[#6B7280]">{driver.licenseNumber}</TableCell>
      <TableCell className="text-[#6B7280]">{driver.licenseCategory}</TableCell>
      <TableCell className="text-[#6B7280]">{driver.licenseExpiryDate}</TableCell>
      <TableCell className="text-[#6B7280]">{driver.contactNumber}</TableCell>
      <TableCell>
        <SafetyScore score={driver.safetyScore} />
      </TableCell>
      <TableCell>
        <DriverStatusBadge status={driver.status} />
      </TableCell>
    </TableRow>
  );
}
