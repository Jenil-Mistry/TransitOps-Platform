const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

const replacements = [
  { regex: /bg-\[#FAFAFA\]/g, replacement: 'bg-[var(--color-bg-secondary)]' },
  { regex: /border-\[#ECECEC\]/g, replacement: 'border-[var(--color-border)]' },
  { regex: /text-\[#111111\]/g, replacement: 'text-[var(--color-text-primary)]' },
  { regex: /ring-\[#0C0D0D\]/g, replacement: 'ring-[var(--color-brand)]/20' },
  { regex: /border-\[#0C0D0D\]/g, replacement: 'border-[var(--color-brand)]' },
  { regex: /bg-\[#0C0D0D\]/g, replacement: 'bg-[var(--color-brand)]' },
  { regex: /text-\[#6B7280\]/g, replacement: 'text-[var(--color-text-muted)]' },
  { regex: /text-\[#9CA3AF\]/g, replacement: 'text-[var(--color-text-disabled)]' },
  { regex: /hover:bg-\[#F3F4F6\]/g, replacement: 'hover:bg-[var(--color-bg-hover)]' },
  { regex: /hover:bg-\[#333\]/g, replacement: 'hover:bg-[var(--color-brand-hover)]' },
  { regex: /active:bg-black/g, replacement: 'active:bg-[var(--color-brand)]' },
  { regex: /fill="#FAFAFA"/g, replacement: 'fill="var(--color-bg-secondary)"' },
  { regex: /stroke="#E2E8F0"/g, replacement: 'stroke="var(--color-border)"' },
  { regex: /fill="#64748B"/g, replacement: 'fill="var(--color-text-muted)"' },
  { regex: /fill="#4F46E5"/g, replacement: 'fill="var(--color-brand)"' },
  { regex: /stroke="#4F46E5"/g, replacement: 'stroke="var(--color-brand)"' },
  { regex: /fill="#D97706"/g, replacement: 'fill="var(--color-warning)"' },
  { regex: /stroke="#D97706"/g, replacement: 'stroke="var(--color-warning)"' },
  { regex: /fill="#DC2626"/g, replacement: 'fill="var(--color-danger)"' },
  { regex: /stroke="#DC2626"/g, replacement: 'stroke="var(--color-danger)"' },
  { regex: /border: '1px solid #ECECEC'/g, replacement: "border: '1px solid var(--color-border)'" },
  { regex: /border: '1px solid #E2E8F0'/g, replacement: "border: '1px solid var(--color-border)'" },
  { regex: /placeholder-\[#9CA3AF\]/g, replacement: 'placeholder-[var(--color-text-disabled)]' },
  { regex: /text-red-700/g, replacement: 'text-[var(--color-danger)]' },
  { regex: /bg-red-50/g, replacement: 'bg-[var(--color-danger-soft)]' },
  { regex: /border-red-200/g, replacement: 'border-[var(--color-danger)]' },
  { regex: /text-green-700/g, replacement: 'text-[var(--color-success)]' },
  { regex: /bg-green-50/g, replacement: 'bg-[var(--color-success-soft)]' },
  { regex: /border-green-200/g, replacement: 'border-[var(--color-success)]' }
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
console.log('Refactoring complete.');
