"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import HeroCarousel from '@/components/hero-carousel';
import HomePanels from '@/components/home-panels';
import { SkeletonLoader } from "@/components/skeleton-loader";
import { Star } from "lucide-react";
import { SalonHomepage } from "@/components/salon-homepage";
import { DynamicPageTitle } from "@/components/dynamic-page-title";

// Force dynamic rendering to avoid long static generation during build
export const dynamic = 'force-dynamic';

// Helper function to detect current theme
function getCurrentTheme(): string {
  if (typeof window === 'undefined') return 'ordify';
  
  const classList = document.documentElement.classList;
  if (classList.contains('theme-musclesports')) return 'musclesports';
  if (classList.contains('theme-lumify')) return 'lumify';
  if (classList.contains('theme-vera')) return 'vera';
  if (classList.contains('theme-blisshair')) return 'blisshair';
  return 'ordify';
}

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('ordify');
  const [siteLayout, setSiteLayout] = useState<any | null>(null);

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

  // If Bliss Hair theme is active, show salon homepage
  if (currentTheme === 'blisshair') {
    return (
      <>
        <DynamicPageTitle pageTitle="Home" />
        <SalonHomepage />
      </>
    );
  }

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

  // Load saved site layout (homepage sections order/visibility)
  // Load saved site layout (homepage sections order/visibility)
  useEffect(() => {
    let mounted = true;

    const fetchLayout = async () => {
      try {
        const r = await fetch('/api/site-layout?businessId=default');
        const data = await r.json();
        if (!mounted) return;
        const layout = data?.layout ?? data;
        setSiteLayout(layout ?? null);
      } catch (err) {
        console.warn('Failed to load site layout, falling back to defaults', err);
        if (mounted) setSiteLayout(null);
      }
    };

    fetchLayout();

    // Listen for admin updates via localStorage (other tabs will receive event)
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'siteLayoutUpdatedAt') {
        fetchLayout();
      }
    };
    window.addEventListener('storage', onStorage);

    // Also listen via BroadcastChannel for immediate same-origin notifications
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('site-layout');
      bc.onmessage = (msg) => {
        // simple message, just refetch
        fetchLayout();
      };
    } catch (e) {
      // BroadcastChannel not supported
      bc = null;
    }

    return () => {
      mounted = false;
      window.removeEventListener('storage', onStorage);
      if (bc) {
        try { bc.close(); } catch (e) { /* ignore */ }
      }
    };
  }, []);

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

  // Helpers for product and review slices
  const bestSellers = products.slice(0, isMobile ? 4 : 5);
  const newStock = products.slice(5, isMobile ? 9 : 10);
  const displayedReviews = reviews.slice(0, isMobile ? 3 : 6);

  // Fallback default homepage sections if API didn't return a layout
  const defaultSections = [
    { id: 'hero-carousel', type: 'hero', enabled: true, order: 0, title: 'Hero Carousel' },
    { id: 'home-panels', type: 'panels', enabled: true, order: 1, title: 'Category Panels' },
    { id: 'best-sellers', type: 'products', enabled: true, order: 2, title: 'Best Sellers', settings: { limit: 5, filter: 'best-sellers' } },
    { id: 'new-stock', type: 'products', enabled: true, order: 3, title: 'New Stock', settings: { limit: 5, filter: 'new' } },
    { id: 'reviews', type: 'reviews', enabled: true, order: 4, title: 'Customer Reviews' }
  ];

  // Render homepage based on saved layout (or defaultSections)
  const homepageSections = (siteLayout?.homepage?.sections ?? defaultSections)
    .slice()
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

  // Dev debug: log layout when it changes
  useEffect(() => {
    const NODE_ENV = (globalThis as any)?.process?.env?.NODE_ENV ?? (globalThis as any)?.NODE_ENV;
    if (NODE_ENV === 'development') {
      console.debug('Homepage sections (applied):', homepageSections.map((s: any) => ({ id: s.id, type: s.type, order: s.order })));
    }
  }, [siteLayout]);

  return (
    <>
      <DynamicPageTitle pageTitle="Home" />
      <div className="container py-8">
        {homepageSections.map((section: any, idx: number) => {
          if (!section.enabled) return null;
          const key = section.id || `${section.type}-${idx}`;

          switch (section.type) {
            case 'hero':
              return (
                <section key={key} className="mb-10">
                  <HeroCarousel />
                </section>
              );

            case 'panels':
              return (
                <section key={key} className="mb-16">
                  <HomePanels />
                </section>
              );

            case 'products': {
              const filter = section.settings?.filter;
              const limit = section.settings?.limit ?? (isMobile ? 4 : 5);
              const list = filter === 'best-sellers' ? bestSellers : filter === 'new' ? newStock : products.slice(0, limit);

              return (
                <section key={key} className="mb-16">
                  <div className="relative">
                    <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
                      <div className={`h-full w-full opacity-5 ${
                        currentTheme === 'musclesports'
                          ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-green-600'
                          : currentTheme === 'vera'
                          ? 'bg-gradient-to-br from-orange-500 via-red-500 to-amber-600'
                          : 'bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600'
                      }`}></div>
                    </div>

                    <div className="flex flex-col items-center text-center py-12 animate-slide-in-up">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-6 shadow-md ${
                        currentTheme === 'musclesports'
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                          : currentTheme === 'vera'
                          ? 'bg-gradient-to-br from-orange-500 to-red-600'
                          : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                      }`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>

                      <h2 className="text-3xl font-bold mb-3 tracking-tight">
                        <span className={`${
                          currentTheme === 'musclesports'
                            ? 'bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-transparent'
                            : currentTheme === 'vera'
                            ? 'bg-gradient-to-r from-orange-600 via-red-500 to-amber-700 bg-clip-text text-transparent'
                            : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-700 bg-clip-text text-transparent'
                        }`}>
                          {section.title ?? 'Products'}
                        </span>
                      </h2>
                      <p className="text-muted-foreground text-base max-w-md mb-0">{section.description ?? ''}</p>
                    </div>
                  </div>

                  {loading ? (
                    <SkeletonLoader type="product" count={isMobile ? 4 : 5} />
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {list.slice(0, limit).map((product, pidx) => (
                        <div key={product.id} style={{ animation: `slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${pidx * 0.05}s backwards` }}>
                          <ProductCard product={product} hideDescription />
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              );
            }

            case 'reviews':
              if (reviewsLoading || reviews.length === 0) return null;
              return (
                <section key={key} className="mb-16">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 rounded-full mb-4">
                      <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                      <span className="font-semibold text-yellow-700 dark:text-yellow-400">Customer Reviews</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-3">{section.title ?? 'What Our Customers Say'}</h2>
                    <p className="text-muted-foreground text-lg">{section.description ?? (currentTheme === 'musclesports' ? 'Real reviews from verified MuscleSports customers' : 'Real reviews from real customers on eBay')}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {displayedReviews.map((review) => (
                      <div key={review.id} className="bg-white dark:bg-card p-6 rounded-xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground font-medium bg-muted px-2.5 py-1 rounded-lg">{review.date}</span>
                        </div>
                        <p className="text-sm mb-4 leading-relaxed text-foreground/90 italic">&quot;{review.comment}&quot;</p>
                        <div className="pt-4 border-t flex items-center justify-between">
                          <div>
                            <p className="font-bold text-sm text-foreground flex items-center gap-2">{review.author || review.reviewer}{review.verified && currentTheme === 'musclesports' && (<span className="text-green-600 dark:text-green-400 text-xs">✓ Verified</span>)}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{review.location || review.item}</p>
                          </div>
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">{(review.author || review.reviewer).charAt(0).toUpperCase()}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {currentTheme !== 'musclesports' && (
                    <div className="text-center mb-16">
                      <a href="https://www.ebay.co.uk/fdbk/feedback_profile/ordifydirectltd" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-base bg-primary/10 hover:bg-primary/20 px-6 py-3 rounded-xl transition-all duration-200">View all reviews on eBay
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </a>
                    </div>
                  )}
                </section>
              );

            case 'partners':
            default:
              return (
                <section key={key} className="mb-12">
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-4">
                      <span className="text-xl">🤝</span>
                      <span className="font-semibold text-blue-700 dark:text-blue-400">Business Partners</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-3">{section.title ?? 'Dropshipping with Us'}</h2>
                    <p className="text-muted-foreground text-lg">{section.description ?? 'Partner with Ordify Direct Ltd for seamless dropshipping solutions'}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group text-center p-8 bg-gradient-to-br from-white to-gray-50 dark:from-card dark:to-card/50 rounded-xl hover:shadow-2xl transition-all duration-300 border hover:border-primary/20 hover:-translate-y-2">
                      <div className="mb-6 flex justify-center"><div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"><svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg></div></div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Avasam</h3>
                      <p className="text-muted-foreground leading-relaxed">Connect with our extensive product catalog through Avasam&apos;s dropshipping platform.</p>
                    </div>
                    <div className="group text-center p-8 bg-gradient-to-br from-white to-gray-50 dark:from-card dark:to-card/50 rounded-2xl hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/30 hover:-translate-y-2"><div className="mb-6 flex justify-center"><div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"><svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg></div></div><h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Avasam</h3><p className="text-muted-foreground leading-relaxed">Connect with our extensive product catalog through Avasam&apos;s dropshipping platform.</p></div>
                    <div className="group text-center p-8 bg-gradient-to-br from-white to-gray-50 dark:from-card dark:to-card/50 rounded-2xl hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/30 hover:-translate-y-2"><div className="mb-6 flex justify-center"><div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"><svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg></div></div><h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Avasam</h3><p className="text-muted-foreground leading-relaxed">Connect with our extensive product catalog through Avasam&apos;s dropshipping platform.</p></div>
                  </div>
                </section>
              );
          }
        })}
      </div>
    </>
  );

