import { useAuthStore } from '../../store/useAuthStore';

export default function LogoutButton() {
  const { logout } = useAuthStore();
  return (
    <button onClick={logout} className="text-sm font-medium text-[#6B7280] hover:text-[#111111] transition-colors">
      Log out
    </button>
  );
}
