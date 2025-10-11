import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { PerformanceProvider } from "@/context/performance-context";
import { SiteSettingsProvider } from "@/context/site-settings-context";
import { ToastProvider } from "@/components/toast";
import { PageTransition } from "@/components/page-transition";
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
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();

  return (
    <html lang="en">
      <head>
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
        <SiteSettingsProvider>
          <PerformanceProvider>
            <AuthProvider>
              <CartProvider>
                <ToastProvider>
                <div className="flex min-h-screen flex-col">
                  <Header />
                  <main className="flex-1 relative z-0">
                    <PageTransition>{children}</PageTransition>
                  </main>
                  <Footer />
                </div>
                </ToastProvider>
              </CartProvider>
            </AuthProvider>
          </PerformanceProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
