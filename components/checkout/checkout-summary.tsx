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
import { Tag, ChevronDown, ChevronUp } from "lucide-react";

export function CheckoutSummary() {
  const { items, totalPrice } = useCart();
  const { promoCode, setPromoCode, discount, setDiscount } = useCheckout();
  const [showItems, setShowItems] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  const shipping = 0; // Free shipping
  const tax = totalPrice * 0.2; // 20% VAT
  const finalTotal = totalPrice + tax - discount;

  const handleApplyPromo = () => {
    // Simulate promo code validation
    const validCodes: { [key: string]: number } = {
      "SAVE10": totalPrice * 0.1,
      "WELCOME20": totalPrice * 0.2,
      "FREESHIP": 5.99,
    };

    if (validCodes[promoInput.toUpperCase()]) {
      setDiscount(validCodes[promoInput.toUpperCase()]);
      setPromoCode(promoInput.toUpperCase());
      setPromoError("");
    } else {
      setPromoError("Invalid promo code");
    }
  };

  return (
    <div className="space-y-4">
      {/* Order Summary Card */}
      <Card className="sticky top-32 shadow-lg">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Order Summary</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowItems(!showItems)}
              className="text-sm"
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

          {/* Items List (Collapsible) */}
          {showItems && (
            <div className="mb-4 space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => {
                const itemAny = item as any;
                const imageSrc = itemAny.images?.[0] || itemAny.image;
                return (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      {imageSrc && (
                        <Image
                          src={imageSrc}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                      <p className="text-sm font-semibold mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <Separator className="my-4" />

          {/* Promo Code */}
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">
              Promo Code
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Enter code"
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value.toUpperCase());
                    setPromoError("");
                  }}
                  className="pl-9"
                  disabled={!!promoCode}
                />
              </div>
              {!promoCode ? (
                <Button onClick={handleApplyPromo} variant="secondary">
                  Apply
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setPromoCode("");
                    setDiscount(0);
                    setPromoInput("");
                  }}
                  variant="ghost"
                >
                  Remove
                </Button>
              )}
            </div>
            {promoError && (
              <p className="text-xs text-red-600 mt-1">{promoError}</p>
            )}
            {promoCode && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {promoCode} applied successfully!
              </p>
            )}
          </div>

          <Separator className="my-4" />

          {/* Price Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
              </span>
              <span className="font-medium">{formatPrice(totalPrice)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium text-green-600">Free</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">VAT (20%)</span>
              <span className="font-medium">{formatPrice(tax)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className="font-medium text-green-600">
                  -{formatPrice(discount)}
                </span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-lg">
              <span className="font-bold">Total</span>
              <span className="font-bold text-primary">
                {formatPrice(finalTotal)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Badges */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>30-day money-back guarantee</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secure SSL encrypted checkout</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
