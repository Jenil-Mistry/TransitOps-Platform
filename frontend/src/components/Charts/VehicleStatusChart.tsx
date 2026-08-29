import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import BaseCard from '../Cards/BaseCard';

interface VehicleStatusChartProps {
  data: { name: string; count: number; color: string }[];
}

export default function VehicleStatusChart({ data }: VehicleStatusChartProps) {
  return (
    <BaseCard title="Vehicle Status">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12, fontWeight: 500 }} width={80} />
            <Tooltip cursor={{ fill: 'var(--color-bg-secondary)' }} contentStyle={{ borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: '0 8px 24px rgba(0,0,0,.05)' }} />
            <Bar dataKey="count" barSize={12} radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </BaseCard>
  );
}
