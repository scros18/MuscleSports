'use client';

import { Suspense } from 'react';
import { AuthProvider } from '@/context/auth-context';
import { PerformanceProvider } from '@/context/performance-context';
import { BusinessSettingsProvider } from '@/context/business-settings-context';
import { SiteSettingsProvider } from '@/context/site-settings-context';
import { CartProvider } from '@/context/cart-context';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  try {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <AuthProvider>
          <PerformanceProvider>
            <BusinessSettingsProvider>
              <SiteSettingsProvider>
                <CartProvider>
                  {children}
                </CartProvider>
              </SiteSettingsProvider>
            </BusinessSettingsProvider>
          </PerformanceProvider>
        </AuthProvider>
      </Suspense>
    );
  } catch (error) {
    console.error('Provider error:', error);
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Application</h1>
          <p className="text-gray-600">{String(error)}</p>
        </div>
      </div>
    );
  }
}
