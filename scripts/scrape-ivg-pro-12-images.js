const https = require('https');
const cheerio = require('cheerio');

const url = 'https://www.washingtonvapeswholesale.co.uk/products/ivg-pro-12';

https.get(url, (res) => {
  let html = '';
  
  res.on('data', (chunk) => {
    html += chunk;
  });
  
  res.on('end', () => {
    const $ = cheerio.load(html);
    
    // Look for variant/option data in script tags
    const scripts = $('script').map((i, el) => $(el).html()).get();
    
    // Find product data
    let productData = null;
    for (let script of scripts) {
      if (script && script.includes('variants')) {
        // Try to extract JSON
        const match = script.match(/var\s+meta\s*=\s*({[\s\S]*?});/);
        if (match) {
          try {
            productData = JSON.parse(match[1]);
            break;
          } catch (e) {}
        }
      }
    }
    
    // Look for select options
    const flavourOptions = [];
    $('select option').each((i, el) => {
      const $el = $(el);
      const text = $el.text().trim();
      const value = $el.attr('value');
      if (text && text.includes('MG /')) {
        flavourOptions.push({
          value,
          text,
          variantId: value
        });
      }
    });
    
    console.log('Found flavour options:', flavourOptions.length);
    flavourOptions.forEach(opt => console.log(`- ${opt.text}`));
    
    // Look for image data
    const images = [];
    $('img').each((i, el) => {
      const $el = $(el);
      const src = $el.attr('src');
      if (src && src.includes('cdn.shopify')) {
        images.push({
          src,
          alt: $el.attr('alt') || ''
        });
      }
    });
    
    console.log('\nFound Shopify CDN images:', images.length);
    images.slice(0, 10).forEach(img => console.log(`- ${img.src}`));
    
    // Output for manual review
    if (productData) {
      console.log('\nProduct data:', JSON.stringify(productData, null, 2));
    }
  });
  
}).on('error', (e) => {
  console.error('Error:', e);
});

