const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../data/products.ts');
let content = fs.readFileSync(filePath, 'utf8');

if (content.includes('"Vapes & Accessories"')) {
  console.log('Category already present');
  process.exit(0);
}

content = content.replace(/export const categories = \[([\s\S]*?)\];/, (m, inner) => {
  return m.replace(/\];\s*$/, ',\n "Vapes & Accessories",\n];');
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Added Vapes & Accessories to categories');
