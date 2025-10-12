"use client";

import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { useSiteSettings } from "@/context/site-settings-context";
import { useState, useEffect } from "react";

export function Footer() {
  const { settings } = useSiteSettings();
  const [currentTheme, setCurrentTheme] = useState<string>('ordify');

  // Detect theme from body class
  useEffect(() => {
    const detectTheme = () => {
      const bodyClasses = document.body.classList;
      if (bodyClasses.contains('theme-musclesports')) {
        setCurrentTheme('musclesports');
      } else {
        setCurrentTheme('ordify');
      }
    };

    detectTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center md:text-left">
            <Image
              src={currentTheme === 'musclesports' 
                ? 'https://musclesports.co.uk/wp-content/uploads/2025/07/Logo_resized-1.jpg'
                : settings.logoUrl}
              alt={currentTheme === 'musclesports' ? 'MuscleSports' : settings.siteName}
              width={120}
              height={40}
              className="h-10 w-auto mb-4 mx-auto md:mx-0"
            />
            <p className="text-sm text-muted-foreground">
              {currentTheme === 'musclesports' ? 'Premium Sports Nutrition' : settings.tagline}
            </p>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/products" className="hover:text-foreground">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-foreground">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-foreground">
                  Deals
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-foreground">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-foreground">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
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

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Ordify Direct Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
