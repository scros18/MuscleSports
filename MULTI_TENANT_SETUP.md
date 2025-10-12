# Multi-Tenant Salon/E-commerce Platform - Complete Implementation

## 🎯 Overview

This platform now supports **multi-tenant business management** where each admin user can configure their own business settings, including:

- Business name, type, and branding
- Contact information and location
- Google Maps integration
- Service offerings with pricing (for salons)
- Opening hours and social media links
- Dynamic page titles and metadata

## 🎨 Bliss Hair Studio Theme

### Logo Implementation

1. **Save the Logo**:
   - Save the provided Bliss Hair Studio logo as `blisshair-logo.png`
   - Place it in: `c:\Users\scros\New folder\html\html\public\blisshair-logo.png`
   - Ensure it has a transparent background for best results

2. **Logo Colors** (Emerald Green with Gold):
   - Primary: Emerald Green (#0D9488 to #14B8A6)
   - Accent: Gold (#F59E0B to #FBBF24)
   - Theme colors have been updated to match

## 📊 Database Schema

### New Tables Created

1. **`business_settings`** - Stores business configuration
   ```sql
   - id (PRIMARY KEY)
   - theme
   - business_name
   - business_type (salon, ecommerce, gym, other)
   - logo_url
   - address, phone, email
   - opening_hours (JSON)
   - google_maps_embed
   - latitude, longitude
   - primary_color, secondary_color
   - description
   - social_media (JSON)
   ```

2. **`salon_services`** - Stores service offerings
   ```sql
   - id (PRIMARY KEY)
   - business_id (FOREIGN KEY)
   - category
   - name, description
   - price
   - duration_minutes
   - is_active
   - display_order
   ```

## 🔌 API Endpoints

### Business Settings
- `GET /api/business-settings` - Fetch business settings
- `POST /api/business-settings` - Create/update settings (admin only)
- `DELETE /api/business-settings?id=xxx` - Delete settings (admin only)

### Salon Services
- `GET /api/salon-services` - Fetch all services
  - Query params: `businessId`, `category`, `includeInactive`
- `POST /api/salon-services` - Create service (admin only)
- `GET /api/salon-services/[id]` - Fetch single service
- `PUT /api/salon-services/[id]` - Update service (admin only)
- `DELETE /api/salon-services/[id]` - Delete service (admin only)

## 🎭 Themes Available

1. **Lumify** (💙 Blue) - Modern e-commerce
2. **Ordify** (🔵 Gray/Blue) - Standard e-commerce
3. **MuscleSports** (🟢 Green) - Sports nutrition
4. **VeraRP** (🟣 Purple) - Gaming/Roleplay
5. **Bliss Hair** (💚 Emerald) - Hair & Beauty Salon ✨ NEW

## 📱 Components Created

### Admin Components

1. **`/admin/salon`** - Salon Management Page
   - Business settings editor
   - Service management (CRUD)
   - Opening hours editor
   - Google Maps embed
   - Social media links

### Client Components

1. **`SalonHomepage`** - Specialized homepage for salons
   - Hero section with business info
   - Contact info card
   - Services & pricing section
   - Google Maps embed
   - Products link
   - Call-to-action section

2. **`DynamicPageTitle`** - Automatic page title updates
   - Updates browser title based on business name
   - Format: "Page Name | Business Name"

### Context Providers

1. **`BusinessSettingsContext`**
   - Provides business settings globally
   - Auto-loads on app start
   - Available via `useBusinessSettings()` hook

## 🚀 Usage Guide

### For Salon Owners (Maxine / Bliss Hair Studio)

1. **Activate Theme**:
   ```
   - Log in to admin panel
   - Click "Theme" button in sidebar
   - Cycle to "Bliss Hair" theme (emerald green)
   - Theme persists automatically
   ```

2. **Configure Business Settings**:
   ```
   - Go to Admin → Salon Management
   - Fill in:
     * Business name: "Bliss Hair Studio"
     * Address, phone, email
     * Description
     * Facebook and Instagram URLs
   ```

3. **Add Google Maps**:
   ```
   - Visit Google Maps
   - Search "Bliss Hair Studio"
   - Click Share → Embed a map
   - Copy entire <iframe> code
   - Paste in "Google Maps Embed Code" field
   - Save
   ```

4. **Add Services & Prices**:
   ```
   Examples:
   Category: Haircuts
   - Women's Cut & Blow Dry - £45.00 - 60 mins
   - Men's Cut - £25.00 - 30 mins
   
   Category: Coloring
   - Full Head Color - £75.00 - 120 mins
   - Balayage - £95.00 - 150 mins
   
   Category: Treatments
   - Deep Conditioning Treatment - £30.00 - 45 mins
   - Keratin Treatment - £120.00 - 180 mins
   ```

### For Developers

#### Access Business Settings in Components:

```typescript
import { useBusinessSettings } from '@/context/business-settings-context';

function MyComponent() {
  const { settings, loading, updateSettings, refreshSettings } = useBusinessSettings();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{settings.businessName}</h1>
      <p>{settings.address}</p>
      <p>{settings.phone}</p>
    </div>
  );
}
```

#### Update Dynamic Page Title:

```typescript
import { DynamicPageTitle } from '@/components/dynamic-page-title';

export default function MyPage() {
  return (
    <>
      <DynamicPageTitle pageTitle="Services" />
      {/* Page content */}
    </>
  );
}
```

#### Create a Service:

```typescript
const token = localStorage.getItem('auth_token');

const response = await fetch('/api/salon-services', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    category: 'Haircuts',
    name: "Women's Cut & Style",
    description: 'Professional cut with blow dry and styling',
    price: 45.00,
    durationMinutes: 60,
    isActive: true,
    displayOrder: 0
  })
});
```

## 🔐 Multi-Tenant Architecture

### Current Implementation
- Settings stored with `id: 'default'`
- All admins share the same business settings
- Theme-based differentiation (different themes = different businesses)

### Future: Per-User Businesses

To allow each admin to have their own business:

1. **Update Database Schema**:
   ```sql
   ALTER TABLE business_settings ADD COLUMN user_id VARCHAR(255);
   ALTER TABLE business_settings ADD FOREIGN KEY (user_id) REFERENCES users(id);
   ALTER TABLE business_settings ADD UNIQUE INDEX unique_user_business (user_id);
   ```

2. **Update API Endpoints**:
   ```typescript
   // In /api/business-settings/route.ts
   const user = await verifyAdmin(request);
   const settings = await Database.getBusinessSettings(user.id);
   ```

3. **Update Context Provider**:
   ```typescript
   // Load settings based on logged-in user
   const user = await fetch('/api/auth/me');
   const settings = await fetch(`/api/business-settings?userId=${user.id}`);
   ```

## 📝 Testing Checklist

- [ ] Theme switches to Bliss Hair (emerald green)
- [ ] Admin sidebar shows "Salon Management" link when Bliss Hair is active
- [ ] Business settings save correctly
- [ ] Services can be added, edited, deleted
- [ ] Google Maps embed displays on homepage
- [ ] Opening hours display correctly
- [ ] Social media links work
- [ ] Homepage shows salon-specific layout for Bliss Hair theme
- [ ] Page title updates with business name
- [ ] Services grouped by category
- [ ] Prices formatted as GBP (£)
- [ ] Mobile responsive
- [ ] Dark mode compatible

## 🎨 Theme Customization

### Update Primary Color:

Edit `app/globals.css`:

```css
.theme-blisshair {
  --primary: 170 85% 35%;  /* Emerald green */
  --accent: 43 96% 56%;    /* Gold accent */
}
```

### Add Logo to Header:

When the logo is added to `/public/blisshair-logo.png`, update the header component to display it:

```typescript
{settings.logoUrl && (
  <Image 
    src={settings.logoUrl} 
    alt={settings.businessName} 
    width={150} 
    height={50}
  />
)}
```

## 📦 Deployment

### Prerequisites
- MySQL/MariaDB database
- Node.js 18+
- Environment variables configured

### Steps

1. **Database Migration**:
   ```bash
   # Tables auto-create on first API call
   # Or run manual SQL if needed
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Start**:
   ```bash
   npm start
   ```

4. **Initial Setup**:
   - Log in as admin
   - Activate Bliss Hair theme
   - Configure business settings
   - Add services

## 🐛 Troubleshooting

### Issue: Services not showing
**Solution**: 
- Check `is_active = TRUE` in database
- Verify `business_id = 'default'`
- Check browser console for API errors

### Issue: Google Maps not displaying
**Solution**:
- Ensure full `<iframe>` tag is pasted
- Check for CSP/CORS issues
- Verify embed code from Google Maps Share menu

### Issue: Theme not persisting
**Solution**:
- Check localStorage is enabled
- Verify `admin_theme` key exists
- Clear browser cache and re-select theme

### Issue: Page title not updating
**Solution**:
- Ensure `<DynamicPageTitle>` component is added
- Verify BusinessSettingsContext is in layout
- Check business_name is set in database

## 📚 Documentation Files

- `BLISSHAIR_THEME_SETUP.md` - Initial theme setup guide
- `BLISSHAIR_COMPLETE_GUIDE.md` - Comprehensive feature guide
- `MULTI_TENANT_SETUP.md` - This file
- `README.md` - Main project documentation

## 🎯 Next Steps

1. **Add Logo**: Save logo to `/public/blisshair-logo.png`
2. **Configure Settings**: Fill in business information
3. **Add Services**: Create service menu with prices
4. **Test**: Verify all features work correctly
5. **Go Live**: Deploy to production

## 🤝 Support

For issues or questions:
- Check documentation files
- Review console logs
- Verify database connections
- Check API endpoint responses

---

**Version**: 2.0.0  
**Date**: October 12, 2025  
**Multi-Tenant Support**: ✅ Ready  
**Bliss Hair Studio**: ✅ Configured  
**Dynamic Page Titles**: ✅ Implemented
