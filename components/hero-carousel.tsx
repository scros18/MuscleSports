"use client";

import React, { useEffect, useRef, useState } from "react";

type Slide = {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
};

const slides: Slide[] = [
  {
    id: 1,
    title: "AUTUMN COLLECTION",
    subtitle: "New Season Arrivals",
    image:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a7f9d2b2a1f5f6b9a2b4e0f0a2d3c1b",
  },
  {
    id: 2,
    title: "WEEKLY SPECIALS",
    subtitle: "Limited Time Offers",
    image:
      "https://images.unsplash.com/photo-1606813902803-8cdbf1b5d9d7?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=3c5c8c5f2e4a6b7a8c9d0e1f2a3b4c5d",
  },
  {
    id: 3,
    title: "FREE SHIPPING",
    subtitle: "Orders Over £50",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=4c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }

  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }

  // Keyboard navigation
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    }
  }

  // Touch navigation (swipe)
  function onTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    const threshold = 40; // px
    if (delta > threshold) prev();
    else if (delta < -threshold) next();
  }

  return (
    <div
      className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg"
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotions"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`pointer-events-none w-full h-64 md:h-96 bg-center bg-cover absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{ backgroundImage: `url(${s.image})` }}
          aria-hidden={i !== index}
        >
          <div className="w-full h-full bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center">
            <div className="container px-8 md:px-16">
              <div className="max-w-xl md:max-w-2xl">
                {/* Main Title - Bold & Masculine */}
                <h2 className="text-white text-3xl md:text-6xl font-black tracking-tight leading-none mb-2 md:mb-3 drop-shadow-2xl uppercase">
                  {s.title}
                </h2>
                
                {/* Subtitle with accent line */}
                {s.subtitle && (
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="h-0.5 w-10 md:w-14 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <p className="text-white text-base md:text-xl font-bold tracking-wide drop-shadow-lg uppercase">
                      {s.subtitle}
                    </p>
                  </div>
                )}
                
                {/* Shop Now CTA */}
                <button className="mt-5 md:mt-6 bg-white text-black px-6 md:px-10 py-2.5 md:py-3.5 rounded-full font-black text-xs md:text-sm uppercase tracking-wider hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-95">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Left / Right controls - Enhanced */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          prev();
        }}
        aria-label="Previous"
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-2.5 md:p-3 rounded-full shadow-xl border-2 border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/50 group"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5 text-black font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          next();
        }}
        aria-label="Next"
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-2.5 md:p-3 rounded-full shadow-xl border-2 border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/50 group"
      >
        <svg className="w-4 h-4 md:w-5 md:h-5 text-black font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-3 w-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white/80 ${
              i === index ? "bg-white" : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
