import { useAuthStore } from '../../store/useAuthStore';

export default function SidebarProfile() {
  const { user } = useAuthStore();

  return (
    <div className="px-6 pb-6 hidden md:flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full bg-[#FAFAFA] border border-[#ECECEC] overflow-hidden flex-shrink-0">
        <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} alt="User avatar" />
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-sm font-semibold text-[#111111] truncate">{user?.name}</span>
        <span className="text-xs text-[#6B7280] truncate">{user?.role}</span>
      </div>
    </div>
  );
}
