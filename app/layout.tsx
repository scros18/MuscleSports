import type { Metadata, Viewport } from "next";
import { Inter, Saira } from "next/font/google";
import "./globals.css";
import "@/styles/critical.css";
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

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true
});
const saira = Saira({ 
  subsets: ["latin"],
  variable: "--font-saira",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: 'swap',
  preload: true
});

export const metadata: Metadata = {
  ...generateSEO({
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
  }),
  metadataBase: new URL('https://musclesports.co.uk'),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
        
        {/* Critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-the-fold styles */
            .container{width:100%;margin-left:auto;margin-right:auto;padding-left:1rem;padding-right:1rem}
            .sticky{position:sticky}.top-0{top:0}.z-\\[99999\\]{z-index:99999}.w-full{width:100%}.max-w-full{max-width:100%}
            .bg-background\\/70{background-color:hsl(var(--background)/0.7)}.backdrop-blur-2xl{backdrop-filter:blur(40px)}
            .flex{display:flex}.items-center{align-items:center}.justify-between{justify-content:space-between}.justify-center{justify-content:center}
            .h-16{height:4rem}.px-3{padding-left:0.75rem;padding-right:0.75rem}.gap-2{gap:0.5rem}
            .text-xl{font-size:1.25rem;line-height:1.75rem}.font-bold{font-weight:700}.text-white{color:rgb(255 255 255)}
            .inline-flex{display:inline-flex}.whitespace-nowrap{white-space:nowrap}.font-medium{font-weight:500}
            .transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}
            .h-20{height:5rem}.w-auto{width:auto}.object-cover{object-fit:cover}
            @media (min-width:768px){.md\\:h-20{height:5rem}.md\\:px-4{padding-left:1rem;padding-right:1rem}}
            @media (min-width:1024px){.lg\\:h-24{height:6rem}}
          `
        }} />
        
        {/* Preconnect to image CDNs for faster loading */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://img.aosomcdn.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.tropicanawholesale.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.imgur.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://img.aosomcdn.com" />
        <link rel="dns-prefetch" href="https://www.tropicanawholesale.com" />
        <link rel="dns-prefetch" href="https://i.imgur.com" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={getJsonLdScript(organizationSchema)}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={getJsonLdScript(websiteSchema)}
        />
      </head>
      <body className={`${inter.className} ${saira.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
