import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // ONLY allow these paths during maintenance mode:
  // - /admin/* (admin panel access)
  // - /login (for admin login)
  // - /api/* (API routes needed for admin)
  // - /_next/* (Next.js assets)
  // - /favicon.ico (favicon)
  // - /maintenance (the maintenance page itself)
  const isAdminPath = pathname.startsWith('/admin');
  const isLoginPath = pathname.startsWith('/login');
  const isApiPath = pathname.startsWith('/api');
  const isNextAsset = pathname.startsWith('/_next');
  const isPublicAsset = pathname.startsWith('/public') || pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico|css|js)$/);
  const isFavicon = pathname.startsWith('/favicon');
  const isMaintenancePage = pathname.startsWith('/maintenance');
  
  // Skip maintenance check for admin, login, API, and system routes
  if (isAdminPath || isLoginPath || isApiPath || isNextAsset || isPublicAsset || isFavicon || isMaintenancePage) {
    return NextResponse.next();
  }

  try {
    // Check maintenance mode via public API endpoint
    // Use HTTP for internal server requests to avoid SSL issues
    const protocol = process.env.NODE_ENV === 'production' ? 'http' : 'http';
    const host = request.headers.get('host') || 'localhost:3000';
    const apiUrl = `${protocol}://${host}/api/maintenance-status`;
    
    const maintenanceResponse = await fetch(apiUrl, {
      headers: request.headers,
      cache: 'no-store', // Prevent caching
      next: { revalidate: 0 } // Always fetch fresh data
    });

    if (maintenanceResponse.ok) {
      const maintenanceData = await maintenanceResponse.json();
      
      if (maintenanceData.isMaintenanceMode) {
        // BLOCK EVERYONE - redirect to maintenance page
        const maintenanceUrl = new URL('/maintenance', request.url);
        
        return NextResponse.redirect(maintenanceUrl);
      }
    }
  } catch (error) {
    // If there's an error checking maintenance mode, continue normally
    console.error('Error checking maintenance mode:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match ALL request paths
     * Maintenance mode will block everything except /admin
     */
    '/(.*)',
  ],
};
