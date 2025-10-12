# Layout Builder - iOS-Style Drag & Drop Site Editor

## 🎯 Overview

The **Layout Builder** is a visual, drag-and-drop interface that lets admins customize the layout and order of sections on their website pages - similar to rearranging apps on an iOS home screen. Changes apply to the live site for all visitors.

## ✨ Features

### Drag & Drop Reordering
- **Grab & Move**: Click and hold the grip icon (⋮⋮) to drag sections
- **Visual Feedback**: Sections highlight when dragging, show drop zones
- **Smooth Animations**: iOS-style transitions and scaling effects
- **Auto-Ordering**: Section numbers update automatically (1, 2, 3...)

### Show/Hide Sections
- **Toggle Visibility**: Click the eye icon to show/hide any section
- **Visual Indicators**: Hidden sections appear dimmed
- **Live Preview**: See exactly what visitors will see

### Multi-Page Support
- **Homepage**: Hero, panels, products, reviews, partners
- **Products Page**: Filters, product grid, sorting options
- **Checkout Page**: Customer info, shipping, payment, order summary

## 🗄️ Database Architecture

### site_layouts Table
```sql
CREATE TABLE site_layouts (
  id VARCHAR(255) PRIMARY KEY,
  business_id VARCHAR(255) NOT NULL DEFAULT 'default',
  layout_data JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_business (business_id)
);
```

### Layout Data Structure
```typescript
interface SiteLayout {
  homepage: {
    sections: [
      {
        id: 'hero-carousel',
        type: 'hero',
        enabled: true,
        order: 0,
        title: 'Hero Carousel',
        description: 'Main banner carousel',
        settings: { /* section-specific config */ }
      },
      // ... more sections
    ]
  },
  products: { sections: [...] },
  checkout: { sections: [...] }
}
```

## 🎨 Section Types

### Homepage Sections
1. **Hero Carousel** - Main banner with slides
2. **Category Panels** - Featured categories and offers
3. **Best Sellers** - Most popular products
4. **New Stock** - Recently added products
5. **Customer Reviews** - Testimonials and feedback
6. **Business Partners** - Dropshipping partners

### Products Page Sections
1. **Filters** - Category/price/brand filters (left sidebar)
2. **Product Grid** - Main product display

### Checkout Page Sections
1. **Customer Info** - Name and contact details
2. **Shipping Address** - Delivery information
3. **Payment Method** - Payment selection
4. **Order Summary** - Cart items and total (right sidebar)

## 🚀 Usage Instructions

### For Admins

1. **Access Layout Builder**
   - Navigate to Admin Panel → Layout Builder
   - Select which page to edit (Homepage, Products, Checkout)

2. **Reorder Sections**
   - Click and hold the grip icon (⋮⋮) on any section
   - Drag up or down to new position
   - Blue highlight shows drop zone
   - Release to place section

3. **Show/Hide Sections**
   - Click the eye icon button on any section
   - "Visible" = Section appears on live site
   - "Hidden" = Section is removed from live site

4. **Save Changes**
   - Click "Save Layout" button (top right)
   - Changes apply immediately to live site
   - All visitors see the new layout

5. **Reset to Defaults**
   - Click "Reset" button to restore default layout
   - Confirms before resetting (cannot be undone)

### Visual Guide

```
┌─────────────────────────────────────────────┐
│ ⋮⋮  [1]  📐  Hero Carousel         [👁 Visible] │
│     Main banner carousel                    │
└─────────────────────────────────────────────┘
       ↕ Drag to reorder
┌─────────────────────────────────────────────┐
│ ⋮⋮  [2]  📊  Category Panels       [👁 Visible] │
│     Featured categories and offers          │
└─────────────────────────────────────────────┘
       ↕
┌─────────────────────────────────────────────┐
│ ⋮⋮  [3]  📦  Best Sellers          [👁️‍🗨️ Hidden] │
│     Most popular products                   │
└─────────────────────────────────────────────┘
```

## 🔧 Technical Implementation

### API Endpoints

#### GET /api/site-layout
```typescript
// Fetch layout configuration
const response = await fetch('/api/site-layout?businessId=default', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { layout } = await response.json();
```

#### POST /api/site-layout
```typescript
// Save layout configuration (admin only)
const response = await fetch('/api/site-layout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    businessId: 'default',
    layout: {
      homepage: { sections: [...] },
      products: { sections: [...] },
      checkout: { sections: [...] }
    }
  })
});
```

#### DELETE /api/site-layout
```typescript
// Reset to default layout (admin only)
await fetch('/api/site-layout?businessId=default', {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Frontend Integration

#### Using Layout Data in Pages

```typescript
// app/page.tsx - Homepage example
'use client';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [layout, setLayout] = useState<any>(null);

  useEffect(() => {
    fetch('/api/site-layout?businessId=default')
      .then(res => res.json())
      .then(data => setLayout(data.layout));
  }, []);

  if (!layout) return <div>Loading...</div>;

  const visibleSections = layout.homepage.sections
    .filter((s: any) => s.enabled)
    .sort((a: any, b: any) => a.order - b.order);

  return (
    <div>
      {visibleSections.map((section: any) => {
        switch (section.type) {
          case 'hero':
            return <HeroCarousel key={section.id} {...section.settings} />;
          case 'panels':
            return <HomePanels key={section.id} {...section.settings} />;
          case 'products':
            return <ProductGrid key={section.id} {...section.settings} />;
          // ... more section types
        }
      })}
    </div>
  );
}
```

## 🎯 Default Layout Configuration

### Homepage Default
```javascript
{
  sections: [
    { id: 'hero-carousel', type: 'hero', enabled: true, order: 0 },
    { id: 'home-panels', type: 'panels', enabled: true, order: 1 },
    { id: 'best-sellers', type: 'products', enabled: true, order: 2, 
      settings: { limit: 5, filter: 'best-sellers' } },
    { id: 'new-stock', type: 'products', enabled: true, order: 3,
      settings: { limit: 5, filter: 'new' } },
    { id: 'reviews', type: 'reviews', enabled: true, order: 4 },
    { id: 'dropshipping', type: 'partners', enabled: true, order: 5 }
  ]
}
```

### Products Page Default
```javascript
{
  sections: [
    { id: 'filters', type: 'filters', enabled: true, order: 0, position: 'left' },
    { id: 'product-grid', type: 'grid', enabled: true, order: 1,
      settings: { perPage: 48, columns: { mobile: 2, tablet: 3, desktop: 4 } } }
  ]
}
```

### Checkout Page Default
```javascript
{
  sections: [
    { id: 'customer-info', type: 'form', enabled: true, order: 0 },
    { id: 'shipping', type: 'form', enabled: true, order: 1 },
    { id: 'payment', type: 'form', enabled: true, order: 2 },
    { id: 'order-summary', type: 'summary', enabled: true, order: 3, 
      position: 'right', sticky: true }
  ]
}
```

## 🔒 Security

- **Admin Only**: Layout changes require admin role authentication
- **JWT Verification**: All write operations verify JWT token
- **Input Validation**: Layout data validated before saving
- **SQL Injection Protection**: Uses parameterized queries

## 🌐 Multi-Tenant Support

Each business can have its own custom layout:

```typescript
// Get layout for specific business
const response = await fetch('/api/site-layout?businessId=business-123');

// Save layout for specific business
await fetch('/api/site-layout', {
  method: 'POST',
  body: JSON.stringify({
    businessId: 'business-123',
    layout: customLayout
  })
});
```

## 📱 Mobile Responsiveness

- **Touch-Friendly**: Large touch targets for drag handles and buttons
- **Responsive Layout**: Adapts to all screen sizes
- **Mobile Gestures**: Touch drag-and-drop support
- **Optimized Performance**: Smooth animations on mobile devices

## 🎨 UI/UX Features

### Visual Feedback
- **Drag Preview**: Section scales and changes opacity while dragging
- **Drop Zones**: Blue ring highlights valid drop positions
- **Order Numbers**: Large, prominent position indicators (1, 2, 3...)
- **Icon System**: Each section type has a unique icon
- **Status Badges**: Shows customized settings, position, etc.

### Accessibility
- **Keyboard Support**: Tab navigation through sections
- **ARIA Labels**: Screen reader friendly
- **Color Contrast**: Meets WCAG AA standards
- **Focus Indicators**: Clear focus states

## 🔄 State Management

```typescript
// Component state
const [layout, setLayout] = useState<SiteLayout | null>(null);
const [activeTab, setActiveTab] = useState<'homepage' | 'products' | 'checkout'>('homepage');
const [draggedItem, setDraggedItem] = useState<SectionItem | null>(null);
const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

// Drag handlers
const handleDragStart = (e, item) => setDraggedItem(item);
const handleDragOver = (e, index) => setDragOverIndex(index);
const handleDrop = (e, dropIndex) => {
  // Reorder logic
  const sections = [...currentPage.sections];
  const [removed] = sections.splice(dragIndex, 1);
  sections.splice(dropIndex, 0, removed);
  sections.forEach((s, idx) => s.order = idx);
  setLayout(updatedLayout);
};
```

## 🚦 Status Indicators

```
┌────────────────────────────────┐
│ Total Sections:    6           │
│ Visible:           5 (green)   │
│ Hidden:            1 (red)     │
│ Status: ● All changes saved    │
└────────────────────────────────┘
```

## 📝 Example Use Cases

### 1. Seasonal Promotion
```
During Black Friday:
1. Move "Deals" section to position 1 (top of page)
2. Hide "Reviews" section temporarily
3. Add "Limited Time Offers" section
```

### 2. New Product Launch
```
For new product line:
1. Move "New Stock" to position 2
2. Enable "New Stock" section
3. Adjust grid to show 12 products
```

### 3. Simplified Checkout
```
For faster checkout:
1. Hide optional "Gift Message" section
2. Reorder: Payment → Shipping → Info
3. Enable express checkout option
```

## 🐛 Troubleshooting

### Layout Not Saving
- Check admin authentication token is valid
- Ensure database connection is active
- Verify JSON data structure is correct

### Sections Not Reordering
- Clear browser cache
- Check drag event handlers are working
- Verify order property is updating

### Missing Sections
- Reset to default layout
- Check database for corrupted data
- Verify section IDs match component mapping

## 🎓 Best Practices

1. **Test Before Saving**: Drag sections to preview, then save
2. **Keep Mobile in Mind**: Test layout on mobile devices
3. **Don't Hide Critical Sections**: Always keep hero/main content visible
4. **Use Meaningful Order**: Place most important content first
5. **Save Regularly**: Save changes as you make them
6. **Backup Layouts**: Note current configuration before major changes

## 🔗 Related Documentation

- [Site Builder Guide](./BLISSHAIR_COMPLETE_GUIDE.md) - Business settings and content
- [Multi-Tenant Setup](./MULTI_TENANT_SETUP.md) - Business-specific configurations
- [Theme System](./PROJECT_SUMMARY.md) - Color schemes and branding

---

**Created**: December 2024  
**Last Updated**: December 2024  
**Version**: 1.0.0
