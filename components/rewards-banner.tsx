"use client";

import { useState, useEffect } from "react";
import { Gift, X, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function RewardsBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner
    const dismissed = localStorage.getItem('rewards_banner_dismissed');
    if (!dismissed) {
      // Show banner after 2 seconds
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('rewards_banner_dismissed', 'true');
  };

  if (isDismissed || !isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[99998] w-[calc(100vw-2rem)] max-w-sm animate-slide-in-up">
      <div className="bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-600 rounded-2xl shadow-2xl p-1">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 relative">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg">Rewards Program</h3>
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs">
                  New!
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Earn points with every purchase and unlock exclusive rewards!
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  £1 = 10pts
                </div>
                <div className="text-xs text-muted-foreground">Every Purchase</div>
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  500pts
                </div>
                <div className="text-xs text-muted-foreground">= £5 Off</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-purple-600" />
              <span>Double points on first order</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-fuchsia-600" />
              <span>Birthday bonus: 1000 points</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Gift className="w-4 h-4 text-violet-600" />
              <span>Exclusive member-only deals</span>
            </div>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold"
            onClick={() => window.location.href = '/register'}
          >
            Join Free Now
          </Button>
        </div>
      </div>
    </div>
  );
}

