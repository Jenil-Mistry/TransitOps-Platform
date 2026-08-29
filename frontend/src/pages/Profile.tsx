import { useAuthStore } from '../store/useAuthStore';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { Mail, Phone, MapPin, Briefcase, Calendar, Shield } from 'lucide-react';
import { mockUser } from '../data/mockUser';

export default function Profile() {
  const { user } = useAuthStore();
  const userName = user?.name || mockUser.name;
  const userEmail = user?.email || mockUser.email;
  const userRole = user?.role || mockUser.role;

  const details = [
    { label: 'Email', value: userEmail, icon: Mail },
    { label: 'Phone', value: mockUser.phone, icon: Phone },
    { label: 'Location', value: mockUser.location, icon: MapPin },
    { label: 'Department', value: mockUser.department, icon: Briefcase },
    { label: 'Member since', value: mockUser.memberSince, icon: Calendar },
    { label: 'Role', value: userRole, icon: Shield },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-page-title">Profile</h1>
        <p className="text-page-subtitle mt-1">Your account details.</p>
      </div>

      {/* Profile Card */}
      <div className="card overflow-hidden">
        <div className="px-6 py-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-[var(--color-border)]">
          <Avatar name={userName} size="lg" className="!w-20 !h-20 !text-[24px]" />
          <div className="text-center sm:text-left">
            <h2 className="text-[22px] font-bold text-[var(--color-text-primary)]">{userName}</h2>
            <p className="text-[14px] text-[var(--color-text-secondary)] mt-1">{userRole}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] text-[12px] font-medium bg-[var(--color-success-soft)] text-[var(--color-success)]">
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {mockUser.status}
              </span>
              <span className="text-caption">ID: {mockUser.employeeId}</span>
            </div>
          </div>
          <div className="sm:ml-auto">
            <Button variant="outline" size="sm">Edit Profile</Button>
          </div>
        </div>

        <div className="divide-y divide-[var(--color-border)]">
          {details.map(detail => {
            const Icon = detail.icon;
            return (
              <div key={detail.label} className="px-6 py-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-text-muted)] flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-[var(--color-text-muted)] uppercase tracking-wide">{detail.label}</p>
                  <p className="text-[14px] text-[var(--color-text-primary)] mt-0.5">{detail.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
