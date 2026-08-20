import { useState } from 'react';
import { clsx } from 'clsx';
import { mockFleetHealth } from '../../data/mockData';

// SVG-based map visualization of Gujarat/Maharashtra region
const cities = [
  { name: 'Ahmedabad', x: 180, y: 120, vehicles: 3 },
  { name: 'Surat', x: 220, y: 220, vehicles: 2 },
  { name: 'Vadodara', x: 230, y: 160, vehicles: 1 },
  { name: 'Rajkot', x: 120, y: 130, vehicles: 1 },
  { name: 'Mumbai', x: 240, y: 320, vehicles: 2 },
  { name: 'Pune', x: 300, y: 340, vehicles: 1 },
];

const routes = [
  { from: 'Ahmedabad', to: 'Surat', status: 'active' },
  { from: 'Mumbai', to: 'Pune', status: 'active' },
  { from: 'Rajkot', to: 'Vadodara', status: 'active' },
];

type FilterTab = 'All' | 'Active' | 'Idle' | 'Maintenance' | 'Offline';

export default function LiveFleetMap() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const filters: FilterTab[] = ['All', 'Active', 'Idle', 'Maintenance', 'Offline'];

  const getCityPos = (name: string) => cities.find(c => c.name === name);

  const statusColors: Record<string, string> = {
    active: 'var(--color-success)',
    idle: 'var(--color-warning)',
    maintenance: 'var(--color-purple)',
    offline: 'var(--color-text-disabled)',
  };

  return (
    <div className="card overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="text-card-title">Live Fleet</h3>
          <p className="text-caption mt-0.5">{mockFleetHealth.active} vehicles in transit</p>
        </div>
        <div className="flex items-center gap-1 bg-[var(--color-bg-secondary)] rounded-[var(--radius-sm)] p-0.5">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={clsx(
                'px-2.5 py-1.5 text-[11px] font-medium rounded-[var(--radius-sm)] transition-all cursor-pointer',
                activeFilter === filter
                  ? 'bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] '
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative bg-[var(--color-bg-secondary)] min-h-[280px]">
        <svg viewBox="0 0 420 400" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--color-border)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="420" height="400" fill="url(#grid)" />

          {/* Gujarat/Maharashtra coastline (simplified) */}
          <path
            d="M 80 80 Q 60 150 70 200 Q 80 250 100 280 Q 130 310 180 350 Q 200 360 240 380 Q 280 370 320 360 Q 350 340 370 300"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Land mass fill */}
          <path
            d="M 80 80 Q 100 70 180 60 Q 280 55 370 80 L 380 300 Q 350 340 320 360 Q 280 370 240 380 Q 200 360 180 350 Q 130 310 100 280 Q 80 250 70 200 Q 60 150 80 80 Z"
            fill="var(--color-bg-app)"
            stroke="none"
            opacity="0.6"
          />

          {/* Routes */}
          {routes.map((route, i) => {
            const from = getCityPos(route.from);
            const to = getCityPos(route.to);
            if (!from || !to) return null;
            return (
              <g key={i}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={statusColors[route.status]}
                  strokeWidth="2"
                  strokeDasharray="6 3"
                  opacity="0.6"
                />
                {/* Moving dot animation */}
                <circle r="3" fill={statusColors[route.status]}>
                  <animateMotion
                    dur={`${3 + i}s`}
                    repeatCount="indefinite"
                    path={`M${from.x},${from.y} L${to.x},${to.y}`}
                  />
                </circle>
              </g>
            );
          })}

          {/* Cities */}
          {cities.map(city => (
            <g key={city.name}>
              {/* Pulse ring */}
              <circle cx={city.x} cy={city.y} r="12" fill={statusColors.active} opacity="0.1">
                <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.1;0.05;0.1" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Marker */}
              <circle cx={city.x} cy={city.y} r="6" fill={statusColors.active} stroke="white" strokeWidth="2" />
              {/* Label */}
              <text
                x={city.x}
                y={city.y - 14}
                textAnchor="middle"
                className="text-[10px] font-medium"
                fill="var(--color-text-muted)"
              >
                {city.name}
              </text>
              {/* Vehicle count badge */}
              <rect x={city.x + 8} y={city.y - 8} width="16" height="14" rx="4" fill="var(--color-brand)" />
              <text x={city.x + 16} y={city.y + 2} textAnchor="middle" className="text-[8px] font-bold" fill="white">
                {city.vehicles}
              </text>
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-[var(--radius-sm)] px-3 py-2 border border-[var(--color-border)]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
            <span className="text-[10px] text-[var(--color-text-muted)]">Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--color-warning)]" />
            <span className="text-[10px] text-[var(--color-text-muted)]">Idle</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--color-purple)]" />
            <span className="text-[10px] text-[var(--color-text-muted)]">Maintenance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
