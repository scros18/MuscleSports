import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageTransition } from "@/components/page-transition";
import { ThemeLoader } from "@/components/theme-loader";
import { BusinessSettingsProvider } from "@/context/business-settings-context";
import { DynamicMetadata } from "@/components/dynamic-metadata";
import { SiteSettingsProvider } from "@/context/site-settings-context";
import { PerformanceProvider } from "@/context/performance-context";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { ToastProvider } from "@/components/toast";
import { LiveChatWidget } from "@/components/live-chat-widget";

export default function MainLayout({
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
              <CartProvider>
                <ToastProvider>
                  <div className="flex min-h-screen flex-col">
                    <Header />
                    <main id="main-content" className="flex-1 relative z-0" role="main">
                      <PageTransition>{children}</PageTransition>
                    </main>
                    <Footer />
                    <LiveChatWidget />
                  </div>
                </ToastProvider>
              </CartProvider>
            </AuthProvider>
          </PerformanceProvider>
        </SiteSettingsProvider>
      </BusinessSettingsProvider>
    </>
  );
}

