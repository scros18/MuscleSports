import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/cart-context';
import { AuthProvider } from '@/context/auth-context';
import { PerformanceProvider } from '@/context/performance-context';
import { BusinessSettingsProvider } from '@/context/business-settings-context';
import { SiteSettingsProvider } from '@/context/site-settings-context';
import { DynamicMetadata } from '@/components/dynamic-metadata';
import { DynamicPageTitle } from '@/components/dynamic-page-title';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export const metadata: Metadata = {
  title: 'MuscleSports | Premium Sports Nutrition & Supplements',
  description: 'Premium sports nutrition and supplements. Quality products for athletes and fitness enthusiasts. Fast shipping, secure checkout.',
  keywords: 'sports nutrition, supplements, protein, fitness, muscle building, workout, pre-workout, post-workout',
  authors: [{ name: 'MuscleSports' }],
  creator: 'MuscleSports',
  publisher: 'MuscleSports',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://musclesports.co.uk'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://musclesports.co.uk',
    siteName: 'MuscleSports',
    title: 'MuscleSports | Premium Sports Nutrition & Supplements',
    description: 'Premium sports nutrition and supplements. Quality products for athletes and fitness enthusiasts.',
    images: [
      {
        url: '/musclesports-logo.png',
        width: 1200,
        height: 630,
        alt: 'MuscleSports - Premium Sports Nutrition',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@musclesports',
    creator: '@musclesports',
    title: 'MuscleSports | Premium Sports Nutrition & Supplements',
    description: 'Premium sports nutrition and supplements. Quality products for athletes and fitness enthusiasts.',
    images: ['/musclesports-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        <link rel="dns-prefetch" href="//www.tropicanawholesale.com" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/musclesports-logo.png" as="image" type="image/png" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#059669" />
        <meta name="color-scheme" content="light dark" />
        
        {/* Viewport optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        {/* Critical CSS */}
        <style dangerouslySetInnerHTML={{
          __html: `
            *{box-sizing:border-box}
            html{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.5;-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
            body{margin:0;padding:0;background-color:#ffffff;color:#000000}
            .container{max-width:1200px;margin:0 auto;padding:0 1rem}
            .btn{display:inline-flex;align-items:center;justify-content:center;border-radius:0.375rem;font-weight:500;transition:all 0.2s;cursor:pointer;border:none;text-decoration:none}
            .btn-primary{background-color:#059669;color:white;padding:0.5rem 1rem}
            .btn-primary:hover{background-color:#047857}
            .card{background:white;border-radius:0.5rem;box-shadow:0 1px 3px 0 rgba(0,0,0,0.1);overflow:hidden}
            img{max-width:100%;height:auto;display:block}
            h1,h2,h3,h4,h5,h6{margin:0;font-weight:600;line-height:1.25}
            p{margin:0;line-height:1.6}
            @media (max-width:640px){.container{padding:0 0.75rem}}
          `
        }} />
      </head>
      <body className={inter.className} suppressHydrationWarning>
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
                    <Toaster />
                    <DynamicMetadata />
                    <DynamicPageTitle />
                  </CartProvider>
                </SiteSettingsProvider>
              </BusinessSettingsProvider>
            </PerformanceProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}