"use client";

import { useEffect, useState } from "react";
import { DynamicPageTitle } from "@/components/dynamic-page-title";

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

export default function AboutPage() {
  const [currentTheme, setCurrentTheme] = useState('ordify');

  // Detect theme and watch for changes
  useEffect(() => {
    setCurrentTheme(getCurrentTheme());
    const observer = new MutationObserver(() => setCurrentTheme(getCurrentTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // MuscleSports About Page
  if (currentTheme === 'musclesports') {
    return (
      <>
        <DynamicPageTitle pageTitle="About Us | MuscleSports - Legacy Rebuilt" />
        <div className="container py-12 max-w-6xl mx-auto px-4">
          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h2 className="text-sm font-bold tracking-widest text-green-600 dark:text-green-400 mb-4 uppercase">
              Welcome to MuscleSports
            </h2>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-saira">
              <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-transparent">
                Legacy Rebuilt. Performance Redefined.
              </span>
            </h1>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              MuscleSports isn&apos;t just a supplement store—it&apos;s heritage in motion. Originally built by my father, it grew into a trusted destination for results-driven athletes and health enthusiasts. We&apos;re bringing it back—sharper, faster, and more focused—with a new generation of products and purpose.
            </p>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-8 mb-8 border border-green-200 dark:border-green-800">
              <p className="text-foreground leading-relaxed mb-4">
                <strong>We&apos;re dialled in on the formulas that matter:</strong>
              </p>
              <p className="text-foreground leading-relaxed">
                Nootropics for next-level mental clarity, Gut Health for sustained performance, Premium Sports supplements with verified ingredients.
              </p>
            </div>

            <p className="text-lg text-muted-foreground italic border-l-4 border-green-600 pl-6 py-2 mb-12">
              If it&apos;s on our shelves, it&apos;s been vetted, tested, and earned its place.
            </p>
          </div>

          {/* Vision & Mission Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Vision */}
            <div className="bg-white dark:bg-card rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold font-saira">OUR VISION</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To re-establish MuscleSports as a leading, trustworthy platform for performance-focused supplements and health products in the United Kingdom. We aim to offer a curated selection of scientifically-backed formulations that support physical strength, mental clarity, and long-term well-being.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Through transparency, rigorous standards, and responsive service, we seek to become a reliable resource for athletes, wellness enthusiasts, and everyday individuals committed to improvement.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white dark:bg-card rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold font-saira">OUR MISSION</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                MuscleSports exists to honour a legacy built on integrity and results. By combining modern digital tools with traditional values, we deliver high-quality supplements that meet UK compliance standards and exceed customer expectations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We believe that optimal health is achieved through informed choices, reliable products, and consistent support. Our mission is to help our customers reach their goals—naturally and confidently.
              </p>
            </div>
          </div>

          {/* Service Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-bold text-sm mb-2 font-saira">NEXT DAY DELIVERY</h3>
              <p className="text-xs text-green-600 dark:text-green-400 font-semibold">MORE INFO</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm mb-2 font-saira">14 DAYS RETURN</h3>
              <p className="text-xs text-green-600 dark:text-green-400 font-semibold">MORE INFO</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm mb-2 font-saira">24/7 SUPPORT</h3>
              <p className="text-xs text-green-600 dark:text-green-400 font-semibold">MORE INFO</p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm mb-2 font-saira">100% PAYMENT SECURE</h3>
              <p className="text-xs text-green-600 dark:text-green-400 font-semibold">MORE INFO</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Default About Page for other themes
  return (
    <>
      <DynamicPageTitle pageTitle="About Us" />
      <div className="container py-12 max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">About Us</h1>
        
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Welcome to our store! We are dedicated to providing quality products and exceptional customer service.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Founded with a passion for excellence, we&apos;ve built our business on trust, quality, and customer satisfaction. 
            Our team works tirelessly to source the best products and deliver them to your doorstep.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            To provide our customers with high-quality products, competitive prices, and outstanding service. 
            We believe in building lasting relationships with our customers through transparency and reliability.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">Why Choose Us?</h2>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Fast and reliable shipping</li>
            <li>Quality guaranteed products</li>
            <li>Excellent customer support</li>
            <li>Secure payment options</li>
            <li>Easy returns and exchanges</li>
          </ul>
        </div>
      </div>
    </>
  );
}
