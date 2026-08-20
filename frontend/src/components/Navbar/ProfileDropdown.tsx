import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import Avatar from '../ui/Avatar';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const userName = user?.name || 'Admin Fleet';
  const userEmail = user?.email || 'admin@transitops.com';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="User menu"
      >
        <Avatar name={userName} size="sm" />
        <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-muted)] hidden sm:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[220px] bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-[var(--radius-sm)]  z-50 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-[var(--color-border)]">
            <p className="text-[13px] font-semibold text-[var(--color-text-primary)]">{userName}</p>
            <p className="text-[12px] text-[var(--color-text-muted)] truncate">{userEmail}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => { navigate('/profile'); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={() => { navigate('/settings'); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>

          <div className="border-t border-[var(--color-border)] py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
