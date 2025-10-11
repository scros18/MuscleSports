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
import { usePerformance } from "@/context/performance-context";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { settings } = usePerformance();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
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

  const animationClass = settings.animationsEnabled
    ? "hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out"
    : "transition-shadow duration-200";

  return (
    <Card className={`overflow-hidden hover:shadow-2xl flex flex-col h-full group border-2 hover:border-primary/20 ${animationClass}`}>
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {product.featured && (
            <div className="absolute top-3 right-3 z-10">
              <div className="relative backdrop-blur-md bg-gradient-to-br from-blue-500/90 via-indigo-500/90 to-purple-500/90 text-white px-3 py-1.5 rounded-full shadow-2xl border border-white/20 font-semibold text-xs">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]"></div>
                <span className="relative z-10 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Best Seller
                </span>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/40 via-indigo-400/40 to-purple-400/40 rounded-full blur-md -z-10 animate-pulse"></div>
              </div>
            </div>
          )}
          
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <Badge variant="destructive" className="text-lg px-4 py-2">Out of Stock</Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-base mb-2 hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        {description && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2 min-h-[2rem]">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto gap-2">
          <div className={`hidden sm:flex ${badgeVariants({ variant: 'outline' })} text-xs py-0.5 px-2`}>{product.category}</div>
          {product.inStock && (
            <div className="flex items-center text-xs text-green-600 dark:text-green-400 font-medium sm:ml-auto w-full sm:w-auto justify-center sm:justify-start px-2 py-1 sm:py-0 rounded-md sm:rounded-none bg-green-50/50 dark:bg-green-950/20 sm:bg-transparent border border-green-200/30 dark:border-green-800/30 sm:border-0">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              In Stock
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-3 sm:p-4 pt-0 mt-auto flex flex-col gap-2 bg-gradient-to-t from-muted/30 to-transparent">
        <div className="w-full flex items-center justify-between">
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {formatPrice(product.price)}
          </span>
          <div className={`flex items-center border-2 rounded-lg overflow-hidden shadow-sm bg-background ${settings.animationsEnabled ? 'transition-all duration-200' : ''}`}>
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 sm:h-8 sm:w-8 rounded-none hover:bg-primary/10 ${settings.animationsEnabled ? 'active:scale-90 transition-transform duration-150 ease-spring' : 'transition-colors'}`}
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(Math.max(1, quantity - 1));
              }}
              disabled={quantity <= 1}
            >
              <Minus className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
            </Button>
            <span className={`px-1.5 sm:px-3 py-1 min-w-[1.75rem] sm:min-w-[2.5rem] text-center font-bold text-xs sm:text-sm ${settings.animationsEnabled ? 'transition-all duration-200 ease-spring' : ''}`}>
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 sm:h-8 sm:w-8 rounded-none hover:bg-primary/10 ${settings.animationsEnabled ? 'active:scale-90 transition-transform duration-150 ease-spring' : 'transition-colors'}`}
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(quantity + 1);
              }}
            >
              <Plus className="h-2.5 w-2.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
        <Button
          className={`w-full font-semibold shadow-md hover:shadow-lg text-xs sm:text-sm h-8 sm:h-9 ${
            isAdded ? "bg-green-600 hover:bg-green-700" : ""
          } ${
            settings.animationsEnabled
              ? "transition-all duration-300 active:scale-95 hover:scale-[1.02]"
              : "transition-colors duration-200"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          disabled={!product.inStock || isAdded}
        >
          {isAdded ? (
            <>
              <Check className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-in zoom-in" />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Add {quantity > 1 ? `${quantity}` : "to Cart"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
