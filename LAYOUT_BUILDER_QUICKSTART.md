# Layout Builder - Quick Start Guide

## 🎯 What Is This?

An **iOS-style drag-and-drop page builder** for admins to customize their website layout. Reorder sections on homepage, products page, and checkout - just like rearranging apps on your iPhone!

## 🚀 How to Use

### Step 1: Access the Builder
1. Log in to Admin Panel
2. Click **"Layout Builder"** in the sidebar
3. Choose which page to edit: Homepage, Products, or Checkout

### Step 2: Reorder Sections
1. Click and hold the **grip icon** (⋮⋮) on any section
2. Drag up or down to move it
3. Drop in the new position
4. Numbers update automatically (1, 2, 3...)

### Step 3: Show/Hide Sections
- Click the **eye icon** to toggle visibility
- **"Visible"** = Shows on live site
- **"Hidden"** = Removed from live site

### Step 4: Save Changes
- Click **"Save Layout"** button (top right)
- Changes go live immediately for all visitors

## 📋 Available Sections

### Homepage
- **Hero Carousel** - Main banner with slides
- **Category Panels** - Featured product categories
- **Best Sellers** - Top-selling products
- **New Stock** - Recently added items
- **Customer Reviews** - Testimonials
- **Business Partners** - Partner logos

### Products Page
- **Filters** - Search and filter sidebar
- **Product Grid** - Main product display

### Checkout Page
- **Customer Info** - Name and contact
- **Shipping** - Delivery address
- **Payment** - Payment method selection
- **Order Summary** - Cart total (sidebar)

## 💡 Example Scenarios

### Promote a Sale
```
1. Drag "Deals" section to position 1
2. Hide "Reviews" temporarily
3. Save changes
```

### New Product Launch
```
1. Drag "New Stock" to position 2
2. Make sure it's visible
3. Save changes
```

### Simplify Checkout
```
1. Reorder: Payment → Shipping → Info
2. Hide optional sections
3. Save changes
```

## 🎨 Visual Guide

```
Homepage Layout Example:

┌────────────────────────────────┐
│ ⋮⋮ [1] 📐 Hero Carousel [👁 Visible]  │  ← Drag this
├────────────────────────────────┤
│ ⋮⋮ [2] 📊 Category Panels [👁 Visible] │
├────────────────────────────────┤
│ ⋮⋮ [3] 📦 Best Sellers [👁️‍🗨️ Hidden]  │  ← This is hidden
├────────────────────────────────┤
│ ⋮⋮ [4] 🌟 New Stock [👁 Visible]     │
└────────────────────────────────┘

Stats:
Total: 6 | Visible: 5 | Hidden: 1
```

## 🔧 Technical Details

### Database
- Stores layouts in `site_layouts` table
- Each business can have custom layouts
- JSON format for flexibility

### API Endpoints
- `GET /api/site-layout` - Load layout
- `POST /api/site-layout` - Save layout (admin only)
- `DELETE /api/site-layout` - Reset to defaults

### Security
- Admin authentication required
- JWT token verification
- Business-specific layouts (multi-tenant ready)

## 📱 Mobile-Friendly

- Touch-friendly drag handles
- Responsive design
- Works on phones and tablets
- Smooth animations

## ⚠️ Important Notes

1. **Changes are Live**: Saving affects all visitors immediately
2. **Admin Only**: Only admins can edit layouts
3. **Reset Available**: Can restore default layout anytime
4. **Per-Business**: Each business has its own layout (multi-tenant)

## 🆘 Troubleshooting

**Layout not saving?**
- Check you're logged in as admin
- Verify internet connection
- Try refreshing the page

**Can't drag sections?**
- Try clicking directly on grip icon (⋮⋮)
- Make sure JavaScript is enabled
- Clear browser cache

**Sections missing?**
- Click "Reset" to restore defaults
- Check if sections are hidden (eye icon)

## 📚 Full Documentation

See [LAYOUT_BUILDER_GUIDE.md](./LAYOUT_BUILDER_GUIDE.md) for complete technical documentation.

---

**Quick Tip**: Test your layout changes on mobile before saving! Your customers will thank you. 📱✨
