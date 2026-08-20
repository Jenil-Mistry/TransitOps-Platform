import { useState } from 'react';
import { Fuel, Activity, DollarSign, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { clsx } from 'clsx';
import KpiCard from '../components/ui/KpiCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { mockAnalyticsData, mockTripPerformance } from '../data/mockData';

type TimeFilter = '7D' | '30D' | '6M' | '1Y';

export default function Analytics() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('6M');
  const filters: TimeFilter[] = ['7D', '30D', '6M', '1Y'];

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-4 border-b-4 border-[var(--color-border-strong)]">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-[var(--color-text-primary)] leading-none">Analytics</h1>
          <p className="text-sm font-mono tracking-widest uppercase text-[var(--color-text-muted)] mt-2">FLEET PERFORMANCE &bull; REPORTS</p>
        </div>
        <div className="flex items-center bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border-strong)] rounded-none p-1">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={clsx(
                'px-4 py-2 text-xs font-bold font-mono tracking-wider transition-all cursor-pointer border-2 border-transparent',
                timeFilter === filter
                  ? 'bg-[var(--color-brand)] text-[var(--color-brand-foreground)] border-[var(--color-brand-foreground)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border)]'
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Fleet Utilization" value="78.4%" icon={<Activity className="w-[18px] h-[18px]" />} trend={4.6} trendLabel="vs last month" />
        <KpiCard label="Fuel Efficiency" value="8.4 km/L" icon={<Fuel className="w-[18px] h-[18px]" />} trend={2.1} trendLabel="vs last month" />
        <KpiCard label="Cost / KM" value="₹11.2" icon={<DollarSign className="w-[18px] h-[18px]" />} trend={-3.2} trendLabel="vs last month" />
        <KpiCard label="Trip Completion" value="96.2%" icon={<Target className="w-[18px] h-[18px]" />} trend={1.8} trendLabel="vs last month" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-none border-2 border-[var(--color-border-strong)] shadow-[4px_4px_0_var(--color-border-strong)]">
          <CardHeader className="border-b-2 border-[var(--color-border-strong)] bg-[var(--color-bg-secondary)]">
            <CardTitle>Fleet Utilization Trend</CardTitle>
            <CardDescription>Monthly utilization percentage</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={mockAnalyticsData.fleetUtilization} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: 'monospace', fill: 'var(--color-text-muted)' }} axisLine={{ stroke: 'var(--color-border-strong)', strokeWidth: 2 }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fontFamily: 'monospace', fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} domain={[60, 85]} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-app)', border: '2px solid var(--color-border-strong)', borderRadius: '0px', fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold' }} />
                <Line type="step" dataKey="value" stroke="var(--color-brand)" strokeWidth={3} dot={{ fill: 'var(--color-bg-app)', stroke: 'var(--color-brand)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} name="Utilization %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-none border-2 border-[var(--color-border-strong)] shadow-[4px_4px_0_var(--color-border-strong)]">
          <CardHeader className="border-b-2 border-[var(--color-border-strong)] bg-[var(--color-bg-secondary)]">
            <CardTitle>Cost per KM</CardTitle>
            <CardDescription>Monthly cost efficiency trend</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={mockAnalyticsData.costPerKm} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: 'monospace', fill: 'var(--color-text-muted)' }} axisLine={{ stroke: 'var(--color-border-strong)', strokeWidth: 2 }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fontFamily: 'monospace', fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-app)', border: '2px solid var(--color-border-strong)', borderRadius: '0px', fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold' }} />
                <Line type="step" dataKey="value" stroke="var(--color-warning)" strokeWidth={3} dot={{ fill: 'var(--color-bg-app)', stroke: 'var(--color-warning)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} name="₹ per KM" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="rounded-none border-2 border-[var(--color-border-strong)] shadow-[4px_4px_0_var(--color-border-strong)]">
          <CardHeader className="border-b-2 border-[var(--color-border-strong)] bg-[var(--color-bg-secondary)]">
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>By category</CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={mockAnalyticsData.expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="var(--color-bg-app)"
                  strokeWidth={2}
                >
                  {mockAnalyticsData.expenseBreakdown.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => `₹${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: 'var(--color-bg-app)', border: '2px solid var(--color-border-strong)', borderRadius: '0px', fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-none border-2 border-[var(--color-border-strong)] shadow-[4px_4px_0_var(--color-border-strong)]">
          <CardHeader className="border-b-2 border-[var(--color-border-strong)] bg-[var(--color-bg-secondary)]">
            <CardTitle>Trip Performance</CardTitle>
            <CardDescription>Monthly comparison</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={mockTripPerformance} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fontFamily: 'monospace', fill: 'var(--color-text-muted)' }} axisLine={{ stroke: 'var(--color-border-strong)', strokeWidth: 2 }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fontFamily: 'monospace', fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-app)', border: '2px solid var(--color-border-strong)', borderRadius: '0px', fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold' }} />
                <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold', paddingTop: '8px' }} />
                <Bar dataKey="completed" fill="var(--color-brand)" name="Completed" barSize={12} />
                <Bar dataKey="delayed" fill="var(--color-warning)" name="Delayed" barSize={12} />
                <Bar dataKey="cancelled" fill="var(--color-danger)" name="Cancelled" barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Driver Performance Table */}
      <Card className="rounded-none border-2 border-[var(--color-border-strong)] shadow-[4px_4px_0_var(--color-border-strong)]">
        <CardHeader className="border-b-2 border-[var(--color-border-strong)] bg-[var(--color-bg-secondary)]">
          <CardTitle>Driver Performance</CardTitle>
          <CardDescription>Top performing drivers</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto p-4">
          <Table>
            <TableHeader>
              <TableRow>
                {['Driver', 'Safety Score', 'Trips', 'On-Time %'].map(col => (
                  <TableHead key={col}>{col}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAnalyticsData.driverPerformance.map(driver => (
                <TableRow key={driver.name}>
                  <TableCell>
                    <span className="font-bold text-sm text-[var(--color-text-primary)]">{driver.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-[13px] font-bold ${driver.score >= 90 ? 'text-[var(--color-success)]' : driver.score >= 75 ? 'text-[var(--color-warning)]' : 'text-[var(--color-danger)]'}`}>
                      {driver.score}/100
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs">{driver.trips}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-[var(--color-success)]">{driver.onTime}%</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
