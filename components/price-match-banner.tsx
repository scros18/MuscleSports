"use client";

import { DollarSign } from "lucide-react";

export function PriceMatchBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white py-2 md:py-3">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex items-center justify-center gap-2 md:gap-3 text-xs md:text-base font-semibold">
          <DollarSign className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <p className="text-center leading-tight md:leading-normal">
            <span className="font-bold">PRICE MATCH GUARANTEE</span>
            <span className="mx-1 md:mx-2 hidden sm:inline">•</span>
            <span className="block sm:inline text-xs md:text-base">Found it cheaper? We&apos;ll match it + give you 5% off!</span>
          </p>
        </div>
      </div>
    </div>
  );
}

