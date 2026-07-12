import StatusBadge from './StatusBadge';

interface VehicleStatusBadgeProps {
  status: string;
}

export default function VehicleStatusBadge({ status }: VehicleStatusBadgeProps) {
  return <StatusBadge status={status} />;
}
