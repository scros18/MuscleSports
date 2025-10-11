"use client";

import { useState } from "react";
import { useCheckout } from "@/context/checkout-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserCircle, Mail, ArrowRight } from "lucide-react";

interface GuestLoginStepProps {
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function GuestLoginStep({ onNext }: GuestLoginStepProps) {
  const { isGuest, setIsGuest } = useCheckout();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleContinueAsGuest = () => {
    if (email && email.includes("@")) {
      onNext();
    }
  };

  const handleLogin = () => {
    // Simulate login
    setIsGuest(false);
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Guest Checkout Card */}
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Continue as Guest</h2>
              <p className="text-sm text-muted-foreground">
                Quick checkout without creating an account. You can create one later!
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="guest-email">Email Address *</Label>
              <Input
                id="guest-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 h-11"
              />
              <p className="text-xs text-muted-foreground mt-1">
                We'll send your order confirmation here
              </p>
            </div>

            <Button
              onClick={handleContinueAsGuest}
              disabled={!email || !email.includes("@")}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              Continue as Guest
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* OR Divider */}
      <div className="relative">
        <Separator />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4">
          <span className="text-sm font-medium text-muted-foreground">OR</span>
        </div>
      </div>

      {/* Login Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <UserCircle className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Sign In</h2>
              <p className="text-sm text-muted-foreground">
                Faster checkout with saved addresses and payment methods
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="login-email">Email Address</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="your@email.com"
                value={password ? email : ""}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <Label htmlFor="password">Password</Label>
                <button className="text-xs text-primary hover:underline">
                  Forgot?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              onClick={handleLogin}
              variant="secondary"
              className="w-full"
            >
              Sign In
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button className="text-primary font-medium hover:underline">
                Create one
              </button>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-900">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Why create an account?</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Track your orders in real-time</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Save addresses for faster checkout</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Get exclusive member-only offers</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Earn rewards points on every purchase</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
