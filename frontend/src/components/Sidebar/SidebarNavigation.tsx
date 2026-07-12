import SidebarNavigationItem, { type SidebarNavigationItemProps } from './SidebarNavigationItem';

export interface SidebarNavigationProps {
  items: SidebarNavigationItemProps[];
}

export default function SidebarNavigation({ items }: SidebarNavigationProps) {
  return (
    <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
      {items.map((item) => (
        <SidebarNavigationItem key={item.name} name={item.name} path={item.path} icon={item.icon} />
      ))}
    </nav>
  );
}
