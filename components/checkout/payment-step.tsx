"use client";

import { useState } from "react";
import { useCheckout } from "@/context/checkout-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Smartphone,
  Wallet,
} from "lucide-react";

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function PaymentStep({ onNext, onBack }: PaymentStepProps) {
  const { paymentInfo, setPaymentInfo } = useCheckout();
  const [selectedMethod, setSelectedMethod] = useState<string>(
    paymentInfo?.method || "card"
  );
  const [cardInfo, setCardInfo] = useState({
    cardNumber: paymentInfo?.cardNumber || "",
    cardName: paymentInfo?.cardName || "",
    expiryDate: paymentInfo?.expiryDate || "",
    cvv: paymentInfo?.cvv || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentInfo({
      method: selectedMethod as any,
      ...cardInfo,
    });
    onNext();
  };

  const paymentMethods = [
    {
      id: "card",
      name: "Credit or Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, Amex",
      popular: true,
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: Wallet,
      description: "Pay with your PayPal account",
      popular: true,
    },
    {
      id: "apple_pay",
      name: "Apple Pay",
      icon: Smartphone,
      description: "Quick and secure",
      popular: false,
    },
    {
      id: "google_pay",
      name: "Google Pay",
      icon: Smartphone,
      description: "Fast checkout with Google",
      popular: false,
    },
    {
      id: "klarna",
      name: "Klarna",
      icon: Wallet,
      description: "Pay in 3 interest-free installments",
      popular: false,
    },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Card className="shadow-lg">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Payment Method</h2>
              <p className="text-sm text-muted-foreground">
                All transactions are secure and encrypted
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3 mb-6">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedMethod === method.id
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedMethod === method.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{method.name}</span>
                        {method.popular && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === method.id
                          ? "border-primary"
                          : "border-muted-foreground/30"
                      }`}
                    >
                      {selectedMethod === method.id && (
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Card Form (Only shown when card is selected) */}
          {selectedMethod === "card" && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
              <div>
                <Label htmlFor="cardNumber">Card Number *</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardInfo.cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, "");
                    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
                    setCardInfo({ ...cardInfo, cardNumber: formatted });
                  }}
                  maxLength={19}
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="cardName">Cardholder Name *</Label>
                <Input
                  id="cardName"
                  placeholder="JOHN SMITH"
                  value={cardInfo.cardName}
                  onChange={(e) =>
                    setCardInfo({
                      ...cardInfo,
                      cardName: e.target.value.toUpperCase(),
                    })
                  }
                  className="mt-1.5"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={cardInfo.expiryDate}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      const formatted =
                        value.length >= 2
                          ? `${value.slice(0, 2)}/${value.slice(2, 4)}`
                          : value;
                      setCardInfo({ ...cardInfo, expiryDate: formatted });
                    }}
                    maxLength={5}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    value={cardInfo.cvv}
                    onChange={(e) =>
                      setCardInfo({
                        ...cardInfo,
                        cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                      })
                    }
                    maxLength={4}
                    className="mt-1.5"
                    required
                  />
                </div>
              </div>

              {/* Card Logos */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-muted-foreground">
                  We accept:
                </span>
                <div className="flex gap-2">
                  <div className="h-8 px-3 bg-white dark:bg-gray-800 rounded border flex items-center justify-center text-xs font-bold text-blue-600">
                    VISA
                  </div>
                  <div className="h-8 px-3 bg-white dark:bg-gray-800 rounded border flex items-center justify-center">
                    <div className="flex gap-0.5">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                    </div>
                  </div>
                  <div className="h-8 px-3 bg-white dark:bg-gray-800 rounded border flex items-center justify-center text-xs font-bold text-blue-600">
                    AMEX
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PayPal Message */}
          {selectedMethod === "paypal" && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                You'll be redirected to PayPal to complete your purchase securely.
              </p>
            </div>
          )}

          {/* Apple Pay Message */}
          {selectedMethod === "apple_pay" && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border">
              <p className="text-sm">
                Complete your purchase using Touch ID or Face ID.
              </p>
            </div>
          )}

          {/* Google Pay Message */}
          {selectedMethod === "google_pay" && (
            <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border">
              <p className="text-sm">
                Complete your purchase with your saved Google Pay payment method.
              </p>
            </div>
          )}

          {/* Klarna Message */}
          {selectedMethod === "klarna" && (
            <div className="p-4 bg-pink-50 dark:bg-pink-950/20 rounded-lg border border-pink-200 dark:border-pink-900">
              <p className="text-sm text-pink-900 dark:text-pink-100 font-medium mb-1">
                Buy now, pay later with Klarna
              </p>
              <p className="text-xs text-muted-foreground">
                Split your payment into 3 interest-free installments. No fees when you pay on time.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Badges */}
      <div className="flex items-center justify-center gap-6 mt-6 p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium">256-bit SSL</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium">PCI Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          <span className="text-xs font-medium">Fraud Protected</span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Review Order
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
