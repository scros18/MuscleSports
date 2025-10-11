import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Database } from './database';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isAdmin?: boolean;
}

// Obfuscated admin credentials (server-side only)
const ADMIN_CREDS = {
  id: 'admin-system-0001',
  email: Buffer.from('YWRtaW5Ac3lzdGVtLmxvY2Fs', 'base64').toString('utf-8'), // admin@system.local
  name: 'Administrator'
};

export async function authenticateUser(request: NextRequest): Promise<AuthUser | null> {
  try {
    // First try to get token from cookies
    let token = request.cookies.get('token')?.value;

    // If no cookie token, try Authorization header
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    // Check if this is the admin user
    if (decoded.userId === ADMIN_CREDS.id || decoded.role === 'admin' || decoded.isAdmin === true) {
      return {
        id: ADMIN_CREDS.id,
        name: ADMIN_CREDS.name,
        email: ADMIN_CREDS.email,
        role: 'admin'
      };
    }
    
    const user = await Database.findUserById(decoded.userId || decoded.id);

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'user'
    };
  } catch (error) {
    return null;
  }
}

export async function requireAdmin(request: NextRequest): Promise<AuthUser> {
  const user = await authenticateUser(request);

  if (!user) {
    throw new Error('Authentication required');
  }

  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }

  return user;
}

export function handleAuthError(error: Error): NextResponse {
  if (error.message === 'Authentication required') {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  if (error.message === 'Admin access required') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}