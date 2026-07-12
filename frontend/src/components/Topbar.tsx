import { Search, Bell, Plus } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="h-20 bg-transparent flex items-center justify-between px-8 pt-4">
      <div className="flex-1 max-w-2xl flex items-center">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#9CA3AF]" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 h-12 border border-[#ECECEC] rounded-2xl bg-[#FAFAFA] text-[#111111] text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#0C0D0D] transition-all duration-200"
            placeholder="Search for driver, vehicle, trip..."
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <button className="text-[#6B7280] hover:text-[#111111] transition-all duration-200 hover:scale-105">
          <Bell className="h-6 w-6" />
        </button>
        
        <button
          onClick={() => navigate('/trips')}
          className="flex items-center px-6 h-12 bg-[#0C0D0D] text-white text-sm font-semibold rounded-2xl hover:scale-[1.02] transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Trip
        </button>
        
        <button onClick={logout} className="text-sm font-medium text-[#6B7280] hover:text-[#111111] transition-colors">
          Log out
        </button>
      </div>
    </header>
  );
}
