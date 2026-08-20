import { Bell, Shield, Palette } from 'lucide-react';
import Button from '../components/ui/Button';

const settingsSections = [
  {
    title: 'Notifications',
    description: 'Configure how and when you receive notifications.',
    icon: Bell,
    settings: [
      { label: 'Email notifications', description: 'Receive trip and maintenance updates via email', enabled: true },
      { label: 'Push notifications', description: 'Browser push notifications for critical alerts', enabled: true },
      { label: 'SMS alerts', description: 'Get SMS alerts for overdue maintenance', enabled: false },
    ],
  },
  {
    title: 'Security',
    description: 'Manage your account security settings.',
    icon: Shield,
    settings: [
      { label: 'Two-factor authentication', description: 'Add an extra layer of security to your account', enabled: false },
      { label: 'Session timeout', description: 'Auto-logout after 30 minutes of inactivity', enabled: true },
    ],
  },
  {
    title: 'Preferences',
    description: 'Customize your workspace experience.',
    icon: Palette,
    settings: [
      { label: 'Dark mode', description: 'Switch to dark theme (coming soon)', enabled: false },
      { label: 'Compact tables', description: 'Reduce row height in data tables', enabled: false },
    ],
  },
];

export default function Settings() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-page-title">Settings</h1>
        <p className="text-page-subtitle mt-1">Application preferences and configuration.</p>
      </div>

      {/* Settings sections */}
      {settingsSections.map(section => {
        const Icon = section.icon;
        return (
          <div key={section.title} className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center gap-3">
              <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[var(--color-brand-soft)] flex items-center justify-center text-[var(--color-brand)]">
                <Icon className="w-[18px] h-[18px]" />
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)]">{section.title}</h2>
                <p className="text-[12px] text-[var(--color-text-muted)]">{section.description}</p>
              </div>
            </div>

            <div className="divide-y divide-[var(--color-border)]">
              {section.settings.map(setting => (
                <div key={setting.label} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-medium text-[var(--color-text-primary)]">{setting.label}</p>
                    <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5">{setting.description}</p>
                  </div>
                  {/* Toggle switch */}
                  <button
                    className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                      setting.enabled ? 'bg-[var(--color-brand)]' : 'bg-[var(--color-border-strong)]'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white  transition-transform ${
                        setting.enabled ? 'left-[22px]' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Save */}
      <div className="flex justify-end">
        <Button variant="primary">Save Changes</Button>
      </div>
    </div>
  );
}
