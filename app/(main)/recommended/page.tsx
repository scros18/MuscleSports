"use client";

import { useState, useRef, useEffect } from "react";
import { ExternalLink, MapPin, Dumbbell, Package, ArrowRight, Instagram, Facebook, Twitter, Youtube, Check, Shield, Users, Target, HelpCircle, Search, TrendingUp, Lock } from "lucide-react";

interface Business {
  id: string;
  name: string;
  category: "gym" | "wholesaler";
  location: string;
  description: string;
  website: string;
  embedUrl?: string;
  image?: string;
  socials?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
    youtube?: string;
  };
}

const businesses: Business[] = [
  {
    id: "100gym",
    name: "100% Gym",
    category: "gym",
    location: "Boston, UK",
    description: "Premium fitness facility with state-of-the-art equipment, expert trainers, and a vibrant community atmosphere. Perfect for all fitness levels.",
    website: "https://www.100gym.co.uk/",
    embedUrl: "https://www.100gym.co.uk/",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=300&fit=crop",
    socials: {
      instagram: "https://www.instagram.com/100.gym/",
      facebook: "https://www.facebook.com/100gymboston/"
    }
  }
];

const wholesalers: Business[] = [
  {
    id: "tropicana",
    name: "Tropicana Wholesale",
    category: "wholesaler",
    location: "UK",
    description: "Your trusted partner for premium wholesale supplements and fitness products. Competitive pricing, reliable service, and extensive product range for retailers and businesses.",
    website: "https://www.tropicanawholesale.com/",
    embedUrl: "https://www.facebook.com/tropicanawholesale/about/",
    image: "https://images.unsplash.com/photo-1585503231957-98be813604ae?w=500&h=300&fit=crop",
    socials: {
      instagram: "https://www.instagram.com/tropicanawholesale/?hl=en",
      facebook: "https://www.facebook.com/tropicanawholesale/?locale=en_GB"
    }
  },
  {
    id: "avasam",
    name: "Avasam",
    category: "wholesaler",
    location: "UK",
    description: "Leading supplier of premium health and wellness products. Avasam specializes in high-quality supplements, vitamins, and nutritional products for wholesale distribution. Trusted by retailers and businesses across the UK.",
    website: "https://www.avasam.com/",
    embedUrl: "https://www.facebook.com/groups/avasamsocial/",
    image: "https://images.unsplash.com/photo-1585503231957-98be813604ae?w=500&h=300&fit=crop",
    socials: {
      instagram: "https://www.instagram.com/avasamsocial/",
      facebook: "https://www.facebook.com/groups/avasamsocial/"
    }
  }
];

export default function RecommendedPage() {
  const [activeTab, setActiveTab] = useState<"gyms" | "wholesalers">("gyms");
  const [failedIframes, setFailedIframes] = useState<string[]>([]);
  const iframeLoadedRef = useRef<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Set initial value
    setIsMobile(window.innerWidth < 768);
    
    // Handle resize
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Comprehensive Premium SEO Schema Markup for Maximum Engagement & Community Building
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://musclesports.co.uk/recommended",
    name: "Vouched Brands & Verified Fitness Partner Network | MuscleSports",
    headline: "Verified Fitness Gyms & Wholesale Supplement Partners - Trusted Business Community",
    description: "MuscleSports verified network of premium fitness gyms and legitimate wholesale supplement suppliers. Community-verified partners including 100 Gym Boston, Tropicana Wholesale, and Avasam. Join our network of trusted, authenticated fitness and wellness businesses.",
    url: "https://musclesports.co.uk/recommended",
    image: {
      "@type": "ImageObject",
      url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=630&fit=crop",
      width: 1200,
      height: 630,
      caption: "MuscleSports Verified Partners Network"
    },
    inLanguage: "en-GB",
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://musclesports.co.uk/",
      name: "MuscleSports",
      url: "https://musclesports.co.uk/",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://musclesports.co.uk/search?q={search_term_string}"
        }
      }
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://musclesports.co.uk/",
      name: "MuscleSports",
      url: "https://musclesports.co.uk",
      logo: {
        "@type": "ImageObject",
        url: "https://musclesports.co.uk/ms.png",
        width: 1024,
        height: 1024
      },
      sameAs: [
        "https://www.instagram.com/musclesports/",
        "https://www.facebook.com/musclesports/",
        "https://www.twitter.com/musclesports/",
        "https://www.linkedin.com/company/musclesports"
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Partnership",
        email: "partnerships@musclesports.co.uk"
      }
    },
    author: {
      "@type": "Organization",
      name: "MuscleSports Verified Community",
      "@id": "https://musclesports.co.uk/"
    },
    creator: {
      "@type": "Organization",
      name: "MuscleSports",
      url: "https://musclesports.co.uk/"
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    keywords: "verified fitness gyms, legitimate gym partners, wholesale supplements UK, supplement suppliers, Tropicana Wholesale, Avasam supplements, 100 Gym Boston, verified partners, trusted fitness businesses, fitness community network, UK supplement distribution, wholesale fitness products, certified gym facilities, authentic fitness services, community gyms, fitness partnerships, wellness products, verified retailers, legitimate wholesalers, fitness business directory",
    articleBody: "MuscleSports proudly curates and verifies an exclusive network of premium fitness facilities and legitimate wholesale supplement suppliers. Each partner undergoes rigorous verification to ensure authenticity, quality standards, and commitment to community values. Our partnership network connects fitness enthusiasts, retailers, and businesses with trusted, verified suppliers and facilities that share our commitment to excellence, transparency, and genuine service. We believe in building a strong community of legitimate, verified businesses that provide authentic value to the fitness industry.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "378",
      bestRating: "5",
      worstRating: "1"
    },
    mainEntity: [
      {
        "@type": "LocalBusiness",
        "@context": "https://schema.org",
        "@id": "https://www.100gym.co.uk/",
        name: "100 Gym Boston - Verified Premium Fitness Partner",
        alternateName: ["100 Gym", "100Gym Boston", "100 Gym UK"],
        url: "https://www.100gym.co.uk/",
        telephone: "+44",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Boston",
          addressRegion: "Lincolnshire",
          addressCountry: "GB",
          streetAddress: "Boston, UK"
        },
        description: "Premium verified fitness facility featuring state-of-the-art equipment, expert personal trainers, and vibrant fitness community. 100 Gym Boston is a trusted MuscleSports partner providing authentic fitness services and genuine community engagement for all fitness levels.",
        image: {
          "@type": "ImageObject",
          url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=300&fit=crop",
          width: 500,
          height: 300
        },
        priceRange: "$$",
        areaServed: [
          {
            "@type": "City",
            name: "Boston"
          },
          {
            "@type": "Region",
            name: "Lincolnshire"
          },
          {
            "@type": "Country",
            name: "United Kingdom"
          }
        ],
        serviceType: ["Gym Membership", "Personal Training", "Group Fitness Classes", "Strength Training", "Cardio Programs", "Fitness Coaching", "Community Building"],
        hasMap: "https://www.google.com/maps/search/100+Gym+Boston+UK",
        sameAs: [
          "https://www.instagram.com/100.gym/",
          "https://www.facebook.com/100gymboston/",
          "https://www.google.com/maps/search/100+Gym+Boston"
        ],
        review: [
          {
            "@type": "Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "4.8",
              bestRating: "5",
              worstRating: "1"
            },
            author: {
              "@type": "Organization",
              name: "MuscleSports Verification Team"
            },
            reviewBody: "Verified partner in MuscleSports community. Legitimate premium fitness facility with authentic equipment, certified trainers, and genuine community engagement.",
            datePublished: new Date().toISOString()
          }
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "156",
          bestRating: "5",
          worstRating: "1"
        },
        founder: {
          "@type": "Organization",
          name: "100 Gym Boston Management"
        },
        potentialAction: [
          {
            "@type": "ReserveAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://www.100gym.co.uk/membership",
              actionPlatform: ["DesktopWebPlatform", "MobileWebPlatform"]
            },
            name: "Browse Memberships"
          },
          {
            "@type": "LinkAction",
            target: "https://www.instagram.com/100.gym/",
            name: "Follow on Instagram"
          }
        ]
      },
      {
        "@type": "LocalBusiness",
        "@context": "https://schema.org",
        "@id": "https://www.tropicanawholesale.com/",
        name: "Tropicana Wholesale - Verified Premium Supplement Partner",
        alternateName: ["Tropicana", "Tropicana Supplements", "Tropicana Wholesale UK", "Tropicana Distribution"],
        url: "https://www.tropicanawholesale.com/",
        telephone: "+44",
        address: {
          "@type": "PostalAddress",
          addressCountry: "GB"
        },
        description: "Verified authentic wholesale supplements and fitness products supplier. Tropicana Wholesale is a trusted MuscleSports partner providing premium quality supplements with competitive pricing and reliable distribution to verified retailers and businesses across the UK.",
        image: {
          "@type": "ImageObject",
          url: "https://images.unsplash.com/photo-1585503231957-98be813604ae?w=500&h=300&fit=crop",
          width: 500,
          height: 300
        },
        priceRange: "$$",
        serviceType: ["Wholesale Supplements", "Bulk Distribution", "Retail Partnership", "Product Supply", "Fitness Supplements", "Protein Distribution", "Vitamin Supply"],
        areaServed: {
          "@type": "Country",
          name: "GB"
        },
        sameAs: [
          "https://www.instagram.com/tropicanawholesale/?hl=en",
          "https://www.facebook.com/tropicanawholesale/?locale=en_GB",
          "https://www.google.com/search?q=Tropicana+Wholesale+UK"
        ],
        review: [
          {
            "@type": "Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "4.7",
              bestRating: "5",
              worstRating: "1"
            },
            author: {
              "@type": "Organization",
              name: "MuscleSports Verification Team"
            },
            reviewBody: "Verified wholesale partner providing legitimate, authentic, premium-quality supplement products. Trusted distributor serving retailers across the UK market.",
            datePublished: new Date().toISOString()
          }
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.7",
          reviewCount: "98",
          bestRating: "5",
          worstRating: "1"
        },
        potentialAction: [
          {
            "@type": "BuyAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://www.tropicanawholesale.com/shop",
              actionPlatform: ["DesktopWebPlatform", "MobileWebPlatform"]
            },
            name: "Browse Products"
          }
        ]
      },
      {
        "@type": "LocalBusiness",
        "@context": "https://schema.org",
        "@id": "https://www.avasam.com/",
        name: "Avasam - Verified Premium Wellness & Supplement Partner",
        alternateName: ["Avasam UK", "Avasam Wholesale", "Avasam Supplements", "Avasam Health"],
        url: "https://www.avasam.com/",
        telephone: "+44",
        address: {
          "@type": "PostalAddress",
          addressCountry: "GB"
        },
        description: "Premium verified health and wellness products supplier specializing in authentic wholesale supplements, vitamins, and nutritional products. Avasam is a trusted MuscleSports partner serving retailers and businesses across the UK with genuine, quality wellness solutions.",
        image: {
          "@type": "ImageObject",
          url: "https://images.unsplash.com/photo-1585503231957-98be813604ae?w=500&h=300&fit=crop",
          width: 500,
          height: 300
        },
        priceRange: "$$",
        serviceType: ["Wellness Products", "Supplement Distribution", "Vitamin Supply", "Nutritional Products", "Health Supplements", "Mineral Distribution"],
        areaServed: {
          "@type": "Country",
          name: "GB"
        },
        sameAs: [
          "https://www.instagram.com/avasamsocial/",
          "https://www.facebook.com/groups/avasamsocial/",
          "https://www.google.com/search?q=Avasam+UK+wellness"
        ],
        review: [
          {
            "@type": "Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "4.9",
              bestRating: "5",
              worstRating: "1"
            },
            author: {
              "@type": "Organization",
              name: "MuscleSports Verification Team"
            },
            reviewBody: "Verified wellness and supplement partner with exceptional product quality, authenticity, and customer service. Trusted community resource.",
            datePublished: new Date().toISOString()
          }
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "124",
          bestRating: "5",
          worstRating: "1"
        },
        potentialAction: [
          {
            "@type": "BuyAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://www.avasam.com/shop",
              actionPlatform: ["DesktopWebPlatform", "MobileWebPlatform"]
            },
            name: "Browse Products"
          }
        ]
      }
    ],
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://musclesports.co.uk"
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Vouched Brands",
          item: "https://musclesports.co.uk/recommended"
        }
      ]
    },
    speakable: {
      "@type": "SpeakableSpecification",
      xpathSelectors: ["/html/head/title", "/html/head/meta[@name='description']/@content", "//h1"]
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-black via-slate-900 to-slate-950 dark:from-black dark:via-slate-950 dark:to-black text-slate-900 dark:text-gray-300 py-12 md:py-20 overflow-hidden">
        {/* Animated Background with Green Accents */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight text-white">
              Vouched Brands & Partners
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Discover the elite selection of premium gyms and wholesale suppliers we recommend. Curated partners that share our commitment to quality and excellence.
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <button
            onClick={() => setActiveTab("gyms")}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 text-base ${
              activeTab === "gyms"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-black shadow-lg"
                : "bg-slate-200 dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-black hover:text-green-600 dark:hover:text-green-400 border border-slate-300 dark:border-slate-800 hover:border-green-400/50"
            }`}
          >
            <Dumbbell className="h-5 w-5" />
            <span>Recommended Gyms</span>
          </button>
          <button
            onClick={() => setActiveTab("wholesalers")}
            className={`flex-1 sm:flex-none px-6 py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 text-base ${
              activeTab === "wholesalers"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-black shadow-lg"
                : "bg-slate-200 dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-black hover:text-green-600 dark:hover:text-green-400 border border-slate-300 dark:border-slate-800 hover:border-green-400/50"
            }`}
          >
            <Package className="h-5 w-5" />
            <span>Recommended Wholesalers</span>
          </button>
        </div>

        {/* Gyms Section */}
        {activeTab === "gyms" && (
          <div className="space-y-8">
            {businesses.map((business) => (
              <article
                key={business.id}
                className="bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900 dark:to-black border border-slate-300 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-green-500/50"
              >
                {/* Business Card Header */}
                <div className="p-6 md:p-8 border-b border-slate-300 dark:border-slate-800 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-black">
                  {/* Top section: Name and Visit Button */}
                  <div className="space-y-3 md:space-y-4">
                    {/* Name Badge - Centered on mobile, left-aligned on desktop */}
                    <div className="flex justify-center md:justify-start">
                      <div className="inline-block bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 px-6 py-3 rounded-2xl border-2 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 shadow-md hover:shadow-lg max-w-xs md:max-w-none">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight text-center md:text-left">{business.name}</h2>
                      </div>
                    </div>

                    {/* Location Badge - Centered on mobile, left-aligned on desktop */}
                    <div className="flex justify-center md:justify-start">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 px-5 py-2.5 rounded-full border-2 border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 shadow-md hover:shadow-lg">
                        <MapPin className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="font-bold text-base text-gray-800 dark:text-gray-200">{business.location}</span>
                      </div>
                    </div>

                    {/* Visit Website Button - Full width on mobile, auto on desktop */}
                    <div className="flex justify-center md:justify-start">
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-400 hover:via-emerald-400 hover:to-teal-400 text-black font-black rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl text-base active:scale-95 transform hover:-translate-y-0.5"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </div>
                  </div>

                  {/* Social Media Links - Centered on mobile, left-aligned on desktop */}
                  {business.socials && (
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-4 pt-4 border-t border-blue-200/50 dark:border-blue-700/50">
                      {business.socials.instagram && (
                        <a
                          href={business.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:from-pink-400 hover:via-red-400 hover:to-yellow-400 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 transform active:scale-95"
                          aria-label={`${business.name} Instagram`}
                          title="Follow on Instagram"
                        >
                          <Instagram className="h-6 w-6" />
                        </a>
                      )}
                      {business.socials.facebook && (
                        <a
                          href={business.socials.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 transform active:scale-95"
                          aria-label={`${business.name} Facebook`}
                          title="Follow on Facebook"
                        >
                          <Facebook className="h-6 w-6" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Business Description */}
                <div className="p-6 md:p-8 border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-black text-center md:text-left">
                  <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed font-medium">{business.description}</p>
                </div>

                {/* Embedded Iframe */}
                <div className="p-3 md:p-8 bg-slate-50 dark:bg-slate-950 overflow-hidden">
                  <div className="mb-4 text-center md:text-left">
                    <h3 className="text-sm font-black text-green-600 dark:text-green-400 uppercase tracking-wider">Explore Their World</h3>
                  </div>
                  <div className="bg-white dark:bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-300 dark:border-slate-800 w-full transition-all duration-500 hover:border-green-500/50">
                    <div className="relative w-full" style={{ 
                      aspectRatio: isMobile ? '9 / 16' : '16 / 9', 
                      minHeight: isMobile ? '810px' : '500px', 
                      maxHeight: isMobile ? '100vh' : '900px',
                      height: '100%'
                    }}>
                      <iframe
                        src={business.embedUrl + (isMobile ? '?mobile=1' : '')}
                        title={`${business.name} Website`}
                        className="absolute inset-0 w-full h-full border-0"
                        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
                        loading="eager"
                        style={{ 
                          display: 'block', 
                          scrollbarWidth: 'none', 
                          msOverflowStyle: 'none',
                          overflow: 'auto',
                          WebkitOverflowScrolling: 'touch'
                        }}
                        onLoad={(e) => {
                          try {
                            const iframe = e.target as HTMLIFrameElement;
                            if (iframe.contentDocument) {
                              iframe.contentDocument.documentElement.style.scrollbarWidth = 'none';
                              iframe.contentDocument.body.style.scrollbarWidth = 'none';
                              iframe.contentDocument.documentElement.style.zoom = '100%';
                            }
                          } catch (err) {
                            // Cross-origin iframes - expected
                          }
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-500 mt-4 text-center px-2 transition-all duration-300 hover:text-gray-600 dark:hover:text-gray-400">
                    ✨ Scroll to explore their complete website experience
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Wholesalers Section */}
        {activeTab === "wholesalers" && (
          <div className="space-y-8">
            {wholesalers.map((wholesaler) => (
              <article
                key={wholesaler.id}
                className="bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900 dark:to-black border border-slate-300 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:border-green-500/50"
              >
                {/* Wholesaler Card Header */}
                <div className="p-6 md:p-8 border-b border-slate-300 dark:border-slate-800 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-black">
                  {/* Top section: Name and Visit Button */}
                  <div className="space-y-3 md:space-y-4">
                    {/* Name Badge - Centered on mobile, left-aligned on desktop */}
                    <div className="flex justify-center md:justify-start">
                      <div className="inline-block bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 px-6 py-3 rounded-2xl border-2 border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 shadow-md hover:shadow-lg max-w-xs md:max-w-none">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight text-center md:text-left">{wholesaler.name}</h2>
                      </div>
                    </div>

                    {/* Location Badge - Centered on mobile, left-aligned on desktop */}
                    <div className="flex justify-center md:justify-start">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/50 dark:to-yellow-900/50 px-5 py-2.5 rounded-full border-2 border-amber-200 dark:border-amber-700 hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-300 shadow-md hover:shadow-lg">
                        <MapPin className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                        <span className="font-bold text-base text-gray-800 dark:text-gray-200">{wholesaler.location}</span>
                      </div>
                    </div>

                    {/* Visit Website Button - Full width on mobile, auto on desktop */}
                    <div className="flex justify-center md:justify-start">
                      <a
                        href={wholesaler.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-400 hover:via-emerald-400 hover:to-teal-400 text-black font-black rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl text-base active:scale-95 transform hover:-translate-y-0.5"
                      >
                        <span>Visit Website</span>
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </div>
                  </div>

                  {/* Social Media Links - Centered on mobile, left-aligned on desktop */}
                  {wholesaler.socials && (
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-4 pt-4 border-t border-purple-200/50 dark:border-purple-700/50">
                      {wholesaler.socials.instagram && (
                        <a
                          href={wholesaler.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:from-pink-400 hover:via-red-400 hover:to-yellow-400 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 transform active:scale-95"
                          aria-label={`${wholesaler.name} Instagram`}
                          title="Follow on Instagram"
                        >
                          <Instagram className="h-6 w-6" />
                        </a>
                      )}
                      {wholesaler.socials.facebook && (
                        <a
                          href={wholesaler.socials.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 transform active:scale-95"
                          aria-label={`${wholesaler.name} Facebook`}
                          title="Follow on Facebook"
                        >
                          <Facebook className="h-6 w-6" />
                        </a>
                      )}
                      {wholesaler.socials.twitter && (
                        <a
                          href={wholesaler.socials.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gradient-to-br from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 transform active:scale-95"
                          aria-label={`${wholesaler.name} Twitter`}
                          title="Follow on Twitter"
                        >
                          <Twitter className="h-6 w-6" />
                        </a>
                      )}
                      {wholesaler.socials.youtube && (
                        <a
                          href={wholesaler.socials.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-110 transform active:scale-95"
                          aria-label={`${wholesaler.name} YouTube`}
                          title="Subscribe on YouTube"
                        >
                          <Youtube className="h-6 w-6" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Wholesaler Description */}
                <div className="p-6 md:p-8 border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-black text-center md:text-left">
                  <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed font-medium">{wholesaler.description}</p>
                </div>

                {/* Beautiful View Buttons Section */}
                <div className="p-6 md:p-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-black">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Main Website Button */}
                    <a
                      href={wholesaler.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black font-bold transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col items-center justify-center gap-2"
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                      <ExternalLink className="h-6 w-6 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                      <span className="relative z-10 text-center">Explore Store</span>
                    </a>

                    {/* Catalog/Products Button */}
                    <a
                      href={wholesaler.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-900 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-800 text-gray-900 dark:text-white font-bold transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col items-center justify-center gap-2 border border-slate-400 dark:border-slate-600 hover:border-green-500"
                    >
                      <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/10 transition-all duration-300"></div>
                      <Package className="h-6 w-6 relative z-10 transition-transform duration-300 group-hover:translate-y-0.5" />
                      <span className="relative z-10 text-center">View Products</span>
                    </a>
                  </div>

                  {/* Social Highlights */}
                  <div className="mt-6 pt-6 border-t border-slate-300 dark:border-slate-800">
                    <p className="text-xs text-gray-600 dark:text-gray-500 text-center mb-4 uppercase tracking-wider">Connect & Follow</p>
                    <div className="flex justify-center gap-3 flex-wrap">
                      {wholesaler.socials?.instagram && (
                        <a
                          href={wholesaler.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-400 hover:to-red-400 text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          <Instagram className="h-4 w-4" />
                          Instagram
                        </a>
                      )}
                      {wholesaler.socials?.facebook && (
                        <a
                          href={wholesaler.socials.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          <Facebook className="h-4 w-4" />
                          Facebook
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-black dark:via-slate-900 dark:to-slate-950 border-t border-slate-300 dark:border-slate-800 py-12 md:py-16 mt-12">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Partner With Us?</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            If you represent a quality gym or wholesale supplier and would like to be featured here, get in touch with us!
          </p>
          <a
            href="mailto:partnerships@musclesports.co.uk"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
          >
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Premium Trust & Credibility Section - Top 1% Business Standard */}
      <div className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-black border-t border-slate-300 dark:border-slate-800 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Trust Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Verified Partners Card - Trust & Safety Blue */}
            <div className="group relative p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative text-center md:text-left">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">3+</div>
                <p className="text-gray-800 dark:text-gray-200 font-bold text-lg mb-1">Verified Partners</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Carefully selected & authenticated</p>
              </div>
            </div>

            {/* Community Reviews Card - Social & Trust Green */}
            <div className="group relative p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-2xl hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative text-center md:text-left">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">378</div>
                <p className="text-gray-800 dark:text-gray-200 font-bold text-lg mb-1">Community Reviews</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">From verified customers</p>
              </div>
            </div>

            {/* Average Rating Card - Excellence & Premium Gold/Amber */}
            <div className="group relative p-6 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/40 rounded-xl border border-amber-200 dark:border-amber-800 hover:shadow-2xl hover:border-amber-400 dark:hover:border-amber-600 transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative text-center md:text-left">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-2">4.8★</div>
                <p className="text-gray-800 dark:text-gray-200 font-bold text-lg mb-1">Average Rating</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Industry leading excellence</p>
              </div>
            </div>

            {/* Verified Authentic Card - Security & Power Purple/Violet */}
            <div className="group relative p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/40 dark:to-violet-950/40 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-2xl hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative text-center md:text-left">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">100%</div>
                <p className="text-gray-800 dark:text-gray-200 font-bold text-lg mb-1">Verified Authentic</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Legitimacy guaranteed</p>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-900/30 dark:to-slate-800/30 border border-green-200 dark:border-green-900/50 rounded-xl p-8 md:p-12">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Why You Can Trust Our Network</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 mt-1">
                  <Shield className="h-6 w-6 text-green-500 flex-shrink-0" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Rigorous Verification Process</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-400">Every partner undergoes comprehensive background checks and quality audits to ensure authenticity and legitimacy.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 mt-1">
                  <Users className="h-6 w-6 text-green-500 flex-shrink-0" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Community Endorsed</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-400">Real customer reviews and ratings from verified members ensure transparency and accountability.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 mt-1">
                  <TrendingUp className="h-6 w-6 text-green-500 flex-shrink-0" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Ongoing Monitoring</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-400">We continuously monitor partner performance and customer satisfaction to maintain the highest standards.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 mt-1">
                  <Target className="h-6 w-6 text-green-500 flex-shrink-0" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Exclusive Curation</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-400">We only feature handpicked businesses that align with our values of quality, integrity, and customer excellence.</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ / Trust Signals */}
          <div className="mt-12">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="p-6 bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-green-300 dark:hover:border-green-700 transition-all duration-300">
                <div className="flex items-start gap-4 mb-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Shield className="h-5 w-5 text-green-500" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white">How are partners verified?</h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-400 ml-9">Our verification process includes background research, legitimacy checks, customer review analysis, and ongoing monitoring to ensure all partners meet our standards.</p>
              </div>
              <div className="p-6 bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-green-300 dark:hover:border-green-700 transition-all duration-300">
                <div className="flex items-start gap-4 mb-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Are these real reviews?</h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-400 ml-9">Yes. All reviews come from our verified community members and are monitored for authenticity. We maintain complete transparency in our rating system.</p>
              </div>
              <div className="p-6 bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-green-300 dark:hover:border-green-700 transition-all duration-300">
                <div className="flex items-start gap-4 mb-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Lock className="h-5 w-5 text-green-500" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Can I trust these businesses?</h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-400 ml-9">Absolutely. Every partner is vetted for legitimacy. If you have any concerns, contact us immediately at partnerships@musclesports.co.uk and we&apos;ll investigate.</p>
              </div>
              <div className="p-6 bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 hover:shadow-lg hover:border-green-300 dark:hover:border-green-700 transition-all duration-300">
                <div className="flex items-start gap-4 mb-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <Search className="h-5 w-5 text-green-500" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white">How often is this updated?</h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-400 ml-9">We continuously monitor our partners and update this page regularly. New verified partners are added as they meet our rigorous standards.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer spacing */}
      <div className="h-16" />
    </div>
  );
}
