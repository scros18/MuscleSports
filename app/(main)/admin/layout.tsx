import { ThemeLoader } from "@/components/theme-loader";
import { BusinessSettingsProvider } from "@/context/business-settings-context";
import { DynamicMetadata } from "@/components/dynamic-metadata";
import { SiteSettingsProvider } from "@/context/site-settings-context";
import { PerformanceProvider } from "@/context/performance-context";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { NotificationProvider } from "@/context/notification-context";
import { ToastProvider } from "@/components/toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeLoader />
      <BusinessSettingsProvider>
        <DynamicMetadata />
        <SiteSettingsProvider>
          <PerformanceProvider>
            <AuthProvider>
              <NotificationProvider>
                <CartProvider>
                  <ToastProvider>
                    <div id="main-content" role="main">
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
