import { NextResponse } from 'next/server';
import { Database } from '@/lib/database';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await Database.getBusinessSettings('default');
    const isMaintenanceMode = settings?.isMaintenanceMode || false;
    const maintenanceMessage = settings?.maintenanceMessage || '';
    const estimatedTime = settings?.estimatedTime || '';
    
    return NextResponse.json({
      isMaintenanceMode,
      maintenanceMessage,
      estimatedTime
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    // If there's an error, assume maintenance mode is off
    return NextResponse.json({
      isMaintenanceMode: false,
      maintenanceMessage: '',
      estimatedTime: ''
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}
