import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Verify admin access
function verifyAdmin(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    if (decoded.role !== 'admin') {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

// GET - Fetch cache settings
export async function GET(request: NextRequest) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let settings = await Database.getCacheSettings('default');
    
    // If no settings exist, create default settings
    if (!settings) {
      await Database.createOrUpdateCacheSettings({ id: 'default' });
      settings = await Database.getCacheSettings('default');
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching cache settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cache settings' },
      { status: 500 }
    );
  }
}

// POST - Update cache settings
export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    await Database.createOrUpdateCacheSettings({
      id: 'default',
      ...body
    });

    const updatedSettings = await Database.getCacheSettings('default');

    return NextResponse.json({
      success: true,
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Error updating cache settings:', error);
    return NextResponse.json(
      { error: 'Failed to update cache settings' },
      { status: 500 }
    );
  }
}

