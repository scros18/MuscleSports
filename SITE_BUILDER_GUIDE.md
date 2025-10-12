# Complete Site Builder & Multi-Business System

## 🎨 Overview

A fully functional multi-business e-commerce platform with a powerful site builder that allows each business owner to customize their own site independently. Perfect for hair salons, e-commerce stores, gyms, and more.

---

## ✨ Key Features

### 1. **Site Builder** (Admin → Site Builder)
Complete customization interface for business owners:

#### General Information Tab
- **Business Name**: Appears in browser tab, header, footer
- **Business Type**: Salon, E-commerce, Gym, Other (changes available features)
- **Description**: SEO and social media preview text
- **Contact Info**: Phone & Email

#### Branding Tab  
- **Logo Upload**: Visual identity across site
- **Theme Selection**: 5 professional themes
  - Lumify (Blue)
  - Ordify (Gray/Blue)
  - MuscleSports (Green)
  - VeraRP (Purple)
  - **Bliss Hair (Rose/Pink)** - NEW!
- **Custom Colors**: Primary & Secondary brand colors

#### Location & Hours Tab
- **Street Address**: Physical location
- **Google Maps Embed**: Auto-embedded interactive map
- **Opening Hours**: Day-by-day schedule with closed days

#### Social Media Tab
- Facebook, Instagram, Twitter, TikTok links
- Auto-displays icons on site

---

## 🏢 Bliss Hair Studio Theme Features

### Database-Driven Settings
All settings stored in `business_settings` table:
```sql
- business_name
- business_type
- logo_url
- address
- phone
- email
- opening_hours (JSON)
- google_maps_embed
- primary_color
- secondary_color
- description
- social_media (JSON)
```

### Salon-Specific Homepage
When Bliss Hair theme is active, shows:
1. **Hero Section**
   - Business name & description
   - Contact info card with:
     - Location
     - Phone (clickable to call)
     - Email (clickable to email)
     - Opening hours
     - Social media icons

2. **Services & Prices Section**
   - Grouped by category (e.g., Haircuts, Coloring, Treatments)
   - Each service shows:
     - Name
     - Description
     - Price (formatted in GBP with green highlight)
     - Duration badge
   - Professional card layout

3. **Google Maps Section**
   - Embedded map from settings
   - Shows exact location
   - Clickable for directions

4. **Products Section**
   - Shop hair care products
   - Links to full product catalog

5. **Call-to-Action**
   - Book appointment buttons
   - Contact options

### Salon Management Page (Admin → Salon Management)
Available when theme is `blisshair`:

#### Services Management
- Add/Edit/Delete services
- Fields:
  - Category (e.g., "Haircuts", "Coloring")
  - Service Name
  - Description
  - Price (£)
  - Duration (minutes)
  - Active/Inactive toggle
  - Display Order

#### Business Settings (Quick Access)
- All site builder settings
- Google Maps embed
- Opening hours grid editor
- Social media links

---

## 🗄️ Database Schema

### New Tables

#### `business_settings`
```sql
CREATE TABLE business_settings (
  id VARCHAR(255) PRIMARY KEY,
  theme VARCHAR(50) DEFAULT 'ordify',
  business_name VARCHAR(255),
  business_type ENUM('salon', 'ecommerce', 'gym', 'other'),
  logo_url TEXT,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  opening_hours JSON,
  google_maps_embed TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  primary_color VARCHAR(20),
  secondary_color VARCHAR(20),
  description TEXT,
  social_media JSON,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### `salon_services`
```sql
CREATE TABLE salon_services (
  id VARCHAR(255) PRIMARY KEY,
  business_id VARCHAR(255),
  category VARCHAR(100),
  name VARCHAR(255),
  description TEXT,
  price DECIMAL(10,2),
  duration_minutes INT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES business_settings(id)
)
```

---

## 🔌 API Endpoints

### Business Settings
```
GET    /api/business-settings?id=default
POST   /api/business-settings
DELETE /api/business-settings?id=default
```

### Salon Services
```
GET    /api/salon-services?businessId=default&category=Haircuts&includeInactive=true
POST   /api/salon-services
GET    /api/salon-services/[id]
PUT    /api/salon-services/[id]
DELETE /api/salon-services/[id]
```

---

## 📱 Dynamic Features

### Dynamic Page Title
- Changes based on business name
- Format: `{Business Name} - {Description}`
- Updates automatically when settings change

### Dynamic Theme Colors
- Primary color affects:
  - Buttons
  - Links
  - Accents
  - Category headers
- Secondary color for backgrounds and highlights

### Dynamic Content
- Header shows business name (or logo if uploaded)
- Footer shows business info
- Homepage changes layout based on business type
- Services page (salon-only)
- Products page (all businesses)

---

## 🎯 Usage Guide

### For Bliss Hair Studio (Maxine)

#### Initial Setup
1. Login to admin panel
2. Go to **Site Builder**
3. Fill in General Info:
   ```
   Business Name: Bliss Hair Studio
   Business Type: Hair Salon / Beauty
   Description: Transform your look with our expert stylists...
   Phone: [Your number]
   Email: [Your email]
   ```

4. Upload Logo:
   - Upload to Facebook or image hosting
   - Paste URL in **Branding → Logo URL**

5. Set Colors:
   - Primary: Rose/Pink (#e11d48)
   - Secondary: Light Pink (#fda4af)
   - Or use color picker for custom shades

6. Add Location:
   - Enter street address
   - Go to Google Maps
   - Search your salon
   - Click Share → Embed a map
   - Copy HTML code
   - Paste in **Location & Hours → Google Maps Embed**

7. Set Opening Hours:
   - Check days you're open
   - Set times for each day
   - Mark closed days

8. Add Social Media:
   - Facebook: https://facebook.com/blisshairstudio
   - Instagram: https://instagram.com/blisshairstudio

9. Click **Save All Changes**

#### Adding Services
1. Go to **Admin → Salon Management**
2. Click **Add Service**
3. Example service:
   ```
   Category: Haircuts
   Name: Women's Cut & Blow Dry
   Description: Professional cut with styling
   Price: 45.00
   Duration: 60 minutes
   ```
4. Click **Save Service**
5. Repeat for all services

#### Service Categories Suggestions
- **Haircuts**: Women's, Men's, Children's
- **Coloring**: Full Color, Highlights, Balayage, Root Touch-up
- **Treatments**: Deep Conditioning, Keratin, Olaplex
- **Styling**: Blow Dry, Updos, Special Occasions
- **Extensions**: Tape-in, Clip-in, Bonds

---

## 🔄 Multi-Business Support

### How It Works
Each business can have completely different:
- Name & branding
- Theme & colors
- Contact information
- Location & hours
- Services/products
- Homepage layout

### Per-Business Settings
Settings are stored with `id` field:
```typescript
{
  id: 'blisshair',      // Unique business ID
  businessName: 'Bliss Hair Studio',
  theme: 'blisshair',
  // ... other settings
}
```

### Future: Multi-Tenant
Can be extended to support multiple businesses:
1. Add `owner_id` column to `business_settings`
2. Filter settings by logged-in user
3. Each admin sees only their business
4. Subdomain or path-based routing

---

## 🎨 Theme System

### Available Themes

| Theme | Colors | Best For |
|-------|--------|----------|
| **Lumify** | Bright Blue | General, Tech |
| **Ordify** | Gray/Blue | Classic E-commerce |
| **MuscleSports** | Green | Fitness, Nutrition |
| **VeraRP** | Purple | Gaming, Entertainment |
| **Bliss Hair** | Rose/Pink | Salons, Beauty |

### Theme Customization
Each theme has:
- CSS variables in `globals.css`
- Light & dark mode variants
- Customizable via Site Builder

---

## 📋 Admin Pages Summary

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/admin` | Overview & stats |
| Orders | `/admin/orders` | Order management |
| Customers | `/admin/customers` | Customer list |
| Users | `/admin/users` | User management |
| Products | `/admin/products` | Product catalog |
| Categories | `/admin/products/categories` | Product categories |
| Analytics | `/admin/analytics` | Performance metrics |
| **Salon Management** | `/admin/salon` | Services & prices (salon-only) |
| **Site Builder** | `/admin/site-builder` | Full site customization |
| Settings | `/admin/settings` | App settings |

---

## 🚀 Next Steps

### Recommended Additions
1. **Image Upload**
   - Integrate Cloudinary or AWS S3
   - Direct upload in Site Builder
   - Automatic optimization

2. **Email Configuration**
   - SMTP settings in Site Builder
   - Contact form
   - Booking confirmations

3. **Online Booking**
   - Calendar integration
   - Service scheduling
   - Customer appointment management

4. **Gallery**
   - Before/after photos
   - Portfolio showcase
   - Auto-carousel on homepage

5. **Reviews/Testimonials**
   - Customer review submission
   - Display on homepage
   - Star ratings

6. **Multi-Language**
   - Language switcher
   - Translated content
   - Auto-detect locale

---

## 🔧 Technical Details

### Context Providers
```tsx
<BusinessSettingsProvider>  // Loads & manages business settings
  <DynamicMetadata />       // Updates page title & meta tags
  <SiteSettingsProvider>    // App-wide settings
    <Header />              // Shows business name/logo
    <main>
      {children}            // Dynamic content
    </main>
    <Footer />              // Shows business info
  </SiteSettingsProvider>
</BusinessSettingsProvider>
```

### Settings Flow
1. Admin updates settings in Site Builder
2. POST to `/api/business-settings`
3. Saved to database
4. `BusinessSettingsContext` refreshes
5. `DynamicMetadata` updates page title
6. All components re-render with new data

---

## 📞 Support

### Common Issues

**Q: Theme not changing?**
A: Clear browser cache, reload page, check Site Builder → Branding → Theme

**Q: Logo not showing?**
A: Verify image URL is publicly accessible, try different image host

**Q: Maps not embedding?**
A: Ensure you copied the **entire** `<iframe>` code from Google Maps

**Q: Services not displaying?**
A: Check service is marked as "Active" in Salon Management

**Q: Colors not applying?**
A: Colors apply after saving in Site Builder, may need hard refresh

---

## 📝 License & Credits

- **Platform**: Custom E-commerce System
- **Developer**: GitHub Copilot
- **Client**: Maxine Croston (Bliss Hair Studio)
- **Date**: October 12, 2025

---

## 🎉 Summary

You now have a complete, database-driven, multi-business e-commerce platform with:
- ✅ Full site builder interface
- ✅ Dynamic business settings
- ✅ Salon-specific features
- ✅ Google Maps integration
- ✅ Service/price management
- ✅ Social media integration
- ✅ Custom themes & branding
- ✅ Per-business customization
- ✅ Professional layouts
- ✅ Mobile responsive

**Perfect for hair salons, beauty studios, and any service-based business!**
