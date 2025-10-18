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
            <div className="group relative md:hover:scale-110 md:transition-transform md:duration-300">
              <svg 
                viewBox="0 0 24 24" 
                className="w-12 h-8 md:w-14 md:h-9"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3.5 4h12c1.93 0 3.5 1.57 3.5 3.5v8c0 1.93-1.57 3.5-3.5 3.5h-12C1.57 19 0 17.43 0 15.5v-8C0 5.57 1.57 4 3.5 4z" fill="#003087"/>
                <path d="M8.2 8.5c-.2 1.2-.9 1.8-2.1 1.8H5.2l.4-2.4h.9c.7 0 1.1.3 1.2.8l-.5 1.6zm3.5 0c-.2 1.2-.9 1.8-2.1 1.8h-.9l.4-2.4h.9c.7 0 1.1.3 1.2.8l-.5 1.6z" fill="#009cde"/>
                <path d="M14 9.3c0-.3-.3-.5-.6-.5H9.2l-.7 4.2h2.2c1.4 0 2.5-1.1 2.5-2.5 0-.6-.2-1.1-.6-1.5l-.6-.7z" fill="#009cde"/>
              </svg>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 md:group-hover:opacity-100 md:transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">PayPal</div>
            </div>

            {/* Visa Logo */}
            <div className="group relative md:hover:scale-110 md:transition-transform md:duration-300">
              <svg 
                viewBox="0 0 48 32" 
                className="w-12 h-8 md:w-14 md:h-9"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="48" height="32" rx="4" fill="#1A1F71"/>
                <text x="8" y="21" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="white">VISA</text>
              </svg>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 md:group-hover:opacity-100 md:transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">Visa</div>
            </div>

            {/* Mastercard Logo */}
            <div className="group relative md:hover:scale-110 md:transition-transform md:duration-300">
              <svg 
                viewBox="0 0 48 32" 
                className="w-12 h-8 md:w-14 md:h-9"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="48" height="32" rx="4" fill="#000000"/>
                <circle cx="16" cy="16" r="9" fill="#EB001B"/>
                <circle cx="32" cy="16" r="9" fill="#F79E1B"/>
                <ellipse cx="24" cy="16" rx="8" ry="9" fill="#FF5F00"/>
              </svg>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 md:group-hover:opacity-100 md:transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">Mastercard</div>
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
