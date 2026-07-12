import type { DriverStatus } from '../../types';

interface DriverStatusBadgeProps {
  status: DriverStatus;
}

export default function DriverStatusBadge({ status }: DriverStatusBadgeProps) {
  const getStatusColor = (status: DriverStatus) => {
    switch (status) {
      case 'Available': return 'bg-[#16A34A] text-white';
      case 'On Trip': return 'bg-[#FAFAFA] border border-[#ECECEC] text-[#111111]';
      case 'Off Duty': return 'bg-[#FAFAFA] text-[#6B7280]';
      case 'Suspended': return 'bg-[#DC2626] text-white';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}
