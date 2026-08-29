import { Truck, User, Wrench, Fuel, CheckCircle, Clock } from 'lucide-react';
import { mockRecentActivity } from '../../data/mockData';

const iconMap: Record<string, typeof Truck> = {
  truck: Truck,
  user: User,
  wrench: Wrench,
  fuel: Fuel,
  check: CheckCircle,
};

const typeColors: Record<string, string> = {
  trip: 'bg-[var(--color-info-soft)] text-[var(--color-info)]',
  driver: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
  maintenance: 'bg-[var(--color-purple-soft)] text-[var(--color-purple)]',
  expense: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
};

export default function ActivityFeed() {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--color-border)]">
        <h3 className="text-card-title">Recent Activity</h3>
        <p className="text-caption mt-0.5">Latest fleet operations</p>
      </div>

      <div className="divide-y divide-[var(--color-border)]">
        {mockRecentActivity.map((activity, index) => {
          const Icon = iconMap[activity.icon] || Clock;
          const colorClass = typeColors[activity.type] || typeColors.trip;

          return (
            <div key={activity.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-[var(--color-bg-hover)] transition-colors">
              {/* Timeline indicator */}
              <div className="flex flex-col items-center gap-1 pt-0.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {index < mockRecentActivity.length - 1 && (
                  <div className="w-px h-full min-h-[16px] bg-[var(--color-border)]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-[var(--color-text-primary)]">{activity.message}</p>
                <p className="text-[11px] text-[var(--color-text-disabled)] mt-0.5">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
