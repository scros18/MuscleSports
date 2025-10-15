"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { usePerformance } from "@/context/performance-context";
import { useState, useEffect } from "react";

interface PanelItem {
  title: string;
  img: string;
  category?: string;
  link?: string;
}

interface Panel {
  key: string;
  title: string;
  items: PanelItem[];
  link?: string;
}

export default function HomePanels() {
  const { settings } = usePerformance();
  const [currentTheme, setCurrentTheme] = useState<string>('ordify');

  // Detect theme changes
  useEffect(() => {
    const detectTheme = () => {
      const htmlClasses = document.documentElement.classList;
      if (htmlClasses.contains('theme-musclesports')) {
        setCurrentTheme('musclesports');
      } else if (htmlClasses.contains('theme-vera')) {
        setCurrentTheme('vera');
      } else {
        setCurrentTheme('ordify');
      }
    };

    detectTheme();
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);
  
  // MuscleSports categories for horizontal strip
  const muscleSportsCategories = [
    { 
      title: 'Protein Powders', 
      category: 'Protein',
      gradient: 'from-green-500 to-emerald-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    { 
      title: 'Supplements', 
      category: 'Supplements',
      gradient: 'from-blue-500 to-indigo-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    { 
      title: 'Vitamins & Minerals', 
      category: 'Vitamins',
      gradient: 'from-purple-500 to-pink-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    },
    { 
      title: 'Sports Nutrition', 
      category: 'Sports+Nutrition',
      gradient: 'from-orange-500 to-red-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      title: 'Pre-Workout', 
      category: 'Pre-Workout',
      gradient: 'from-teal-500 to-cyan-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    { 
      title: 'Amino Acids', 
      category: 'Amino+Acids',
      gradient: 'from-yellow-500 to-amber-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      )
    },
    { 
      title: 'Mass Gainers', 
      category: 'All-In-One+Gainer',
      gradient: 'from-rose-500 to-red-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
        </svg>
      )
    },
    { 
      title: 'Energy Bars', 
      category: 'Sports+Nutrition',
      gradient: 'from-lime-500 to-green-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
  ];
  
  // MuscleSports panels for Tropicana Wholesale
  const muscleSportsPanels: Panel[] = [
    {
      key: 'protein',
      title: 'Protein Powders',
      link: '/products?category=Protein',
      items: [
        { 
          title: 'Whey Protein', 
          img: 'https://www.tropicanawholesale.com/Images/Product/Default/large/OPT073.png',
          category: 'Protein',
          link: '/products?category=Protein'
        },
        { 
          title: 'Vegan Protein', 
          img: 'https://www.tropicanawholesale.com/Images/Product/Default/large/10X004.png',
          category: 'Protein',
          link: '/products?category=Protein'
        },
      ],
    },
    {
      key: 'supplements',
      title: 'Supplements',
      link: '/products?category=Amino+Acids',
      items: [
        { 
          title: 'Amino Acids', 
          img: 'https://www.tropicanawholesale.com/Images/Product/Default/large/TPG005.png',
          category: 'Amino Acids',
          link: '/products?category=Amino+Acids'
        },
        { 
          title: 'Pre-Workout', 
          img: 'https://www.tropicanawholesale.com/Images/Product/Default/large/10X014.png',
          category: 'Pre-Workout',
          link: '/products?category=Pre-Workout'
        },
      ],
    },
    {
      key: 'vitamins',
      title: 'Vitamins & Minerals',
      link: '/products?category=Vitamins',
      items: [
        { 
          title: 'Multivitamins', 
          img: 'https://www.tropicanawholesale.com/Images/Product/Default/large/HIM008.png',
          category: 'Vitamins',
          link: '/products?category=Vitamins'
        },
        { 
          title: 'Minerals', 
          img: 'https://www.tropicanawholesale.com/Images/Product/Default/large/HIM016.png',
          category: 'Minerals',
          link: '/products?category=Minerals'
        },
      ],
    },
    {
      key: 'nutrition',
      title: 'Sports Nutrition',
      link: '/products?category=Sports+Nutrition',
      items: [
        { 
          title: 'Energy Bars', 
          img: 'https://www.tropicanawholesale.com/Images/Product/Default/large/MAX020.png',
          category: 'Sports Nutrition',
          link: '/products?category=Sports+Nutrition'
        },
        { 
          title: 'Mass Gainers', 
          img: 'https://www.tropicanawholesale.com/Images/Product/Default/large/BN236.png',
          category: 'All-In-One Gainer',
          link: '/products?category=All-In-One+Gainer'
        },
      ],
    },
  ];

  // Ordify panels
  const ordifyPanels: Panel[] = [
    {
      key: 'top-offers',
      title: 'Top offers',
      link: '/products?featured=true',
      items: [
        { 
          title: 'Outdoor Furniture', 
          img: 'https://img.aosomcdn.com/100/product/2025/01/23/FAkd3d19493af4097.jpg',
          category: 'Garden & Outdoor',
          link: '/products?category=Garden+%26+Outdoor'
        },
        { 
          title: 'Home Storage', 
          img: 'https://img.aosomcdn.com/100/product/2025/07/25/vYO03a19842a63a06.jpg',
          category: 'Home Goods',
          link: '/products?category=Home+Goods'
        },
      ],
    },
    {
      key: 'popular-cats',
      title: 'Popular categories',
      link: '/products',
      items: [
        { 
          title: 'Pet Supplies', 
          img: 'https://img.aosomcdn.com/100/product/2025/04/01/Ml498a195ef2d51da.jpg',
          category: 'Pet Supplies',
          link: '/products?category=Pet+Supplies'
        },
        { 
          title: 'Sports & Leisure', 
          img: 'https://img.aosomcdn.com/100/product/2025/09/29/Z23ed0199938888db.jpg',
          category: 'Sports & Leisure',
          link: '/products?category=Sports+%26+Leisure'
        },
      ],
    },
    {
      key: 'vapes',
      title: 'Vapes',
      link: '/products?category=Vapes+%26+Accessories',
      items: [
        { 
          title: 'Starter Kits', 
          img: 'https://www.washingtonvapeswholesale.co.uk/cdn/shop/files/ivg-pro-12-kit-pack-of-5-washington-vapes-wholesale-627386_1800x1800.webp?v=1741749726',
          category: 'Vapes & Accessories',
          link: '/products?category=Vapes+%26+Accessories'
        },
        { 
          title: 'E-Liquids', 
          img: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop',
          category: 'Vapes & Accessories',
          link: '/products?category=Vapes+%26+Accessories'
        },
      ],
    },
    {
      key: 'more',
      title: 'Garden essentials',
      link: '/products?category=Garden+%26+Outdoor',
      items: [
        { 
          title: 'Garden Furniture', 
          img: 'https://img.aosomcdn.com/100/product/2025/04/01/Ml498a195ef2d51da.jpg',
          category: 'Garden & Outdoor',
          link: '/products?category=Garden+%26+Outdoor'
        },
        { 
          title: 'Planters & Beds', 
          img: 'https://img.aosomcdn.com/100/product/2024/09/05/xWU014191c08e5d1a.jpg',
          category: 'Garden & Outdoor',
          link: '/products?category=Garden+%26+Outdoor'
        },
      ],
    },
  ];

  // Choose panels based on theme
  const panels = currentTheme === 'musclesports' ? muscleSportsPanels : ordifyPanels;

  return (
    <div className="relative mt-8">
      {/* Themed color strip background - only for musclesports */}
      {currentTheme === 'musclesports' && (
        <div className="absolute inset-0 -z-10 rounded-2xl overflow-hidden">
          <div className="h-full w-full bg-gradient-to-br from-primary/8 via-primary/4 to-transparent"></div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {panels.map((panel) => (
          <div 
            key={panel.key} 
            className={`bg-card/98 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-lg overflow-hidden border border-border/40 hover:border-primary/20 ${
              settings.animationsEnabled
                ? 'transition-all duration-300 ease-out hover:-translate-y-1'
                : 'transition-shadow duration-200'
            }`}
          >
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground">{panel.title}</h3>
              {panel.link && (
                <Link 
                  href={panel.link}
                  className="text-primary hover:text-primary/80 transition-all duration-200 hover:scale-110"
                  aria-label={`View all ${panel.title}`}
                >
                  <ArrowRight className="h-5 w-5" />
                </Link>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              {panel.items.map((item, idx) => (
                <Link 
                  key={idx} 
                  href={item.link || `/products?category=${encodeURIComponent(item.category || item.title)}`}
                  className={`group relative block rounded-lg overflow-hidden bg-muted/30 hover:bg-muted/50 hover:shadow-md ${
                    settings.animationsEnabled
                      ? 'transition-all duration-300 ease-out active:scale-95'
                      : 'transition-colors duration-200'
                  }`}
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-50 dark:bg-gray-800">
                    <Image
                      src={item.img}
                      alt={item.title}
                      width={200}
                      height={200}
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                      className={`transition-transform duration-500 ease-out w-full h-full ${
                        item.title.includes('E-Liquid') || item.title.includes('Starter Kit') 
                          ? 'object-contain p-2' 
                          : 'object-cover'
                      }`}
                      unoptimized
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1">
                      {item.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {panel.link && (
              <Link 
                href={panel.link}
                className="block w-full text-center text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-all duration-200 py-3 active:scale-95 shadow-sm hover:shadow-md"
              >
                See more {panel.title.toLowerCase()}
              </Link>
            )}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
}
