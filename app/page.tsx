"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import HeroCarousel from '@/components/hero-carousel';
import HomePanels from '@/components/home-panels';
import { LoadingSpinner } from "@/components/loading-spinner";
import { Star } from "lucide-react";

// Force dynamic rendering to avoid long static generation during build
export const dynamic = 'force-dynamic';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    fetch('/api/ebay-reviews?limit=12')
      .then(r => r.json())
      .then((data) => {
        if (!mounted) return;
        setReviews(data.reviews || []);
      })
      .catch(err => console.error('Failed to fetch reviews', err))
      .finally(() => mounted && setReviewsLoading(false));

    return () => { mounted = false };
  }, []);

  const bestSellers = products.slice(0, isMobile ? 4 : 5);
  const newStock = products.slice(5, isMobile ? 9 : 10);
  const displayedReviews = reviews.slice(0, isMobile ? 3 : 6);

  if (loading) return <LoadingSpinner message="Loading products..." />;

  return (
    <div className="container py-8">
      {/* Hero carousel */}
      <section className="mb-10">
        <HeroCarousel />
      </section>

      {/* Panels under hero (Top offers, Popular categories, Vapes, etc.) */}
      <section className="mb-16">
        <HomePanels />
      </section>

      {/* Best Sellers */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold mb-2 tracking-tight">
            <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 bg-clip-text text-transparent">
              Best Sellers
            </span>
          </h2>
          <p className="text-muted-foreground text-base font-medium">Most popular products flying off the shelves</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} hideDescription />
          ))}
        </div>
      </section>

      {/* New Stock */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold mb-2 tracking-tight">
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
              New Stock
            </span>
          </h2>
          <p className="text-muted-foreground text-base font-medium">Fresh products just added to our collection</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {newStock.map((product) => (
            <ProductCard key={product.id} product={product} hideDescription />
          ))}
        </div>
      </section>

      {/* eBay Reviews Section */}
      {!reviewsLoading && reviews.length > 0 && (
        <section className="mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 rounded-full mb-4">
              <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
              <span className="font-semibold text-yellow-700 dark:text-yellow-400">Customer Reviews</span>
            </div>
            <h2 className="text-4xl font-bold mb-3">What Our Customers Say</h2>
            <p className="text-muted-foreground text-lg">Real reviews from real customers on eBay</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {displayedReviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-card p-6 rounded-xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">\n                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 fill-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium bg-muted px-2.5 py-1 rounded-lg">
                    {review.date}
                  </span>
                </div>
                <p className="text-sm mb-4 leading-relaxed text-foreground/90 italic">
                  &quot;{review.comment}&quot;
                </p>
                <div className="pt-4 border-t flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-foreground">{review.reviewer}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{review.item}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {review.reviewer.charAt(0)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mb-16">
            <a
              href="https://www.ebay.co.uk/fdbk/feedback_profile/ordifydirectltd"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-base bg-primary/10 hover:bg-primary/20 px-6 py-3 rounded-xl transition-all duration-200"
            >
              View all reviews on eBay
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </section>
      )}

      {/* Dropshipping Section */}
      <section className="mb-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-4">
            <span className="text-xl">🤝</span>
            <span className="font-semibold text-blue-700 dark:text-blue-400">Business Partners</span>
          </div>
          <h2 className="text-4xl font-bold mb-3">Dropshipping with Us</h2>
          <p className="text-muted-foreground text-lg">Partner with Ordify Direct Ltd for seamless dropshipping solutions</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group text-center p-8 bg-gradient-to-br from-white to-gray-50 dark:from-card dark:to-card/50 rounded-xl hover:shadow-2xl transition-all duration-300 border hover:border-primary/20 hover:-translate-y-2">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Avasam</h3>
            <p className="text-muted-foreground leading-relaxed">
              Connect with our extensive product catalog through Avasam&apos;s dropshipping platform.
            </p>
          </div>
          <div className="group text-center p-8 bg-gradient-to-br from-white to-gray-50 dark:from-card dark:to-card/50 rounded-2xl hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/30 hover:-translate-y-2">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Syncee</h3>
            <p className="text-muted-foreground leading-relaxed">
              Access our products through Syncee&apos;s automated dropshipping marketplace.
            </p>
          </div>
          <div className="group text-center p-8 bg-gradient-to-br from-white to-gray-50 dark:from-card dark:to-card/50 rounded-2xl hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/30 hover:-translate-y-2">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Appscenic</h3>
            <p className="text-muted-foreground leading-relaxed">
              Integrate our products into your store with Appscenic&apos;s dropshipping solutions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
