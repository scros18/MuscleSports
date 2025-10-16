import { NextRequest, NextResponse } from 'next/server';
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

// GET - Fetch cache statistics
export async function GET(request: NextRequest) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Mock statistics - in production, these would come from actual cache metrics
    const stats = {
      totalSize: '127.5 MB',
      pageCache: {
        size: '45.2 MB',
        entries: 1247,
        hitRate: 94.3
      },
      assetCache: {
        size: '62.8 MB',
        entries: 3521,
        hitRate: 97.1
      },
      databaseCache: {
        size: '19.5 MB',
        entries: 842,
        hitRate: 89.6
      },
      lastCleared: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      compressionRatio: '3.2:1',
      bandwidthSaved: '2.4 GB',
      avgLoadTime: '0.34s',
      improvement: '+76%'
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching cache stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cache statistics' },
      { status: 500 }
    );
  }
}

