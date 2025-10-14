"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/cart-context";
import { Truck, X } from "lucide-react";

export function FreeShippingBanner() {
  const { items } = useCart();
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const FREE_SHIPPING_THRESHOLD = 50;
  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const progressPercent = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  useEffect(() => {
    setProgress(progressPercent);
  }, [progressPercent]);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-white py-3 px-4 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-shimmer"></div>
      </div>

      <div className="container mx-auto flex items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          
          <div className="flex-1 min-w-0">
            {remaining > 0 ? (
              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  Add <span className="text-yellow-300 font-bold">£{remaining.toFixed(2)}</span> more for FREE shipping! 🚚
                </p>
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-yellow-300 h-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm font-semibold flex items-center gap-2">
                <span className="animate-bounce">🎉</span>
                You&apos;ve unlocked FREE shipping!
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-white/80 hover:text-white transition-colors p-1"
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

