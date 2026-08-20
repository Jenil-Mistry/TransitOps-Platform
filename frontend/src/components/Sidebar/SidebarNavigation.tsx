import SidebarNavigationItem from './SidebarNavigationItem';
import type { SidebarNavigationItemProps } from './SidebarNavigationItem';

interface SidebarNavigationProps {
  items: SidebarNavigationItemProps[];
}

// Group items into sections per the master plan
const sectionOrder: Record<string, string[]> = {
  'Overview': ['/dashboard'],
  'Operations': ['/vehicles', '/drivers', '/trips'],
  'Management': ['/maintenance', '/expenses'],
  'Insights': ['/analytics'],
  'System': ['/notifications', '/settings'],
};

export default function SidebarNavigation({ items }: SidebarNavigationProps) {
  // Group items by section
  const sections: { label: string; items: SidebarNavigationItemProps[] }[] = [];

  for (const [label, paths] of Object.entries(sectionOrder)) {
    const sectionItems = paths
      .map(path => items.find(item => item.path === path))
      .filter((item): item is SidebarNavigationItemProps => item !== undefined);

    if (sectionItems.length > 0) {
      sections.push({ label, items: sectionItems });
    }
  }

  // Add any remaining items that don't fit into predefined sections
  const allSectionPaths = Object.values(sectionOrder).flat();
  const remainingItems = items.filter(item => !allSectionPaths.includes(item.path));
  if (remainingItems.length > 0) {
    sections.push({ label: 'Other', items: remainingItems });
  }

  return (
    <nav className="flex flex-col gap-1 py-2">
      {sections.map((section, idx) => (
        <div key={section.label} className={idx > 0 ? 'mt-4' : ''}>
          <div className="section-label hidden md:block px-6 py-1">
            {section.label}
          </div>
          <div className="flex flex-col gap-0.5 mt-1">
            {section.items.map((item) => (
              <SidebarNavigationItem key={item.path} {...item} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
