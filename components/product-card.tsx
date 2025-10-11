"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const firstImage = Array.isArray((product as any).images) && (product as any).images.length
    ? (product as any).images[0]
    : (product as any).image || "/placeholder.svg";
  const description = (product as any).description || "";

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

      <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between">
        <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
        <Button
          onClick={() => addToCart(product)}
          disabled={!product.inStock}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
