"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Check, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/cart-context";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const firstImage = Array.isArray((product as any).images) && (product as any).images.length
    ? (product as any).images[0]
    : (product as any).image || "/placeholder.svg";
  const description = (product as any).description || "";

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <div className={`${badgeVariants({ variant: 'default' })} absolute top-2 right-2`}>
              Featured
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:underline">
            {product.name}
          </h3>
        </Link>
        {description && (
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center justify-end">
          <div className={badgeVariants({ variant: 'outline' })}>{product.category}</div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 mt-auto flex flex-col gap-3">
        <div className="w-full flex items-center justify-between">
          <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
          <div className="flex items-center border-2 rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(Math.max(1, quantity - 1));
              }}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="px-3 py-1 min-w-[2.5rem] text-center font-semibold text-sm">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(quantity + 1);
              }}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <Button
          className={`w-full transition-all duration-300 ${
            isAdded ? "bg-green-600 hover:bg-green-700" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          disabled={!product.inStock || isAdded}
        >
          {isAdded ? (
            <>
              <Check className="mr-2 h-4 w-4 animate-in zoom-in" />
              Added to Cart!
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add {quantity > 1 ? `${quantity} Items` : "to Cart"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
