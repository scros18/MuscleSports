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

// GET single salon service
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const service = await Database.getSalonServiceById(params.id);
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching salon service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch salon service' },
      { status: 500 }
    );
  }
}

// PUT/PATCH update salon service (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      category,
      name,
      description,
      price,
      durationMinutes,
      isActive,
      displayOrder
    } = data;

    await Database.updateSalonService(params.id, {
      category,
      name,
      description,
      price: price !== undefined ? parseFloat(price) : undefined,
      durationMinutes,
      isActive,
      displayOrder
    });

    const updated = await Database.getSalonServiceById(params.id);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating salon service:', error);
    return NextResponse.json(
      { error: 'Failed to update salon service' },
      { status: 500 }
    );
  }
}

export const PATCH = PUT;

// DELETE salon service (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await Database.deleteSalonService(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting salon service:', error);
    return NextResponse.json(
      { error: 'Failed to delete salon service' },
      { status: 500 }
    );
  }
}
