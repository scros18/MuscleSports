"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import HeroCarousel from '@/components/hero-carousel';
import HomePanels from '@/components/home-panels';
import { SkeletonLoader } from "@/components/skeleton-loader";
import { Star } from "lucide-react";

// Force dynamic rendering to avoid long static generation during build
export const dynamic = 'force-dynamic';

// Helper function to detect current theme
function getCurrentTheme(): string {
  if (typeof window === 'undefined') return 'ordify';
  
  const classList = document.documentElement.classList;
  if (classList.contains('theme-musclesports')) return 'musclesports';
  if (classList.contains('theme-lumify')) return 'lumify';
  if (classList.contains('theme-vera')) return 'vera';
  return 'ordify';
}

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('ordify');

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Detect theme and watch for changes
  useEffect(() => {
    setCurrentTheme(getCurrentTheme());
    const observer = new MutationObserver(() => {
      setCurrentTheme(getCurrentTheme());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);

  // Fetch products based on current theme
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`/api/products?theme=${currentTheme}`)
      .then(r => r.json())
      .then((data) => {
        if (!mounted) return;
        const allProducts = data.products || [];
        // Filter out out-of-stock products for MuscleSports theme
        const filteredProducts = currentTheme === 'musclesports' 
          ? allProducts.filter((p: any) => p.inStock !== false)
          : allProducts;
        setProducts(filteredProducts);
      })
      .catch(err => console.error('Failed to fetch products', err))
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false };
  }, [currentTheme]);

  // Fetch eBay reviews or use MuscleSports reviews
  useEffect(() => {
    let mounted = true;
    setReviewsLoading(true);

    // MuscleSports theme-specific reviews
    if (currentTheme === 'musclesports') {
      const musclesportsReviews = [
        {
          id: 'ms1',
          author: 'Kris Kosiba',
          location: 'GB',
          date: 'Aug 3, 2025',
          rating: 5,
          comment: 'I originally wanted to give a 4 star, I love the design and choice of product but once I saw the page had a calculator and recipe tool … I was sold. I entered as much detail and went through what products suited me best. Best £70 spent. Thank you musclesports',
          verified: true
        },
        {
          id: 'ms2',
          author: 'joe carpenter',
          location: 'GB',
          date: 'Aug 1, 2025',
          rating: 5,
          comment: 'Delivery was spot on and product is exactly what I asked for.',
          verified: true
        },
        {
          id: 'ms3',
          author: 'Consumer',
          location: 'GB',
          date: 'Aug 1, 2025',
          rating: 5,
          comment: 'Easy site to navigate and quick delivery',
          verified: true
        },
        {
          id: 'ms4',
          author: 'Leon Snailham',
          location: 'GB',
          date: 'Aug 3, 2025',
          rating: 5,
          comment: 'Has a very good calculator that helped me pick the right products. I had no idea which products I needed until now, just said I wanted to gain muscle, gave my height, age etc and I was sorted',
          verified: true
        }
      ];
      setReviews(musclesportsReviews);
      setReviewsLoading(false);
      return;
    }

    // Fetch eBay reviews for other themes
    fetch('/api/ebay-reviews?limit=12')
      .then(r => r.json())
      .then((data) => {
        if (!mounted) return;
        setReviews(data.reviews || []);
      })
      .catch(err => console.error('Failed to fetch reviews', err))
      .finally(() => mounted && setReviewsLoading(false));

    return () => { mounted = false };
  }, [currentTheme]);

  const bestSellers = products.slice(0, isMobile ? 4 : 5);
  const newStock = products.slice(5, isMobile ? 9 : 10);
  const displayedReviews = reviews.slice(0, isMobile ? 3 : 6);

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
        <div className="relative">
          {/* Theme-specific background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
            <div className={`h-full w-full opacity-5 ${
              currentTheme === 'musclesports' 
                ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-green-600' 
                : currentTheme === 'vera'
                ? 'bg-gradient-to-br from-orange-500 via-red-500 to-amber-600'
                : 'bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600'
            }`}></div>
          </div>

          <div className="text-center mb-10 pt-12 animate-slide-in-up">
            {/* Icon badge */}
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg ${
              currentTheme === 'musclesports'
                ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                : currentTheme === 'vera'
                ? 'bg-gradient-to-br from-orange-500 to-red-600'
                : 'bg-gradient-to-br from-blue-500 to-indigo-600'
            }`}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            <h2 className="text-5xl font-black mb-3 tracking-tight relative inline-block">
              <span className={`relative z-10 ${
                currentTheme === 'musclesports'
                  ? 'bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-transparent'
                  : currentTheme === 'vera'
                  ? 'bg-gradient-to-r from-orange-600 via-red-500 to-amber-700 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-700 bg-clip-text text-transparent'
              }`}>
                Best Sellers
              </span>
              <span className={`absolute -inset-3 blur-2xl -z-10 opacity-40 animate-pulse ${
                currentTheme === 'musclesports'
                  ? 'bg-gradient-to-r from-green-500/30 via-emerald-500/30 to-green-600/30'
                  : currentTheme === 'vera'
                  ? 'bg-gradient-to-r from-orange-500/30 via-red-500/30 to-amber-600/30'
                  : 'bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-blue-600/30'
              }`} />
            </h2>
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <p className="text-lg font-semibold">Most popular products flying off the shelves</p>
            </div>
          </div>
        </div>

        {loading ? (
          <SkeletonLoader type="product" count={isMobile ? 4 : 5} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {bestSellers.map((product, idx) => (
              <div 
                key={product.id}
                style={{
                  animation: `slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.05}s backwards`
                }}
              >
                <ProductCard product={product} hideDescription />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* New Stock */}
      <section className="mb-16">
        <div className="relative">
          {/* Theme-specific background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
            <div className={`h-full w-full opacity-5 ${
              currentTheme === 'musclesports' 
                ? 'bg-gradient-to-br from-lime-500 via-green-400 to-emerald-500' 
                : currentTheme === 'vera'
                ? 'bg-gradient-to-br from-amber-500 via-orange-400 to-yellow-500'
                : 'bg-gradient-to-br from-cyan-500 via-blue-400 to-teal-500'
            }`}></div>
          </div>

          <div className="text-center mb-10 pt-12 animate-slide-in-up">
            {/* Icon badge */}
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg ${
              currentTheme === 'musclesports'
                ? 'bg-gradient-to-br from-lime-500 to-green-600'
                : currentTheme === 'vera'
                ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                : 'bg-gradient-to-br from-cyan-500 to-blue-600'
            }`}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>

            <h2 className="text-5xl font-black mb-3 tracking-tight relative inline-block">
              <span className={`relative z-10 ${
                currentTheme === 'musclesports'
                  ? 'bg-gradient-to-r from-lime-600 via-green-500 to-emerald-700 bg-clip-text text-transparent'
                  : currentTheme === 'vera'
                  ? 'bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-700 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-cyan-600 via-blue-500 to-teal-700 bg-clip-text text-transparent'
              }`}>
                New Stock
              </span>
              <span className={`absolute -inset-3 blur-2xl -z-10 opacity-40 animate-pulse ${
                currentTheme === 'musclesports'
                  ? 'bg-gradient-to-r from-lime-500/30 via-green-500/30 to-emerald-600/30'
                  : currentTheme === 'vera'
                  ? 'bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-yellow-600/30'
                  : 'bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-teal-600/30'
              }`} />
            </h2>
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              <p className="text-lg font-semibold">Fresh products just added to our collection</p>
            </div>
          </div>
        </div>

        {loading ? (
          <SkeletonLoader type="product" count={isMobile ? 4 : 5} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {newStock.map((product, idx) => (
              <div 
                key={product.id}
                style={{
                  animation: `slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.05}s backwards`
                }}
              >
                <ProductCard product={product} hideDescription />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reviews Section */}
      {!reviewsLoading && reviews.length > 0 && (
        <section className="mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 rounded-full mb-4">
              <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
              <span className="font-semibold text-yellow-700 dark:text-yellow-400">Customer Reviews</span>
            </div>
            <h2 className="text-4xl font-bold mb-3">What Our Customers Say</h2>
            <p className="text-muted-foreground text-lg">
              {currentTheme === 'musclesports' 
                ? 'Real reviews from verified MuscleSports customers'
                : 'Real reviews from real customers on eBay'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {displayedReviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-card p-6 rounded-xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
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
                    <p className="font-bold text-sm text-foreground flex items-center gap-2">
                      {review.author || review.reviewer}
                      {review.verified && currentTheme === 'musclesports' && (
                        <span className="text-green-600 dark:text-green-400 text-xs">✓ Verified</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {review.location || review.item}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {(review.author || review.reviewer).charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentTheme !== 'musclesports' && (
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
          )}
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
