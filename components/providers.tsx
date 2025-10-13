'use client';

import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/auth-context';
import { PerformanceProvider } from '@/context/performance-context';
import { BusinessSettingsProvider } from '@/context/business-settings-context';
import { SiteSettingsProvider } from '@/context/site-settings-context';
import { CartProvider } from '@/context/cart-context';
import { DynamicMetadata } from '@/components/dynamic-metadata';
import { DynamicPageTitle } from '@/components/dynamic-page-title';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <PerformanceProvider>
          <BusinessSettingsProvider>
            <SiteSettingsProvider>
              <CartProvider>
                {children}
                <DynamicMetadata />
                <DynamicPageTitle />
              </CartProvider>
            </SiteSettingsProvider>
          </BusinessSettingsProvider>
        </PerformanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
