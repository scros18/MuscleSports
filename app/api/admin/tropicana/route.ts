import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import TropicanaIntegration from '@/lib/tropicana-integration';

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin(request);

    const integration = new TropicanaIntegration();
    await integration.initialize();

    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    switch (action) {
      case 'status':
        const syncStatus = await integration.getSyncStatus();
        const productsCount = await integration.getProductsCount();
        return NextResponse.json({
          success: true,
          data: {
            syncStatus,
            productsCount,
            lastSync: syncStatus[0]?.started_at || null
          }
        });

      case 'products':
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '50');
        const products = await integration.getProductsPaginated(page, limit);
        return NextResponse.json({
          success: true,
          data: { products }
        });

      case 'settings':
        const settings = await integration.getSettings();
        return NextResponse.json({
          success: true,
          data: { settings }
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            message: 'Tropicana Integration API',
            availableActions: ['status', 'products', 'settings']
          }
        });
    }

  } catch (error) {
    console.error('Error in Tropicana admin API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin(request);

    const integration = new TropicanaIntegration();
    await integration.initialize();

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'sync':
        const syncType = body.syncType || 'incremental';
        
        if (syncType === 'full') {
          await integration.performFullSync();
        } else if (syncType === 'incremental') {
          await integration.performIncrementalSync();
        } else if (syncType === 'stock') {
          await integration.performStockCheck();
        }

        return NextResponse.json({
          success: true,
          message: `${syncType} sync completed successfully`
        });

      case 'updateSettings':
        const newSettings = body.settings;
        await integration.updateSettings(newSettings);
        
        return NextResponse.json({
          success: true,
          message: 'Settings updated successfully'
        });

      case 'authenticate':
        const authResult = await integration.authenticate();
        return NextResponse.json({
          success: authResult,
          message: authResult ? 'Authentication successful' : 'Authentication failed'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in Tropicana admin API POST:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
