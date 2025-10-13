import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip maintenance check for admin routes and API routes
  if (pathname.startsWith('/admin') || 
      pathname.startsWith('/api') || 
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon') ||
      pathname === '/maintenance') {
    return NextResponse.next();
  }

  try {
    // Check maintenance mode via public API endpoint
    // Use HTTP for local development, HTTPS for production
    const protocol = request.nextUrl.hostname === 'localhost' ? 'http' : 'https';
    const maintenanceResponse = await fetch(`${protocol}://${request.nextUrl.host}/api/maintenance-status`);

    if (maintenanceResponse.ok) {
      const maintenanceData = await maintenanceResponse.json();
      
      if (maintenanceData.isMaintenanceMode) {
        // Redirect to maintenance page
        const maintenanceUrl = new URL('/maintenance', request.url);
        if (maintenanceData.maintenanceMessage) {
          maintenanceUrl.searchParams.set('message', maintenanceData.maintenanceMessage);
        }
        if (maintenanceData.estimatedTime) {
          maintenanceUrl.searchParams.set('estimatedTime', maintenanceData.estimatedTime);
        }
        
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
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin (admin routes)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|admin).*)',
  ],
};
