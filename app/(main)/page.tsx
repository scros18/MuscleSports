"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ProductCard } from "@/components/product-card";
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
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Detect theme and watch for changes
  useEffect(() => {
    setCurrentTheme(getCurrentTheme());
    const observer = new MutationObserver(() => setCurrentTheme(getCurrentTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Render SalonHomepage for Bliss Hair theme inside JSX to avoid conditional hooks

  // Fetch products based on current theme
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`/api/products?theme=${currentTheme}`)
      .then(r => r.json())
      .then((data) => {
        if (!mounted) return;
        const allProducts = data.products || [];
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

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'siteLayoutUpdatedAt') fetchLayout();
    };
    window.addEventListener('storage', onStorage);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('site-layout');
      bc.onmessage = () => fetchLayout();
    } catch { bc = null; }

    return () => {
      mounted = false;
      window.removeEventListener('storage', onStorage);
      if (bc) bc.close();
    };
  }, []);

  // Fetch eBay reviews or MuscleSports reviews
  useEffect(() => {
    let mounted = true;
    setReviewsLoading(true);

    if (currentTheme === 'musclesports') {
      const musclesportsReviews = [
        { id: 'ms1', author: 'Kris Kosiba', location: 'GB', date: 'Aug 3, 2025', rating: 5, comment: 'I originally wanted to give a 4 star, I love the design...', verified: true },
        { id: 'ms2', author: 'joe carpenter', location: 'GB', date: 'Aug 1, 2025', rating: 5, comment: 'Delivery was spot on and product is exactly what I asked for.', verified: true },
        { id: 'ms3', author: 'Consumer', location: 'GB', date: 'Aug 1, 2025', rating: 5, comment: 'Easy site to navigate and quick delivery', verified: true },
        { id: 'ms4', author: 'Leon Snailham', location: 'GB', date: 'Aug 3, 2025', rating: 5, comment: 'Has a very good calculator that helped me pick the right products...', verified: true }
      ];
      setReviews(musclesportsReviews);
      setReviewsLoading(false);
      return;
    }

    fetch('/api/ebay-reviews?limit=12')
      .then(r => r.json())
      .then((data) => { if (mounted) setReviews(data.reviews || []); })
      .catch(err => console.error('Failed to fetch reviews', err))
      .finally(() => mounted && setReviewsLoading(false));

    return () => { mounted = false };
  }, [currentTheme]);

  const bestSellers = products.slice(0, isMobile ? 4 : 5);
  const newStock = products.slice(5, isMobile ? 9 : 10);
  const displayedReviews = reviews.slice(0, isMobile ? 3 : 6);

  const defaultSections = [
    { id: 'hero-carousel', type: 'hero', enabled: true, order: 0, title: 'Hero Carousel' },
    { id: 'home-panels', type: 'panels', enabled: true, order: 1, title: 'Category Panels' },
    { id: 'community-cta', type: 'community-cta', enabled: true, order: 2, title: 'Community Hub' },
    { id: 'best-sellers', type: 'products', enabled: true, order: 3, title: 'Best Sellers', settings: { limit: 5, filter: 'best-sellers' } },
    { id: 'new-stock', type: 'products', enabled: true, order: 4, title: 'New Stock', settings: { limit: 5, filter: 'new' } },
    { id: 'reviews', type: 'reviews', enabled: true, order: 5, title: 'Customer Reviews' },
    { id: 'about-cta', type: 'about-cta', enabled: true, order: 6, title: 'Our Story' },
    { id: 'partners', type: 'partners', enabled: true, order: 7, title: 'Business Partners' }
  ];

  const homepageSections = (siteLayout?.homepage?.sections ?? defaultSections)
    .slice()
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <>
      <DynamicPageTitle 
        pageTitle={currentTheme === 'musclesports' 
          ? 'Muscle Sports | Premium Sports Supplements & Nutrition UK' 
          : 'Home'
        } 
      />
      {currentTheme === 'blisshair' ? (
        <SalonHomepage />
      ) : (
        <div className="container py-8 relative">
          {/* Subtle minimalist background accents */}
          <div className="pointer-events-none absolute inset-0 -z-10 select-none">
            {/* Soft top fade */}
            <div className="absolute inset-x-0 top-0 h-64 opacity-[0.06] dark:opacity-[0.05] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.6),transparent_60%)]"></div>
            {/* Radial glow top-right (primary tint) */}
            <div className={`absolute -top-12 -right-16 w-[42rem] h-[22rem] rounded-full blur-3xl opacity-[0.08] dark:opacity-[0.06] ${
              currentTheme === 'musclesports'
                ? 'bg-[radial-gradient(55%_55%_at_50%_50%,rgba(16,185,129,0.9),transparent_70%)]'
                : 'bg-[radial-gradient(55%_55%_at_50%_50%,rgba(59,130,246,0.9),transparent_70%)]'
            }`}></div>
            {/* Radial glow bottom-left (indigo tint) */}
            <div className={`absolute -bottom-20 -left-24 w-[36rem] h-[18rem] rounded-full blur-3xl opacity-[0.07] dark:opacity-[0.05] ${
              currentTheme === 'musclesports'
                ? 'bg-[radial-gradient(55%_55%_at_50%_50%,rgba(5,150,105,0.9),transparent_70%)]'
                : 'bg-[radial-gradient(55%_55%_at_50%_50%,rgba(99,102,241,0.9),transparent_70%)]'
            }`}></div>
          </div>
          {homepageSections.map((section: any, idx: number) => {
          if (!section.enabled) return null;
          const key = section.id || `${section.type}-${idx}`;

          switch (section.type) {
            case 'hero':
              return <section key={key} className="mb-10"><HeroCarousel /></section>;

            case 'panels':
              return <section key={key} className="mb-16"><HomePanels /></section>;

            case 'products': {
              const filter = section.settings?.filter;
              const limit = section.settings?.limit ?? (isMobile ? 4 : 5);
              const list = filter === 'best-sellers' ? bestSellers : filter === 'new' ? newStock : products.slice(0, limit);

              // Determine colors based on section type and theme
              const getColorScheme = () => {
                if (currentTheme === 'musclesports') {
                  if (filter === 'best-sellers') {
                    return {
                      bgGradient: 'bg-gradient-to-br from-amber-600 via-orange-500 to-red-500',
                      iconGradient: 'bg-gradient-to-br from-amber-700 to-red-600',
                      textGradient: 'bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent',
                      icon: (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      )
                    };
                  } else if (filter === 'new') {
                    return {
                      bgGradient: 'bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500',
                      iconGradient: 'bg-gradient-to-br from-green-700 to-teal-600',
                      textGradient: 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent',
                      icon: (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )
                    };
                  } else {
                    return {
                      bgGradient: 'bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500',
                      iconGradient: 'bg-gradient-to-br from-emerald-700 to-teal-600',
                      textGradient: 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent',
                      icon: (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )
                    };
                  }
                } else if (currentTheme === 'vera') {
                  return {
                    bgGradient: 'bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-500',
                    iconGradient: 'bg-gradient-to-br from-violet-700 to-fuchsia-600',
                    textGradient: 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent',
                    icon: (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )
                  };
                } else {
                  return {
                    bgGradient: 'bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600',
                    iconGradient: 'bg-gradient-to-br from-blue-500 to-indigo-600',
                    textGradient: 'bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-700 bg-clip-text text-transparent',
                    icon: (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )
                  };
                }
              };

              const colorScheme = getColorScheme();

              return (
                <section key={key} className="mb-16">
                  <div className="relative">
                    <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
                      <div className={`h-full w-full opacity-5 ${colorScheme.bgGradient}`}></div>
                    </div>

                    <div className="flex flex-col items-center text-center py-12 animate-slide-in-up">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-6 shadow-md ${colorScheme.iconGradient}`}>
                        {colorScheme.icon}
                      </div>
                      <h2 className="text-3xl font-bold mb-3 tracking-tight font-saira">
                        <span className={colorScheme.textGradient}>
                          {section.title ?? 'Products'}
                        </span>
                      </h2>
                      <p className="text-muted-foreground text-base max-w-md mb-0">{section.description ?? ''}</p>
                    </div>
                  </div>

                  {loading ? (
                    <SkeletonLoader type="product" count={isMobile ? 4 : 5} />
                  ) : (
                    <div className={`flex flex-wrap gap-6 ${
                      list.length < 5 ? 'justify-center' : 'justify-center lg:justify-start'
                    }`}>
                      {list.slice(0, limit).map((product) => (
                        <div 
                          key={product.id} 
                          className="w-[calc(50%-0.75rem)] sm:w-[calc(33.333%-1rem)] lg:w-[calc(20%-1.2rem)] min-w-[160px] max-w-[280px]"
                        >
                          <ProductCard product={product} hideDescription sectionType={filter} />
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
                <section key={key} className="mb-32 relative">
                  {/* Premium background with subtle gradient */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-b from-green-50/30 via-transparent to-transparent dark:from-green-950/10"></div>

                  <div className="text-center mb-16">
                    {/* Trustpilot-style Trust Badge */}
                    <div className="inline-flex items-center gap-3 mb-6">
                      <div className="flex items-center gap-2 px-4 py-2 bg-[#00B67A] rounded-lg shadow-lg">
                        <Star className="h-5 w-5 fill-white text-white" />
                        <span className="font-bold text-white text-sm tracking-wide">Trustpilot</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-6 w-6 fill-[#00B67A] text-[#00B67A]" />
                        ))}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-2xl font-bold text-foreground">4.8</span>
                        <span className="text-xs text-muted-foreground">Excellent</span>
                      </div>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold mb-3 text-foreground">
                      {section.title ?? 'Customer Reviews'}
                    </h2>
                    <p className="text-muted-foreground text-base max-w-2xl mx-auto">
                      {section.description ?? 'Real reviews from verified customers'}
                    </p>
                  </div>

                  {/* Trustpilot-inspired review cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12 lg:justify-items-center">
                    {displayedReviews.map((review, index) => (
                      <div 
                        key={review.id} 
                        className="group bg-background border border-border rounded-2xl p-6 hover:shadow-xl hover:border-[#00B67A]/30 transition-all duration-300 hover:-translate-y-1 w-full max-w-md"
                      >
                        {/* Header with stars and date */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-5 w-5 transition-all ${
                                  i < review.rating 
                                    ? 'fill-[#00B67A] text-[#00B67A]'
                                    : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                                }`} 
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                            {review.date}
                          </span>
                        </div>

                        {/* Review title (if present) */}
                        {review.title && (
                          <h3 className="text-base font-bold text-foreground mb-3 line-clamp-2">
                            {review.title}
                          </h3>
                        )}

                        {/* Review comment */}
                        <p className="text-sm text-foreground/80 leading-relaxed mb-6 line-clamp-4">
                          {review.comment}
                        </p>

                        {/* Footer with author info */}
                        <div className="flex items-center gap-3 pt-4 border-t border-border">
                          {/* Avatar with initials */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                            {(review.author || review.reviewer)?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-semibold text-sm text-foreground truncate">
                                {review.author || review.reviewer}
                              </p>
                              {review.verified && (
                                <svg className="w-4 h-4 text-[#00B67A] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {review.location || review.item || 'Verified Customer'}
                            </p>
                          </div>
                        </div>

                        {/* Verified badge (Trustpilot style) */}
                        {review.verified && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-medium">Verified purchase</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* CTA Section */}
                  <div className="text-center">
                    <div className="inline-flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl border border-green-200/50 dark:border-green-800/30">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Rated</span>
                        <span className="text-2xl font-bold text-foreground">4.8/5</span>
                        <span className="text-sm text-muted-foreground">based on</span>
                        <span className="font-bold text-foreground">{reviews.length}+ reviews</span>
                      </div>
                      {currentTheme !== 'musclesports' && (
                        <a 
                          href="https://www.ebay.co.uk/fdbk/feedback_profile/ordifydirectltd" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[#00B67A] hover:text-[#00B67A]/80 transition-colors group"
                        >
                          View all reviews
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </section>
              );

            case 'community-cta':
              return (
                <section key={key} className="mb-16">
                  <div className="relative overflow-hidden rounded-3xl border-2 border-gradient bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/30 dark:via-purple-950/30 dark:to-fuchsia-950/30">
                    {/* Abstract background elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full blur-3xl opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-fuchsia-400 to-pink-600 rounded-full blur-3xl opacity-20"></div>
                    
                    <div className="relative px-6 py-12 md:py-16 lg:px-12">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Left side - Content */}
                        <div>
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white mb-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="font-bold text-sm">NEW FEATURE</span>
                          </div>
                          
                          <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                            Join Our Community Hub
                          </h3>
                          
                          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
                            Connect with fellow fitness enthusiasts, watch expert educational videos on testosterone optimization, muscle building, and get real-time tips from our community.
                          </p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              </div>
                              <div>
                                <div className="font-semibold text-sm">Live Chat</div>
                                <div className="text-xs text-muted-foreground">Real-time community</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div>
                                <div className="font-semibold text-sm">Expert Videos</div>
                                <div className="text-xs text-muted-foreground">Curated content</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-950/50 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </div>
                              <div>
                                <div className="font-semibold text-sm">Testosterone Tips</div>
                                <div className="text-xs text-muted-foreground">Natural methods</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-950/50 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                              <div>
                                <div className="font-semibold text-sm">Health Guides</div>
                                <div className="text-xs text-muted-foreground">Science-backed</div>
                              </div>
                            </div>
                          </div>
                          
                          <a 
                            href="/community" 
                            className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                          >
                            Explore Community Hub
                            <svg 
                              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </a>
                        </div>
                        
                        {/* Right side - Visual Preview */}
                        <div className="hidden md:block">
                          <div className="relative">
                            {/* Mock chat window */}
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-violet-200 dark:border-violet-800 overflow-hidden">
                              <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                  <div className="w-3 h-3 rounded-full bg-white/30"></div>
                                  <div className="w-3 h-3 rounded-full bg-white/30"></div>
                                  <div className="w-3 h-3 rounded-full bg-white/30"></div>
                                </div>
                                <span className="text-white text-sm font-semibold ml-2">Community Chat</span>
                                <div className="ml-auto flex items-center gap-1.5">
                                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                  <span className="text-white/80 text-xs">Live</span>
                                </div>
                              </div>
                              <div className="p-4 space-y-3 h-48 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                                <div className="flex gap-2 items-start">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex-shrink-0"></div>
                                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-xs">
                                    <div className="font-semibold mb-1">FitnessPro</div>
                                    <div className="text-muted-foreground">Check out the testosterone guide! 🔥</div>
                                  </div>
                                </div>
                                <div className="flex gap-2 items-start">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex-shrink-0"></div>
                                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-xs">
                                    <div className="font-semibold mb-1">HealthGuru</div>
                                    <div className="text-muted-foreground">The videos are super helpful 💪</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Floating badges */}
                            <div className="absolute -top-4 -right-4 bg-gradient-to-br from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold flex items-center gap-2 animate-bounce">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                              New
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );

            case 'about-cta':
              return (
                <section key={key} className="mb-16">
                  <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-card dark:to-card/50">
                    {/* Subtle decorative gradient */}
                    <div className={`absolute top-0 right-0 w-96 h-96 opacity-5 blur-3xl ${
                      currentTheme === 'musclesports'
                        ? 'bg-green-500'
                        : currentTheme === 'vera'
                        ? 'bg-orange-500'
                        : 'bg-blue-500'
                    }`}></div>

                    {/* Content */}
                    <div className="relative px-6 py-12 md:py-16 lg:px-12 flex flex-col md:flex-row items-center gap-8">
                      {/* Left side - Icon and badge */}
                      <div className="flex-shrink-0">
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl shadow-lg ${
                          currentTheme === 'musclesports'
                            ? 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/30'
                            : currentTheme === 'vera'
                            ? 'bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-950/30 dark:to-red-950/30'
                            : 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30'
                        }`}>
                          <svg className={`w-10 h-10 ${
                            currentTheme === 'musclesports'
                              ? 'text-green-600 dark:text-green-400'
                              : currentTheme === 'vera'
                              ? 'text-orange-600 dark:text-orange-400'
                              : 'text-blue-600 dark:text-blue-400'
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>

                      {/* Middle - Text content */}
                      <div className="flex-1 text-center md:text-left">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                          currentTheme === 'musclesports'
                            ? 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400'
                            : currentTheme === 'vera'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                        }`}>
                          <span>✨</span>
                          <span>OUR STORY</span>
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-bold mb-2 font-saira">
                          {currentTheme === 'musclesports' 
                            ? 'Legacy Rebuilt. Performance Redefined.' 
                            : 'Discover Our Story'}
                        </h3>
                        
                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
                          {currentTheme === 'musclesports'
                            ? 'Learn about our journey from trusted legacy to modern excellence in sports nutrition and supplements.'
                            : 'Learn more about who we are, our mission, and why we\'re passionate about delivering quality.'}
                        </p>
                      </div>

                      {/* Right side - CTA Button */}
                      <div className="flex-shrink-0">
                        <a 
                          href="/about-us" 
                          className={`inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg group font-saira ${
                            currentTheme === 'musclesports'
                              ? 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700'
                              : currentTheme === 'vera'
                              ? 'bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
                          }`}
                        >
                          Learn More
                          <svg 
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </a>
                      </div>
                    </div>

                    {/* Bottom stats for MuscleSports only - more subtle */}
                    {currentTheme === 'musclesports' && (
                      <div className="relative border-t border-gray-200 dark:border-gray-800 px-6 py-6 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/10 dark:to-emerald-950/10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <div className="text-green-600 dark:text-green-400 font-bold text-lg">100%</div>
                            <div className="text-xs text-muted-foreground">Verified</div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="text-green-600 dark:text-green-400 font-bold text-lg">24/7</div>
                            <div className="text-xs text-muted-foreground">Support</div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="text-green-600 dark:text-green-400 font-bold text-lg">Next Day</div>
                            <div className="text-xs text-muted-foreground">Delivery</div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <div className="text-green-600 dark:text-green-400 font-bold text-lg">14 Days</div>
                            <div className="text-xs text-muted-foreground">Returns</div>
                          </div>
                        </div>

                        {/* New Features Section - Enhanced with Abstract Colors */}
                        <div className="mt-8 pt-6 border-t border-green-200 dark:border-green-800 relative overflow-hidden">
                          {/* Abstract background blobs */}
                          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
                          
                          <div className="relative text-center mb-8">
                            <div className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg">
                              <svg className="w-4 h-4 fill-white" viewBox="0 0 20 20">
                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                              </svg>
                              <span className="font-bold text-sm">NUTRITION TOOLS</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-2 font-saira bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                              AI-Powered Nutrition Planning
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                              AI-powered tools designed by nutrition experts to help you achieve your fitness goals faster
                            </p>
                          </div>

                          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5">
                            <a
                              href="/nutrition-calculator"
                              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-500 to-violet-500 p-[2px] hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl"
                            >
                              {/* Abstract shapes */}
                              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                              
                              <div className="relative flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl h-full">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <div className="font-bold text-blue-700 dark:text-blue-300 mb-1 text-lg">
                                    Nutrition Calculator
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    AI macro planning & meal timing
                                  </div>
                                </div>
                                <svg className="w-5 h-5 text-blue-600 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </div>
                            </a>

                            <a
                              href="/recipe-generator"
                              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-500 p-[2px] hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl"
                            >
                              {/* Abstract shapes */}
                              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500"></div>
                              
                              <div className="relative flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl h-full">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <div className="font-bold text-violet-700 dark:text-violet-300 mb-1 text-lg">
                                    Recipe Generator
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Macro-optimized meal recipes
                                  </div>
                                </div>
                                <svg className="w-5 h-5 text-violet-600 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              );

            case 'partners':
            default:
              // Hide partners section for MuscleSports theme
              if (currentTheme === 'musclesports') return null;
              
              const partners = [
                {
                  image: '/avasam-logo.webp',
                  name: 'Avasam',
                  description: 'Connect with our extensive product catalog through Avasam\'s dropshipping platform.'
                },
                {
                  image: '/syncee-banner.png',
                  name: 'Syncee',
                  description: 'Access thousands of products from our catalog via Syncee\'s seamless integration.'
                },
                {
                  image: '/cropped-Logo-600.png',
                  name: 'Direct Partnership',
                  description: 'Browse our comprehensive product range and grow your business with direct API access.'
                }
              ];
              
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
                    {partners.map((partner, idx) => (
                      <div key={idx} className={`group text-center p-8 bg-gradient-to-br from-white to-gray-50 dark:from-card dark:to-card/50 rounded-2xl hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/30 hover:-translate-y-2`}>
                        <div className="mb-6 flex justify-center">
                          <div className="w-48 h-48 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 p-6">
                            <Image 
                              src={partner.image} 
                              alt={partner.name} 
                              width={192}
                              height={192}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{partner.name}</h3>
                        <p className="text-muted-foreground leading-relaxed">{partner.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              );
          }
        })}
          </div>
        )}
      </>
    );
}
