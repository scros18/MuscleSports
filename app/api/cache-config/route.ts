import { NextResponse } from 'next/server';
import { Database } from '@/lib/database';

// Public API to get cache configuration (no auth needed - used by middleware)
export async function GET() {
  try {
    const settings = await Database.getCacheSettings('default');
    
    // Return basic cache config that can be used client-side or in middleware
    return NextResponse.json({
      enabled: settings?.enabled ?? true,
      cacheTtl: settings?.cacheTtl ?? 3600,
      excludeUrls: settings?.excludeUrls ?? ['/admin', '/api', '/checkout', '/cart'],
      browserCache: settings?.browserCache ?? true,
      gzipCompression: settings?.gzipCompression ?? true,
    });
  } catch (error) {
    // Return defaults if database fails
    return NextResponse.json({
      enabled: true,
      cacheTtl: 3600,
      excludeUrls: ['/admin', '/api', '/checkout', '/cart'],
      browserCache: true,
      gzipCompression: true,
    });
  }
}

