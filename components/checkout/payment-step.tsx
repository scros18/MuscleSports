"use client";

import { useState, useEffect } from "react";
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
  Shield,
  Lock,
  CheckCircle,
  Sparkles,
  Zap,
} from "lucide-react";

// Card brand detection function
const getCardBrand = (cardNumber: string) => {
  const number = cardNumber.replace(/\s/g, '');
  if (number.startsWith('4')) return 'visa';
  if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
  if (number.startsWith('3')) return 'amex';
  return 'generic';
};

// Card brand icon component
const CardBrandIcon = ({ cardNumber }: { cardNumber: string }) => {
  const brand = getCardBrand(cardNumber);
  
  if (brand === 'visa') {
    return (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="#1434CB" d="M9.04 8.04h5.93v7.92H9.04z"/>
          <path fill="#1434CB" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2.15 5.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v3c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5v-3z"/>
        </svg>
      </div>
    );
  }
  
  if (brand === 'mastercard') {
    return (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <circle cx="9" cy="12" r="6" fill="#EB001B"/>
          <circle cx="15" cy="12" r="6" fill="#F79E1B"/>
          <path d="M12 6.5c1.5 0 2.8.8 3.5 2-1.4 1.4-3.5 1.4-4.9 0-.7-1.2 2-2 3.5-2z" fill="#FF5F00"/>
        </svg>
      </div>
    );
  }
  
  if (brand === 'amex') {
    return (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="#006FCF" d="M2 6h20v12H2z"/>
          <path fill="#fff" d="M4 8h16v8H4z"/>
          <text x="12" y="14" textAnchor="middle" fontSize="8" fill="#006FCF" fontWeight="bold">AMEX</text>
        </svg>
      </div>
    );
  }
  
  return <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />;
};

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function PaymentStep({ onNext, onBack }: PaymentStepProps) {
  const { paymentInfo, setPaymentInfo } = useCheckout();
  const [selectedMethod, setSelectedMethod] = useState<string>(
    paymentInfo?.method || "paypal"
  );
  const [cardInfo, setCardInfo] = useState({
    cardNumber: paymentInfo?.cardNumber || "",
    cardName: paymentInfo?.cardName || "",
    expiryDate: paymentInfo?.expiryDate || "",
    cvv: paymentInfo?.cvv || "",
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);

  // Smooth animation for card form
  useEffect(() => {
    if (selectedMethod === "paypal_card") {
      setIsAnimating(true);
      setTimeout(() => setShowCardForm(true), 100);
    } else {
      setShowCardForm(false);
      setIsAnimating(false);
    }
  }, [selectedMethod]);

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
      id: "paypal",
      name: "PayPal Checkout",
      icon: Wallet,
      description: "Pay with your PayPal account",
      popular: true,
      benefits: ["Instant checkout", "Buyer protection", "No fees"],
      color: "blue",
    },
    {
      id: "paypal_card",
      name: "PayPal Debit & Credit",
      icon: CreditCard,
      description: "PayPal powered card processing",
      popular: true,
      benefits: ["All major cards", "Secure processing", "Instant confirmation"],
      color: "green",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mobile-First Header */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Choose Payment Method
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Secure & encrypted transactions
              </p>
            </div>
          </div>
          
          {/* Mobile Trust Indicators */}
          <div className="flex items-center justify-center md:justify-start gap-4 mt-4 mb-6">
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Shield className="w-4 h-4" />
              <span className="font-medium">Secure</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <Lock className="w-4 h-4" />
              <span className="font-medium">Encrypted</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-purple-600">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Protected</span>
            </div>
          </div>
        </div>

        {/* Enhanced Payment Methods */}
        <div className="grid gap-4 md:gap-6">
          {paymentMethods.map((method, index) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => setSelectedMethod(method.id)}
                className={`group relative w-full text-left p-4 md:p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                  isSelected
                    ? `border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-xl shadow-primary/10`
                    : "border-border hover:border-primary/30 hover:bg-muted/20 hover:shadow-lg"
                }`}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Selection Indicator */}
                <div className="absolute top-4 right-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30 group-hover:border-primary/50"
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>

                {/* Popular Badge */}
                {method.popular && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      POPULAR
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4 md:gap-6 pr-8">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? `bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg`
                        : "bg-muted group-hover:bg-primary/10"
                    }`}
                  >
                    <Icon className="w-7 h-7 md:w-8 md:h-8" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg md:text-xl font-bold">{method.name}</h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground mb-3">
                      {method.description}
                    </p>
                    
                    {/* Benefits */}
                    <div className="flex flex-wrap gap-2">
                      {method.benefits.map((benefit, benefitIndex) => (
                        <div
                          key={benefitIndex}
                          className="flex items-center gap-1 text-xs bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 px-2 py-1 rounded-full"
                        >
                          <Zap className="w-3 h-3" />
                          <span className="font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/5 group-hover:to-primary/5 transition-all duration-300 pointer-events-none" />
              </button>
            );
          })}
        </div>

        {/* Enhanced Card Form */}
        {showCardForm && (
          <div
            className={`space-y-6 p-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl border border-primary/20 shadow-lg transition-all duration-500 ${
              isAnimating ? "animate-in slide-in-from-top-4 fade-in" : ""
            }`}
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Card Information</h3>
              <p className="text-sm text-muted-foreground">
                Your payment is processed securely through PayPal
              </p>
            </div>

            <div className="space-y-5">
              {/* Card Number */}
              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="text-sm font-semibold">
                  Card Number *
                </Label>
                <div className="relative">
                  <CardBrandIcon cardNumber={cardInfo.cardNumber} />
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
                    className="pl-12 h-12 text-lg font-mono"
                    required
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="space-y-2">
                <Label htmlFor="cardName" className="text-sm font-semibold">
                  Cardholder Name *
                </Label>
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
                  className="h-12 text-lg"
                  required
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate" className="text-sm font-semibold">
                    Expiry Date *
                  </Label>
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
                    className="h-12 text-lg font-mono"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv" className="text-sm font-semibold">
                    CVV *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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
                      className="pl-12 h-12 text-lg font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Enhanced Card Logos */}
              <div className="pt-4 border-t border-border/50">
                <div className="text-center mb-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    We accept all major cards
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <div className="h-10 px-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-200 dark:border-blue-800 flex items-center justify-center shadow-sm">
                    <span className="text-sm font-bold text-blue-600">VISA</span>
                  </div>
                  <div className="h-10 px-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-red-200 dark:border-red-800 flex items-center justify-center shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-orange-500" />
                    </div>
                  </div>
                  <div className="h-10 px-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-blue-200 dark:border-blue-800 flex items-center justify-center shadow-sm">
                    <span className="text-sm font-bold text-blue-600">AMEX</span>
                  </div>
                  <div className="h-10 px-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-800 flex items-center justify-center shadow-sm">
                    <span className="text-sm font-bold text-gray-600">MC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Method Messages */}
        {selectedMethod === "paypal" && (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">
                  Secure PayPal Checkout
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  You&apos;ll be redirected to PayPal to complete your purchase securely with buyer protection.
                </p>
                <div className="flex items-center gap-4 text-xs text-blue-700 dark:text-blue-300">
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>Protected</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    <span>Instant</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedMethod === "paypal_card" && !showCardForm && (
          <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-2xl border border-green-200 dark:border-green-800 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-green-900 dark:text-green-100 mb-2">
                  PayPal Card Processing
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200 mb-3">
                  Your card information is processed securely through PayPal&apos;s payment infrastructure with fraud protection.
                </p>
                <div className="flex items-center gap-4 text-xs text-green-700 dark:text-green-300">
                  <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    <span>Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>Protected</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Security Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-green-900 dark:text-green-100">256-bit SSL</p>
              <p className="text-xs text-green-700 dark:text-green-300">Encrypted</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100">PCI Compliant</p>
              <p className="text-xs text-blue-700 dark:text-blue-300">Secure</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-purple-900 dark:text-purple-100">Fraud Protected</p>
              <p className="text-xs text-purple-700 dark:text-purple-300">Monitored</p>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 h-12 text-base font-semibold border-2 hover:bg-muted/50 transition-all duration-200"
          >
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back to Shipping
          </Button>
          <Button 
            type="submit" 
            className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            Review Order
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
