"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/seo";
import { IVG_PRO_12_FLAVOURS } from '@/data/ivg-pro-12-flavours';

// Render this page dynamically so product fetch happens at request-time
export const dynamic = 'force-dynamic';

export default function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState(String(1));
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedFlavourIndex, setSelectedFlavourIndex] = useState<number | null>(null);
  const [mainImage, setMainImage] = useState<string>('');
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // keep input string in sync when quantity changes programmatically
  useEffect(() => {
    setQuantityInput(String(quantity));
  }, [quantity]);

  // Use flavours from product data if present
  const hasFlavours = Array.isArray(product?.flavours) && product.flavours.length > 0;
  const flavours: string[] = hasFlavours ? product.flavours : IVG_PRO_12_FLAVOURS;

  // Map flavours to images if a match is present in product.images (by simple name match)
  // Run this mapping regardless of whether the product object includes flavours
  // so the standalone IVG flavour list (IVG_PRO_12_FLAVOURS) can provide images.
  const flavourImages = useMemo(() => {
    const imgs = Array.isArray(product?.images) ? product.images : [];
    // If there are many product.images (pack shot) and separate flavour images
    // are not provided, prefer supplier flavour images (external) when known.
    // We'll attempt to match flavour names to supplier image URLs by a small lookup.
    const lookup: Record<string, string> = {
      'blue raspberry ice': 'https://mcrvapedistro.co.uk/cdn/shop/files/ivg-pro-12-prefilled-vape-pods-box-of-10-mcr-vape-distro-500758.png?v=1748617276',
      'blue sour raspberry': 'https://mcrvapedistro.co.uk/cdn/shop/files/ivg-pro-12-prefilled-vape-pods-box-of-10-mcr-vape-distro-933612.png?v=1748617276',
      'classic menthol': 'https://mcrvapedistro.co.uk/cdn/shop/files/ivg-pro-12-prefilled-vape-pods-box-of-10-mcr-vape-distro-489670.png?v=1748617254',
      'double mango': 'https://mcrvapedistro.co.uk/cdn/shop/files/ivg-pro-12-prefilled-vape-pods-box-of-10-mcr-vape-distro-871313.png?v=1748617251',
      'fizzy cherry': 'https://mcrvapedistro.co.uk/cdn/shop/files/ivg-pro-12-prefilled-vape-pods-box-of-10-mcr-vape-distro-384300.png?v=1748617253',
      'fizzy strawberry': 'https://mcrvapedistro.co.uk/cdn/shop/files/ivg-pro-12-prefilled-vape-pods-box-of-10-mcr-vape-distro-271657.png?v=1748617252',
      'fresh menthol mojito': 'https://mcrvapedistro.co.uk/cdn/shop/files/ivg-pro-12-prefilled-vape-pods-box-of-10-mcr-vape-distro-297006.png?v=1748617274',
      'kiwi passionfruit guava': 'https://mcrvapedistro.co.uk/cdn/shop/files/ivg-pro-12-prefilled-vape-pods-box-of-10-mcr-vape-distro-525411.png?v=1748617275',
      'lemon lime': 'https://mcrvapedistro.co.uk/cdn/shop/files/ivg-pro-12-prefilled-vape-pods-box-of-10-mcr-vape-distro-768531.png?v=1748617253',
      'pineapple ice': 'https://mcrvapedistro.co.uk/cdn/shop/files/ivg-pro-12-prefilled-vape-pods-box-of-10-mcr-vape-distro-320536.png?v=1748617255',
      'pink lemonade': 'https://mcrvapedistro.co.uk/cdn/shop/files/ivg-pro-12-prefilled-vape-pods-box-of-10-mcr-vape-distro-249073.png?v=1748617251',
      'red sour raspberry': 'https://mcrvapedistro.co.uk/cdn/shop/files/ivg-pro-12-prefilled-vape-pods-box-of-10-mcr-vape-distro-383507.png?v=1748617274',
      'strawberry ice': 'https://mcrvapedistro.co.uk/cdn/shop/files/ivg-pro-12-prefilled-vape-pods-box-of-10-mcr-vape-distro-310181.png?v=1748617254',
      'strawberry raspberry cherry': 'https://mcrvapedistro.co.uk/cdn/shop/files/ivg-pro-12-prefilled-vape-pods-box-of-10-mcr-vape-distro-411261.png?v=1748617255',
      'strawberry watermelon': 'https://mcrvapedistro.co.uk/cdn/shop/files/ivg-pro-12-prefilled-vape-pods-box-of-10-mcr-vape-distro-237675.png?v=1748617255'
    };
    // Return null when we don't have a specific flavour image so callers
    // can decide whether to fall back to the pack shot or not.
    return flavours.map((f) => {
      if (typeof f === 'string') {
        return lookup[f.toLowerCase()] ?? null;
      }
      return null;
    });
  }, [hasFlavours, flavours, product]);

  const images: string[] = Array.isArray(product?.images) && product.images.length ? product.images : [product?.image || '/placeholder.svg'];

  // Build the thumbnails list: start from product pack-shot images then append
  // any flavour-specific images. Deduplicate and exclude placeholders.
  const thumbnailImages = useMemo(() => {
    const base = images.filter(Boolean) as string[];
    const extras = flavourImages.filter(Boolean) as string[];
    const merged = [...base, ...extras];
    const deduped = Array.from(new Set(merged)).filter((u) => u && u !== '/placeholder.svg');
    return deduped;
  }, [images, flavourImages]);

  // Track thumbnails that failed to load, so we can hide them from the gallery
  const [brokenThumbs, setBrokenThumbs] = useState<Set<string>>(new Set());

  const safeSelected = Math.min(Math.max(0, selectedImage), thumbnailImages.length - 1);

  // Set main image when product loads
  useEffect(() => {
    if (product && images.length > 0) {
      setMainImage(images[0]);
      // ensure selected thumbnail index is valid for the thumbnails list
      setSelectedImage(0);
    }
  }, [product, images]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    // Detect current theme
    const getCurrentTheme = () => {
      if (typeof window === 'undefined') return 'ordify';
      const classList = document.documentElement.classList;
      if (classList.contains('theme-musclesports')) return 'musclesports';
      if (classList.contains('theme-lumify')) return 'lumify';
      if (classList.contains('theme-vera')) return 'vera';
      if (classList.contains('theme-blisshair')) return 'blisshair';
      return 'ordify';
    };
    const theme = getCurrentTheme();
    fetch(`/api/products/${params.id}?theme=${theme}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((data) => {
        if (!mounted) return;
        setProduct(data);

        // Add structured data to page
        const productSchema = generateProductSchema(data);
        const breadcrumbSchema = generateBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: data.name, url: `/products/${data.id}` },
        ]);

        const productScript = document.createElement('script');
        productScript.type = 'application/ld+json';
        productScript.text = JSON.stringify(productSchema);
        document.head.appendChild(productScript);

        const breadcrumbScript = document.createElement('script');
        breadcrumbScript.type = 'application/ld+json';
        breadcrumbScript.text = JSON.stringify(breadcrumbSchema);
        document.head.appendChild(breadcrumbScript);
      })
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
    // Include selected flavour for IVG Pro 12 so cart/checkout can show it
    const item = hasFlavours && selectedFlavourIndex !== null
      ? { ...product, selectedFlavour: String(flavours[selectedFlavourIndex]) }
      : product;
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
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
            <img
              src={mainImage}
              alt={product.name}
              className="object-cover w-full h-full"
              onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
            />
          </div>

          {thumbnailImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {thumbnailImages
                .filter((url) => !brokenThumbs.has(url))
                .map((image: string, index: number) => (
                  <button
                    key={image}
                    onClick={() => {
                      setSelectedImage(index);
                      setMainImage(image);
                    }}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                      selectedImage === index ? "border-primary" : "border-gray-200"
                    }`}
                  >
                  <div className="relative w-full h-full">
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        setBrokenThumbs((prev) => new Set(prev).add(image));
                        e.currentTarget.src = '/placeholder.svg'; // optional fallback
                      }}
                    />
                  </div>
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

          {/* Flavours dropdown */}
          {hasFlavours && flavours.length > 0 && (
            <div className="mb-4">
              <label className="text-sm font-semibold mb-2 block">Flavour</label>
              <div className="flex items-center gap-3">
                <select
                  value={selectedFlavourIndex !== null ? String(selectedFlavourIndex) : ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      setSelectedFlavourIndex(null);
                      setMainImage(images[0]);
                    } else {
                      const idx = parseInt(val, 10);
                      setSelectedFlavourIndex(idx);
                      const flavourImg = flavourImages[idx];
                      setMainImage(flavourImg || images[0]);
                    }
                  }}
                  className="h-9 px-3 rounded-md bg-background border text-sm"
                >
                  <option value="">Select flavour</option>
                  {flavours.map((f, i: number) => (
                    <option key={String(i)} value={String(i)}>{String(f)}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
            <span className="font-semibold text-sm sm:text-base">Quantity:</span>
            <div className="flex items-center border rounded-md w-fit">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const next = Math.max(1, quantity - 1);
                  setQuantity(next);
                  setQuantityInput(String(next));
                }}
                disabled={!product.inStock}
                className="h-8 w-8 sm:h-10 sm:w-10"
              >
                -
              </Button>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                aria-label={`Quantity for ${product.name}`}
                value={quantityInput}
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
                className="px-3 sm:px-4 py-2 min-w-[2.5rem] sm:min-w-[3rem] text-center text-sm sm:text-base appearance-none bg-transparent outline-none"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const next = quantity + 1;
                  setQuantity(next);
                  setQuantityInput(String(next));
                }}
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
