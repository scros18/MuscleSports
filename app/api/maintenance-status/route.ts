import { NextResponse } from 'next/server';
import { Database } from '@/lib/database';

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
    });
  } catch (error) {
    // If there's an error, assume maintenance mode is off
    return NextResponse.json({
      isMaintenanceMode: false,
      maintenanceMessage: '',
      estimatedTime: ''
    });
  }
}
