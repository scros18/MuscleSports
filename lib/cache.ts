import { Database } from '@/lib/database';

// Cache utility functions for performance optimization

/**
 * Get cache settings from database
 */
export async function getCacheSettings() {
  try {
    return await Database.getCacheSettings('default');
  } catch (error) {
    console.error('Error loading cache settings:', error);
    return null;
  }
}

/**
 * Generate cache headers based on settings
 */
export function getCacheHeaders(settings: any, pathname: string) {
  const headers: Record<string, string> = {};

  if (!settings || !settings.enabled) {
    return headers;
  }

  // Check if URL is excluded
  if (settings.excludeUrls?.some((url: string) => pathname.includes(url))) {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    return headers;
  }

  // Browser cache headers
  if (settings.browserCache) {
    const ttl = settings.cacheTtl || 3600;
    headers['Cache-Control'] = `public, max-age=${ttl}, s-maxage=${ttl}, stale-while-revalidate`;
  }

  // GZIP compression hint
  if (settings.gzipCompression) {
    headers['Accept-Encoding'] = 'gzip, deflate, br';
  }

  // Vary header for optimization
  headers['Vary'] = 'Accept-Encoding';

  // ETag for cache validation
  headers['ETag'] = `"${Date.now()}"`;

  return headers;
}

/**
 * Generate preload/prefetch headers
 */
export function getResourceHints(settings: any) {
  const hints: string[] = [];

  if (!settings || !settings.enabled) {
    return hints;
  }

  // DNS Prefetch
  if (settings.dnsPrefetch && settings.dnsPrefetchDomains) {
    settings.dnsPrefetchDomains.forEach((domain: string) => {
      hints.push(`<link rel="dns-prefetch" href="${domain}" />`);
    });
  }

  // Preconnect
  if (settings.preconnectDomains) {
    settings.preconnectDomains.forEach((domain: string) => {
      hints.push(`<link rel="preconnect" href="${domain}" crossorigin />`);
    });
  }

  // Preload fonts
  if (settings.preloadFonts) {
    // Add common font preloads
    hints.push(`<link rel="preload" as="font" type="font/woff2" crossorigin />`);
  }

  return hints;
}

/**
 * Minify HTML content
 */
export function minifyHTML(html: string, enabled: boolean): string {
  if (!enabled) return html;

  return html
    // Remove comments
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove whitespace between tags
    .replace(/>\s+</g, '><')
    // Remove leading/trailing whitespace
    .replace(/^\s+|\s+$/gm, '')
    // Collapse multiple spaces
    .replace(/\s{2,}/g, ' ');
}

/**
 * Generate critical CSS (simplified version)
 */
export function generateCriticalCSS(enabled: boolean): string {
  if (!enabled) return '';

  return `
    <style id="critical-css">
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:system-ui,-apple-system,sans-serif;line-height:1.5}
      img{max-width:100%;height:auto}
      a{color:inherit;text-decoration:none}
    </style>
  `;
}

/**
 * Add lazy loading attributes to images
 */
export function addLazyLoading(html: string, enabled: boolean): string {
  if (!enabled) return html;

  // Add loading="lazy" to all img tags that don't have it
  return html.replace(
    /<img(?![^>]*loading=)/gi,
    '<img loading="lazy"'
  );
}

/**
 * Defer JavaScript loading
 */
export function deferJavaScript(html: string, enabled: boolean): string {
  if (!enabled) return html;

  // Add defer to script tags that don't have it or async
  return html.replace(
    /<script(?![^>]*(?:defer|async))/gi,
    '<script defer'
  );
}

/**
 * Get CDN URL for asset
 */
export function getCDNUrl(assetPath: string, settings: any): string {
  if (!settings?.cdnEnabled || !settings?.cdnUrl) {
    return assetPath;
  }

  // If asset is already a full URL, return as is
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
    return assetPath;
  }

  // Combine CDN URL with asset path
  const cdnBase = settings.cdnUrl.replace(/\/$/, '');
  const path = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  
  return `${cdnBase}${path}`;
}

/**
 * Apply all optimizations to HTML
 */
export async function optimizeHTML(html: string, pathname: string): Promise<string> {
  const settings = await getCacheSettings();
  
  if (!settings || !settings.enabled) {
    return html;
  }

  let optimized = html;

  // Apply critical CSS
  if (settings.criticalCss) {
    const criticalCSS = generateCriticalCSS(true);
    optimized = optimized.replace('</head>', `${criticalCSS}</head>`);
  }

  // Add resource hints
  const hints = getResourceHints(settings);
  if (hints.length > 0) {
    const hintsHTML = hints.join('\n');
    optimized = optimized.replace('</head>', `${hintsHTML}</head>`);
  }

  // Add lazy loading to images
  if (settings.imageLazyLoad) {
    optimized = addLazyLoading(optimized, true);
  }

  // Defer JavaScript
  if (settings.deferJavascript) {
    optimized = deferJavaScript(optimized, true);
  }

  // Minify HTML
  if (settings.htmlMinification) {
    optimized = minifyHTML(optimized, true);
  }

  return optimized;
}

/**
 * Generate performance metrics
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined') return null;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (!navigation) return null;

  return {
    dns: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
    tcp: Math.round(navigation.connectEnd - navigation.connectStart),
    request: Math.round(navigation.responseStart - navigation.requestStart),
    response: Math.round(navigation.responseEnd - navigation.responseStart),
    dom: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
    load: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
    total: Math.round(navigation.loadEventEnd - navigation.fetchStart),
  };
}

