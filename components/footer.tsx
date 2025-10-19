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
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-5">
            {/* PayPal Logo - Authentic Design */}
            <div className="group relative md:hover:scale-105 md:transition-transform md:duration-200">
              <svg 
                viewBox="0 0 124 33" 
                className="w-16 h-10"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="124" height="33" rx="4" fill="white"/>
                <g transform="translate(8, 8)">
                  {/* First P */}
                  <path d="M15.5 0.5C17.9 0.5 19.8 1.1 21 2.4C22.1 3.6 22.5 5.3 22.1 7.5C21.5 10.7 19.8 12.9 17.1 14C15.7 14.7 13.9 15 11.8 15H9.2C8.6 15 8.1 15.4 8 16L6.8 23H3.5L6.8 4.5C7 3.3 8 2.5 9.2 2.5H15.5Z" fill="#003087"/>
                  <path d="M11.5 5.5C11.3 5.5 11.1 5.7 11 5.9L10.2 11C10.2 11.2 10.3 11.5 10.6 11.5H12.3C13.5 11.5 14.5 11.2 15.2 10.7C15.9 10.1 16.3 9.2 16.5 8C16.7 7 16.6 6.3 16.1 5.8C15.6 5.4 14.8 5.2 13.6 5.2H11.5V5.5Z" fill="#003087"/>
                  {/* Second P */}
                  <path d="M30.5 0.5C32.9 0.5 34.8 1.1 36 2.4C37.1 3.6 37.5 5.3 37.1 7.5C36.5 10.7 34.8 12.9 32.1 14C30.7 14.7 28.9 15 26.8 15H24.2C23.6 15 23.1 15.4 23 16L21.8 23H18.5L21.8 4.5C22 3.3 23 2.5 24.2 2.5H30.5Z" fill="#009CDE"/>
                  <path d="M26.5 5.5C26.3 5.5 26.1 5.7 26 5.9L25.2 11C25.2 11.2 25.3 11.5 25.6 11.5H27.3C28.5 11.5 29.5 11.2 30.2 10.7C30.9 10.1 31.3 9.2 31.5 8C31.7 7 31.6 6.3 31.1 5.8C30.6 5.4 29.8 5.2 28.6 5.2H26.5V5.5Z" fill="#009CDE"/>
                  {/* a */}
                  <path d="M47 7.5C46.8 8.7 46.2 9.6 45.3 10.3C44.4 11 43.2 11.3 41.8 11.3C40.8 11.3 40 11.1 39.5 10.6C39 10.1 38.8 9.4 39 8.5C39.2 7.3 39.8 6.4 40.7 5.7C41.6 5 42.8 4.7 44.2 4.7C45.2 4.7 46 4.9 46.5 5.4C47 5.9 47.2 6.6 47 7.5ZM51.5 4.5L49.5 15H46.2L46.5 13.5C45.8 14.2 45 14.7 44.1 15C43.2 15.3 42.2 15.5 41.1 15.5C39.4 15.5 38 15 37 14.1C36 13.2 35.6 11.9 35.9 10.3C36.2 8.5 37 7 38.4 5.9C39.8 4.8 41.6 4.2 43.8 4.2C45 4.2 46 4.4 46.8 4.8L47.2 2.5H51.5V4.5Z" fill="#003087"/>
                  {/* l */}
                  <path d="M58 0L55.5 15H52L54.5 0H58Z" fill="#009CDE"/>
                </g>
              </svg>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 md:group-hover:opacity-100 md:transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">PayPal</div>
            </div>

            {/* Visa Logo - Authentic Design */}
            <div className="group relative md:hover:scale-105 md:transition-transform md:duration-200">
              <svg 
                viewBox="0 0 80 26" 
                className="w-16 h-10"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="80" height="26" rx="4" fill="#1A1F71"/>
                <g transform="translate(10, 6)">
                  {/* V */}
                  <path d="M0 0L6 14H9.5L15.5 0H11.5L7.8 9.5L4 0H0Z" fill="#FFFFFF"/>
                  {/* i */}
                  <path d="M17 0L13.5 14H17.5L21 0H17Z" fill="#F7B600"/>
                  {/* s */}
                  <path d="M31 3.5C30.5 3.3 29.7 3 28.5 3C25.5 3 23.3 4.5 23.3 7C23.3 8.8 25 9.8 26.2 10.3C27.5 10.8 28 11.2 28 11.7C28 12.5 27 12.8 26 12.8C24.5 12.8 23.7 12.5 22.5 12L22 11.8L21.5 14.2C22.3 14.5 23.7 14.8 25.2 14.8C28.5 14.8 30.5 13.3 30.5 10.5C30.5 9.2 29.7 8.2 28 7.5C27 7 26.3 6.7 26.3 6.2C26.3 5.7 26.8 5.2 28 5.2C29 5.2 29.7 5.4 30.3 5.7L30.7 5.8L31 3.5Z" fill="#FFFFFF"/>
                  {/* a */}
                  <path d="M38.5 0C37.8 0 37.2 0.3 36.8 1L31 14H34.3L35 12H39L39.5 14H42.5L40 0H38.5ZM36 9.5L37.5 5L38.5 9.5H36Z" fill="#F7B600"/>
                </g>
              </svg>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 md:group-hover:opacity-100 md:transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">Visa</div>
            </div>

            {/* Mastercard Logo - Authentic Design */}
            <div className="group relative md:hover:scale-105 md:transition-transform md:duration-200">
              <svg 
                viewBox="0 0 80 50" 
                className="w-16 h-10"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="80" height="50" rx="4" fill="transparent"/>
                <g transform="translate(15, 10)">
                  {/* Red Circle */}
                  <circle cx="15" cy="15" r="15" fill="#EB001B"/>
                  {/* Orange Circle */}
                  <circle cx="35" cy="15" r="15" fill="#F79E1B"/>
                  {/* Overlap Orange */}
                  <path d="M25 4.5C28.5 7.5 30.5 11.5 30.5 15.5C30.5 19.5 28.5 23.5 25 26.5C21.5 23.5 19.5 19.5 19.5 15.5C19.5 11.5 21.5 7.5 25 4.5Z" fill="#FF5F00"/>
                </g>
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
