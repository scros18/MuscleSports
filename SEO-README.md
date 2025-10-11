# SEO Implementation Guide

This project includes a comprehensive, automatic SEO system designed to work with any branding and deliver best-in-class search engine optimization.

## Features Implemented

### 1. **Dynamic Meta Tags**
- Automatic title generation with site name
- Description optimization per page
- Keywords based on content
- Canonical URLs to prevent duplicate content
- Author and publisher metadata

### 2. **Open Graph Tags**
- Complete OG tag support for social sharing
- Dynamic images (1200x630 optimized)
- Page-specific content
- Works with Facebook, LinkedIn, etc.

### 3. **Twitter Cards**
- Summary large image cards
- Optimized for Twitter sharing
- Dynamic content per page

### 4. **Structured Data (JSON-LD)**
Implemented schemas:
- **Organization Schema**: Company information
- **Website Schema**: Site-wide search functionality
- **Product Schema**: Individual product details with pricing, availability, SKU
- **Breadcrumb Schema**: Navigation structure for search engines

### 5. **Dynamic Sitemap**
- Auto-generates from products database
- Includes priority and change frequency
- Updates automatically as products change
- Located at `/sitemap.xml`

### 6. **Robots.txt**
- Properly configured crawling rules
- Protects admin and API routes
- Links to sitemap
- Located at `/robots.txt`

### 7. **Mobile Optimization**
- Responsive design throughout
- Viewport configuration
- Touch-friendly interface
- Fast mobile performance

## Configuration

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
# Site Configuration (Customize for your branding)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com

# SEO Configuration
NEXT_PUBLIC_SITE_NAME="Your Brand Name"
NEXT_PUBLIC_SITE_DESCRIPTION="Your brand description for search engines"
NEXT_PUBLIC_TWITTER_HANDLE=@yourhandle
```

### Programmatic Configuration

You can also configure SEO programmatically in your code:

```typescript
import { configureSEO } from '@/lib/seo';

configureSEO({
  siteName: 'My Custom Brand',
  siteUrl: 'https://mycustombrand.com',
  defaultTitle: 'My Custom Brand - Best Products Online',
  defaultDescription: 'Shop the best products with free shipping...',
  twitterHandle: '@mycustombrand',
});
```

## Usage

### Page-Level SEO

The SEO system automatically generates metadata for all pages:

#### Homepage
- Organization and Website structured data
- Default branding and description
- Social sharing optimization

#### Products Listing Page (`/products`)
- Breadcrumb structured data
- Category filtering support
- Search-optimized titles

#### Product Detail Page (`/products/[id]`)
- Full Product schema with pricing
- Image optimization for sharing
- Breadcrumb navigation
- Reviews support (when implemented)

#### Categories Page (`/categories`)
- Category listing with counts
- Breadcrumb structured data
- Links to filtered product pages

### Adding SEO to New Pages

```typescript
import { generateSEO } from '@/lib/seo';

export const metadata = generateSEO({
  title: 'Your Page Title',
  description: 'Your page description',
  path: '/your-path',
  keywords: ['keyword1', 'keyword2'],
});
```

### Adding Structured Data

```typescript
import { generateProductSchema, getJsonLdScript } from '@/lib/seo';

const productSchema = generateProductSchema({
  id: product.id,
  name: product.name,
  description: product.description,
  image: product.image,
  price: product.price,
  inStock: product.inStock,
});

// In your component
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={getJsonLdScript(productSchema)}
/>
```

## Best Practices

### 1. **Images**
- Add an `og-image.jpg` (1200x630px) to the public folder
- Use descriptive alt text for all images
- Optimize image sizes for fast loading

### 2. **Content**
- Write unique, descriptive titles (50-60 characters)
- Create compelling descriptions (150-160 characters)
- Use relevant keywords naturally

### 3. **URLs**
- Keep URLs clean and descriptive
- Use hyphens, not underscores
- Avoid special characters

### 4. **Performance**
- Minimize JavaScript bundle size
- Lazy load images
- Use Next.js Image component
- Enable caching

## Testing

### Test Your SEO

1. **Rich Results Test**
   - Visit: https://search.google.com/test/rich-results
   - Enter your product URLs
   - Verify structured data

2. **Open Graph Debugger**
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator

3. **Mobile-Friendly Test**
   - Visit: https://search.google.com/test/mobile-friendly
   - Enter your site URL

4. **PageSpeed Insights**
   - Visit: https://pagespeed.web.dev/
   - Test mobile and desktop performance

## Monitoring

### Google Search Console
1. Verify your site ownership
2. Submit your sitemap (`/sitemap.xml`)
3. Monitor indexing status
4. Check for crawl errors

### Analytics Integration
Add Google Analytics or similar to track:
- Page views
- User behavior
- Conversion rates
- Search queries leading to your site

## Customization Per Brand

The SEO system is designed to adapt to any brand:

1. **Update `.env.local`** with your brand details
2. **Replace images** in `/public` folder:
   - `og-image.jpg` (1200x630px)
   - `logo.png` (square, transparent)
3. **Customize colors** in `tailwind.config.js`
4. **Update content** in page components

The system automatically applies your brand to:
- Meta tags
- Structured data
- Social sharing
- Search results

## Advanced Features

### Multi-Language Support
To add multi-language SEO:
1. Use Next.js i18n routing
2. Add `hreflang` tags
3. Create language-specific sitemaps

### Rich Snippets
Current implementations:
- Product prices and availability
- Organization contact info
- Breadcrumb navigation

Coming soon:
- Review ratings (requires review system)
- FAQ schema
- How-to schema

## Performance Optimization

SEO features are optimized for performance:
- Metadata generated at build time when possible
- Structured data rendered server-side
- Minimal client-side JavaScript
- Efficient data fetching

## Troubleshooting

### Common Issues

**Sitemap not updating?**
- Check API connection
- Verify `NEXT_PUBLIC_API_URL`
- Clear Next.js cache: `rm -rf .next`

**Structured data errors?**
- Use Google's Rich Results Test
- Check for missing required fields
- Verify JSON-LD syntax

**Social sharing not working?**
- Verify OG image exists and is accessible
- Check image dimensions (1200x630)
- Use social platform debuggers

## Resources

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards)

## Support

For issues or questions about the SEO implementation:
1. Check this documentation
2. Review the `/lib/seo.ts` file
3. Test with Google's tools
4. Verify environment variables

---

**Note**: This SEO system is production-ready and will automatically adapt to any branding configuration. Simply update your environment variables and deploy!
