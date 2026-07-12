import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (isOpen) {
      setIsMounted(true);
    } else {
      timeoutId = setTimeout(() => setIsMounted(false), 200);
    }
    return () => clearTimeout(timeoutId);
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-[40px] h-[40px] md:w-[44px] md:h-[44px] rounded-full bg-[#FAFAFA] border border-[#ECECEC] flex items-center justify-center text-[#111111] hover:bg-[#F3F4F6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0C0D0D] focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <User className="w-5 h-5 text-[#6B7280]" />
      </button>

      {/* Dropdown Menu */}
      {isMounted && (
        <div
          className={`absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#ECECEC] shadow-xl py-2 z-50 transition-all duration-200 origin-top-right ${
            isOpen
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
          role="menu"
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-[#ECECEC]">
            <p className="text-sm font-semibold text-[#111111] truncate">{user?.name || 'Fleet Manager'}</p>
            <p className="text-xs text-[#6B7280] truncate">{user?.email || 'manager@transitops.com'}</p>
          </div>

          {/* Menu Items */}
          <div className="px-2 py-2 space-y-1">
            <button
              onClick={() => handleNavigation('/profile')}
              className="w-full flex items-center px-2 py-2 text-sm font-medium text-[#111111] rounded-lg hover:bg-[#FAFAFA] transition-colors cursor-pointer focus:outline-none focus:bg-[#FAFAFA]"
            >
              <User className="w-4 h-4 mr-3 text-[#6B7280]" />
              Profile
            </button>
            
            <button
              onClick={() => handleNavigation('/settings')}
              className="w-full flex items-center px-2 py-2 text-sm font-medium text-[#111111] rounded-lg hover:bg-[#FAFAFA] transition-colors cursor-pointer focus:outline-none focus:bg-[#FAFAFA]"
            >
              <Settings className="w-4 h-4 mr-3 text-[#6B7280]" />
              Settings
            </button>
          </div>

          {/* Separator */}
          <div className="h-px bg-[#ECECEC] w-full" />

          {/* Logout Section */}
          <div className="px-2 py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-2 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer focus:outline-none focus:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-3 text-red-500" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
