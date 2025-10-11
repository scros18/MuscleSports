"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";

// Force dynamic rendering to avoid long static generation during build
export const dynamic = 'force-dynamic';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch('/api/products')
      .then(r => r.json())
      .then((data) => {
        if (!mounted) return;
        setProducts(data.products || []);
      })
      .catch(err => console.error('Failed to fetch products', err))
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false };
  }, []);

  // Fetch eBay reviews
  useEffect(() => {
    let mounted = true;
    setReviewsLoading(true);
    fetch('/api/ebay-reviews?limit=6')
      .then(r => r.json())
      .then((data) => {
        if (!mounted) return;
        setReviews(data.reviews || []);
      })
      .catch(err => console.error('Failed to fetch reviews', err))
      .finally(() => mounted && setReviewsLoading(false));

    return () => { mounted = false };
  }, []);

  const featuredProducts = products.filter(p => p.featured);

  if (loading || reviewsLoading) return <div className="container py-8">Loading products…</div>;

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to Ordify Direct Ltd
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover premium products at unbeatable prices. Quality you can trust, delivered to your door.
        </p>
        <a href="https://ordifydirect.com/products" rel="noopener noreferrer">
          <Button size="lg">Shop Now</Button>
        </a>
      </section>

      {/* Dropshipping Section */}
      <section className="mb-16 bg-muted/50 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Dropshipping with Us</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Partner with Ordify Direct Ltd for seamless dropshipping solutions. Available on leading platforms:
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-background rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Avasam</h3>
            <p className="text-muted-foreground">
              Connect with our extensive product catalog through Avasam&apos;s dropshipping platform.
            </p>
          </div>
          <div className="text-center p-6 bg-background rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Syncee</h3>
            <p className="text-muted-foreground">
              Access our products through Syncee&apos;s automated dropshipping marketplace.
            </p>
          </div>
          <div className="text-center p-6 bg-background rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Appscenic</h3>
            <p className="text-muted-foreground">
              Integrate our products into your store with Appscenic&apos;s dropshipping solutions.
            </p>
          </div>
        </div>
      </section>

      {/* eBay Reviews Section */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground">
            See our latest reviews from eBay customers
          </p>
        </div>

        {reviewsLoading ? (
          <div className="text-center py-8">Loading reviews...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-card p-6 rounded-lg border">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {review.date}
                  </span>
                </div>
                <p className="text-sm mb-3 italic">&quot;{review.comment}&quot;</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">{review.reviewer}</span>
                  <span className="text-muted-foreground">{review.item}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <a
            href="https://www.ebay.co.uk/fdbk/feedback_profile/ordifydirectltd"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary hover:underline"
          >
            View all reviews on eBay →
          </a>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Best Sellers</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Stock */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">New Stock</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {products.slice(5, 10).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
