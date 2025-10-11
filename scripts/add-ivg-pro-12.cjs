const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../data/products.ts');
const content = fs.readFileSync(filePath, 'utf8');

const idx = content.lastIndexOf('\n];');
if (idx === -1) {
  console.error('Could not find closing array in products.ts');
  process.exit(1);
}

const newProduct = `,
 {
  "id": "IVG-PRO12",
  "name": "IVG Pro 12 Vape (Pack of 5)",
  "price": 24.99,
  "description": "IVG Pro 12 rechargeable vape kit - pack of 5. Portable, pre-filled pods with multiple flavours.",
  "images": [
   "https://www.washingtonvapeswholesale.co.uk/cdn/shop/files/ivg-pro-12-kit-pack-of-5-washington-vapes-wholesale-627386_1800x1800.webp?v=1741749726",
   "https://www.washingtonvapeswholesale.co.uk/cdn/shop/files/ivg-pro-12-kit-pack-of-5-washington-vapes-wholesale-627386_350x.webp?v=1741749726",
   "https://www.washingtonvapeswholesale.co.uk/cdn/shop/files/ivg-pro-12-3_600x.webp?v=1741749726"
  ],
  "category": "Vapes & Accessories",
  "inStock": true,
  "featured": false,
  "flavours": [
   "Blue Sour Raspberry",
   "Blue Raspberry Ice",
   "Strawberry Watermelon",
   "Pineapple Ice",
   "Kiwi Passionfruit Guava",
   "Fizzy Cherry",
   "Polar Mint",
   "Red Sour Raspberry",
   "Lemon Lime",
   "Double Mango",
   "Cherry Strawberry Raspberry Ice",
   "Pink Lemonade",
   "Classic Menthol",
   "Fizzy Strawberry",
   "Strawberry Ice"
  ]
 }
];
`;

const newContent = content.replace(/\n\];\n\nexport const categories = \[/, newProduct + '\nexport const categories = [');

if (newContent === content) {
  console.error('Replacement failed — pattern not found');
  process.exit(1);
}

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Inserted IVG product into data/products.ts');
