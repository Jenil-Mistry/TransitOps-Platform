export interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  let style = '';
  switch (status) {
    case 'Available':
    case 'Completed':
      style = 'bg-[#16A34A] text-white';
      break;
    case 'On Trip':
    case 'Dispatched':
      style = 'bg-[#FAFAFA] border border-[#ECECEC] text-[#111111]';
      break;
    case 'In Shop':
      style = 'bg-[#F59E0B] text-white';
      break;
    case 'Retired':
    case 'Draft':
      style = 'bg-[#FAFAFA] border border-[#ECECEC] text-[#6B7280]';
      break;
    case 'Cancelled':
      style = 'bg-[#DC2626] text-white';
      break;
    default:
      style = 'bg-[#DC2626] text-white';
  }

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${style} ${className}`}>
      {status}
    </span>
  );
}
