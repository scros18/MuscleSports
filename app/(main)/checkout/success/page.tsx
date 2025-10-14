"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2, XCircle, Home, Package } from "lucide-react";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const capturePayment = async () => {
      const token = searchParams.get("token");
      
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        // Get pending order from sessionStorage
        const pendingOrderStr = sessionStorage.getItem("pendingOrder");
        if (!pendingOrderStr) {
          throw new Error("No pending order found");
        }

        const pendingOrder = JSON.parse(pendingOrderStr);

        // Capture the PayPal payment
        const response = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: pendingOrder.paypalOrderId,
            items: pendingOrder.items,
            shippingInfo: pendingOrder.shippingInfo,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setOrderDetails(data);
          setStatus("success");
          
          // Clear cart and pending order
          clearCart();
          sessionStorage.removeItem("pendingOrder");
          
          // Redirect to home after 5 seconds
          setTimeout(() => {
            router.push("/");
          }, 5000);
        } else {
          throw new Error(data.error || "Payment capture failed");
        }
      } catch (error) {
        console.error("Payment capture error:", error);
        setStatus("error");
      }
    };

    capturePayment();
  }, [searchParams, clearCart, router]);

  if (status === "processing") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg">
          <CardContent className="p-12 text-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-3">Processing Your Payment</h2>
            <p className="text-muted-foreground">
              Please wait while we confirm your PayPal payment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-lg border-2 border-red-500">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Payment Failed</h2>
            <p className="text-muted-foreground mb-6">
              We couldn&apos;t complete your payment. Please try again or contact support.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => router.push("/checkout")} className="w-full">
                Try Again
              </Button>
              <Button variant="outline" onClick={() => router.push("/")} className="w-full">
                <Home className="mr-2 w-4 h-4" />
                Go to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg border-2 border-green-500">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
            Order Placed Successfully!
          </h2>
          <p className="text-muted-foreground mb-2">
            Thank you for your purchase!
          </p>
          {orderDetails?.orderId && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg mb-6">
              <Package className="w-4 h-4 text-primary" />
              <span className="text-sm">
                Order ID: <span className="font-mono font-bold">{orderDetails.orderId}</span>
              </span>
            </div>
          )}
          <p className="text-sm text-muted-foreground mb-8">
            We&apos;ve sent a confirmation email with your order details.
          </p>
          
          <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecting to homepage in 5 seconds...</span>
          </div>
          
          <Button 
            onClick={() => router.push("/")} 
            className="w-full mt-6"
            variant="outline"
          >
            <Home className="mr-2 w-4 h-4" />
            Go to Homepage Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
