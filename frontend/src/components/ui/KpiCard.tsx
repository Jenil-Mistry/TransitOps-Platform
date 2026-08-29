import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from './Card';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  subtitle?: string;
  trend?: number | null;
  trendLabel?: string;
  className?: string;
}

export default function KpiCard({ label, value, icon, subtitle, trend, trendLabel, className }: KpiCardProps) {
  const trendIsPositive = trend !== null && trend !== undefined && trend >= 0;
  const hasTrend = trend !== null && trend !== undefined;

  return (
    <Card className={cn("overflow-hidden group", className)}>
      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-muted)] group-hover:text-[var(--color-brand)] transition-colors">{label}</span>
          <div className="w-8 h-8 rounded-none border-2 border-[var(--color-border-strong)] bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-brand)] flex-shrink-0 group-hover:border-[var(--color-brand)] transition-colors">
            {icon}
          </div>
        </div>

        <div className="flex flex-col items-start mt-2">
          <span className="text-4xl font-black tracking-tighter text-[var(--color-text-primary)] font-mono leading-none">{value}</span>
          {subtitle && (
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-text-muted)] mt-1">{subtitle}</span>
          )}
        </div>

        {hasTrend && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t-2 border-dashed border-[var(--color-border)]">
            <div
              className={cn(
                'inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border-2',
                trendIsPositive
                  ? 'text-[var(--color-success)] border-[var(--color-success)] bg-[var(--color-success-soft)]'
                  : 'text-[var(--color-danger)] border-[var(--color-danger)] bg-[var(--color-danger-soft)]'
              )}
            >
              {trendIsPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trendIsPositive ? '+' : ''}{trend}%
            </div>
            {trendLabel && (
              <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider">{trendLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
