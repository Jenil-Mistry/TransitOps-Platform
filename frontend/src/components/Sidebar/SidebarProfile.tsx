import { useAuthStore } from '../../store/useAuthStore';

export default function SidebarProfile() {
  const { user } = useAuthStore();

  return (
    <div className="px-6 pb-6 hidden md:flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full bg-[var(--color-6)] border border-[var(--color-3)] overflow-hidden flex-shrink-0">
        <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`} alt="User avatar" />
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-sm font-semibold text-[var(--color-1)] truncate">{user?.name}</span>
        <span className="text-xs text-[var(--color-text-muted)] truncate">{user?.role}</span>
      </div>
    </div>
  );
}
