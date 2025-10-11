"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { X, TrendingUp, Zap, Star } from "lucide-react";

interface UpsellModalProps {
  onClose: (accepted: boolean) => void;
}

export function UpsellModal({ onClose }: UpsellModalProps) {
  const { addToCart, items } = useCart();
  const [upsellProducts, setUpsellProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    // Fetch related/popular products for upsell
    // For now, using mock data
    const mockUpsells = [
      {
        id: "upsell-1",
        name: "Premium Phone Case",
        price: 19.99,
        image: "/placeholder.svg",
        discount: 20,
        tag: "Best Seller",
      },
      {
        id: "upsell-2",
        name: "Wireless Charger",
        price: 29.99,
        image: "/placeholder.svg",
        discount: 15,
        tag: "Popular",
      },
      {
        id: "upsell-3",
        name: "Screen Protector (2-Pack)",
        price: 14.99,
        image: "/placeholder.svg",
        discount: 25,
        tag: "Great Deal",
      },
    ];
    setUpsellProducts(mockUpsells);
  }, []);

  const handleToggleProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleAddAndContinue = () => {
    // Add selected products to cart
    upsellProducts
      .filter((p) => selectedProducts.has(p.id))
      .forEach((product) => {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          category: "Accessories",
          inStock: true,
          featured: false,
        } as any);
      });

    onClose(true);
  };

  const totalSavings = upsellProducts
    .filter((p) => selectedProducts.has(p.id))
    .reduce((sum, p) => sum + (p.price * p.discount) / 100, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300">
        <CardContent className="p-0">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6">
            <button
              onClick={() => onClose(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-3">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Wait! Don't Miss These Deals
                </h2>
                <p className="text-primary-foreground/90 text-sm">
                  Complete your order with these popular items. Limited time
                  offers!
                </p>
              </div>
            </div>

            {selectedProducts.size > 0 && (
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 mt-4">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">
                  You're saving {formatPrice(totalSavings)} today!
                </span>
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {upsellProducts.map((product) => {
                const isSelected = selectedProducts.has(product.id);
                const discountedPrice =
                  product.price - (product.price * product.discount) / 100;

                return (
                  <button
                    key={product.id}
                    onClick={() => handleToggleProduct(product.id)}
                    className={`relative text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                        : "border-border hover:border-primary/50 hover:shadow-md"
                    }`}
                  >
                    {/* Selected Checkmark */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg z-10 animate-in zoom-in duration-200">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <Badge className="bg-red-600 hover:bg-red-600 text-white text-[10px] px-2 py-0.5">
                        {product.discount}% OFF
                      </Badge>
                    </div>

                    {/* Image */}
                    <div className="relative aspect-square w-full mb-3 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <h3 className="font-semibold text-sm line-clamp-2">
                          {product.name}
                        </h3>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(discountedPrice)}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      <Badge
                        variant="secondary"
                        className="text-[10px] px-2 py-0"
                      >
                        {product.tag}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-muted-foreground">
                  Still <strong className="text-foreground">FREE</strong> shipping
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                  </svg>
                </div>
                <span className="text-muted-foreground">
                  Same <strong className="text-foreground">delivery</strong> date
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Limited</strong> offer
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-orange-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">30-day</strong> returns
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onClose(false)}
                className="flex-1"
              >
                No Thanks
              </Button>
              <Button
                onClick={handleAddAndContinue}
                disabled={selectedProducts.size === 0}
                className="flex-1 text-lg font-bold h-12"
              >
                {selectedProducts.size > 0 ? (
                  <>
                    Add {selectedProducts.size} Item
                    {selectedProducts.size > 1 ? "s" : ""} & Continue
                  </>
                ) : (
                  "Continue to Payment"
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-3">
              These deals expire in <span className="font-bold text-red-600">5:00</span> minutes
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
