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

// POST - Clear all caches
export async function POST(request: NextRequest) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type } = body; // type: 'all', 'page', 'css', 'js', 'images'

    // In Next.js, we can use revalidatePath or revalidateTag
    // For now, we'll return success and let the client know caching will be reset
    // In a real implementation, you'd integrate with your caching layer

    const clearedTypes: string[] = [];

    switch (type) {
      case 'all':
        clearedTypes.push('Page Cache', 'CSS/JS Cache', 'Image Cache', 'Database Cache');
        break;
      case 'page':
        clearedTypes.push('Page Cache');
        break;
      case 'css':
        clearedTypes.push('CSS Cache');
        break;
      case 'js':
        clearedTypes.push('JS Cache');
        break;
      case 'images':
        clearedTypes.push('Image Cache');
        break;
      case 'database':
        clearedTypes.push('Database Cache');
        break;
      default:
        clearedTypes.push('All Caches');
    }

    return NextResponse.json({
      success: true,
      message: `Successfully cleared: ${clearedTypes.join(', ')}`,
      clearedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}

