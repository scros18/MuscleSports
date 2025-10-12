const https = require('https');
const cheerio = require('cheerio');

// Normalize flavor names for matching
function normalizeFlavor(name) {
  return name
    .toLowerCase()
    .replace(/\s*&\s*/g, ' ') // & to space
    .replace(/\s+/g, ' ') // multiple spaces to single
    .replace(/[^\w\s]/g, '') // remove special chars except spaces
    .trim();
}

// Create variations of a flavor name
function getFlavorVariations(name) {
  const base = name.toLowerCase().trim();
  return [
    base,
    base.replace(/\s*&\s*/g, ' and '),
    base.replace(/\s*&\s*/g, ' '),
    base.replace(/\s+/g, ''),
    normalizeFlavor(base)
  ];
}

async function scrapeSource(url, sourceName) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let html = '';
      
      res.on('data', (chunk) => {
        html += chunk;
      });
      
      res.on('end', () => {
        try {
          const $ = cheerio.load(html);
          const scripts = $('script').map((i, el) => $(el).html()).get();
          
          // Find product variants data
          for (let script of scripts) {
            if (script && script.includes('"variants"')) {
              // Extract variants JSON
              const match = script.match(/"variants":\[{[\s\S]*?"id":\d+[\s\S]*?}\]/);
              if (match) {
                let jsonStr = '{ ' + match[0] + ' }';
                jsonStr = jsonStr.replace(/&quot;/g, '"').replace(/\\"/g, '"').replace(/\\\//g, '/');
                
                try {
                  const data = JSON.parse(jsonStr);
                  const flavorImages = {};
                  
                  data.variants.forEach(variant => {
                    if (variant.option1 === '20 MG' && variant.option2 && variant.featured_image && variant.featured_image.src) {
                      const flavor = variant.option2.replace(/ \*NEW\*$/i, '').trim();
                      const imageUrl = 'https:' + variant.featured_image.src;
                      
                      // Store with multiple keys for better matching
                      const variations = getFlavorVariations(flavor);
                      variations.forEach(v => {
                        flavorImages[v] = imageUrl;
                      });
                    }
                  });
                  
                  console.log(`\n${sourceName}: Found ${Object.keys(flavorImages).length / 5} unique flavors`);
                  resolve({ source: sourceName, flavors: flavorImages });
                  return;
                } catch (e) {
                  console.error(`${sourceName}: Failed to parse JSON:`, e.message);
                }
              }
            }
          }
          
          resolve({ source: sourceName, flavors: {} });
        } catch (error) {
          console.error(`${sourceName}: Error:`, error.message);
          resolve({ source: sourceName, flavors: {} });
        }
      });
    }).on('error', (e) => {
      console.error(`${sourceName}: Request error:`, e.message);
      resolve({ source: sourceName, flavors: {} });
    });
  });
}

async function main() {
  console.log('Scraping IVG Pro 12 flavor images from multiple sources...\n');
  
  const sources = [
    { url: 'https://www.washingtonvapeswholesale.co.uk/products/ivg-pro-12', name: 'Washington Vapes' },
    { url: 'https://www.mcrvapedistro.co.uk/products/ivg-pro-12-kit', name: 'MCR Vape Distro' },
    { url: 'https://www.ivapegreat.co.uk/products/ivg-pro-12-vape-kit', name: 'iVape Great' }
  ];
  
  const results = await Promise.all(
    sources.map(s => scrapeSource(s.url, s.name))
  );
  
  // Merge all sources
  const mergedFlavors = {};
  
  results.forEach(result => {
    Object.entries(result.flavors).forEach(([key, url]) => {
      if (!mergedFlavors[key]) {
        mergedFlavors[key] = url;
      }
    });
  });
  
  console.log(`\n=== TOTAL UNIQUE FLAVOR KEYS: ${Object.keys(mergedFlavors).length} ===`);
  
  // Save to file
  const fs = require('fs');
  fs.writeFileSync('/tmp/merged-flavor-images.json', JSON.stringify(mergedFlavors, null, 2));
  console.log('\nSaved merged data to /tmp/merged-flavor-images.json');
  
  // Show sample
  const sampleKeys = Object.keys(mergedFlavors).slice(0, 20);
  console.log('\nSample keys:');
  sampleKeys.forEach(k => console.log(`  - "${k}"`));
}

main();

