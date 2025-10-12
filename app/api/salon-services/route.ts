import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

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

// GET salon services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId') || 'default';
    const category = searchParams.get('category');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    let services;
    if (category) {
      services = await Database.getSalonServicesByCategory(businessId, category);
    } else if (includeInactive) {
      services = await Database.getAllSalonServices(businessId);
    } else {
      services = await Database.getSalonServices(businessId);
    }

    // Group by category
    const grouped = services.reduce((acc: any, service: any) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }
      acc[service.category].push(service);
      return acc;
    }, {});

    return NextResponse.json({
      services,
      grouped,
      categories: Object.keys(grouped).sort()
    });
  } catch (error) {
    console.error('Error fetching salon services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch salon services' },
      { status: 500 }
    );
  }
}

// POST new salon service (admin only)
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
      category,
      name,
      description,
      price,
      durationMinutes,
      isActive = true,
      displayOrder = 0
    } = data;

    if (!category || !name || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: category, name, price' },
        { status: 400 }
      );
    }

    const id = randomUUID();

    await Database.createSalonService({
      id,
      businessId,
      category,
      name,
      description,
      price: parseFloat(price),
      durationMinutes,
      isActive,
      displayOrder
    });

    const created = await Database.getSalonServiceById(id);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Error creating salon service:', error);
    return NextResponse.json(
      { error: 'Failed to create salon service' },
      { status: 500 }
    );
  }
}
