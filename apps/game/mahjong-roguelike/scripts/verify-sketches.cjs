const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'sketches');
const files = [
  'index.html',
  '001-teahouse-table/index.html',
  '002-mobile-hud/index.html',
  '003-roguelike-drama/index.html',
  '004-concept-layered/index.html',
  '001-teahouse-table/README.md',
  '002-mobile-hud/README.md',
  '003-roguelike-drama/README.md',
  '004-concept-layered/README.md',
];

const errors = [];
for (const rel of files) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    errors.push(`missing ${rel}`);
    continue;
  }
  const content = fs.readFileSync(file, 'utf8');
  if (content.charCodeAt(0) === 0xfeff) errors.push(`${rel} has BOM`);
  if (!content.trim()) errors.push(`${rel} is empty`);
  if (rel.endsWith('.html')) {
    for (const token of ['<!doctype html>', '<html', '<head>', '<body', '</html>']) {
      if (!content.toLowerCase().includes(token)) errors.push(`${rel} missing ${token}`);
    }
    if (rel !== 'index.html' && !content.includes('390px')) {
      errors.push(`${rel} missing 390px mobile frame sizing`);
    }
  }
}

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const links = [...index.matchAll(/href="([^"]+)"/g)].map((match) => match[1]).filter((href) => !href.startsWith('#'));
for (const href of links) {
  const target = path.join(root, href);
  if (!fs.existsSync(target)) errors.push(`index link target missing: ${href}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Verified ${files.length} sketch files and ${links.length} index links.`);
