'use client';

import { AuthProvider } from '@/context/auth-context';
import { PerformanceProvider } from '@/context/performance-context';
import { BusinessSettingsProvider } from '@/context/business-settings-context';
import { SiteSettingsProvider } from '@/context/site-settings-context';
import { CartProvider } from '@/context/cart-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
