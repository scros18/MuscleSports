import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { Database } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    
    const settings = await Database.getBusinessSettings('default');
    const isMaintenanceMode = settings?.isMaintenanceMode || false;
    const maintenanceMessage = settings?.maintenanceMessage || 'We are currently performing scheduled maintenance. Please check back soon!';
    
    return NextResponse.json({
      isMaintenanceMode,
      maintenanceMessage,
      estimatedTime: settings?.estimatedTime || null
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
    
    const body = await request.json();
    const { isMaintenanceMode, maintenanceMessage, estimatedTime } = body;
    
    // Get existing settings first to preserve other fields
    const existingSettings = await Database.getBusinessSettings('default');
    
    await Database.createOrUpdateBusinessSettings({
      id: 'default',
      theme: existingSettings?.theme || 'musclesports',
      isMaintenanceMode: isMaintenanceMode ?? false,
      maintenanceMessage: maintenanceMessage || 'We are currently performing scheduled maintenance. Please check back soon!',
      estimatedTime: estimatedTime || null
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Maintenance mode error:', error);
    return NextResponse.json({ error: 'Failed to update maintenance mode' }, { status: 500 });
  }
}
