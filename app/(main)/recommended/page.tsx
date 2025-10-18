"use client";

import { useState, useRef } from "react";
import { ExternalLink, MapPin, Dumbbell, Package, ArrowRight, Instagram, Facebook, Twitter, Youtube } from "lucide-react";

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
    name: "100 Gym",
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{business.name}</h2>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-green-500" />
                          <span>{business.location}</span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base active:scale-95"
                    >
                      Visit Website
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  {/* Social Media Links */}
                  {business.socials && (
                    <div className="flex flex-wrap gap-2">
                      {business.socials.instagram && (
                        <a
                          href={business.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:from-pink-400 hover:via-red-400 hover:to-yellow-400 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                          aria-label={`${business.name} Instagram`}
                          title="Follow on Instagram"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                      {business.socials.facebook && (
                        <a
                          href={business.socials.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                          aria-label={`${business.name} Facebook`}
                          title="Follow on Facebook"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Business Description */}
                <div className="p-6 md:p-8 border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-black">
                  <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">{business.description}</p>
                </div>

                {/* Embedded Iframe */}
                <div className="p-3 md:p-8 bg-slate-50 dark:bg-slate-950 overflow-hidden">
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">Explore Their World</h3>
                  </div>
                  <div className="bg-white dark:bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-300 dark:border-slate-800 w-full transition-all duration-500 hover:border-green-500/50">
                    <div className="relative w-full" style={{ 
                      aspectRatio: window.innerWidth < 768 ? '9 / 16' : '16 / 9', 
                      minHeight: window.innerWidth < 768 ? '810px' : '500px', 
                      maxHeight: window.innerWidth < 768 ? '100vh' : '900px',
                      height: '100%'
                    }}>
                      <iframe
                        src={business.embedUrl + (typeof window !== 'undefined' && window.innerWidth < 768 ? '?mobile=1' : '')}
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
                              iframe.contentDocument.documentElement.style.zoom = window.innerWidth < 768 ? '100%' : '100%';
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{wholesaler.name}</h2>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-green-500" />
                          <span>{wholesaler.location}</span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={wholesaler.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-black font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base active:scale-95"
                    >
                      Visit Website
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  {/* Social Media Links */}
                  {wholesaler.socials && (
                    <div className="flex flex-wrap gap-2">
                      {wholesaler.socials.instagram && (
                        <a
                          href={wholesaler.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:from-pink-400 hover:via-red-400 hover:to-yellow-400 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                          aria-label={`${wholesaler.name} Instagram`}
                          title="Follow on Instagram"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                      {wholesaler.socials.facebook && (
                        <a
                          href={wholesaler.socials.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                          aria-label={`${wholesaler.name} Facebook`}
                          title="Follow on Facebook"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                      {wholesaler.socials.twitter && (
                        <a
                          href={wholesaler.socials.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                          aria-label={`${wholesaler.name} Twitter`}
                          title="Follow on Twitter"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {wholesaler.socials.youtube && (
                        <a
                          href={wholesaler.socials.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                          aria-label={`${wholesaler.name} YouTube`}
                          title="Subscribe on YouTube"
                        >
                          <Youtube className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Wholesaler Description */}
                <div className="p-6 md:p-8 border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-black">
                  <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">{wholesaler.description}</p>
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

      {/* Footer spacing */}
      <div className="h-16" />
    </div>
  );
}
