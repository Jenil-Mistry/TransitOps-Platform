import { useState, type ReactNode } from 'react';
import { clsx } from 'clsx';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export default function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={clsx('flex items-center border-b border-[var(--color-border)]', className)} role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'relative flex items-center gap-2 px-4 py-3 text-[14px] font-medium transition-colors cursor-pointer',
              isActive
                ? 'text-[var(--color-1)] font-bold'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-1)]'
            )}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-2)] rounded-t-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// Convenience hook for tab state
export function useTabs(initialTab: string) {
  const [activeTab, setActiveTab] = useState(initialTab);
  return { activeTab, setActiveTab };
}
