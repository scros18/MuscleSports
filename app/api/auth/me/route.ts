import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

// Obfuscated admin credentials (server-side only)
const ADMIN_CREDS = {
  id: 'admin-system-0001',
  email: Buffer.from('YWRtaW5Ac3lzdGVtLmxvY2Fs', 'base64').toString('utf-8'), // admin@system.local
  name: 'Administrator'
};

export async function GET(request: NextRequest) {
  try {
    // First try to authenticate via cookies (for server-side requests)
    let user = await authenticateUser(request);

    // If no user found via cookies, try Authorization header (for client-side requests)
    if (!user) {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7); // Remove "Bearer " prefix

        try {
          const jwt = require('jsonwebtoken');
          const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
          const decoded = jwt.verify(token, JWT_SECRET) as any;

          // Check if this is the admin user
          if (decoded.userId === ADMIN_CREDS.id || decoded.role === 'admin' || decoded.isAdmin === true) {
            user = {
              id: ADMIN_CREDS.id,
              name: ADMIN_CREDS.name,
              email: ADMIN_CREDS.email,
              role: 'admin',
              isAdmin: true,
              createdAt: new Date().toISOString()
            };
          } else {
            const Database = require('@/lib/database').default;
            const dbUser = await Database.findUserById(decoded.userId || decoded.id);

            if (dbUser) {
              user = {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                role: dbUser.role || 'user',
                createdAt: dbUser.created_at ? (dbUser.created_at instanceof Date ? dbUser.created_at.toISOString() : new Date(dbUser.created_at).toISOString()) : new Date().toISOString()
              };
            }
          }
        } catch (error) {
          // Token verification failed, continue with null user
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}