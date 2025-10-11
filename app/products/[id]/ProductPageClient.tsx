"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, ArrowLeft, Check, Plus, Minus } from "lucide-react";
import Link from "next/link";

interface ProductPageClientProps {
  params: { id: string };
}

export default function ProductPageClient({ params }: ProductPageClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

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
    <div className="container py-8">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative h-96 md:h-[600px] rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${
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
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <Badge variant="outline">{product.category}</Badge>
            </div>
            {product.featured && (
              <Badge variant="default">Featured</Badge>
            )}
          </div>

          <div className="text-3xl font-bold mb-6">
            {formatPrice(product.price)}
          </div>

          <Separator className="mb-6" />

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
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
          <div className="flex items-center gap-4 mb-6">
            <span className="font-semibold">Quantity:</span>
            <div className="flex items-center border-2 rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={!product.inStock || quantity <= 1}
                className="rounded-none hover:bg-gray-100"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-6 py-2 min-w-[4rem] text-center font-semibold">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                disabled={!product.inStock}
                className="rounded-none hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            size="lg"
            className={`w-full md:w-auto transition-all duration-300 ${
              isAdded ? "bg-green-600 hover:bg-green-700" : ""
            }`}
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdded}
          >
            {isAdded ? (
              <>
                <Check className="mr-2 h-5 w-5 animate-in zoom-in" />
                Added to Cart!
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add {quantity > 1 ? `${quantity} Items` : "to Cart"}
              </>
            )}
          </Button>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Product Features:</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
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