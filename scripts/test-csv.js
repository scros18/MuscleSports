const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const filePath = path.join(process.cwd(), 'aosomstockandprice.csv');
const map = {};
fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (row) => {
    const lower = Object.fromEntries(
      Object.entries(row).map(([k, v]) => [String(k).toLowerCase().trim(), typeof v === 'string' ? v.trim() : v])
    );
    const hasGeneric = 'column1' in lower || 'column2' in lower || 'column4' in lower;
    const skuVal = hasGeneric ? (row['Column1'] ?? row['column1']) : (lower.id ?? lower.sku);
    if (typeof skuVal === 'string' && skuVal.trim().toLowerCase() === 'sku') return;
    const key = (skuVal ?? '').toString().trim();
    if (!key) return;
    const priceStr = hasGeneric ? (row['Column4'] ?? row['column4']) : (lower.price ?? row.Price ?? row.PRICE);
    let priceNum;
    if (priceStr !== undefined) {
      const cleaned = String(priceStr).replace(/[^0-9.]/g, '');
      const val = parseFloat(cleaned);
      if (Number.isFinite(val)) priceNum = val;
    }
    const stockStr = hasGeneric ? (row['Column2'] ?? row['column2']) : (lower.stock ?? lower.quantity ?? lower.qty ?? lower.instock);
    let inStock;
    if (stockStr !== undefined) {
      const s = String(stockStr).toLowerCase();
      if (s.includes('out')) inStock = false;
      else if (s.includes('in')) inStock = true;
      else {
        const n = parseInt(s.replace(/[^0-9-]/g, '') || '0', 10);
        inStock = n > 0;
      }
    }
    map[key] = { price: priceNum, inStock };
  })
  .on('end', () => {
    console.log('keys:', Object.keys(map).slice(0,5));
    console.log('720-021 =>', map['720-021']);
    console.log('01-0710 =>', map['01-0710']);
  })
  .on('error', (err) => {
    console.error('error', err);
  });
