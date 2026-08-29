import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { mockTripPerformance } from '../../data/mockData';

export default function TripPerformanceChart() {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--color-border)]">
        <h3 className="text-card-title">Trip Performance</h3>
        <p className="text-caption mt-0.5">Completed vs delayed vs cancelled</p>
      </div>

      <div className="px-5 py-4">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={mockTripPerformance} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-primary)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            />
            <Bar dataKey="completed" fill="var(--color-brand)" radius={[4, 4, 0, 0]} name="Completed" barSize={16} />
            <Bar dataKey="delayed" fill="var(--color-warning)" radius={[4, 4, 0, 0]} name="Delayed" barSize={16} />
            <Bar dataKey="cancelled" fill="var(--color-danger)" radius={[4, 4, 0, 0]} name="Cancelled" barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
