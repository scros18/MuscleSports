import dotenv from 'dotenv';
import { Database } from '../lib/database';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Clean text by removing "pack of X" and similar references
function cleanText(text: string): string {
  if (!text) return text;
  
  return text
    .replace(/\b(pack|box)\s+of\s+\d+\b/gi, '')
    .replace(/\(.*?(pack|box).*?\)/gi, '')
    .replace(/\bbulk\s+wholesale\b/gi, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^\s*-\s*/, '')
    .replace(/\s*-\s*$/, '')
    .trim();
}

// Clean HTML content
function cleanHtmlDescription(html: string): string {
  if (!html) return html;
  
  let cleaned = html
    .replace(/\b(pack|box)\s+of\s+\d+\b/gi, '')
    .replace(/\b10-pack box\b/gi, '')
    .replace(/\bbulk\s+wholesale\b/gi, '');
  
  // Remove embedded images with bulk-wholesale references
  cleaned = cleaned.replace(/<div[^>]*>[\s\S]*?<img[^>]*bulk-wholesale[^>]*>[\s\S]*?<\/div>/gi, '');
  cleaned = cleaned.replace(/<img[^>]*bulk-wholesale[^>]*>/gi, '');
  cleaned = cleaned.replace(/<div[^>]*>\s*<\/div>/gi, '');
  
  // Remove list items that mention pack quantities
  cleaned = cleaned.replace(/<li>\s*<strong>10-pack box<\/strong>[^<]*<\/li>/gi, '');
  
  // Remove empty list items
  cleaned = cleaned.replace(/<li>\s*(<br\s*\/?>)?\s*<\/li>/gi, '');
  
  // Remove empty parentheses
  cleaned = cleaned.replace(/\(\s*\)/g, '');
  
  cleaned = cleaned.replace(/\s{2,}/g, ' ');
  
  return cleaned;
}

// Product configurations
// Note: Replace these with actual data from your supplier JSON files
const products = [
  {
    id: 'lost-mary-bm6000',
    supplierData: {
      title: 'Lost Mary BM6000 Prefilled Disposable Vape Kit Box of 5',
      description: '<h2><strong>Lost Mary BM6000 Prefilled Disposable Vape Kit</strong></h2><p>The Lost Mary BM6000 is a rechargeable and refillable vape kit designed for extended use, offering up to 6000 puffs. It features a 650mAh rechargeable battery, a 2ml pre-filled pod with an advanced built-in QUAQ mesh coil, and a 10ml auto-reload reservoir tank. The device includes a power display screen, visible e-liquid level, and a detachable battery for recycling.</p><h3>Product Features:</h3><ul><li><strong>6000 puffs per device</strong> – Enjoy long-lasting use without needing frequent replacements.</li><li><strong>Rechargeable 650mAh battery</strong> – Type-C USB charging for convenience.</li><li><strong>Portable and compact</strong> – Easily fits into pockets or bags.</li><li><strong>Advanced mesh coil</strong> – Enhanced flavor delivery.</li><li><strong>Visible e-liquid level</strong> – Know when to refill.</li><li><strong>Power display screen</strong> – Monitor battery life.</li></ul>',
      vendor: 'Lost Mary',
      product_type: 'Disposable Vapes',
      price: '37.50', // Box of 5 price
      boxQuantity: 5,
      flavours: ['Apple Pear', 'Banana Volcano', 'Blackberry Ice', 'Blueberry Sour Raspberry', 'Blueberry', 'Cola', 'Double Apple', 'Grape', 'Lemon Lime', 'Menthol', 'Pineapple Ice', 'Pink Lemonade', 'Strawberry Ice', 'Triple Berry', 'Triple Mango', 'Watermelon Ice'],
      strengths: ['20mg'],
      images: []
    }
  },
  {
    id: 'lost-mary-nera-30k',
    supplierData: {
      title: 'Lost Mary Nera 30K Vape Kit Box of 5',
      description: '<h2><strong>Lost Mary Nera 30K Vape Kit</strong></h2><p>The Lost Mary Nera 30K is an advanced rechargeable vape kit offering up to 30,000 puffs. Features adjustable wattage, large e-liquid capacity, and multiple flavor options.</p><h3>Product Features:</h3><ul><li><strong>30000 puffs per device</strong> – Extended use for heavy vapers.</li><li><strong>Adjustable wattage</strong> – Customize your vaping experience.</li><li><strong>Large capacity</strong> – Less frequent refills needed.</li><li><strong>Advanced technology</strong> – Premium vaping experience.</li></ul>',
      vendor: 'Lost Mary',
      product_type: 'Disposable Vapes',
      price: '50.00',
      boxQuantity: 5,
      flavours: ['Blue Razz Ice', 'Blueberry Sour Raspberry', 'Cherry Cola', 'Grape Ice', 'Lemon & Lime', 'Mango', 'Pineapple Ice', 'Strawberry Ice', 'Watermelon Ice'],
      strengths: ['20mg'],
      images: []
    }
  },
  {
    id: 'ivg-smart-max-10k',
    supplierData: {
      title: 'IVG Smart Max 10K Prefilled Pod Vape Kit Box of 5',
      description: '<h2><strong>IVG Smart Max 10K Prefilled Pod Vape Kit</strong></h2><p>The IVG Smart Max 10K is a smart prefilled pod vape kit delivering up to 10,000 puffs. Features smart technology, rechargeable battery, and a variety of premium flavors.</p><h3>Product Features:</h3><ul><li><strong>10000 puffs per device</strong> – Long-lasting performance.</li><li><strong>Smart technology</strong> – Optimized vaping experience.</li><li><strong>Prefilled pods</strong> – Easy to use.</li><li><strong>Rechargeable</strong> – Eco-friendly design.</li></ul>',
      vendor: 'IVG',
      product_type: 'Disposable Vapes',
      price: '45.00',
      boxQuantity: 5,
      flavours: ['Blue Razz Lemonade', 'Cherry Cola', 'Grape Ice', 'Mango', 'Menthol', 'Strawberry Ice', 'Watermelon Ice'],
      strengths: ['20mg'],
      images: []
    }
  },
  {
    id: 'elf-bar-elfa-pro-pods',
    supplierData: {
      title: 'Elf Bar Elfa Pro Pods for Replacement 2Pack',
      description: '<h2><strong>Elf Bar Elfa Pro Replacement Pods</strong></h2><p>Elf Bar Elfa Pro Replacement Pods are designed for use with the Elfa Pro device. Each pod is prefilled with 2ml of premium e-liquid.</p><h3>Product Features:</h3><ul><li><strong>2ml prefilled pods</strong> – Convenient and ready to use.</li><li><strong>Compatible with Elfa Pro</strong> – Perfect fit.</li><li><strong>Premium flavors</strong> – High-quality taste.</li><li><strong>Easy to replace</strong> – Simple pod system.</li></ul>',
      vendor: 'Elf Bar',
      product_type: 'Vape Pods',
      price: '10.00',
      boxQuantity: 2,
      flavours: ['Blue Razz Lemonade', 'Cherry', 'Grape', 'Mango', 'Menthol', 'Strawberry Ice', 'Watermelon'],
      strengths: ['20mg'],
      images: []
    }
  },
  {
    id: 'firerose-5000-nic-salt',
    supplierData: {
      title: 'Firerose 5000 10ml Nic Salts E-Liquids Box of 10',
      description: '<h2><strong>Firerose 5000 Nic Salt E-Liquids</strong></h2><p>Firerose 5000 offers premium 10ml Nicotine Salt e-liquids designed for a smooth vaping experience. Available in various flavors and nicotine strengths.</p><h3>Product Features:</h3><ul><li><strong>10ml bottle</strong> – Perfect size for vaping.</li><li><strong>Nicotine salt formula</strong> – Smooth throat hit.</li><li><strong>Multiple flavors</strong> – Wide variety to choose from.</li><li><strong>Multiple strengths</strong> – Choose your nicotine level.</li></ul>',
      vendor: 'Firerose',
      product_type: 'E-Liquids',
      price: '30.00',
      boxQuantity: 10,
      flavours: ['Blue Razz Lemonade', 'Cherry Cola', 'Grape', 'Mango', 'Menthol', 'Strawberry Ice', 'Watermelon Ice'],
      strengths: ['10mg', '20mg'],
      images: []
    }
  },
  {
    id: 'hayati-pro-max-nic-salt',
    supplierData: {
      title: 'Hayati Pro Max Nic Salt 10ml E-Liquids Box of 10',
      description: '<h2><strong>Hayati Pro Max Nic Salt E-Liquids</strong></h2><p>Hayati Pro Max provides premium 10ml Nicotine Salt e-liquids with a variety of flavors for an enhanced vaping experience. Available in multiple nicotine strengths.</p><h3>Product Features:</h3><ul><li><strong>10ml bottle</strong> – Convenient size.</li><li><strong>Premium nic salt</strong> – Smooth and satisfying.</li><li><strong>Wide flavor range</strong> – Something for everyone.</li><li><strong>Multiple strengths</strong> – Customizable nicotine level.</li></ul>',
      vendor: 'Hayati',
      product_type: 'E-Liquids',
      price: '30.00',
      boxQuantity: 10,
      flavours: ['Banana Ice', 'Blue Razz Ice', 'Cherry Cola', 'Grape Ice', 'Lemon & Lime', 'Mango Ice', 'Strawberry Ice', 'Watermelon Ice'],
      strengths: ['10mg', '20mg'],
      images: []
    }
  },
  {
    id: 'elf-bar-elfliq-nic-salt',
    supplierData: {
      title: 'Elf Bar Elfliq Nic Salt Box of 10',
      description: '<h2><strong>Elf Bar Elfliq Nic Salt E-Liquids</strong></h2><p>Elf Bar Elfliq provides a range of 10ml Nicotine Salt e-liquids with multiple flavor and strength options. Crafted for a satisfying vape experience.</p><h3>Product Features:</h3><ul><li><strong>10ml bottle</strong> – Perfect for daily use.</li><li><strong>Nicotine salt</strong> – Fast absorption and smooth hit.</li><li><strong>Authentic Elf Bar flavors</strong> – Trusted brand quality.</li><li><strong>Multiple strengths</strong> – Choose your preferred level.</li></ul>',
      vendor: 'Elf Bar',
      product_type: 'E-Liquids',
      price: '30.00',
      boxQuantity: 10,
      flavours: ['Blue Razz Lemonade', 'Cherry', 'Grape', 'Mango', 'Menthol', 'Strawberry Ice', 'Watermelon'],
      strengths: ['10mg', '20mg'],
      images: []
    }
  }
];

async function addBulkProducts() {
  try {
    console.log('Adding bulk products to database...\n');
    
    for (const product of products) {
      console.log(`Processing: ${product.supplierData.title}`);
      
      const cleanTitle = cleanText(product.supplierData.title);
      const cleanDescription = cleanHtmlDescription(product.supplierData.description);
      
      // Calculate single unit price
      const supplierPrice = parseFloat(product.supplierData.price);
      const singleUnitPrice = supplierPrice / product.supplierData.boxQuantity;
      
      const productData = {
        id: product.id,
        name: cleanTitle,
        price: singleUnitPrice,
        description: cleanDescription,
        images: product.supplierData.images,
        category: product.supplierData.product_type,
        inStock: true,
        featured: true,
        flavours: product.supplierData.flavours,
        strengths: product.supplierData.strengths
      };
      
      console.log('  - ID:', productData.id);
      console.log('  - Name:', productData.name);
      console.log('  - Price:', `£${singleUnitPrice.toFixed(2)}`);
      console.log('  - Flavours:', productData.flavours.length);
      console.log('  - Strengths:', productData.strengths.join(', '));
      
      // Check if product already exists
      const existing = await Database.getProductById(product.id);
      if (existing) {
        console.log('  ⚠️  Product exists. Updating...');
        await Database.updateProduct(product.id, productData);
        console.log('  ✅ Updated!\n');
      } else {
        await Database.createProduct(productData as any);
        console.log('  ✅ Created!\n');
      }
    }
    
    console.log('✅ All products processed successfully!');
    
  } catch (error) {
    console.error('❌ Failed to add products:', error);
    process.exit(1);
  }
}

addBulkProducts();

