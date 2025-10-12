import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper to verify admin access
async function verifyAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const user = await Database.findUserById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

// GET site layout configuration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId') || 'default';

    const layout = await Database.getSiteLayout(businessId);
    
    if (!layout) {
      // Return default layout
      return NextResponse.json({
        businessId,
        layout: getDefaultLayout()
      });
    }

    return NextResponse.json(layout);
  } catch (error) {
    console.error('Error fetching site layout:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site layout' },
      { status: 500 }
    );
  }
}

// POST/PUT site layout configuration (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const {
      businessId = 'default',
      layout
    } = data;

    if (!layout) {
      return NextResponse.json(
        { error: 'Layout data is required' },
        { status: 400 }
      );
    }

    await Database.saveSiteLayout({
      businessId,
      layout
    });

    const updated = await Database.getSiteLayout(businessId);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating site layout:', error);
    return NextResponse.json(
      { error: 'Failed to update site layout' },
      { status: 500 }
    );
  }
}

// Default layout configuration
function getDefaultLayout() {
  return {
    homepage: {
      sections: [
        {
          id: 'hero-carousel',
          type: 'hero',
          enabled: true,
          order: 0,
          title: 'Hero Carousel',
          description: 'Main banner carousel'
        },
        {
          id: 'home-panels',
          type: 'panels',
          enabled: true,
          order: 1,
          title: 'Category Panels',
          description: 'Featured categories and offers'
        },
        {
          id: 'best-sellers',
          type: 'products',
          enabled: true,
          order: 2,
          title: 'Best Sellers',
          description: 'Most popular products',
          settings: {
            limit: 5,
            filter: 'best-sellers'
          }
        },
        {
          id: 'new-stock',
          type: 'products',
          enabled: true,
          order: 3,
          title: 'New Stock',
          description: 'Recently added products',
          settings: {
            limit: 5,
            filter: 'new'
          }
        },
        {
          id: 'reviews',
          type: 'reviews',
          enabled: true,
          order: 4,
          title: 'Customer Reviews',
          description: 'Testimonials and feedback'
        },
        {
          id: 'dropshipping',
          type: 'partners',
          enabled: true,
          order: 5,
          title: 'Business Partners',
          description: 'Dropshipping partners'
        }
      ]
    },
    products: {
      sections: [
        {
          id: 'filters',
          type: 'filters',
          enabled: true,
          order: 0,
          position: 'left'
        },
        {
          id: 'product-grid',
          type: 'grid',
          enabled: true,
          order: 1,
          settings: {
            perPage: 48,
            columns: {
              mobile: 2,
              tablet: 3,
              desktop: 4
            }
          }
        }
      ]
    },
    checkout: {
      sections: [
        {
          id: 'customer-info',
          type: 'form',
          enabled: true,
          order: 0,
          title: 'Customer Information'
        },
        {
          id: 'shipping',
          type: 'form',
          enabled: true,
          order: 1,
          title: 'Shipping Address'
        },
        {
          id: 'payment',
          type: 'form',
          enabled: true,
          order: 2,
          title: 'Payment Method'
        },
        {
          id: 'order-summary',
          type: 'summary',
          enabled: true,
          order: 3,
          position: 'right',
          sticky: true
        }
      ]
    }
  };
}
