import { ThemeLoader } from "@/components/theme-loader";
import { BusinessSettingsProvider } from "@/context/business-settings-context";
import { DynamicMetadata } from "@/components/dynamic-metadata";
import { SiteSettingsProvider } from "@/context/site-settings-context";
import { PerformanceProvider } from "@/context/performance-context";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { NotificationProvider } from "@/context/notification-context";
import { ToastProvider } from "@/components/toast";
import { AdminHeader } from "@/components/admin-header";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100000] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg">
        Skip to main content
      </a>
      <ThemeLoader />
      <BusinessSettingsProvider>
        <DynamicMetadata />
        <SiteSettingsProvider>
          <PerformanceProvider>
            <AuthProvider>
              <NotificationProvider>
                <CartProvider>
                  <ToastProvider>
                    <div className="min-h-screen bg-slate-950 text-slate-100" id="main-content" role="main">
                      <AdminHeader />
                      {children}
                    </div>
                  </ToastProvider>
                </CartProvider>
              </NotificationProvider>
            </AuthProvider>
          </PerformanceProvider>
        </SiteSettingsProvider>
      </BusinessSettingsProvider>
    </>
  );
}
