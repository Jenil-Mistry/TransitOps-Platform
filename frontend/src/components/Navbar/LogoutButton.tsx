import { useAuthStore } from '../../store/useAuthStore';

export default function LogoutButton() {
  const { logout } = useAuthStore();
  return (
    <button onClick={logout} className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-1)] transition-colors">
      Log out
    </button>
  );
}
