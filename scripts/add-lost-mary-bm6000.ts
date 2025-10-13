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
    .replace(/\(\s*\)/g, '') // Remove empty parentheses
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
    .replace(/\bcomes in pack of 5pcs\b/gi, '')
    .replace(/\bbulk\s+wholesale\b/gi, '');
  
  // Remove embedded images
  cleaned = cleaned.replace(/<div[^>]*>[\s\S]*?<img[^>]*>[\s\S]*?<\/div>/gi, '');
  cleaned = cleaned.replace(/<img[^>]*>/gi, '');
  
  // Remove list items that mention pack quantities
  cleaned = cleaned.replace(/<li>\s*Comes in pack of 5pcs\s*<\/li>/gi, '');
  
  // Remove empty list items (like <li></li> or <li> </li> or <li><br></li>)
  cleaned = cleaned.replace(/<li>\s*(<br\s*\/?>)?\s*<\/li>/gi, '');
  
  // Remove empty parentheses
  cleaned = cleaned.replace(/\(\s*\)/g, '');
  
  cleaned = cleaned.replace(/\s{2,}/g, ' ');
  
  return cleaned;
}

// Actual supplier product data
const supplierData = {
  "id": 8661685436672,
  "title": "Lost Mary BM6000 Prefilled Vape Kit (Box of 5)",
  "body_html": "<p>Embark on a journey of pure vaping bliss with the Lost Mary BM6000 Prefilled Disposable Vape Kit. Crafted to deliver unparalleled satisfaction, each puff from these sleek devices promises an indulgent experience. With a perfect blend of convenience and performance, this box of 5 disposable vapes ensures you're always prepared for your vaping needs. Designed for both novices and seasoned enthusiasts, the Lost Mary BM6000 boasts a user-friendly design and premium-quality construction. Dive into a world of rich flavors and satisfying clouds with every draw, making every moment an opportunity to savor the essence of relaxation and enjoyment. Elevate your vaping experience with Lost Mary BM6000, where convenience meets excellence.</p>\n<h3>Product Features:</h3>\n<ul>\n<li>Long Lasting Puffs </li>\n<li>Up to 6000 Puffs Counts<br>\n</li>\n<li>Nicotine Strength: 20mg</li>\n<li>Rechargeable &amp; Refillable</li>\n<li>Detatchable Battery</li>\n<li>LED Battery Display Screen</li>\n<li>Inhale Activation &amp; Easy to use</li>\n<li>Choice of best 16 Flavours </li>\n<li>Comes in pack of 5pcs</li>\n</ul>\n<h2>Discover the Ultimate Vaping Experience with Lost Mary BM6000 Prefilled Disposable Vape Kits</h2>\n<p>Elevate your vaping experience with the Lost Mary BM6000 Prefilled Disposable Vape Kits. Whether you're a seasoned vaper or just starting, the Lost Mary BM6000 offers convenience, flavor, and satisfaction all in one sleek disposable vape. Perfect for on-the-go vaping, this prefilled kit is designed to provide an exceptional vaping experience with ease and simplicity.</p>\n<h3>Why Choose Lost Mary BM6000 Disposable Vape Kits?</h3>\n<ol>\n<li>\n<p>Long-Lasting Vaping Pleasure<br>Each Lost Mary BM6000 Prefilled Disposable Vape Kit comes with up to 6000 puffs, giving you extended satisfaction and convenience. You won't have to worry about constantly refilling or replacing your vape, as each kit is designed to last for an extended period, perfect for vapers who need a reliable and long-lasting device.</p>\n</li>\n<li>\n<p>Pre-Filled with Premium Flavors<br>The Lost Mary BM6000 is prefilled with premium e-liquid in a variety of delicious flavors that will tantalize your taste buds. With options like sweet fruits, refreshing menthols, and rich dessert flavors, there's a flavor profile for every preference. Enjoy a smooth, consistent vape with every puff, no matter which flavor you choose.</p>\n</li>\n<li>\n<p>Compact and Portable Design<br>Designed for convenience and portability, the Lost Mary BM6000 is lightweight and easy to carry. Its compact size ensures that it fits comfortably in your pocket or bag, making it the perfect choice for vaping while you're on the move.</p>\n</li>\n<li>\n<p>Ready to Use Right Out of the Box<br>No need to worry about complicated setups or maintenance. The Lost Mary BM6000 is a fully disposable vape kit, pre-filled and ready to use straight out of the box. Simply inhale and enjoy, without the hassle of refilling, charging, or any complicated setups.</p>\n</li>\n</ol>",
  "vendor": "Lost Mary",
  "product_type": "Disposable Vapes",
  "variants": [
    { "title": "Apple Pear", "price": "23.50" },
    { "title": "Blue Sour Raspberry", "price": "23.50" },
    { "title": "Blueberry", "price": "23.50" },
    { "title": "Banana Volcano", "price": "23.50" },
    { "title": "Blackberry Ice", "price": "23.50" },
    { "title": "Triple Berry", "price": "23.50" },
    { "title": "Double Apple", "price": "23.50" },
    { "title": "Cola", "price": "23.50" },
    { "title": "Strawberry Ice", "price": "23.50" },
    { "title": "Pink Lemonade", "price": "23.50" },
    { "title": "Pineapple Ice", "price": "23.50" },
    { "title": "Lemon Lime", "price": "23.50" },
    { "title": "Grape", "price": "23.50" },
    { "title": "Menthol", "price": "23.50" },
    { "title": "Watermelon Ice", "price": "23.50" },
    { "title": "Triple Mango", "price": "23.50" },
    { "title": "Acai Berry Blueberry", "price": "23.50" },
    { "title": "Acai Berry Lemonade", "price": "23.50" },
    { "title": "Juicy Peach", "price": "23.50" },
    { "title": "Mad Blue", "price": "23.50" },
    { "title": "Blue Razz Lemonade", "price": "23.50" },
    { "title": "Cherry Ice", "price": "23.50" },
    { "title": "Mango", "price": "23.50" },
    { "title": "Miami Mint", "price": "23.50" },
    { "title": "Strawberry Raspberry Cherry Ice", "price": "23.50" },
    { "title": "Raspberry Peach", "price": "23.50" },
    { "title": "Strawberry Watermelon", "price": "23.50" },
    { "title": "Cherry Cola", "price": "23.50" },
    { "title": "Summer Grape", "price": "23.50" },
    { "title": "Blue Razz Gami", "price": "23.50" },
    { "title": "Blueberry Cherry Cranberry", "price": "23.50" },
    { "title": "Cherry Peach Lemonade", "price": "23.50" },
    { "title": "Fizzy Cherry", "price": "23.50" },
    { "title": "Fruit Punch", "price": "23.50" },
    { "title": "Hawaii Sunrise", "price": "23.50" },
    { "title": "Kiwi Passionfruit Guava", "price": "23.50" },
    { "title": "Strawberry Kiwi", "price": "23.50" },
    { "title": "Strawberry Raspberry Blackberry", "price": "23.50" }
  ],
  "images": [
    "https://cdn.shopify.com/s/files/1/0480/0885/5717/files/lost-mary-bm6000-prefilled-disposable-vape-kit-box-of-5-mcr-vape-distro-721303.jpg?v=1721647578"
  ]
};

async function addLostMaryBM6000() {
  try {
    console.log('Adding Lost Mary BM6000 to database...\n');
    
    const cleanTitle = cleanText(supplierData.title);
    const cleanDescription = cleanHtmlDescription(supplierData.body_html);
    
    // Extract flavours from variants
    const flavours = supplierData.variants.map(v => v.title);
    
    // Calculate single unit price (divide box price by 5)
    const supplierBoxPrice = parseFloat(supplierData.variants[0].price);
    const singleUnitPrice = supplierBoxPrice / 5;
    
    const productId = 'lost-mary-bm6000';
    
    const productData = {
      id: productId,
      name: cleanTitle,
      price: singleUnitPrice,
      description: cleanDescription,
      images: supplierData.images,
      category: supplierData.product_type,
      inStock: true,
      featured: true,
      flavours: flavours,
      strengths: ['20mg']
    };
    
    console.log('Product data prepared:');
    console.log('- ID:', productData.id);
    console.log('- Name:', productData.name);
    console.log('- Price:', `£${singleUnitPrice.toFixed(2)}`);
    console.log('- Category:', productData.category);
    console.log('- Flavours:', flavours.length);
    console.log('- Strengths:', productData.strengths.join(', '));
    console.log('- Images:', productData.images.length);
    
    // Check if product already exists
    const existing = await Database.getProductById(productId);
    if (existing) {
      console.log('\n⚠️  Product already exists. Updating...');
      await Database.updateProduct(productId, productData);
      console.log('✅ Successfully updated Lost Mary BM6000!');
    } else {
      await Database.createProduct(productData);
      console.log('\n✅ Successfully added Lost Mary BM6000!');
    }
    
    console.log(`\nProduct ID: ${productId}`);
    console.log(`Single unit price: £${singleUnitPrice.toFixed(2)}`);
    console.log(`Available flavours: ${flavours.length}`);
    
  } catch (error) {
    console.error('❌ Failed to add product:', error);
    process.exit(1);
  }
}

addLostMaryBM6000();

