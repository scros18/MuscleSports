import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // ONLY allow these paths during maintenance mode:
  // - /admin/* (admin panel access)
  // - /api/* (API routes needed for admin)
  // - /_next/* (Next.js assets)
  // - /favicon.ico (favicon)
  // - /maintenance (the maintenance page itself)
  const isAdminPath = pathname.startsWith('/admin');
  const isApiPath = pathname.startsWith('/api');
  const isNextAsset = pathname.startsWith('/_next');
  const isFavicon = pathname.startsWith('/favicon');
  const isMaintenancePage = pathname === '/maintenance';
  
  // Skip maintenance check for admin, API, and system routes
  if (isAdminPath || isApiPath || isNextAsset || isFavicon || isMaintenancePage) {
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
    });

    if (maintenanceResponse.ok) {
      const maintenanceData = await maintenanceResponse.json();
      
      // TEMPORARY TEST - ALWAYS REDIRECT TO MAINTENANCE PAGE
      if (true) {
        // BLOCK EVERYONE - redirect to static maintenance HTML
        const maintenanceUrl = new URL('/maintenance.html', request.url);
        
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
