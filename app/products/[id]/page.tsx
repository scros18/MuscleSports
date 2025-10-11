"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Render this page dynamically so product fetch happens at request-time
export const dynamic = 'force-dynamic';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`/api/products/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((data) => mounted && setProduct(data))
      .catch((err) => {
        console.error('Failed to load product', err);
        mounted && setProduct(null);
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false };
  }, [params.id]);

  if (loading) return <div className="container py-8">Loading…</div>;
  if (!product) return notFound();

  const images: string[] = Array.isArray((product as any).images) && (product as any).images.length
    ? (product as any).images
    : [ (product as any).image || "/placeholder.svg" ];
  const safeSelected = Math.min(Math.max(0, selectedImage), images.length - 1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
      <Link href="/">
        <Button variant="ghost" className="mb-4 sm:mb-6 -ml-2 sm:ml-0">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative h-80 sm:h-96 md:h-[600px] rounded-lg overflow-hidden bg-gray-100 w-full">
            <Image
              src={images[safeSelected]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                    selectedImage === index ? "border-primary" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 break-words">{product.name}</h1>
              <Badge variant="outline" className="text-xs">{product.category}</Badge>
            </div>
            {product.featured && (
              <Badge variant="default" className="self-start">Featured</Badge>
            )}
          </div>

          <div className="text-2xl sm:text-3xl font-bold mb-6">
            {formatPrice(product.price)}
          </div>

          <Separator className="mb-6" />

          <div className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
              {product.description}
            </p>
          </div>

          <Separator className="mb-6" />

          <div className="mb-6">
            <p className="text-sm mb-2">
              <span className="font-semibold">Status:</span>{" "}
              {product.inStock ? (
                <span className="text-green-600">In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
            <span className="font-semibold text-sm sm:text-base">Quantity:</span>
            <div className="flex items-center border rounded-md w-fit">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={!product.inStock}
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                -
              </Button>
              <span className="px-3 sm:px-4 py-2 min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm sm:text-base">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                disabled={!product.inStock}
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                +
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            size="lg"
            className="w-full sm:w-auto px-6 py-3 text-base font-semibold"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>

          <div className="mt-8 p-3 sm:p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2 text-sm sm:text-base">Product Features:</h3>
            <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1">
              <li>Premium quality materials</li>
              <li>Fast and secure shipping</li>
              <li>30-day return policy</li>
              <li>1-year warranty included</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
