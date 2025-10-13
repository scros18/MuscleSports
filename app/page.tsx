"use client";

import { useState, useEffect } from "react";
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
    { id: 'best-sellers', type: 'products', enabled: true, order: 2, title: 'Best Sellers', settings: { limit: 5, filter: 'best-sellers' } },
    { id: 'new-stock', type: 'products', enabled: true, order: 3, title: 'New Stock', settings: { limit: 5, filter: 'new' } },
    { id: 'reviews', type: 'reviews', enabled: true, order: 4, title: 'Customer Reviews' },
    { id: 'about-cta', type: 'about-cta', enabled: true, order: 5, title: 'Our Story' },
    { id: 'partners', type: 'partners', enabled: true, order: 6, title: 'Business Partners' }
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
        <div className="container py-8">
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
                      bgGradient: 'bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500',
                      iconGradient: 'bg-gradient-to-br from-yellow-500 to-amber-600',
                      textGradient: 'bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-700 bg-clip-text text-transparent',
                      icon: (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      )
                    };
                  } else if (filter === 'new') {
                    return {
                      bgGradient: 'bg-gradient-to-br from-teal-400 via-cyan-400 to-sky-500',
                      iconGradient: 'bg-gradient-to-br from-teal-500 to-cyan-600',
                      textGradient: 'bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-700 bg-clip-text text-transparent',
                      icon: (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )
                    };
                  } else {
                    return {
                      bgGradient: 'bg-gradient-to-br from-green-500 via-emerald-500 to-green-600',
                      iconGradient: 'bg-gradient-to-br from-green-500 to-emerald-600',
                      textGradient: 'bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-transparent',
                      icon: (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )
                    };
                  }
                } else if (currentTheme === 'vera') {
                  return {
                    bgGradient: 'bg-gradient-to-br from-orange-500 via-red-500 to-amber-600',
                    iconGradient: 'bg-gradient-to-br from-orange-500 to-red-600',
                    textGradient: 'bg-gradient-to-r from-orange-600 via-red-500 to-amber-700 bg-clip-text text-transparent',
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
                <section key={key} className="mb-16">
                  <div className="text-center mb-12">
                    <div className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full mb-4 ${
                        currentTheme === 'musclesports'
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/15 dark:to-emerald-900/10 border border-green-200'
                          : 'bg-yellow-100 dark:bg-yellow-900/30'
                      }`}>
                        <Star className={`h-5 w-5 ${
                          currentTheme === 'musclesports'
                            ? 'text-green-800 fill-green-800'
                            : 'text-yellow-600 fill-yellow-600'
                        }`} />
                        <span className={`font-semibold ${
                          currentTheme === 'musclesports'
                            ? 'text-green-900 dark:text-green-200'
                            : 'text-yellow-700 dark:text-yellow-400'
                        }`}>Customer Reviews</span>
                      </div>
                    <h2 className="text-4xl font-bold mb-3 font-saira">{section.title ?? 'What Our Customers Say'}</h2>
                    <p className="text-muted-foreground text-lg">{section.description ?? (currentTheme === 'musclesports' ? 'Real reviews from verified MuscleSports customers' : 'Real reviews from real customers on eBay')}</p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto mb-12">
                    {displayedReviews.map((review) => (
                      <div 
                        key={review.id} 
                        className={`bg-white dark:bg-card p-6 rounded-2xl border-2 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] min-w-[280px] max-w-[400px] ${
                          currentTheme === 'musclesports'
                            ? 'border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600'
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary'
                        }`}
                      >
                        {/* Header with stars and date */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${
                                i < review.rating 
                                  ? currentTheme === 'musclesports'
                                    ? 'text-green-500 fill-green-500'
                                    : 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300 fill-gray-300'
                              }`} />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground font-medium">{review.date}</span>
                        </div>

                        {/* Review comment */}
                        <div className={`mb-4 p-4 rounded-xl ${
                            currentTheme === 'musclesports'
                              ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800'
                              : 'bg-gray-50 dark:bg-gray-900/30'
                          }`}>
                          <p className="text-sm leading-relaxed text-foreground/90 italic">&quot;{review.comment}&quot;</p>
                        </div>

                        {/* Author info */}
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md ${
              currentTheme === 'musclesports'
                ? 'bg-gradient-to-br from-green-700 to-emerald-800'
                : 'bg-gradient-to-br from-blue-500 to-purple-600'
                          }`}>
                            {(review.author || review.reviewer).charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-sm text-foreground">{review.author || review.reviewer}</p>
                              {review.verified && currentTheme === 'musclesports' && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-950/50 px-2 py-0.5 rounded-full">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  Verified
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{review.location || review.item}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {currentTheme !== 'musclesports' && (
                    <div className="text-center">
                      <a href="https://www.ebay.co.uk/fdbk/feedback_profile/ordifydirectltd" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-base bg-primary/10 hover:bg-primary/20 px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105">
                        View all reviews on eBay
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </a>
                    </div>
                  )}
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
                          href="/about" 
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
                            <img 
                              src={partner.image} 
                              alt={partner.name} 
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
