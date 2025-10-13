import dotenv from 'dotenv';
import { Database } from '../lib/database';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Supplier product data
const supplierData = {
  "product": {
    "id": 14989582598524,
    "title": "Hayati Pro Max+ 6000 Puffs Vape Kit Box of 5",
    "body_html": "<h2><strong>Hayati Pro Max+ 6000 Vape Kit</strong></h2>\n<p><strong>Hayati Pro Max+ 6000 Vape Kit</strong> is a premium selection of <a title=\"Pre filled vape\" href=\"https://mcrvapedistro.co.uk/collections/pre-filled-pod-kits\"><strong>pre filled vape</strong></a> designed to provide a long-lasting and satisfying experience. Each device offers <strong>6000 puffs</strong>, ensuring that you enjoy extended use without the need for constant replacements. With a variety of <strong>flavors</strong> to choose from, including fruity, menthol, and dessert-inspired options, this kit caters to a wide range of taste preferences. The <strong>sleek design</strong> of the vapes combines both style and function, providing an excellent option for those who appreciate convenience with a touch of elegance.</p>\n<div style=\"text-align: start;\"><img alt=\"bulk wholesale Hayati Pro Max+ 6000 Puffs Vape Kit Box of 5 - Blue Razz Blackcurrant *New*\" src=\"https://cdn.shopify.com/s/files/1/0480/0885/5717/files/bulk-wholesale-hayati-pro-max-6000-puffs-vape-kit-box-of-5-blue-razz-blackcurrant-new-5836607_1024x1024.jpg?v=1752178595\" style=\"margin-bottom: 16px; float: none;\"></div>\n<p>Each vape in the box is equipped with <strong>advanced airflow technology</strong> that delivers consistent and smooth vapor with every puff. The kit offers various <strong><a title=\"nicotine\" href=\"https://mcrvapedistro.co.uk/collections/nic-salts\">nicotine</a> strengths</strong>, making it suitable for vapers of all experience levels. Its <strong>lightweight and portable</strong> design makes it easy to carry around, whether you're on the go or relaxing at home. The <strong>ready-to-use</strong> nature of this kit means no setup is required, offering you a simple and enjoyable vaping experience from the moment you open the box.</p>\n<h3>Product Features:</h3>\n<ol>\n<li><strong>6000 puffs per device</strong> – Enjoy long-lasting use without needing frequent replacements.</li>\n<li><strong>Straightforward, no-setup design</strong> – Ready to use right out of the box for immediate enjoyment.</li>\n<li><strong>Portable and compact</strong> – Easily fits into pockets or bags for convenience on the move.</li>\n<li><strong>Smooth vapor delivery</strong> – Advanced airflow system ensures a consistent, smooth vaping experience.</li>\n<li><strong>Variety of flavors</strong> – Choose from multiple options such as fruity, menthol, and dessert-inspired flavors.</li>\n<li><strong>Customizable nicotine levels</strong> – Available in different nicotine strengths to suit all vapers.</li>\n<li><strong>Modern and stylish design</strong> – A sleek, comfortable device that's both attractive and easy to handle.</li>\n<li><strong>Disposable</strong> – No refilling needed, simplifying maintenance and use.</li>\n<li><strong>Perfect for traveling</strong> – Compact and easy to carry, ideal for vapers on the go.</li>\n</ol>",
    "vendor": "Hayati",
    "product_type": "Disposable Vapes",
    "variants": [
      { "title": "Banana Ice", "price": "20.00" },
      { "title": "Blueberry Kiwi Ice", "price": "20.00" },
      { "title": "Cherry Strawberry Raspberry", "price": "20.00" },
      { "title": "Fizzy Cherry", "price": "20.00" },
      { "title": "Kiwi Passion Fruit Guava", "price": "20.00" },
      { "title": "Lemon & Lime", "price": "20.00" },
      { "title": "Mango Ice", "price": "20.00" },
      { "title": "Mr Blue", "price": "20.00" },
      { "title": "Strawberry Ice", "price": "20.00" },
      { "title": "Strawberry Raspberry Ice", "price": "20.00" },
      { "title": "Triple Melon", "price": "20.00" },
      { "title": "Watermelon Ice", "price": "20.00" },
      { "title": "Lemon Pineapple", "price": "20.00" },
      { "title": "Strawberry Raspberry Cherry *New*", "price": "20.00" },
      { "title": "Blue Razz Pineapple *New*", "price": "20.00" },
      { "title": "Blueberry Pomegranate *New*", "price": "20.00" },
      { "title": "Pink Lemonade *New*", "price": "20.00" },
      { "title": "Blue Razz Blackcurrant *New*", "price": "20.00" }
    ],
    "images": [
      "https://cdn.shopify.com/s/files/1/0480/0885/5717/files/hayati-crystal-pro-max-6000-puffs-vape-kit-box-of-5-mcr-vape-distro-152562.png?v=1739306159",
      "https://cdn.shopify.com/s/files/1/0480/0885/5717/files/hayati-crystal-pro-max-6000-puffs-vape-kit-box-of-5-mcr-vape-distro-532478.png?v=1739204939",
      "https://cdn.shopify.com/s/files/1/0480/0885/5717/files/hayati-crystal-pro-max-6000-puffs-vape-kit-box-of-5-mcr-vape-distro-817043.png?v=1739204939"
    ]
  }
};

// Clean text by removing "pack of 5" and similar references
function cleanText(text: string): string {
  if (!text) return text;
  
  return text
    // Remove "pack of 5", "box of 5", "pack of 10", etc. (case insensitive)
    .replace(/\b(pack|box)\s+of\s+\d+\b/gi, '')
    // Remove content in parentheses that mentions pack/box
    .replace(/\(.*?(pack|box).*?\)/gi, '')
    // Remove "bulk wholesale"
    .replace(/\bbulk\s+wholesale\b/gi, '')
    // Remove empty parentheses
    .replace(/\(\s*\)/g, '')
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    // Clean up " - " at the end or beginning
    .replace(/^\s*-\s*/, '')
    .replace(/\s*-\s*$/, '')
    .trim();
}

// Clean HTML content
function cleanHtmlDescription(html: string): string {
  if (!html) return html;
  
  // Remove references to packs/boxes in the text
  let cleaned = html
    .replace(/\b(pack|box)\s+of\s+\d+\b/gi, '')
    .replace(/\b10-pack box\b/gi, '')
    .replace(/\bbulk\s+wholesale\b/gi, '');
  
  // Remove embedded images (especially those with bulk-wholesale in the URL)
  cleaned = cleaned.replace(/<div[^>]*>[\s\S]*?<img[^>]*bulk-wholesale[^>]*>[\s\S]*?<\/div>/gi, '');
  cleaned = cleaned.replace(/<img[^>]*bulk-wholesale[^>]*>/gi, '');
  
  // Remove any remaining empty divs
  cleaned = cleaned.replace(/<div[^>]*>\s*<\/div>/gi, '');
  
  // Update list items that mention pack quantities
  cleaned = cleaned.replace(
    /<li>\s*<strong>10-pack box<\/strong>[^<]*<\/li>/gi,
    ''
  );
  
  // Remove empty list items
  cleaned = cleaned.replace(/<li>\s*(<br\s*\/?>)?\s*<\/li>/gi, '');
  
  // Remove empty parentheses
  cleaned = cleaned.replace(/\(\s*\)/g, '');
  
  // Clean up extra whitespace
  cleaned = cleaned.replace(/\s{2,}/g, ' ');
  
  return cleaned;
}

async function addHayatiProduct() {
  try {
    console.log('Adding Hayati Pro Max+ 6000 Puffs to database...');
    
    const product = supplierData.product;
    
    // Extract flavours from variants
    const flavours = product.variants.map(v => v.title.replace(/\s*\*New\*\s*/gi, '').trim());
    
    // Clean the title and description
    const cleanTitle = cleanText(product.title);
    const cleanDescription = cleanHtmlDescription(product.body_html);
    
    // Calculate a single unit price (divide supplier box price by 5)
    const supplierBoxPrice = parseFloat(product.variants[0].price);
    const singleUnitPrice = supplierBoxPrice / 5; // Since supplier sells box of 5
    
    // Generate a clean product ID
    const productId = 'hayati-pro-max-6000';
    
    // Prepare product data
    const productData = {
      id: productId,
      name: cleanTitle,
      price: singleUnitPrice,
      description: cleanDescription,
      images: product.images,
      category: 'Disposable Vapes',
      inStock: true,
      featured: true,
      flavours: flavours
    };
    
    console.log('Product data prepared:');
    console.log('- ID:', productData.id);
    console.log('- Name:', productData.name);
    console.log('- Price:', productData.price);
    console.log('- Category:', productData.category);
    console.log('- Flavours:', flavours.length);
    console.log('- Images:', productData.images.length);
    
    // Check if product already exists
    const existing = await Database.getProductById(productId);
    if (existing) {
      console.log('⚠️  Product already exists in database. Updating...');
      
      // Update the existing product
      await Database.updateProduct(productId, productData);
      
      console.log('✅ Successfully updated Hayati Pro Max+ 6000 Puffs in database!');
    } else {
      // Create the product
      await Database.createProduct(productData);
      
      console.log('✅ Successfully added Hayati Pro Max+ 6000 Puffs to database!');
    }
    console.log(`Product ID: ${productId}`);
    console.log(`Single unit price: £${singleUnitPrice.toFixed(2)}`);
    console.log(`Available flavours: ${flavours.length}`);
    
  } catch (error) {
    console.error('❌ Failed to add product:', error);
    process.exit(1);
  }
}

addHayatiProduct();

