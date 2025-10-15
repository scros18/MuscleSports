"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { useCheckout } from "@/context/checkout-context";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  ShoppingBag, 
  Truck, 
  Percent, 
  Shield, 
  Lock,
  CheckCircle,
  Sparkles,
  Gift
} from "lucide-react";

export function CheckoutSummary() {
  const { items, totalPrice } = useCart();
  const { promoCode, setPromoCode, discount, setDiscount } = useCheckout();
  const [showItems, setShowItems] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  const shipping = 0; // Free shipping
  const tax = totalPrice * 0.2; // 20% VAT
  const finalTotal = totalPrice + tax - discount;

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    try {
      const response = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: promoInput.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        const discountAmount = totalPrice * (data.discountPercentage / 100);
        setDiscount(discountAmount);
        setPromoCode(data.code);
        setPromoError("");
        setPromoInput("");
      } else {
        const error = await response.json();
        setPromoError(error.message || "Invalid promo code");
      }
    } catch (error) {
      console.error("Error validating promo code:", error);
      setPromoError("Failed to validate promo code");
    }
  };

  return (
    <div className="space-y-4 lg:sticky lg:top-32">
      {/* Enhanced Order Summary Card */}
      <Card className="shadow-xl border-2 border-primary/10">
        <CardContent className="p-4 md:p-6">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Order Summary
                </h2>
                <p className="text-sm text-muted-foreground">
                  {items.reduce((sum, item) => sum + item.quantity, 0)} items
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowItems(!showItems)}
              className="text-sm hover:bg-primary/10 transition-colors duration-200"
            >
              {showItems ? (
                <>
                  Hide <ChevronUp className="ml-1 w-4 h-4" />
                </>
              ) : (
                <>
                  Show ({items.length}) <ChevronDown className="ml-1 w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {/* Enhanced Items List */}
          {showItems && (
            <div className="mb-6 space-y-4 max-h-80 overflow-y-auto pr-2">
              {items.map((item, index) => {
                const itemAny = item as any;
                const imageSrc = itemAny.images?.[0] || itemAny.image;
                return (
                  <div 
                    key={item.id} 
                    className="flex gap-4 p-3 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 border border-border/50 hover:border-primary/20 transition-all duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex-shrink-0 shadow-sm">
                      {imageSrc && (
                        <Image
                          src={imageSrc}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white text-xs flex items-center justify-center font-bold shadow-lg">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-base font-semibold line-clamp-2 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">{item.category}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(item.price)} × {item.quantity}
                        </p>
                        <p className="text-base font-bold text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Separator className="my-6" />

          {/* Enhanced Promo Code Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Percent className="w-4 h-4 text-white" />
              </div>
              <label className="text-base font-semibold">
                Promo Code
              </label>
              {promoCode && (
                <div className="flex items-center gap-1 text-xs bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  <span className="font-medium">Active</span>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter promo code"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value.toUpperCase());
                      setPromoError("");
                    }}
                    className="pl-10 h-11"
                    disabled={!!promoCode}
                  />
                </div>
                {!promoCode ? (
                  <Button 
                    onClick={handleApplyPromo} 
                    variant="secondary"
                    className="h-11 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                  >
                    Apply
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setPromoCode("");
                      setDiscount(0);
                      setPromoInput("");
                    }}
                    variant="outline"
                    className="h-11 px-6 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                )}
              </div>
              
              {promoError && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">!</span>
                  {promoError}
                </div>
              )}
              
              {promoCode && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">{promoCode} applied successfully! You saved {formatPrice(discount)}</span>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Enhanced Price Breakdown */}
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
                </span>
              </div>
              <span className="font-semibold text-base">{formatPrice(totalPrice)}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-green-600" />
                <span className="text-sm text-muted-foreground">Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium">
                  FREE
                </span>
                <span className="font-semibold text-green-600">£0.00</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-2">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">VAT (20%)</span>
              </div>
              <span className="font-semibold text-base">{formatPrice(tax)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between items-center py-2 bg-green-50 dark:bg-green-950/20 rounded-lg px-3">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 dark:text-green-300 font-medium">Discount ({promoCode})</span>
                </div>
                <span className="font-bold text-green-600 text-lg">
                  -{formatPrice(discount)}
                </span>
              </div>
            )}

            <Separator className="my-4" />

            <div className="flex justify-between items-center py-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl px-4">
              <span className="text-xl font-bold">Total</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {formatPrice(finalTotal)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Trust Badges */}
      <Card className="bg-gradient-to-br from-muted/30 to-muted/10 border-2 border-primary/10">
        <CardContent className="p-4 md:p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold mb-2">Your Purchase is Protected</h3>
            <p className="text-sm text-muted-foreground">
              Shop with confidence knowing you&apos;re fully protected
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                  30-day guarantee
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Money-back promise
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  SSL encrypted
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Secure checkout
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
