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

// GET business settings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || 'default';

    const settings = await Database.getBusinessSettings(id);
    
    if (!settings) {
      return NextResponse.json({
        id: 'default',
        theme: 'musclesports',
        businessType: 'ecommerce'
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching business settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business settings' },
      { status: 500 }
    );
  }
}

// POST/PUT business settings (admin only)
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
      id = 'default',
      theme,
      businessName,
      businessType,
      logoUrl,
      address,
      phone,
      email,
      openingHours,
      googleMapsEmbed,
      latitude,
      longitude,
      primaryColor,
      secondaryColor,
      description,
      socialMedia,
      isMaintenanceMode,
      maintenanceMessage,
      estimatedTime
    } = data;

    await Database.createOrUpdateBusinessSettings({
      id,
      theme,
      businessName,
      businessType,
      logoUrl,
      address,
      phone,
      email,
      openingHours,
      googleMapsEmbed,
      latitude,
      longitude,
      primaryColor,
      secondaryColor,
      description,
      socialMedia,
      isMaintenanceMode,
      maintenanceMessage,
      estimatedTime
    });

    const updated = await Database.getBusinessSettings(id);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating business settings:', error);
    return NextResponse.json(
      { error: 'Failed to update business settings' },
      { status: 500 }
    );
  }
}

// DELETE business settings (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id') || 'default';

    await Database.deleteBusinessSettings(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting business settings:', error);
    return NextResponse.json(
      { error: 'Failed to delete business settings' },
      { status: 500 }
    );
  }
}
