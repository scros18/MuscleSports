# Layout Builder - Visual Workflow

## 🎯 How It Works (Visual Guide)

### Step 1: Access the Layout Builder
```
Admin Panel Sidebar
┌─────────────────────────┐
│ 📊 Dashboard            │
│ 📦 Products             │
│ 🛒 Orders               │
│ 👥 Customers            │
│ ⚙️  Site Builder         │
│ 📱 Layout Builder  ◄──── Click here!
│ ✂️  Salon Management     │
└─────────────────────────┘
```

### Step 2: Choose Your Page
```
┌──────────────────────────────────────────┐
│ Layout Builder                [Reset] [Save] │
├──────────────────────────────────────────┤
│ [Homepage] [Products] [Checkout]         │
│     ▲                                    │
│  Active tab                              │
└──────────────────────────────────────────┘
```

### Step 3: Drag & Drop Sections
```
BEFORE DRAGGING:
┌────────────────────────────────────────────┐
│ ⋮⋮ [1] 📐 Hero Carousel        [👁 Visible] │
├────────────────────────────────────────────┤
│ ⋮⋮ [2] 📊 Category Panels      [👁 Visible] │
├────────────────────────────────────────────┤
│ ⋮⋮ [3] 📦 Best Sellers         [👁 Visible] │
├────────────────────────────────────────────┤
│ ⋮⋮ [4] 🌟 New Stock            [👁 Visible] │
└────────────────────────────────────────────┘

DURING DRAG (New Stock being moved up):
┌────────────────────────────────────────────┐
│ ⋮⋮ [1] 📐 Hero Carousel        [👁 Visible] │
├────────────────────────────────────────────┤
│ 🔵 DROP ZONE 🔵                            │  ◄── Blue highlight
├────────────────────────────────────────────┤
│ ⋮⋮ [2] 📊 Category Panels      [👁 Visible] │
├────────────────────────────────────────────┤
│ ⋮⋮ [3] 📦 Best Sellers         [👁 Visible] │
├────────────────────────────────────────────┤
│ ⋮⋮ [?] 🌟 New Stock (dragging...) 50% opacity │
└────────────────────────────────────────────┘

AFTER DROP:
┌────────────────────────────────────────────┐
│ ⋮⋮ [1] 📐 Hero Carousel        [👁 Visible] │
├────────────────────────────────────────────┤
│ ⋮⋮ [2] 🌟 New Stock            [👁 Visible] │  ◄── Moved!
├────────────────────────────────────────────┤
│ ⋮⋮ [3] 📊 Category Panels      [👁 Visible] │
├────────────────────────────────────────────┤
│ ⋮⋮ [4] 📦 Best Sellers         [👁 Visible] │
└────────────────────────────────────────────┘
```

### Step 4: Toggle Visibility
```
CLICKING EYE ICON:
┌────────────────────────────────────────────┐
│ ⋮⋮ [1] 📐 Hero Carousel        [👁 Visible] │
├────────────────────────────────────────────┤
│ ⋮⋮ [2] 📦 Best Sellers         [👁️‍🗨️ Hidden] │  ◄── Clicked!
│     (dimmed, 50% opacity)                  │
├────────────────────────────────────────────┤
│ ⋮⋮ [3] 🌟 New Stock            [👁 Visible] │
└────────────────────────────────────────────┘

RESULT ON LIVE SITE:
┌────────────────────────────────────────────┐
│ 📐 Hero Carousel Section                   │
│ [Image slider with 3 slides]               │
├────────────────────────────────────────────┤
│ (Best Sellers section is HIDDEN)           │
├────────────────────────────────────────────┤
│ 🌟 New Stock Section                       │
│ [Product cards for 5 new items]            │
└────────────────────────────────────────────┘
```

### Step 5: Save and View Stats
```
STATS FOOTER:
┌────────────────────────────────────────────┐
│  Total: 6    Visible: 4    Hidden: 2       │
│  Status: ● All changes saved               │
└────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Admin Interface                      │
│           /admin/layout-builder/page.tsx                │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Drag &    │  │   Toggle    │  │    Save     │   │
│  │   Drop      │  │  Visibility │  │   Button    │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘   │
└─────────┼─────────────────┼─────────────────┼──────────┘
          │                 │                 │
          └─────────────────┴─────────────────┘
                            │
                            ▼
          ┌─────────────────────────────────┐
          │     Update Layout State         │
          │   (sections reordered/hidden)   │
          └─────────────────┬───────────────┘
                            │
                            ▼
          ┌─────────────────────────────────┐
          │   POST /api/site-layout         │
          │   { businessId, layout }        │
          └─────────────────┬───────────────┘
                            │
                            ▼
          ┌─────────────────────────────────┐
          │   lib/database.ts               │
          │   saveSiteLayout()              │
          └─────────────────┬───────────────┘
                            │
                            ▼
          ┌─────────────────────────────────┐
          │   MySQL Database                │
          │   site_layouts table            │
          │   { id, business_id, layout }   │
          └─────────────────┬───────────────┘
                            │
                            ▼
          ┌─────────────────────────────────┐
          │   Frontend Pages Load Layout    │
          │   GET /api/site-layout          │
          └─────────────────┬───────────────┘
                            │
                            ▼
          ┌─────────────────────────────────┐
          │   Render Sections in Order      │
          │   (only visible sections)       │
          └─────────────────────────────────┘
```

---

## 🎨 Section Component Mapping

```
Layout Type → Component Rendered
────────────────────────────────────
'hero'      → <HeroCarousel />
'panels'    → <HomePanels />
'products'  → <ProductGrid filter="best-sellers" limit={5} />
'reviews'   → <CustomerReviews />
'partners'  → <BusinessPartners />
'filters'   → <ProductFilters position="left" />
'grid'      → <ProductGrid columns={4} />
'form'      → <CheckoutForm type="customer-info" />
'summary'   → <OrderSummary position="right" sticky />
```

---

## 🔄 Drag & Drop State Machine

```
State: IDLE
  │
  ├─ User clicks grip icon (⋮⋮)
  │
  ▼
State: DRAGGING
  │  • draggedItem = section
  │  • Section becomes 50% opacity
  │  • Cursor changes to "grabbing"
  │
  ├─ User hovers over another section
  │
  ▼
State: HOVERING
  │  • dragOverIndex = hovered section index
  │  • Blue ring highlights drop zone
  │
  ├─ User releases mouse
  │
  ▼
State: DROPPING
  │  • Remove section from old position
  │  • Insert section at new position
  │  • Update all order numbers (0, 1, 2...)
  │
  ▼
State: IDLE
  │  • Clear draggedItem
  │  • Clear dragOverIndex
  │  • Show "unsaved changes" indicator
```

---

## 📱 Responsive Behavior

```
DESKTOP (1200px+):
┌────────────────────────────────────────────────────────┐
│ Sidebar │          Main Content Area                   │
│         │  ┌──────────────────────────────────────┐   │
│  Menu   │  │ Layout Builder                       │   │
│         │  │ ┌──────────────────────────────────┐ │   │
│ - Home  │  │ │ ⋮⋮ [1] Section     [Visible]     │ │   │
│ - Prod  │  │ ├──────────────────────────────────┤ │   │
│ - Ord   │  │ │ ⋮⋮ [2] Section     [Visible]     │ │   │
│ - Cust  │  │ ├──────────────────────────────────┤ │   │
│ ▶Layout │  │ │ ⋮⋮ [3] Section     [Hidden]      │ │   │
│         │  │ └──────────────────────────────────┘ │   │
└─────────┴──┴───────────────────────────────────────┴───┘

MOBILE (< 768px):
┌──────────────────────────────┐
│ ☰ Menu    Layout Builder     │
├──────────────────────────────┤
│ [Homepage][Products][Check]  │
├──────────────────────────────┤
│ ⋮⋮ [1] Section               │
│     [👁 Visible]              │
├──────────────────────────────┤
│ ⋮⋮ [2] Section               │
│     [👁 Visible]              │
├──────────────────────────────┤
│ ⋮⋮ [3] Section               │
│     [👁️‍🗨️ Hidden]              │
└──────────────────────────────┘
  • Full width
  • Touch-friendly drag
  • Buttons stack vertically
```

---

## 🎯 Example Layouts

### E-Commerce Homepage
```
1. [👁 Visible] Hero Carousel - 3 promotional slides
2. [👁 Visible] Category Panels - 6 main categories
3. [👁 Visible] Best Sellers - Top 5 products
4. [👁 Visible] New Arrivals - Latest 5 products
5. [👁️‍🗨️ Hidden] Customer Reviews - Testimonials
6. [👁 Visible] Partner Logos - Dropshipping partners
```

### Salon Homepage (Bliss Hair)
```
1. [👁 Visible] Hero Banner - Welcome message
2. [👁 Visible] Services List - Haircuts, coloring, etc.
3. [👁 Visible] Google Maps - Location embed
4. [👁 Visible] Contact Info - Address, phone, hours
5. [👁️‍🗨️ Hidden] Products - Hair care products
6. [👁 Visible] Booking CTA - "Book Now" button
```

### Products Page
```
1. [👁 Visible] Filters - Left sidebar (categories, price)
2. [👁 Visible] Product Grid - 4 columns, 48 per page
```

### Checkout Page
```
1. [👁 Visible] Customer Info - Name, email, phone
2. [👁 Visible] Shipping Address - Delivery details
3. [👁 Visible] Payment Method - Card/PayPal
4. [👁 Visible] Order Summary - Right sidebar, sticky
```

---

## 🔑 Key Concepts

### Order vs Position
```
ORDER: Determines sequence (0, 1, 2, 3...)
  • Auto-updated when dragging
  • Controls rendering order
  • Always sequential

POSITION: Determines layout placement
  • 'left' = sidebar
  • 'right' = sidebar
  • undefined = main content
  • Fixed per section type
```

### Enabled vs Hidden
```
ENABLED = TRUE:
  • Section renders on live site
  • Appears in normal colors
  • Visible to all visitors

ENABLED = FALSE:
  • Section does NOT render
  • Appears dimmed (50% opacity)
  • Completely hidden from visitors
```

### Settings vs Config
```
SETTINGS: Per-section customization
  {
    limit: 5,           // Show 5 products
    filter: 'new',      // Only new products
    columns: 4          // 4-column grid
  }

CONFIG: Global layout settings
  {
    businessId: 'default',
    createdAt: '2024-12-10',
    updatedAt: '2024-12-10'
  }
```

---

## 📊 Database Schema Visual

```
site_layouts Table
┌──────────────────────────────────────────────────┐
│ id (VARCHAR)         │ "uuid-abc-123"            │
│ business_id (VARCHAR)│ "default"                 │
│ layout_data (JSON)   │ {                         │
│                      │   homepage: { ... },      │
│                      │   products: { ... },      │
│                      │   checkout: { ... }       │
│                      │ }                         │
│ created_at (TIME)    │ 2024-12-10 10:30:00       │
│ updated_at (TIME)    │ 2024-12-10 15:45:00       │
└──────────────────────────────────────────────────┘
         │
         │ Foreign Key (future)
         ▼
business_settings Table
┌──────────────────────────────────────────────────┐
│ id (VARCHAR)         │ "default"                 │
│ businessName         │ "Bliss Hair Studio"       │
│ ...                  │ ...                       │
└──────────────────────────────────────────────────┘
```

---

## 🎬 Animation Timeline

```
Drag Start (0ms):
  • Section opacity → 50%
  • Cursor → grabbing
  • Transform → scale(0.95)

Drag Over (100ms):
  • Target section → blue ring
  • Ring animation → pulse
  • Transform → scale(1.05)

Drop (200ms):
  • Sections reorder
  • Order numbers update
  • Transform → scale(1)
  • Opacity → 100%

Complete (300ms):
  • Clear drag state
  • Remove highlights
  • Show save indicator
```

---

## 💡 Pro Tips

### For Best Performance
```
✓ Keep total sections < 20
✓ Use lazy loading for images
✓ Minimize custom settings
✓ Cache layout data on frontend
✓ Optimize database indexes
```

### For Best UX
```
✓ Test on mobile before saving
✓ Keep hero section at top
✓ Don't hide navigation elements
✓ Group related sections together
✓ Use clear section titles
```

### For Troubleshooting
```
✓ Check browser console for errors
✓ Verify admin token is valid
✓ Test API endpoints with Postman
✓ Reset to defaults if corrupted
✓ Check database connection
```

---

## 🚀 Quick Reference

### Admin Access
- **URL**: `/admin/layout-builder`
- **Auth**: Admin role required
- **Token**: JWT in localStorage

### API Endpoints
- **Load**: `GET /api/site-layout?businessId=default`
- **Save**: `POST /api/site-layout`
- **Reset**: `DELETE /api/site-layout?businessId=default`

### Database
- **Table**: `site_layouts`
- **Method**: `Database.saveSiteLayout()`
- **Method**: `Database.getSiteLayout()`
- **Method**: `Database.deleteSiteLayout()`

### Component Location
- **File**: `app/admin/layout-builder/page.tsx`
- **Lines**: ~420 lines
- **Dependencies**: AdminLayout, Button, Card, Icons

---

Made with ❤️ for intuitive site customization!
