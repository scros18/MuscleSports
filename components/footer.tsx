"use client";

import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { useSiteSettings } from "@/context/site-settings-context";
import { useState, useEffect } from "react";

export function Footer() {
  const { settings } = useSiteSettings();
  const [currentTheme, setCurrentTheme] = useState<string>('ordify');

  // Detect theme from documentElement class
  useEffect(() => {
    const detectTheme = () => {
      // Check both documentElement and body
      const htmlClasses = document.documentElement.classList;
      const bodyClasses = document.body.classList;
      if (htmlClasses.contains('theme-musclesports') || bodyClasses.contains('theme-musclesports')) {
        setCurrentTheme('musclesports');
      } else if (htmlClasses.contains('theme-vera') || bodyClasses.contains('theme-vera')) {
        setCurrentTheme('vera');
      } else {
        setCurrentTheme('ordify');
      }
    };

    detectTheme();
    
    // Watch for theme changes on both elements
    const htmlObserver = new MutationObserver(detectTheme);
    const bodyObserver = new MutationObserver(detectTheme);
    htmlObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      htmlObserver.disconnect();
      bodyObserver.disconnect();
    };
  }, []);

  return (
    <footer className="border-t bg-background">
      <div className="container py-4 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center md:text-left">
            <Image
              src={currentTheme === 'musclesports' 
                ? '/musclesports-logo.png'
                : currentTheme === 'vera'
                ? 'https://i.imgur.com/verarp-logo.png'
                : settings.logoUrl}
              alt={currentTheme === 'musclesports' ? 'MuscleSports' : currentTheme === 'vera' ? 'VeraRP' : settings.siteName}
              width={currentTheme === 'musclesports' ? 256 : 120}
              height={currentTheme === 'musclesports' ? 256 : 40}
              className={currentTheme === 'musclesports' ? 'h-16 w-auto mb-3 mx-auto md:mx-0' : 'h-8 w-auto mb-3 mx-auto md:mx-0'}
              style={currentTheme === 'musclesports' ? {
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1)) brightness(1.05)',
                imageRendering: 'crisp-edges'
              } : undefined}
            />
            <p className="text-sm text-foreground/80">
              {currentTheme === 'musclesports' ? 'Premium Sports Nutrition' : currentTheme === 'vera' ? 'Serious FiveM Roleplay' : settings.tagline}
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-3">Shop</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <Link href="/products" className="hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block">
                  Deals
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <Link href="/contact" className="hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Payment Processors Section */}
        <div className="mb-6">
          <p className="text-center text-xs uppercase tracking-widest font-semibold text-foreground/60 mb-3">Secure Payments</p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {/* PayPal Logo */}
            <div className="group relative hover:scale-110 transition-transform duration-300">
              <img 
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 4.008-.027.15a.806.806 0 0 1-.796.686H8.88a.554.554 0 0 1-.548-.664l1.185-7.524c.063-.402.41-.692.82-.692h.65c2.377 0 4.235-.968 4.77-3.827.205-1.08.142-1.98-.526-2.614-.206-.208-.485-.36-.82-.448.74.05 1.429.164 2.056.484z' fill='%23003087'/%3E%3Cpath d='M12.602 8.478h-3.6a.805.805 0 0 0-.795.68l-.628 3.99a.806.806 0 0 0 .796.933h2.133c1.75 0 3.116-.895 3.47-2.265.172-.653.147-1.27-.15-1.783-.27-.46-.772-.774-1.526-.774.237-.04.465-.12.7-.18z' fill='%23009cde'/%3E%3C/svg%3E" 
                alt="PayPal"
                className="w-10 h-10 md:w-12 md:h-12"
              />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">PayPal</div>
            </div>

            {/* Visa Logo */}
            <div className="group relative hover:scale-110 transition-transform duration-300">
              <img 
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 32'%3E%3Crect width='48' height='32' rx='4' fill='%231434CB'/%3E%3Ctext x='8' y='22' font-size='14' font-weight='bold' fill='white' font-family='Arial'%3EVISA%3C/text%3E%3C/svg%3E" 
                alt="Visa"
                className="w-10 h-10 md:w-12 md:h-12"
              />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">Visa</div>
            </div>

            {/* Mastercard Logo */}
            <div className="group relative hover:scale-110 transition-transform duration-300">
              <img 
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 32'%3E%3Crect width='48' height='32' rx='4' fill='%23000'/%3E%3Ccircle cx='16' cy='16' r='7' fill='%23FF5F00'/%3E%3Ccircle cx='32' cy='16' r='7' fill='%23EB001B'/%3E%3Cellipse cx='24' cy='16' rx='6' ry='7' fill='%23F79E1B'/%3E%3C/svg%3E" 
                alt="Mastercard"
                className="w-10 h-10 md:w-12 md:h-12"
              />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">Mastercard</div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="text-center text-sm text-foreground/70">
          <p>&copy; 2025 {currentTheme === 'musclesports' ? 'MuscleSports' : currentTheme === 'vera' ? 'VeraRP' : 'Ordify Direct Ltd'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
