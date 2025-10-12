"use client";

import { useState, useEffect } from "react";
import { X, ShoppingBag } from "lucide-react";
import Link from "next/link";

export function SaleBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [theme, setTheme] = useState("lumify");

  useEffect(() => {
    // Detect current theme from document classList
    const detectTheme = () => {
      const classList = document.documentElement.classList;
      if (classList.contains('ordify-theme')) setTheme('ordify');
      else if (classList.contains('musclesports-theme')) setTheme('musclesports');
      else if (classList.contains('verap-theme')) setTheme('verap');
      else setTheme('lumify');
    };

    detectTheme();

    // Watch for theme changes
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  if (!isVisible) return null;

  // Theme-specific gradient backgrounds
  const themeGradients = {
    lumify: "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700",
    ordify: "bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900",
    musclesports: "bg-gradient-to-r from-green-500 via-green-600 to-emerald-700",
    verap: "bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800"
  };

  return (
    <div className={`relative ${themeGradients[theme as keyof typeof themeGradients]} text-white shadow-md transition-colors duration-500`}>
      <div className="container px-4 py-2.5">
        <div className="flex items-center justify-center gap-2 text-center">
          <p className="text-sm sm:text-base font-semibold flex items-center gap-2">
            <span className="animate-pulse">🎉</span>
            Special Offer: Save 15% on all items
            <Link 
              href="/products" 
              className="inline-flex items-center hover:scale-110 transition-transform duration-200"
              aria-label="Shop Sale"
            >
              <ShoppingBag className="h-4 w-4 ml-1" />
            </Link>
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-all duration-200 hover:rotate-90"
        aria-label="Close banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
