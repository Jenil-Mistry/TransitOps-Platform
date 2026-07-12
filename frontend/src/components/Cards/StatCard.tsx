interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
}

export default function StatCard({ label, value, color = 'text-[#111111]' }: StatCardProps) {
  return (
    <div className="min-w-[140px] flex-shrink-0 flex flex-col justify-center border-r border-[#ECECEC] last:border-0 pr-6">
      <span className="text-[10px] font-bold text-[#6B7280] tracking-wider mb-2">{label}</span>
      <span className={`text-4xl font-extrabold ${color}`}>{value}</span>
    </div>
  );
}
