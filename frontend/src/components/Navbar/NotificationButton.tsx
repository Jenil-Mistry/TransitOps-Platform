import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { mockNotifications } from '../../data/mockData';

export default function NotificationButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const categoryColors: Record<string, string> = {
    maintenance: 'bg-[var(--color-purple-soft)] text-[var(--color-purple)]',
    trips: 'bg-[var(--color-info-soft)] text-[var(--color-info)]',
    vehicles: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
    expenses: 'bg-[var(--color-warning-soft)] text-[var(--color-warning)]',
    system: 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]',
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-[18px] h-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--color-danger)] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[380px] bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-[var(--radius-sm)]  z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
            <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[12px] font-medium text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`px-4 py-3 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-hover)] transition-colors ${
                  !notification.read ? 'bg-[var(--color-brand-soft)]/30' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 px-2 py-0.5 rounded-[4px] text-[10px] font-medium uppercase ${categoryColors[notification.category]}`}>
                    {notification.category}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[var(--color-text-primary)]">{notification.title}</p>
                    <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5 line-clamp-2">{notification.message}</p>
                    <p className="text-[11px] text-[var(--color-text-disabled)] mt-1">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-[var(--color-brand)] flex-shrink-0 mt-1.5" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
