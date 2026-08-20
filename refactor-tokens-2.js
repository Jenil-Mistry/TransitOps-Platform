const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

const replacements = [
  { regex: /'#64748B'/g, replacement: "'var(--color-text-muted)'" },
  { regex: /'#E2E8F0'/g, replacement: "'var(--color-border)'" },
  { regex: /"#E2E8F0"/g, replacement: '"var(--color-border)"' },
  { regex: /'#4F46E5'/g, replacement: "'var(--color-brand)'" },
  { regex: /"#4F46E5"/g, replacement: '"var(--color-brand)"' },
  { regex: /'#D97706'/g, replacement: "'var(--color-warning)'" },
  { regex: /"#D97706"/g, replacement: '"var(--color-warning)"' },
  { regex: /'#fff'/g, replacement: "'var(--color-bg-primary)'" },
  { regex: /'#FFF'/g, replacement: "'var(--color-bg-primary)'" },
  { regex: /"#fff"/g, replacement: '"var(--color-bg-primary)"' },
  { regex: /"#FFF"/g, replacement: '"var(--color-bg-primary)"' },
  { regex: /bg-\[#F0F4F8\]/g, replacement: 'bg-[var(--color-bg-secondary)]' },
  { regex: /fill="#F8FAFC"/g, replacement: 'fill="var(--color-bg-app)"' },
  { regex: /stroke="#CBD5E1"/g, replacement: 'stroke="var(--color-border)"' },
  { regex: /fill="#475569"/g, replacement: 'fill="var(--color-text-muted)"' },
  { regex: /hover:bg-\[#15803d\]/g, replacement: 'hover:bg-[var(--color-success-soft)] text-[var(--color-success)]' }, // Approximate for TripCard button
  { regex: /'#FAFAFA'/g, replacement: "'var(--color-bg-secondary)'" },
  { regex: /'#6B7280'/g, replacement: "'var(--color-text-muted)'" },
  { regex: /fill: '#6B7280'/g, replacement: "fill: 'var(--color-text-muted)'" },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Refactoring complete 2.');
