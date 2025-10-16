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
                      bgGradient: 'bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500',
                      iconGradient: 'bg-gradient-to-br from-emerald-700 to-teal-600',
                      textGradient: 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent',
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
              
              // MuscleSports green color scheme for all review tiles
              const reviewColors = [
                { 
                  bg: 'bg-gradient-to-br from-green-700 via-emerald-600 to-teal-600',
                  icon: 'bg-gradient-to-br from-green-800 to-emerald-700',
                  star: 'text-green-300 fill-green-300',
                  text: 'text-green-100',
                  border: 'border-green-300/30'
                },
                { 
                  bg: 'bg-gradient-to-br from-emerald-700 via-green-600 to-teal-600',
                  icon: 'bg-gradient-to-br from-emerald-800 to-green-700',
                  star: 'text-emerald-300 fill-emerald-300',
                  text: 'text-emerald-100',
                  border: 'border-emerald-300/30'
                },
                { 
                  bg: 'bg-gradient-to-br from-teal-700 via-emerald-600 to-green-600',
                  icon: 'bg-gradient-to-br from-teal-800 to-emerald-700',
                  star: 'text-teal-300 fill-teal-300',
                  text: 'text-teal-100',
                  border: 'border-teal-300/30'
                },
                { 
                  bg: 'bg-gradient-to-br from-green-700 via-emerald-600 to-teal-600',
                  icon: 'bg-gradient-to-br from-green-800 to-emerald-700',
                  star: 'text-green-300 fill-green-300',
                  text: 'text-green-100',
                  border: 'border-green-300/30'
                },
                { 
                  bg: 'bg-gradient-to-br from-emerald-700 via-teal-600 to-green-600',
                  icon: 'bg-gradient-to-br from-emerald-800 to-teal-700',
                  star: 'text-emerald-300 fill-emerald-300',
                  text: 'text-emerald-100',
                  border: 'border-emerald-300/30'
                },
                { 
                  bg: 'bg-gradient-to-br from-teal-700 via-green-600 to-emerald-600',
                  icon: 'bg-gradient-to-br from-teal-800 to-green-700',
                  star: 'text-teal-300 fill-teal-300',
                  text: 'text-teal-100',
                  border: 'border-teal-300/30'
                },
              ];

              return (
                <section key={key} className="mb-20 relative">
                  {/* Abstract background shapes */}
                  <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                  </div>

                  <div className="text-center mb-16">
                    {/* MuscleSports x Trustpilot Badge */}
                    <div className="inline-flex items-center justify-center gap-4 px-8 py-4 rounded-2xl mb-6 bg-gradient-to-r from-green-700 to-emerald-700 shadow-2xl border-2 border-green-600">
                      <div className="flex items-center gap-2">
                        <div className="bg-white px-3 py-1.5 rounded-lg flex items-center gap-2">
                          <Star className="h-5 w-5 fill-[#00B67A] text-[#00B67A]" />
                          <span className="font-bold text-base text-[#00B67A]">Trustpilot</span>
                        </div>
                      </div>
                      <div className="h-8 w-px bg-white/30"></div>
                      <div className="flex flex-col items-start">
                        <div className="flex gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-white text-white" />
                          ))}
                        </div>
                        <span className="text-white font-bold text-sm">4.8 out of 5 stars</span>
                      </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 font-saira bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {section.title ?? 'What Our Customers Say'}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                      {section.description ?? (currentTheme === 'musclesports' ? 'Real reviews from verified MuscleSports customers on Trustpilot' : 'Real reviews from real customers')}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
                    {displayedReviews.map((review, index) => {
                      const colors = reviewColors[index % reviewColors.length];
                      
                      return (
                        <div 
                          key={review.id} 
                          className={`group relative overflow-hidden rounded-3xl ${colors.bg} p-[2px] hover:scale-105 transition-all duration-500 hover:shadow-2xl`}
                        >
                          {/* Abstract decorative elements */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500"></div>
                          
                          <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-3xl p-6 h-full">
                            {/* Star rating */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-5 w-5 transition-all duration-300 ${
                                      i < review.rating 
                                        ? colors.star
                                        : 'text-gray-300 fill-gray-300'
                                    }`} 
                                  />
                                ))}
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${colors.icon}`}>
                                {review.rating}.0
                              </div>
                            </div>

                            {/* Review comment with quote icon */}
                            <div className="relative mb-6">
                              <svg className="absolute -top-2 -left-2 w-8 h-8 text-gray-200 dark:text-gray-700" fill="currentColor" viewBox="0 0 32 32">
                                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2h2V8h-2zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2h2V8h-2z"/>
                              </svg>
                              <p className="text-foreground/90 leading-relaxed pl-6 pt-2 italic">
                                {review.comment}
                              </p>
                            </div>

                            {/* Author info with gradient accent */}
                            <div className="flex items-center gap-4 pt-4 border-t-2 border-gray-100 dark:border-gray-800">
                              <div className={`w-12 h-12 rounded-full ${colors.icon} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                {(review.author || review.reviewer)?.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-sm text-foreground">{review.author || review.reviewer}</p>
                                  {review.verified && (
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-950/50 px-2 py-0.5 rounded-full">
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
                        </div>
                      );
                    })}
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
