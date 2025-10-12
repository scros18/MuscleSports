const fs = require('fs');

// Read the HTML file
const html = fs.readFileSync('/tmp/ivg-pro-12.html', 'utf8');

// Find the variants JSON in the HTML
const match = html.match(/"variants":\[{[\s\S]*?"id":\d+[\s\S]*?}\]/);

if (!match) {
  console.error('Could not find variants data');
  process.exit(1);
}

// Clean up the JSON string - it's HTML-encoded
let jsonStr = match[0];
jsonStr = '{ ' + jsonStr + ' }';
jsonStr = jsonStr.replace(/&quot;/g, '"').replace(/\\"/g, '"').replace(/\\\//g, '/');

// Parse the JSON
let data;
try {
  data = JSON.parse(jsonStr);
} catch (e) {
  console.error('Failed to parse JSON:', e.message);
  process.exit(1);
}

// Extract flavor-to-image mapping (only 20 MG variants)
const flavorImages = {};

data.variants.forEach(variant => {
  if (variant.option1 === '20 MG' && variant.option2 && variant.featured_image && variant.featured_image.src) {
    const flavor = variant.option2;
    const imageUrl = 'https:' + variant.featured_image.src;
    
    // Normalize the flavor name (remove " *NEW*" suffix for mapping)
    const normalizedFlavor = flavor.replace(/ \*NEW\*$/i, '').trim().toLowerCase();
    
    flavorImages[normalizedFlavor] = imageUrl;
    console.log(`${flavor} => ${imageUrl}`);
  }
});

// Output the JSON mapping
console.log('\n\n=== FLAVOR IMAGES MAPPING (JSON) ===');
console.log(JSON.stringify(flavorImages, null, 2));

// Save to file
fs.writeFileSync('/tmp/flavor-images-mapping.json', JSON.stringify(flavorImages, null, 2));
console.log('\n\nSaved to /tmp/flavor-images-mapping.json');

