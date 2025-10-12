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
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {panels.map((panel) => (
        <div 
          key={panel.key} 
          className={`bg-card rounded-xl shadow-md hover:shadow-xl overflow-hidden border border-border/50 hover:border-primary/30 ${
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
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                      className={`transition-transform duration-500 ease-out ${
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
                className="block w-full text-center text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-all duration-200 py-2 active:scale-95"
              >
                See more
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
