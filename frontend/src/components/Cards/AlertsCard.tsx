import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { mockAlerts } from '../../data/mockData';

const severityConfig = {
  critical: {
    icon: AlertCircle,
    bg: 'bg-[var(--color-danger-soft)]',
    text: 'text-[var(--color-danger)]',
    border: 'border-l-[var(--color-danger)]',
    label: 'Critical',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-[var(--color-warning-soft)]',
    text: 'text-[var(--color-warning)]',
    border: 'border-l-[var(--color-warning)]',
    label: 'Warning',
  },
  info: {
    icon: Info,
    bg: 'bg-[var(--color-info-soft)]',
    text: 'text-[var(--color-info)]',
    border: 'border-l-[var(--color-info)]',
    label: 'Info',
  },
};

export default function AlertsCard() {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--color-border)]">
        <h3 className="text-card-title">Operational Alerts</h3>
        <p className="text-caption mt-0.5">{mockAlerts.length} active alerts</p>
      </div>

      <div className="divide-y divide-[var(--color-border)]">
        {mockAlerts.map(alert => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={`px-5 py-3.5 flex items-start gap-3 border-l-[3px] ${config.border} hover:bg-[var(--color-bg-hover)] transition-colors`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${config.bg} ${config.text}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${config.text}`}>
                    {config.label}
                  </span>
                  <span className="text-[10px] text-[var(--color-text-disabled)]">• {alert.entity}</span>
                </div>
                <p className="text-[13px] text-[var(--color-text-primary)]">{alert.message}</p>
                <p className="text-[11px] text-[var(--color-text-disabled)] mt-0.5">{alert.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
