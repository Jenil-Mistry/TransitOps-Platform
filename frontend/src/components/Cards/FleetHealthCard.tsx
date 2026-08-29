import ProgressBar from '../ui/ProgressBar';
import { mockFleetHealth } from '../../data/mockData';

export default function FleetHealthCard() {
  const { active, idle, maintenance, critical, total, healthPercentages } = mockFleetHealth;

  const statuses = [
    { label: 'Active', count: active, color: 'success' as const, percentage: Math.round((active / total) * 100) },
    { label: 'Idle', count: idle, color: 'warning' as const, percentage: Math.round((idle / total) * 100) },
    { label: 'In Maintenance', count: maintenance, color: 'purple' as const, percentage: Math.round((maintenance / total) * 100) },
    { label: 'Critical', count: critical, color: 'danger' as const, percentage: Math.round((critical / total) * 100) },
  ];

  return (
    <div className="card h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--color-border)]">
        <h3 className="text-card-title">Fleet Health</h3>
        <p className="text-caption mt-0.5">{total} total vehicles</p>
      </div>

      {/* Content */}
      <div className="px-5 py-4 flex-1 flex flex-col gap-4">
        {/* Status breakdown */}
        {statuses.map(status => (
          <div key={status.label} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[var(--color-text-primary)]">{status.label}</span>
              <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">{status.count}</span>
            </div>
            <ProgressBar value={status.percentage} color={status.color} size="sm" />
          </div>
        ))}

        {/* Health summary */}
        <div className="mt-auto pt-4 border-t border-[var(--color-border)]">
          <div className="text-label mb-3">Overall Health</div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] text-[var(--color-success)]">Healthy</span>
                <span className="text-[12px] font-semibold text-[var(--color-success)]">{healthPercentages.healthy}%</span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] text-[var(--color-warning)]">Warning</span>
                <span className="text-[12px] font-semibold text-[var(--color-warning)]">{healthPercentages.warning}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[var(--color-danger)]">Critical</span>
                <span className="text-[12px] font-semibold text-[var(--color-danger)]">{healthPercentages.critical}%</span>
              </div>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-[var(--color-success)] flex items-center justify-center flex-shrink-0">
              <span className="text-[14px] font-bold text-[var(--color-success)]">{healthPercentages.healthy}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
