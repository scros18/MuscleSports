import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeLoader } from "@/components/theme-loader";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { PerformanceProvider } from "@/context/performance-context";
import { SiteSettingsProvider } from "@/context/site-settings-context";
import { BusinessSettingsProvider } from "@/context/business-settings-context";
import { ToastProvider } from "@/components/toast";
import { PageTransition } from "@/components/page-transition";
import { DynamicMetadata } from "@/components/dynamic-metadata";
import { generateSEO, generateOrganizationSchema, generateWebsiteSchema, getJsonLdScript } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = generateSEO({
  title: undefined, // Use default
  description: undefined, // Use default
  path: '',
  keywords: [
    'e-commerce',
    'online shopping',
    'buy online',
    'fast shipping',
    'secure checkout',
    'premium products',
    'online store',
  ],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={getJsonLdScript(organizationSchema)}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={getJsonLdScript(websiteSchema)}
        />
      </head>
      <body className={inter.className}>
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
                  </div>
                  </ToastProvider>
                </CartProvider>
              </AuthProvider>
            </PerformanceProvider>
          </SiteSettingsProvider>
        </BusinessSettingsProvider>
      </body>
    </html>
  );
}
