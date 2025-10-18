import { NextRequest, NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { enabled } = body;

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request: enabled must be a boolean' },
        { status: 400 }
      );
    }

    // Update database
    try {
      await Database.query(
        `UPDATE business_settings 
         SET is_maintenance_mode = ?
         WHERE id = 'default'`,
        [enabled ? 1 : 0]
      );
    } catch (dbError) {
      console.error('Database update failed, using file fallback:', dbError);
      
      // Fallback: write to a file
      const maintenancePath = path.join(process.cwd(), '.maintenance');
      if (enabled) {
        fs.writeFileSync(maintenancePath, 'true');
      } else {
        if (fs.existsSync(maintenancePath)) {
          fs.unlinkSync(maintenancePath);
        }
      }
    }

    return NextResponse.json({
      success: true,
      enabled,
      message: enabled
        ? 'Maintenance mode enabled. Site is now down for visitors.'
        : 'Maintenance mode disabled. Site is now live.'
    });
  } catch (error) {
    console.error('Error toggling maintenance mode:', error);
    return NextResponse.json(
      { error: 'Failed to toggle maintenance mode' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    let isMaintenanceMode = false;

    // Check database first
    try {
      const rows: any = await Database.query(
        `SELECT is_maintenance_mode FROM business_settings WHERE id = 'default'`
      );
      if (Array.isArray(rows) && rows.length > 0) {
        isMaintenanceMode = rows[0].is_maintenance_mode === 1;
      }
    } catch (dbError) {
      console.error('Database check failed, using file fallback:', dbError);
      
      // Fallback: check file
      const maintenancePath = path.join(process.cwd(), '.maintenance');
      isMaintenanceMode = fs.existsSync(maintenancePath);
    }

    return NextResponse.json({
      isMaintenanceMode
    });
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
    return NextResponse.json(
      { error: 'Failed to check maintenance mode', isMaintenanceMode: false },
      { status: 500 }
    );
  }
}
