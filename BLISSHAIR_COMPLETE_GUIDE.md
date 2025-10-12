# Bliss Hair Studio - Complete Implementation Guide

## Logo Information

The Bliss Hair Studio logo features:
- **Colors**: Emerald green watercolor with gold/brass script text and leaf accents
- **Style**: Elegant, artistic, feminine
- **Format**: Circular design with "Bliss Hair" in gold script and "STUDIO" beneath
- **Theme Colors**: Green (#0D9488 to #14B8A6) with gold accents (#F59E0B to #FBBF24)

### Logo Implementation Steps

1. Save the attached logo image as `blisshair-logo.png` in `/public/`
2. For best results, use a transparent background PNG
3. The logo will automatically appear in:
   - Admin sidebar when Bliss Hair theme is active
   - Site header
   - Footer
   - Salon homepage

### Recommended Logo Colors for Theme

Based on the logo, the theme uses:
- **Primary Green**: `hsl(340, 82%, 52%)` → Should be updated to `hsl(170, 85%, 35%)` (Emerald)
- **Gold Accent**: `hsl(43, 96%, 56%)` for highlights
- **Secondary**: Light emerald tones

## Features Implemented

### 1. Database Tables

Three new tables created for multi-tenant salon support:

#### `business_settings` Table
Stores per-business configuration:
- Business name, type, logo URL
- Contact information (address, phone, email)
- Opening hours (JSON)
- Google Maps embed code
- Geolocation (latitude, longitude)
- Brand colors (primary, secondary)
- Description
- Social media links (JSON)

#### `salon_services` Table
Stores service offerings:
- Service category (Haircuts, Coloring, etc.)
- Service name and description
- Pricing
- Duration in minutes
- Active/inactive status
- Display order

### 2. API Endpoints

#### `/api/business-settings`
- **GET**: Fetch business settings
- **POST**: Create/update business settings (admin only)
- **DELETE**: Remove business settings (admin only)

#### `/api/salon-services`
- **GET**: Fetch salon services (can filter by category)
  - Query params: `businessId`, `category`, `includeInactive`
- **POST**: Create new service (admin only)

#### `/api/salon-services/[id]`
- **GET**: Fetch single service
- **PUT/PATCH**: Update service (admin only)
- **DELETE**: Delete service (admin only)

### 3. Context Providers

#### `BusinessSettingsContext`
- Loads business settings on app start
- Provides settings to all components
- Handles updates and refreshes
- Available via `useBusinessSettings()` hook

### 4. Admin Interface

#### `/admin/salon` Page
Complete salon management interface:
- **Business Settings Section**:
  - Business name, type, description
  - Contact details (address, phone, email)
  - Google Maps embed code
  - Social media links (Facebook, Instagram)
  - Opening hours editor

- **Services Management Section**:
  - Add new services with category, name, description, price, duration
  - Edit existing services inline
  - Delete services
  - Services grouped by category
  - Active/inactive toggle
  - Display order management

### 5. Salon Homepage Component

`/components/salon-homepage.tsx` provides:
- **Hero Section**: Business name, description, call-to-action
- **Contact Info Card**: Address, phone, email, opening hours, social links
- **Services & Pricing Section**: 
  - Services grouped by category
  - Professional pricing cards
  - Duration badges
  - Green-themed design
- **Google Maps Section**: Embedded map if configured
- **Products Section**: Link to product catalog
- **Contact/CTA Section**: Phone booking and contact form

### 6. Dynamic Page Titles & Metadata

The system now supports dynamic page titles based on business settings:
- Site name pulls from business settings
- Page titles format: `[Page Name] | [Business Name]`
- Metadata updates based on business type
- SEO optimized for salon businesses

## Usage Guide

### For Salon Owners

1. **Initial Setup**:
   ```
   - Log in to admin panel
   - Navigate to "Salon Management" (when Bliss Hair theme is active)
   - Fill in Business Settings
   - Add your services and prices
   ```

2. **Adding Services**:
   ```
   - Click "Add Service"
   - Enter category (e.g., "Haircuts", "Coloring", "Treatments")
   - Enter service name
   - Set price and duration
   - Save
   ```

3. **Google Maps Setup**:
   ```
   - Go to Google Maps
   - Search for your business
   - Click Share → Embed a map
   - Copy the iframe code
   - Paste in "Google Maps Embed Code" field
   ```

4. **Theme Activation**:
   ```
   - In admin sidebar, click "Theme" button
   - Cycle to "Bliss Hair" theme
   - Theme persists automatically
   ```

### For Developers

#### Accessing Business Settings in Components:

```typescript
import { useBusinessSettings } from '@/context/business-settings-context';

function MyComponent() {
  const { settings, loading, updateSettings } = useBusinessSettings();
  
  return (
    <div>
      <h1>{settings.businessName}</h1>
      <p>{settings.address}</p>
    </div>
  );
}
```

#### Creating a New Service:

```typescript
const response = await fetch('/api/salon-services', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    category: 'Haircuts',
    name: "Women's Cut & Style",
    description: 'Professional cut with blow dry',
    price: 45.00,
    durationMinutes: 60,
    isActive: true
  })
});
```

## Multi-Tenant Architecture

The system is designed to support multiple businesses:

1. **Business ID**: Each business has a unique ID (default: 'default')
2. **Isolated Data**: Services and settings are scoped to business ID
3. **Theme-Based Switching**: Different themes can represent different businesses
4. **Scalable**: Easy to add user authentication to business settings

### Future Enhancement: Per-User Businesses

To allow each admin user to manage their own business:

1. **Add `user_id` to `business_settings` table**:
   ```sql
   ALTER TABLE business_settings ADD COLUMN user_id VARCHAR(255);
   ALTER TABLE business_settings ADD FOREIGN KEY (user_id) REFERENCES users(id);
   ```

2. **Filter by user in API**:
   ```typescript
   const settings = await Database.getBusinessSettings(userId);
   ```

3. **Update Context** to use current user's settings

## Color Scheme Updates

To match the logo better, update `app/globals.css`:

```css
.theme-blisshair {
  --primary: 170 85% 35%;  /* Emerald green from logo */
  --secondary: 170 75% 96%;  /* Light emerald */
  /* Keep other values */
}
```

For gold accents in components:
```css
.gold-accent {
  color: hsl(43, 96%, 56%);
}
```

## Testing Checklist

- [ ] Business settings save and load correctly
- [ ] Services CRUD operations work
- [ ] Google Maps embed displays properly
- [ ] Opening hours format correctly
- [ ] Social media links work
- [ ] Theme switching persists
- [ ] Salon homepage displays all sections
- [ ] Admin panel "Salon Management" accessible
- [ ] Services grouped by category
- [ ] Price formatting shows GBP correctly
- [ ] Mobile responsive design works
- [ ] Dark mode compatible

## Deployment Notes

### Database Migration

Run this SQL before deploying:

```sql
-- Already handled by Database.initTables() but for reference:

CREATE TABLE IF NOT EXISTS business_settings (
  id VARCHAR(255) PRIMARY KEY,
  theme VARCHAR(50) NOT NULL DEFAULT 'ordify',
  business_name VARCHAR(255),
  business_type ENUM('salon', 'ecommerce', 'gym', 'other') DEFAULT 'ecommerce',
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS salon_services (
  id VARCHAR(255) PRIMARY KEY,
  business_id VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES business_settings(id) ON DELETE CASCADE
);
```

### Environment Variables

No new environment variables needed. Uses existing database connection.

## Support & Maintenance

### Common Issues

**Issue**: Google Maps not showing
- **Solution**: Ensure embed code includes complete `<iframe>` tag
- **Check**: No CORS or CSP blocking the embed

**Issue**: Services not displaying
- **Solution**: Check `is_active` status and business_id match
- **Verify**: Database connection and table creation

**Issue**: Theme not persisting
- **Solution**: Check localStorage is enabled
- **Verify**: `admin_theme` key in localStorage

## Future Enhancements

1. **Booking System**: Online appointment booking
2. **Gallery**: Photo gallery for hair styles
3. **Staff Profiles**: Individual stylist pages
4. **Reviews**: Customer review system
5. **Loyalty Program**: Points/rewards system
6. **Email Marketing**: Newsletter integration
7. **Multi-Location**: Support for salon chains
8. **Mobile App**: Native mobile booking app

---

**Version**: 1.0.0  
**Date**: October 12, 2025  
**Author**: GitHub Copilot  
**Business Owner**: Maxine Croston (Bliss Hair Studio)
