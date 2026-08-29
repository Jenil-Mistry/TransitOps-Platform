import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { clsx } from 'clsx';
import { mockFuelData } from '../../data/mockData';

type TimeFilter = '7D' | '30D' | '6M';

export default function FuelConsumptionChart() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('6M');
  const filters: TimeFilter[] = ['7D', '30D', '6M'];

  const data = (timeFilter === '7D'
    ? mockFuelData.weeklyData
    : mockFuelData.monthlyData) as any[];

  const xKey = timeFilter === '7D' ? 'day' : 'month';

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
        <div>
          <h3 className="text-card-title">Fuel Consumption</h3>
          <p className="text-caption mt-0.5">Litres & cost trend</p>
        </div>
        <div className="flex items-center gap-1 bg-[var(--color-bg-secondary)] rounded-[var(--radius-sm)] p-0.5">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={clsx(
                'px-2.5 py-1.5 text-[11px] font-medium rounded-[var(--radius-sm)] transition-all cursor-pointer',
                timeFilter === filter
                  ? 'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] '
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-brand)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="var(--color-brand)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey={xKey}
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
            <Area
              type="monotone"
              dataKey="litres"
              stroke="var(--color-brand)"
              strokeWidth={2}
              fill="url(#fuelGradient)"
              name="Litres"
            />
            <Area
              type="monotone"
              dataKey="cost"
              stroke="var(--color-warning)"
              strokeWidth={2}
              fill="none"
              strokeDasharray="5 3"
              name="Cost (₹)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
