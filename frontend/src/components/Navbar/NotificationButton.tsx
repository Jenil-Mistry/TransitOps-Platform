import { Bell } from 'lucide-react';

export default function NotificationButton() {
  return (
    <button className="text-[#6B7280] hover:text-[#111111] transition-all duration-200 hover:scale-105">
      <Bell className="h-6 w-6" />
    </button>
  );
}
