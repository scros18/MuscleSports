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
    title: "The perfect autumn fits",
    subtitle: "Shop our seasonal picks",
    image:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a7f9d2b2a1f5f6b9a2b4e0f0a2d3c1b",
  },
  {
    id: 2,
    title: "Top offers this week",
    subtitle: "Limited time deals on top brands",
    image:
      "https://images.unsplash.com/photo-1606813902803-8cdbf1b5d9d7?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=3c5c8c5f2e4a6b7a8c9d0e1f2a3b4c5d",
  },
  {
    id: 3,
    title: "Free shipping over £50",
    subtitle: "Fast delivery across the UK",
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
          <div className="w-full h-full bg-gradient-to-r from-black/60 to-transparent flex items-center">
            <div className="container px-4 md:px-0">
              <div className="max-w-lg md:ml-12 text-left">
                <h2 className="text-white text-3xl md:text-5xl font-bold">{s.title}</h2>
                {s.subtitle && (
                  <p className="text-white/80 mt-2">{s.subtitle}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Left / Right controls */}
      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 rounded-full shadow border backdrop-blur pointer-events-auto focus:outline-none focus:ring-2 focus:ring-primary"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 rounded-full shadow border backdrop-blur pointer-events-auto focus:outline-none focus:ring-2 focus:ring-primary"
      >
        ›
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
