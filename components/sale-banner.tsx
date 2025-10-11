"use client";

import { useState } from "react";
import { X, ShoppingBag } from "lucide-react";
import Link from "next/link";

export function SaleBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md">
      <div className="container px-4 py-2.5">
        <div className="flex items-center justify-center gap-2 text-center">
          <p className="text-sm sm:text-base font-semibold flex items-center gap-2">
            Special Offer: Save up to 70% on selected items
            <Link 
              href="/products" 
              className="inline-flex items-center hover:scale-110 transition-transform"
              aria-label="Shop Sale"
            >
              <ShoppingBag className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Close banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
