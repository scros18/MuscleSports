"use client";

import { useState, useEffect } from "react";
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
  hideDescription?: boolean;
}

export function ProductCard({ product, hideDescription = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const { settings } = usePerformance();
  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState(String(1));
  const [isAdded, setIsAdded] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const firstImage = Array.isArray((product as any).images) && (product as any).images.length
    ? (product as any).images[0]
    : (product as any).image || "/placeholder.svg";
  const description = (product as any).description || "";
  
  // keep input string in sync when quantity changes programmatically
  useEffect(() => {
    setQuantityInput(String(quantity));
  }, [quantity]);

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
    <Card className={`overflow-hidden hover:shadow-xl flex flex-col h-full group border hover:border-primary/20 rounded-lg ${animationClass}`}>
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          
          {product.featured && (
            <div className="absolute top-2.5 right-2.5 z-10">
              <div className="relative backdrop-blur-sm bg-gradient-to-br from-blue-500/95 via-indigo-500/95 to-purple-500/95 text-white px-2.5 py-1 rounded-lg shadow-lg border border-white/20 font-semibold text-[10px]">
                <span className="relative z-10 flex items-center gap-1">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured
                </span>
              </div>
            </div>
          )}
          
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <Badge variant="destructive" className="text-sm px-3 py-1.5 rounded-lg">Out of Stock</Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-2.5 sm:p-3 md:p-3.5 flex-grow flex flex-col">
        <Link href={`/products/${product.id}`} className="flex-grow">
          <h3 className="font-semibold text-xs sm:text-sm mb-1 sm:mb-1.5 hover:text-primary transition-colors line-clamp-2 min-h-[2.2rem] sm:min-h-[2.5rem] leading-tight sm:leading-snug">
            {product.name}
          </h3>
        </Link>
        {!hideDescription && description && (
          <p className="hidden sm:block text-xs text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
        )}
        
        {/* Price prominently displayed */}
        <div className="mt-auto mb-2 sm:mb-3">
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <div className={`hidden md:flex ${badgeVariants({ variant: 'secondary' })} text-[9px] sm:text-[10px] py-0.5 px-1.5 sm:px-2 font-medium`}>
            {product.category}
          </div>
          {product.inStock && (
            <div className="flex items-center text-[9px] sm:text-[10px] text-green-600 dark:text-green-400 font-medium sm:ml-auto w-full md:w-auto justify-center md:justify-start px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-green-50/50 dark:bg-green-950/20 border border-green-200/30 dark:border-green-800/30">
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mr-1 sm:mr-1.5"></span>
              In Stock
            </div>
          )}
        </div>

        {/* Quantity controls */}
        <div className={`flex items-center border rounded-md overflow-hidden shadow-sm bg-background mb-1.5 sm:mb-2 ${settings.animationsEnabled ? 'transition-all duration-200' : ''}`}>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 sm:h-8 sm:w-8 rounded-none hover:bg-primary/10 ${settings.animationsEnabled ? 'active:scale-90 transition-transform duration-150 ease-spring' : 'transition-colors'}`}
            onClick={(e) => {
              e.stopPropagation();
              setQuantity(Math.max(1, quantity - 1));
            }}
            disabled={quantity <= 1}
          >
            <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          </Button>
          {/* Input allows typing - keep a string state to allow editing before commit */}
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            aria-label={`Quantity for ${product.name}`}
            value={quantityInput}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              // keep only digits in the input string
              const cleaned = e.target.value.replace(/\D/g, "");
              setQuantityInput(cleaned);
            }}
            onBlur={() => {
              const n = parseInt(quantityInput, 10);
              const final = Number.isNaN(n) || n < 1 ? 1 : n;
              setQuantity(final);
              setQuantityInput(String(final));
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const n = parseInt(quantityInput, 10);
                const final = Number.isNaN(n) || n < 1 ? 1 : n;
                setQuantity(final);
                setQuantityInput(String(final));
                // prevent form submits or other handlers
                e.currentTarget.blur();
              }
            }}
            className={`px-2 sm:px-3 py-1 min-w-[2rem] sm:min-w-[2.5rem] w-12 sm:w-16 text-center font-bold text-xs sm:text-sm appearance-none bg-transparent outline-none ${settings.animationsEnabled ? 'transition-all duration-200 ease-spring' : ''}`}
          />
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 sm:h-8 sm:w-8 rounded-none hover:bg-primary/10 ${settings.animationsEnabled ? 'active:scale-90 transition-transform duration-150 ease-spring' : 'transition-colors'}`}
            onClick={(e) => {
              e.stopPropagation();
              const next = quantity + 1;
              setQuantity(next);
              setQuantityInput(String(next));
            }}
          >
            <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          </Button>
        </div>

        {/* Add to cart button */}
        <Button
          className={`w-full font-semibold shadow-sm hover:shadow-md text-xs sm:text-sm h-8 sm:h-9 ${
            isAdded ? "bg-green-600 hover:bg-green-700" : ""
          } ${
            settings.animationsEnabled
              ? "transition-all duration-300 active:scale-[0.98] hover:scale-[1.01]"
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
              <Check className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-in zoom-in" />
              <span className="hidden sm:inline">Added to Cart</span>
              <span className="sm:hidden">Added</span>
            </>
          ) : (
            <>
              <ShoppingCart className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Add {quantity > 1 ? `${quantity} ` : ""}to Cart</span>
              <span className="sm:hidden">Add {quantity > 1 ? quantity : ""}</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
