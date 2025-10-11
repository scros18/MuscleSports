"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ShippingInfo {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface PaymentInfo {
  method: "card" | "paypal" | "apple_pay" | "google_pay" | "klarna";
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}

interface CheckoutContextType {
  isGuest: boolean;
  setIsGuest: (value: boolean) => void;
  shippingInfo: ShippingInfo | null;
  setShippingInfo: (info: ShippingInfo) => void;
  paymentInfo: PaymentInfo | null;
  setPaymentInfo: (info: PaymentInfo) => void;
  promoCode: string;
  setPromoCode: (code: string) => void;
  discount: number;
  setDiscount: (amount: number) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [isGuest, setIsGuest] = useState(true);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  return (
    <CheckoutContext.Provider
      value={{
        isGuest,
        setIsGuest,
        shippingInfo,
        setShippingInfo,
        paymentInfo,
        setPaymentInfo,
        promoCode,
        setPromoCode,
        discount,
        setDiscount,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
