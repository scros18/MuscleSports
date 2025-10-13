"use client";

import { useState, useEffect } from "react";
import { useCheckout } from "@/context/checkout-context";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, MapPin, Truck } from "lucide-react";

interface ShippingStepProps {
  onNext: () => void;
  onBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export function ShippingStep({ onNext, onBack }: ShippingStepProps) {
  const { shippingInfo, setShippingInfo } = useCheckout();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    email: shippingInfo?.email || "",
    firstName: shippingInfo?.firstName || "",
    lastName: shippingInfo?.lastName || "",
    address: shippingInfo?.address || "",
    apartment: shippingInfo?.apartment || "",
    city: shippingInfo?.city || "",
    postalCode: shippingInfo?.postalCode || "",
    country: shippingInfo?.country || "GB",
    phone: shippingInfo?.phone || "",
  });
  const [saveInfo, setSaveInfo] = useState(false);
  const [loadedSavedAddress, setLoadedSavedAddress] = useState(false);

  // Load saved shipping address if user is logged in
  useEffect(() => {
    const loadSavedAddress = async () => {
      if (!user || loadedSavedAddress) return;
      
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const response = await fetch("/api/user/shipping-address", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.shippingAddress) {
            const saved = data.shippingAddress;
            // Only load if form is empty
            if (!formData.firstName && !formData.address) {
              setFormData({
                email: user.email || "",
                firstName: saved.firstName || "",
                lastName: saved.lastName || "",
                address: saved.address || "",
                apartment: saved.apartment || "",
                city: saved.city || "",
                postalCode: saved.postalCode || "",
                country: saved.country || "GB",
                phone: saved.phone || "",
              });
            }
            setLoadedSavedAddress(true);
          }
        }
      } catch (error) {
        console.error("Error loading saved address:", error);
      }
    };

    loadSavedAddress();
  }, [user, loadedSavedAddress, formData.firstName, formData.address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShippingInfo(formData as any);
    
    // Save to user account if checkbox is checked and user is logged in
    if (saveInfo && user) {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          await fetch('/api/user/shipping-address', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              firstName: formData.firstName,
              lastName: formData.lastName,
              address: formData.address,
              apartment: formData.apartment,
              city: formData.city,
              postalCode: formData.postalCode,
              country: formData.country,
              phone: formData.phone,
            }),
          });
        }
      } catch (error) {
        console.error('Error saving shipping address:', error);
      }
    }
    
    onNext();
  };

  const isValid =
    formData.firstName &&
    formData.lastName &&
    formData.address &&
    formData.city &&
    formData.postalCode &&
    formData.phone;

  return (
    <form onSubmit={handleSubmit}>
      <Card className="shadow-lg">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">Shipping Information</h2>
              <p className="text-sm text-muted-foreground">
                Where should we deliver your order?
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Contact</h3>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-1.5"
                  required
                />
              </div>
            </div>

            {/* Name */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Name</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="mt-1.5"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Delivery Address</h3>
              
              <div>
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) =>
                    setFormData({ ...formData, country: value })
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GB">🇬🇧 United Kingdom</SelectItem>
                    <SelectItem value="US">🇺🇸 United States</SelectItem>
                    <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                    <SelectItem value="AU">🇦🇺 Australia</SelectItem>
                    <SelectItem value="DE">🇩🇪 Germany</SelectItem>
                    <SelectItem value="FR">🇫🇷 France</SelectItem>
                    <SelectItem value="ES">🇪🇸 Spain</SelectItem>
                    <SelectItem value="IT">🇮🇹 Italy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="Street address or P.O. Box"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="apartment">
                  Apartment, suite, etc. (optional)
                </Label>
                <Input
                  id="apartment"
                  value={formData.apartment}
                  onChange={(e) =>
                    setFormData({ ...formData, apartment: e.target.value })
                  }
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    className="mt-1.5"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+44 20 1234 5678"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="mt-1.5"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  For delivery updates and notifications
                </p>
              </div>
            </div>

            {/* Save Info Checkbox - only show if user is logged in */}
            {user && (
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="saveInfo"
                  checked={saveInfo}
                  onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
                />
                <label
                  htmlFor="saveInfo"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Save this information to my account for next time
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Options */}
      <Card className="mt-6 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Standard Shipping</h3>
              <p className="text-sm text-muted-foreground">
                Delivery in 3-5 business days
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-green-600">FREE</p>
              <p className="text-xs text-muted-foreground">Save £5.99</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
        <Button type="submit" disabled={!isValid} className="flex-1">
          Continue to Payment
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
