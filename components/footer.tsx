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
          <p className="text-center text-xs uppercase tracking-widest font-semibold text-foreground/60 mb-3">We Accept</p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {/* PayPal */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 px-4 py-2 md:px-5 md:py-2.5 rounded-lg border border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 shadow-md hover:shadow-lg">
                <span className="text-lg md:text-xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">PayPal</span>
              </div>
            </div>

            {/* Stripe */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-800/30 px-4 py-2 md:px-5 md:py-2.5 rounded-lg border border-blue-200 dark:border-blue-700 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg">
                <span className="text-lg md:text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">Stripe</span>
              </div>
            </div>

            {/* Visa */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-700 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 px-4 py-2 md:px-5 md:py-2.5 rounded-lg border border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 shadow-md hover:shadow-lg">
                <span className="text-lg md:text-xl font-black bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Visa</span>
              </div>
            </div>

            {/* Mastercard */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-orange-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-900/30 dark:to-orange-800/30 px-4 py-2 md:px-5 md:py-2.5 rounded-lg border border-red-200 dark:border-red-700 hover:border-orange-400 dark:hover:border-orange-600 transition-all duration-300 shadow-md hover:shadow-lg">
                <span className="text-lg md:text-xl font-black bg-gradient-to-r from-red-600 to-orange-700 bg-clip-text text-transparent">Mastercard</span>
              </div>
            </div>

            {/* Apple Pay */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-900 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30 px-4 py-2 md:px-5 md:py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-all duration-300 shadow-md hover:shadow-lg">
                <span className="text-lg md:text-xl font-black bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">Apple Pay</span>
              </div>
            </div>

            {/* Google Pay */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-red-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-blue-50 to-red-50 dark:from-blue-900/30 dark:to-red-900/30 px-4 py-2 md:px-5 md:py-2.5 rounded-lg border border-blue-200 dark:border-blue-700 hover:border-red-400 dark:hover:border-red-600 transition-all duration-300 shadow-md hover:shadow-lg">
                <span className="text-lg md:text-xl font-black bg-gradient-to-r from-blue-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">Google Pay</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />
      </div>
    </footer>
  );
}
