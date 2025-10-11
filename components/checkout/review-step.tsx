"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { useCheckout } from "@/context/checkout-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Check, Package, MapPin, CreditCard, Loader2 } from "lucide-react";

interface ReviewStepProps {
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function ReviewStep({ onBack }: ReviewStepProps) {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { shippingInfo, paymentInfo, discount } = useCheckout();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const tax = totalPrice * 0.2;
  const finalTotal = totalPrice + tax - discount;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setOrderPlaced(true);

    // Clear cart and redirect after success message
    setTimeout(() => {
      clearCart();
      router.push("/");
    }, 3000);
  };

  if (orderPlaced) {
    return (
      <Card className="shadow-lg border-2 border-green-500">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Order Placed Successfully!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. We've sent a confirmation email to{" "}
            <span className="font-medium text-foreground">
              {shippingInfo?.email}
            </span>
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecting to homepage...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Items */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Order Review</h2>
          </div>

          <div className="space-y-4">
            {items.map((item) => {
              const itemAny = item as any;
              const imageSrc = itemAny.images?.[0] || itemAny.image;
              return (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-lg bg-muted/30"
                >
                  <div className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    {imageSrc && (
                      <Image
                        src={imageSrc}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.category}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Shipping Address</h2>
          </div>

          {shippingInfo && (
            <div className="space-y-1 text-sm">
              <p className="font-medium">
                {shippingInfo.firstName} {shippingInfo.lastName}
              </p>
              <p className="text-muted-foreground">{shippingInfo.address}</p>
              {shippingInfo.apartment && (
                <p className="text-muted-foreground">{shippingInfo.apartment}</p>
              )}
              <p className="text-muted-foreground">
                {shippingInfo.city}, {shippingInfo.postalCode}
              </p>
              <p className="text-muted-foreground">{shippingInfo.country}</p>
              <p className="text-muted-foreground mt-2">{shippingInfo.phone}</p>
              <p className="text-muted-foreground">{shippingInfo.email}</p>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="mt-4"
          >
            Edit Address
          </Button>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Payment Method</h2>
          </div>

          {paymentInfo && (
            <div className="space-y-2">
              {paymentInfo.method === "card" && (
                <>
                  <p className="font-medium">Credit/Debit Card</p>
                  <p className="text-sm text-muted-foreground">
                    •••• •••• •••• {paymentInfo.cardNumber?.slice(-4)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {paymentInfo.cardName}
                  </p>
                </>
              )}
              {paymentInfo.method === "paypal" && (
                <p className="font-medium">PayPal</p>
              )}
              {paymentInfo.method === "apple_pay" && (
                <p className="font-medium">Apple Pay</p>
              )}
              {paymentInfo.method === "google_pay" && (
                <p className="font-medium">Google Pay</p>
              )}
              {paymentInfo.method === "klarna" && (
                <p className="font-medium">Klarna - Pay in 3</p>
              )}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="mt-4"
          >
            Edit Payment
          </Button>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="shadow-lg border-2">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Order Total</h2>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
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

            <div className="flex justify-between text-xl">
              <span className="font-bold">Total</span>
              <span className="font-bold text-primary">
                {formatPrice(finalTotal)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Place Order Button */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isProcessing}
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="flex-1 h-14 text-lg font-bold"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Check className="mr-2 w-5 h-5" />
              Place Order | {formatPrice(finalTotal)}
            </>
          )}
        </Button>
      </div>

      {/* Terms */}
      <p className="text-xs text-center text-muted-foreground">
        By placing your order, you agree to our{" "}
        <button className="text-primary hover:underline">Terms of Service</button>{" "}
        and{" "}
        <button className="text-primary hover:underline">Privacy Policy</button>
      </p>
    </div>
  );
}
