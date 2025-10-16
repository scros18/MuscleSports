// Server-side cache helpers for Next.js
// These are used in API routes and server components

import { Database } from './database';

/**
 * Get cache settings from database with fallback to defaults
 */
export async function getCacheConfig() {
  try {
    const settings = await Database.getCacheSettings('default');
    return settings || getDefaultCacheConfig();
  } catch (error) {
    console.error('Failed to get cache config:', error);
    return getDefaultCacheConfig();
  }
}

/**
 * Default cache configuration
 */
export function getDefaultCacheConfig() {
  return {
    enabled: true,
    pageCache: true,
    cssMinification: true,
    jsMinification: true,
    htmlMinification: true,
    imageLazyLoad: true,
    criticalCss: true,
    removeUnusedCss: false,
    deferJavascript: true,
    preloadFonts: true,
    browserCache: true,
    gzipCompression: true,
    cdnEnabled: false,
    cdnUrl: '',
    preloadKeyRequests: true,
    dnsPrefetch: true,
    dnsPrefetchDomains: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
    preconnectDomains: ['https://fonts.googleapis.com'],
    cacheTtl: 3600,
    excludeUrls: ['/admin', '/api', '/checkout', '/cart'],
    databaseOptimization: false,
  };
}

/**
 * Get cache control headers based on path and settings
 */
export function getCacheControlHeader(pathname: string, settings: any): string {
  if (!settings?.enabled) {
    return 'no-cache, no-store, must-revalidate';
  }

  // Check if path is excluded
  const excluded = settings.excludeUrls?.some((url: string) => 
    pathname.startsWith(url)
  );

  if (excluded) {
    return 'no-cache, no-store, must-revalidate';
  }

  // Apply caching based on settings
  const ttl = settings.cacheTtl || 3600;
  
  if (settings.browserCache) {
    return `public, max-age=${ttl}, s-maxage=${ttl}, stale-while-revalidate=${Math.floor(ttl / 2)}`;
  }

  return 'public, max-age=0, must-revalidate';
}

/**
 * Check if a path should be cached
 */
export function shouldCachePath(pathname: string, excludeUrls: string[] = []): boolean {
  // Never cache these paths
  const neverCache = ['/api', '/admin', '/_next/data'];
  
  for (const path of neverCache) {
    if (pathname.startsWith(path)) return false;
  }

  // Check custom exclusions
  for (const path of excludeUrls) {
    if (pathname.startsWith(path)) return false;
  }

  return true;
}

/**
 * Apply cache settings to Next.js response
 */
export function applyCacheHeaders(pathname: string, settings: any) {
  const headers: Record<string, string> = {};

  if (!settings?.enabled) {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    return headers;
  }

  // Cache-Control header
  headers['Cache-Control'] = getCacheControlHeader(pathname, settings);

  // Vary header for proper caching
  headers['Vary'] = 'Accept-Encoding, Accept';

  // ETag for validation
  headers['ETag'] = `W/"cache-plus-${Date.now()}"`;

  // Additional headers based on settings
  if (settings.gzipCompression) {
    headers['Content-Encoding'] = 'gzip';
  }

  // Server timing for debugging
  if (settings.enabled) {
    headers['Server-Timing'] = 'cache-plus;desc="Enabled"';
  }

  return headers;
}

/**
 * Minify HTML content (basic implementation)
 */
export function minifyHTML(html: string, enabled: boolean = true): string {
  if (!enabled) return html;

  try {
    return html
      // Remove HTML comments (except IE conditionals)
      .replace(/<!--(?!\[if\s)[\s\S]*?-->/g, '')
      // Remove whitespace between tags
      .replace(/>\s+</g, '><')
      // Collapse multiple spaces into one
      .replace(/\s{2,}/g, ' ')
      // Remove leading/trailing whitespace from lines
      .replace(/^\s+|\s+$/gm, '')
      // Trim the whole string
      .trim();
  } catch (error) {
    console.error('HTML minification error:', error);
    return html;
  }
}

/**
 * Get CDN URL for an asset
 */
export function getCDNUrl(assetPath: string, cdnUrl: string | null, cdnEnabled: boolean = false): string {
  if (!cdnEnabled || !cdnUrl) {
    return assetPath;
  }

  // Don't modify external URLs
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
    return assetPath;
  }

  const baseUrl = cdnUrl.replace(/\/$/, '');
  const path = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  
  return `${baseUrl}${path}`;
}

