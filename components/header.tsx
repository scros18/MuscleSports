"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, User, LogOut, X, Menu, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { usePerformance } from "@/context/performance-context";
import { useSiteSettings } from "@/context/site-settings-context";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { settings } = usePerformance();
  const { settings: siteSettings } = useSiteSettings();
  const router = useRouter();
  
  // Start with null to force client-side only rendering of the logo
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);

  // Update scroll buttons on mount and resize
  useEffect(() => {
    const updateButtons = () => {
      updateScrollButtons();
    };
    
    updateButtons();
    window.addEventListener('resize', updateButtons);
    
    return () => window.removeEventListener('resize', updateButtons);
  }, []);

  // Handle scroll for mobile sticky header enhancement
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect theme from localStorage FIRST, then DOM
  useEffect(() => {
    const detectTheme = () => {
      // ALWAYS prioritize localStorage
      const savedTheme = localStorage.getItem('admin_theme');
      
      if (savedTheme) {
        setCurrentTheme(savedTheme);
        return;
      }
      
      // Only check DOM if no localStorage value exists - batch DOM queries
      const htmlElement = document.documentElement;
      const classList = htmlElement.classList;
      
      if (classList.contains('theme-musclesports')) {
        setCurrentTheme('musclesports');
      } else if (classList.contains('theme-vera')) {
        setCurrentTheme('vera');
      } else if (classList.contains('theme-blisshair')) {
        setCurrentTheme('blisshair');
      } else {
        setCurrentTheme('ordify');
      }
    };

    // Use requestAnimationFrame to avoid forced reflows
    const rafId = requestAnimationFrame(detectTheme);
    
    // Watch for theme changes with debouncing
    let timeoutId: NodeJS.Timeout;
    const htmlObserver = new MutationObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const savedTheme = localStorage.getItem('admin_theme');
        if (savedTheme) {
          setCurrentTheme(savedTheme);
        } else {
          requestAnimationFrame(detectTheme);
        }
      }, 16); // ~60fps debouncing
    });
    
    htmlObserver.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      htmlObserver.disconnect();
    };
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isFitnessGuidesOpen, setIsFitnessGuidesOpen] = useState(false);
  const [navScrollPosition, setNavScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties | null>(null);

  const handleLogout = () => {
    logout();
  };

  const scrollNav = (direction: 'left' | 'right') => {
    if (!navRef.current) return;
    
    const scrollAmount = 200; // pixels to scroll
    const currentScroll = navRef.current.scrollLeft;
    const targetScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;
    
    navRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
    
    // Update scroll position after animation
    setTimeout(() => {
      if (navRef.current) {
        setNavScrollPosition(navRef.current.scrollLeft);
        updateScrollButtons();
      }
    }, 300);
  };

  const updateScrollButtons = () => {
    if (!navRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = navRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      // Add theme parameter to filter products by catalog
      const themeParam = currentTheme === 'musclesports' ? '&theme=musclesports' : '';
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&pageSize=5${themeParam}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.products || []);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      const themeParam = currentTheme === 'musclesports' ? '&theme=musclesports' : '';
      router.push(`/products?search=${encodeURIComponent(searchQuery)}${themeParam}`);
    }
  };

  const handleResultClick = (productId: string) => {
    setShowResults(false);
    setSearchQuery("");
    router.push(`/products/${productId}`);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If click is inside the search portal (created via createPortal), treat it as inside
      const portalEl = typeof document !== "undefined" ? document.querySelector('[data-debug="search-portal"]') : null;
      if (portalEl && portalEl.contains(event.target as Node)) {
        return;
      }

      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Position portal dropdown so it won't be clipped by other stacking contexts
  useEffect(() => {
    if (!showResults || !searchRef.current) {
      setDropdownStyle(null);
      return;
    }

    const update = () => {
      const el = searchRef.current as HTMLDivElement;
      const rect = el.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
        zIndex: 9999999,
        maxHeight: "50vh",
        overflowY: "auto",
      });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [showResults]);

  return (
    <>
      <header className={`sticky top-0 z-[99999] w-full max-w-full overflow-visible border-b transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-3xl supports-[backdrop-filter]:bg-background/90 border-white/20 dark:border-white/10 shadow-xl shadow-black/10' 
          : 'bg-background/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60 border-white/10 dark:border-white/5 shadow-lg shadow-black/5'
      }`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-4 gap-2 sm:gap-4">
        <Link href="/" className="flex items-center flex-shrink-0 min-w-0">
          {currentTheme !== null && (
            <Image
              key={`logo-${currentTheme}`}
              src={currentTheme === 'musclesports' 
                ? '/musclesports-logo.png'
                : currentTheme === 'vera'
                ? 'https://i.imgur.com/verarp-logo.png'
                : siteSettings.logoUrl}
              alt={currentTheme === 'musclesports' ? 'MuscleSports' : currentTheme === 'vera' ? 'VeraRP' : siteSettings.siteName}
              width={currentTheme === 'musclesports' ? 256 : 120}
              height={currentTheme === 'musclesports' ? 256 : 40}
              className={currentTheme === 'musclesports' ? 'h-20 md:h-20 lg:h-24 w-auto' : 'h-10 md:h-10 w-auto'}
              style={currentTheme === 'musclesports' ? {
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1)) brightness(1.05)',
                imageRendering: 'crisp-edges'
              } : undefined}
              priority
            />
          )}
        </Link>

        {/* Desktop Search - Always expanded Amazon-style */}
        <div className="hidden md:flex items-center flex-1 max-w-3xl mx-4">
          <div className="relative w-full" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
              <div className="relative flex items-center w-full">
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="h-10 w-full rounded-lg bg-background border border-input pr-20 pl-4"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setShowResults(true)}
                  />
                  {/* Right side buttons - Clear (X) and Search button */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                          setShowResults(false);
                        }}
                        className="h-7 w-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                    {/* Search Submit Button */}
                    <Button 
                      type="submit" 
                      size="sm"
                      className="h-7 px-3 text-xs bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                    >
                      <Search className="h-3.5 w-3.5 mr-1" />
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {/* Search Results Dropdown (portal) */}
            {showResults && typeof document !== "undefined" && createPortal(
              <div style={dropdownStyle || {}} className="bg-background border rounded-md shadow-lg z-[9999999]" data-debug="search-portal">
                {isSearching ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        onClick={() => {
                          setShowResults(false);
                          setSearchQuery("");
                        }}
                        className="w-full block px-4 py-2 text-left hover:bg-muted flex items-center space-x-3"
                      >
                        {product.image && (
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <p className="text-sm text-muted-foreground">£{product.price?.toFixed(2)}</p>
                        </div>
                      </Link>
                    ))}
                    <div className="border-t px-4 py-2">
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full text-left text-sm text-primary hover:underline"
                      >
                        View all results for &quot;{searchQuery}&quot;
                      </button>
                    </div>
                  </div>
                ) : searchQuery.trim() ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No products found for &quot;{searchQuery}&quot;
                  </div>
                ) : null}
              </div>,
              document.body
            )}
          </div>
        </div>

        {/* Auth and Cart buttons - DESKTOP ONLY */}
        <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
          {user ? (
            <div className="flex items-center space-x-2">
              <Link href="/account">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                  Register
                </Button>
              </Link>
            </div>
          )}

          {/* Single Shopping Cart Icon - Desktop */}
          <Link href="/cart" aria-label="Shopping cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {totalItems}
                </Badge>
              )}
              <span className="sr-only">Shopping cart{totalItems > 0 ? ` (${totalItems} items)` : ''}</span>
            </Button>
          </Link>
        </div>

        {/* Mobile menu button and cart - MOBILE ONLY (hidden on md and up) */}
        <div className="md:!hidden flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-auto">
          <Link href="/cart" aria-label="Shopping cart">
            <Button variant="outline" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 min-w-[20px] flex items-center justify-center p-0 text-[10px] sm:text-xs font-semibold rounded-full"
                >
                  {totalItems}
                </Badge>
              )}
              <span className="sr-only">Shopping cart{totalItems > 0 ? ` (${totalItems} items)` : ''}</span>
            </Button>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary flex-shrink-0"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Category Navigation Bar - Hidden on mobile */}
      <div className="border-t bg-muted/30 hidden md:block">
        <div className="container px-4">
          <div className="relative flex items-center">
            {/* Left Arrow */}
            <button
              onClick={() => scrollNav('left')}
              className={`absolute left-0 z-10 p-1 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm transition-all duration-200 ${
                canScrollLeft 
                  ? 'opacity-100 hover:bg-background hover:scale-105' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!canScrollLeft}
              aria-label="Scroll navigation left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => scrollNav('right')}
              className={`absolute right-0 z-10 p-1 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm transition-all duration-200 ${
                canScrollRight 
                  ? 'opacity-100 hover:bg-background hover:scale-105' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!canScrollRight}
              aria-label="Scroll navigation right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <nav
              className="flex items-center gap-2 md:gap-3 py-2 text-sm overflow-x-auto [&::-webkit-scrollbar]:hidden px-8"
              ref={navRef}
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
              onScroll={updateScrollButtons}
            >
            {/* Custom MuscleSports Categories with Animated Dropdowns */}
            <Link
              href="/products?category=Protein+Powders"
              className="whitespace-nowrap hover:text-primary transition-colors text-foreground/90 hover:text-foreground"
            >
              Protein Powders
            </Link>
            <div className="relative group">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'preworkout' ? null : 'preworkout')}
                onMouseEnter={() => setOpenDropdown('preworkout')}
                className="whitespace-nowrap hover:text-primary transition-colors text-foreground/90 hover:text-foreground flex items-center gap-1"
              >
                Pre-Workout
                <ChevronDown className="h-3 w-3 transition-transform duration-300" style={{ transform: openDropdown === 'preworkout' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              <div
                className={`absolute left-0 top-full pt-2 z-[9999] transition-all duration-300 ease-spring ${openDropdown === 'preworkout' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                onMouseEnter={() => setOpenDropdown('preworkout')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div className="bg-background border rounded-lg shadow-xl p-4 min-w-[220px] animate-slide-in-up">
                  <Link href="/products?category=Pre-Workout&subcategory=Powders" className="block px-3 py-2 rounded-md hover:bg-accent text-sm transition-colors" onClick={() => setOpenDropdown(null)}>Powders</Link>
                  <Link href="/products?category=Pre-Workout&subcategory=Shots" className="block px-3 py-2 rounded-md hover:bg-accent text-sm transition-colors" onClick={() => setOpenDropdown(null)}>Shots</Link>
                  <Link href="/products?category=Pre-Workout&subcategory=Tablets" className="block px-3 py-2 rounded-md hover:bg-accent text-sm transition-colors" onClick={() => setOpenDropdown(null)}>Tablets</Link>
                </div>
              </div>
            </div>
            <Link
              href="/products?category=Creatine"
              className="whitespace-nowrap hover:text-primary transition-colors text-foreground/90 hover:text-foreground"
            >
              Creatine
            </Link>
            <Link
              href="/products?category=Protein+Bars"
              className="whitespace-nowrap hover:text-primary transition-colors text-foreground/90 hover:text-foreground"
            >
              Protein Bars
            </Link>
            <div className="relative group">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'accessories' ? null : 'accessories')}
                onMouseEnter={() => setOpenDropdown('accessories')}
                className="whitespace-nowrap hover:text-primary transition-colors text-foreground/90 hover:text-foreground flex items-center gap-1"
              >
                Accessories
                <ChevronDown className="h-3 w-3 transition-transform duration-300" style={{ transform: openDropdown === 'accessories' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              <div
                className={`absolute left-0 top-full pt-2 z-[9999] transition-all duration-300 ease-spring ${openDropdown === 'accessories' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                onMouseEnter={() => setOpenDropdown('accessories')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <div className="bg-background border rounded-lg shadow-xl p-4 min-w-[220px] animate-slide-in-up">
                  <Link href="/products?category=Accessories&subcategory=Shakers" className="block px-3 py-2 rounded-md hover:bg-accent text-sm transition-colors" onClick={() => setOpenDropdown(null)}>Shakers</Link>
                  <Link href="/products?category=Accessories&subcategory=Bottles" className="block px-3 py-2 rounded-md hover:bg-accent text-sm transition-colors" onClick={() => setOpenDropdown(null)}>Bottles</Link>
                  <Link href="/products?category=Accessories&subcategory=Apparel" className="block px-3 py-2 rounded-md hover:bg-accent text-sm transition-colors" onClick={() => setOpenDropdown(null)}>Apparel</Link>
                </div>
              </div>
            </div>
            <Link
              href="/products?category=Vitamins+%26+Supplements"
              className="whitespace-nowrap hover:text-primary transition-colors text-foreground/90 hover:text-foreground"
            >
              Vitamins & Supplements
            </Link>
            <Link
              href="/products?category=Snacks"
              className="whitespace-nowrap hover:text-primary transition-colors text-foreground/90 hover:text-foreground"
            >
              Snacks
            </Link>
            <Link
              href="/products?category=Bundles"
              className="whitespace-nowrap hover:text-primary transition-colors text-foreground/90 hover:text-foreground"
            >
              Bundles
            </Link>
            <Link
              href="/about-us"
              className="whitespace-nowrap hover:text-primary transition-colors text-foreground/90 hover:text-foreground"
            >
              About Us
            </Link>
            <Link
              href="/nutrition-calculator"
              className="whitespace-nowrap hover:text-primary transition-colors text-foreground/90 hover:text-foreground"
            >
              Nutrition Calculator
            </Link>
            <Link
              href="/recipe-generator"
              className="whitespace-nowrap hover:text-primary transition-colors text-foreground/90 hover:text-foreground"
            >
              Recipe Generator
            </Link>
            <Link
              href="/supplement-finder"
              className="whitespace-nowrap hover:text-primary transition-colors text-foreground/90 hover:text-foreground font-semibold"
            >
              Supplement Finder 🎯
            </Link>
            <Link
              href="/stacks"
              className="whitespace-nowrap hover:text-primary transition-colors text-foreground/90 hover:text-foreground"
            >
              Product Stacks
            </Link>
            <Link
              href="/progress-tracker"
              className="whitespace-nowrap hover:text-primary transition-colors text-foreground/90 hover:text-foreground"
            >
              Track Progress
            </Link>
            <Link
              href="/community"
              className="whitespace-nowrap hover:text-primary transition-colors text-foreground/90 hover:text-foreground"
            >
              Community
            </Link>
            <div className="relative group">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'guides' ? null : 'guides')}
                onMouseEnter={() => setOpenDropdown('guides')}
                className="whitespace-nowrap hover:text-primary transition-colors text-foreground/90 hover:text-foreground flex items-center gap-1"
              >
                Fitness Guides
                <ChevronDown className="h-3 w-3 transition-transform duration-300" style={{ transform: openDropdown === 'guides' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              <div
                className={`absolute right-0 top-full pt-2 z-[9999] transition-all duration-300 ease-spring ${openDropdown === 'guides' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                onMouseEnter={() => setOpenDropdown('guides')}
                onMouseLeave={() => setOpenDropdown(null)}
                style={{ right: '-20px' }}
              >
                <div className="bg-background border rounded-lg shadow-xl p-4 min-w-[320px] animate-slide-in-up">
                  <Link href="/guides/muscle-building" className="block px-3 py-2 rounded-md hover:bg-accent text-sm transition-colors" onClick={() => setOpenDropdown(null)}>💪 Muscle Building Guide</Link>
                  <Link href="/guides/weight-loss" className="block px-3 py-2 rounded-md hover:bg-accent text-sm transition-colors" onClick={() => setOpenDropdown(null)}>📉 Weight Loss Guide</Link>
                  <Link href="/guides/protein-guide" className="block px-3 py-2 rounded-md hover:bg-accent text-sm transition-colors" onClick={() => setOpenDropdown(null)}>🥩 Complete Protein Guide</Link>
                  <Link href="/guides/creatine-benefits" className="block px-3 py-2 rounded-md hover:bg-accent text-sm transition-colors" onClick={() => setOpenDropdown(null)}>⚡ Creatine Benefits</Link>
                  <Link href="/guides/pre-workout-benefits" className="block px-3 py-2 rounded-md hover:bg-accent text-sm transition-colors" onClick={() => setOpenDropdown(null)}>🔥 Pre-Workout Guide</Link>
                  <Link href="/guides/post-workout-nutrition" className="block px-3 py-2 rounded-md hover:bg-accent text-sm transition-colors" onClick={() => setOpenDropdown(null)}>🍗 Post-Workout Nutrition</Link>
                  <div className="border-t my-2"></div>
                  <Link href="/testosterone-guide" className="block px-3 py-2 rounded-md hover:bg-accent text-sm transition-colors font-semibold" onClick={() => setOpenDropdown(null)}>🧬 Testosterone Guide</Link>
                </div>
              </div>
            </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background max-w-full overflow-x-hidden">
          <div className="px-3 sm:px-4 py-4 space-y-3 sm:space-y-4 w-full">
            {/* Mobile Search */}
            <div className="relative w-full" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full">
                <div className="relative flex-1 min-w-0">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-3 sm:pl-4 pr-10 text-sm"
                    style={{
                      boxShadow: searchQuery ? (
                        currentTheme === 'musclesports' 
                          ? '0 0 0 2px rgba(0, 179, 65, 0.3), 0 0 20px rgba(0, 179, 65, 0.2)'
                          : currentTheme === 'vera'
                          ? '0 0 0 2px rgba(255, 107, 0, 0.3), 0 0 20px rgba(255, 107, 0, 0.2)'
                          : '0 0 0 2px rgba(56, 142, 233, 0.3), 0 0 20px rgba(56, 142, 233, 0.2)'
                      ) : undefined
                    }}
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  {/* Clear Button - Mobile */}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                        setShowResults(false);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                      style={{
                        background: currentTheme === 'musclesports'
                          ? 'rgba(0, 179, 65, 0.1)'
                          : currentTheme === 'vera'
                          ? 'rgba(255, 107, 0, 0.1)'
                          : 'rgba(56, 142, 233, 0.1)',
                      }}
                    >
                      <X className="h-3 w-3" style={{
                        color: currentTheme === 'musclesports'
                          ? '#00B341'
                          : currentTheme === 'vera'
                          ? '#FF6B00'
                          : '#388EE9'
                      }} />
                    </button>
                  )}
                </div>
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost"
                  className="rounded-lg"
                  style={{
                    background: currentTheme === 'musclesports'
                      ? 'rgba(0, 179, 65, 0.1)'
                      : currentTheme === 'vera'
                      ? 'rgba(255, 107, 0, 0.1)'
                      : 'rgba(56, 142, 233, 0.1)',
                  }}
                >
                  <Search className="h-5 w-5" style={{
                    color: currentTheme === 'musclesports'
                      ? '#00B341'
                      : currentTheme === 'vera'
                      ? '#FF6B00'
                      : '#388EE9'
                  }} />
                </Button>
              </form>

              {/* Mobile Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-[1000000] max-h-96 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          onClick={() => {
                            setShowResults(false);
                            setIsMobileMenuOpen(false);
                            setSearchQuery("");
                          }}
                          className="w-full block px-4 py-2 text-left hover:bg-muted flex items-center space-x-3"
                        >
                          {product.image && (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-sm text-muted-foreground">£{product.price?.toFixed(2)}</p>
                          </div>
                        </Link>
                      ))}
                      <div className="border-t px-4 py-2">
                        <button
                          onClick={() => {
                            const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                            handleSearchSubmit(fakeEvent);
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full text-left text-sm text-primary hover:underline"
                        >
                          View all results for &quot;{searchQuery}&quot;
                        </button>
                      </div>
                    </div>
                  ) : searchQuery.trim() ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No products found for &quot;{searchQuery}&quot;
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Mobile Navigation Links */}
            <nav className="space-y-2.5 sm:space-y-3 w-full">
              <Link
                href="/"
                className={`relative block px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-xl backdrop-blur-xl border shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-foreground hover:text-primary overflow-hidden group ${
                  settings.animationsEnabled
                    ? 'transition-all duration-500 ease-out hover:scale-[1.02] active:scale-98'
                    : 'transition-all duration-300'
                }`}
                style={{
                  background: currentTheme === 'musclesports' 
                    ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.08), rgba(0, 179, 65, 0.02))'
                    : currentTheme === 'vera'
                    ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.12), rgba(255, 107, 0, 0.04))'
                    : 'linear-gradient(135deg, rgba(56, 142, 233, 0.08), rgba(56, 142, 233, 0.02))',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="relative z-10">Home</span>
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                  style={{
                    background: currentTheme === 'musclesports'
                      ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.15), rgba(0, 179, 65, 0.05))'
                      : currentTheme === 'vera'
                      ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.2), rgba(255, 107, 0, 0.08))'
                      : 'linear-gradient(135deg, rgba(56, 142, 233, 0.15), rgba(56, 142, 233, 0.05))'
                  }}
                ></div>
              </Link>
              <Link
                href="/products"
                className={`relative block px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-xl backdrop-blur-xl border shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-foreground hover:text-primary overflow-hidden group ${
                  settings.animationsEnabled
                    ? 'transition-all duration-500 ease-out hover:scale-[1.02] active:scale-98'
                    : 'transition-all duration-300'
                }`}
                style={{
                  background: currentTheme === 'musclesports' 
                    ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.08), rgba(0, 179, 65, 0.02))'
                    : currentTheme === 'vera'
                    ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.12), rgba(255, 107, 0, 0.04))'
                    : 'linear-gradient(135deg, rgba(56, 142, 233, 0.08), rgba(56, 142, 233, 0.02))',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="relative z-10">Products</span>
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                  style={{
                    background: currentTheme === 'musclesports'
                      ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.15), rgba(0, 179, 65, 0.05))'
                      : currentTheme === 'vera'
                      ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.2), rgba(255, 107, 0, 0.08))'
                      : 'linear-gradient(135deg, rgba(56, 142, 233, 0.15), rgba(56, 142, 233, 0.05))'
                  }}
                ></div>
              </Link>
              <Link
                href="/categories"
                className={`relative block px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-xl backdrop-blur-xl border shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-foreground hover:text-primary overflow-hidden group ${
                  settings.animationsEnabled
                    ? 'transition-all duration-500 ease-out hover:scale-[1.02] active:scale-98'
                    : 'transition-all duration-300'
                }`}
                style={{
                  background: currentTheme === 'musclesports'
                    ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.08), rgba(0, 179, 65, 0.02))'
                    : currentTheme === 'vera'
                    ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.12), rgba(255, 107, 0, 0.04))'
                    : 'linear-gradient(135deg, rgba(56, 142, 233, 0.08), rgba(56, 142, 233, 0.02))',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="relative z-10">Categories</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                  style={{
                    background: currentTheme === 'musclesports'
                      ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.15), rgba(0, 179, 65, 0.05))'
                      : currentTheme === 'vera'
                      ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.2), rgba(255, 107, 0, 0.08))'
                      : 'linear-gradient(135deg, rgba(56, 142, 233, 0.15), rgba(56, 142, 233, 0.05))'
                  }}
                ></div>
              </Link>
              <Link
                href="/nutrition-calculator"
                className={`relative block px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-xl backdrop-blur-xl border shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-foreground hover:text-primary overflow-hidden group ${
                  settings.animationsEnabled
                    ? 'transition-all duration-500 ease-out hover:scale-[1.02] active:scale-98'
                    : 'transition-all duration-300'
                }`}
                style={{
                  background: currentTheme === 'musclesports'
                    ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.08), rgba(0, 179, 65, 0.02))'
                    : currentTheme === 'vera'
                    ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.12), rgba(255, 107, 0, 0.04))'
                    : 'linear-gradient(135deg, rgba(56, 142, 233, 0.08), rgba(56, 142, 233, 0.02))',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="relative z-10">Nutrition Calculator</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                  style={{
                    background: currentTheme === 'musclesports'
                      ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.15), rgba(0, 179, 65, 0.05))'
                      : currentTheme === 'vera'
                      ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.2), rgba(255, 107, 0, 0.08))'
                      : 'linear-gradient(135deg, rgba(56, 142, 233, 0.15), rgba(56, 142, 233, 0.05))'
                  }}
                ></div>
              </Link>
              <Link
                href="/recipe-generator"
                className={`relative block px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-xl backdrop-blur-xl border shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-foreground hover:text-primary overflow-hidden group ${
                  settings.animationsEnabled
                    ? 'transition-all duration-500 ease-out hover:scale-[1.02] active:scale-98'
                    : 'transition-all duration-300'
                }`}
                style={{
                  background: currentTheme === 'musclesports'
                    ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.08), rgba(0, 179, 65, 0.02))'
                    : currentTheme === 'vera'
                    ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.12), rgba(255, 107, 0, 0.04))'
                    : 'linear-gradient(135deg, rgba(56, 142, 233, 0.08), rgba(56, 142, 233, 0.02))',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="relative z-10">Recipe Generator</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                  style={{
                    background: currentTheme === 'musclesports'
                      ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.15), rgba(0, 179, 65, 0.05))'
                      : currentTheme === 'vera'
                      ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.2), rgba(255, 107, 0, 0.08))'
                      : 'linear-gradient(135deg, rgba(56, 142, 233, 0.15), rgba(56, 142, 233, 0.05))'
                  }}
                ></div>
              </Link>
              <Link
                href="/supplement-finder"
                className={`relative block px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-bold rounded-xl backdrop-blur-xl border-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-foreground hover:text-primary overflow-hidden group ${
                  settings.animationsEnabled
                    ? 'transition-all duration-500 ease-out hover:scale-[1.02] active:scale-98'
                    : 'transition-all duration-300'
                }`}
                style={{
                  background: currentTheme === 'musclesports'
                    ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.15), rgba(0, 179, 65, 0.05))'
                    : currentTheme === 'vera'
                    ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.2), rgba(255, 107, 0, 0.08))'
                    : 'linear-gradient(135deg, rgba(56, 142, 233, 0.15), rgba(56, 142, 233, 0.05))',
                  borderColor: currentTheme === 'musclesports'
                    ? 'rgba(0, 179, 65, 0.3)'
                    : currentTheme === 'vera'
                    ? 'rgba(255, 107, 0, 0.3)'
                    : 'rgba(56, 142, 233, 0.3)'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>🎯</span>
                  <span>Supplement Finder</span>
                </span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                  style={{
                    background: currentTheme === 'musclesports'
                      ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.25), rgba(0, 179, 65, 0.1))'
                      : currentTheme === 'vera'
                      ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.3), rgba(255, 107, 0, 0.12))'
                      : 'linear-gradient(135deg, rgba(56, 142, 233, 0.25), rgba(56, 142, 233, 0.1))'
                  }}
                ></div>
              </Link>
              <Link
                href="/stacks"
                className={`relative block px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-xl backdrop-blur-xl border shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-foreground hover:text-primary overflow-hidden group ${
                  settings.animationsEnabled
                    ? 'transition-all duration-500 ease-out hover:scale-[1.02] active:scale-98'
                    : 'transition-all duration-300'
                }`}
                style={{
                  background: currentTheme === 'musclesports'
                    ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.08), rgba(0, 179, 65, 0.02))'
                    : currentTheme === 'vera'
                    ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.12), rgba(255, 107, 0, 0.04))'
                    : 'linear-gradient(135deg, rgba(56, 142, 233, 0.08), rgba(56, 142, 233, 0.02))',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="relative z-10">Product Stacks</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                  style={{
                    background: currentTheme === 'musclesports'
                      ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.15), rgba(0, 179, 65, 0.05))'
                      : currentTheme === 'vera'
                      ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.2), rgba(255, 107, 0, 0.08))'
                      : 'linear-gradient(135deg, rgba(56, 142, 233, 0.15), rgba(56, 142, 233, 0.05))'
                  }}
                ></div>
              </Link>
              <Link
                href="/progress-tracker"
                className={`relative block px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-xl backdrop-blur-xl border shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-foreground hover:text-primary overflow-hidden group ${
                  settings.animationsEnabled
                    ? 'transition-all duration-500 ease-out hover:scale-[1.02] active:scale-98'
                    : 'transition-all duration-300'
                }`}
                style={{
                  background: currentTheme === 'musclesports'
                    ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.08), rgba(0, 179, 65, 0.02))'
                    : currentTheme === 'vera'
                    ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.12), rgba(255, 107, 0, 0.04))'
                    : 'linear-gradient(135deg, rgba(56, 142, 233, 0.08), rgba(56, 142, 233, 0.02))',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="relative z-10">Track Progress</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                  style={{
                    background: currentTheme === 'musclesports'
                      ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.15), rgba(0, 179, 65, 0.05))'
                      : currentTheme === 'vera'
                      ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.2), rgba(255, 107, 0, 0.08))'
                      : 'linear-gradient(135deg, rgba(56, 142, 233, 0.15), rgba(56, 142, 233, 0.05))'
                  }}
                ></div>
              </Link>
              <Link
                href="/community"
                className={`relative block px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-xl backdrop-blur-xl border shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-foreground hover:text-primary overflow-hidden group ${
                  settings.animationsEnabled
                    ? 'transition-all duration-500 ease-out hover:scale-[1.02] active:scale-98'
                    : 'transition-all duration-300'
                }`}
                style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(139, 92, 246, 0.02))',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="relative z-10">Community Hub</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                  style={{
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05))'
                  }}
                ></div>
              </Link>
              {/* Fitness Guides Dropdown */}
              <div className="space-y-2">
                <button
                  onClick={() => setIsFitnessGuidesOpen(!isFitnessGuidesOpen)}
                  className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-foreground/90 hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  <span>FITNESS GUIDES</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isFitnessGuidesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isFitnessGuidesOpen && (
                  <div className="space-y-1 pl-4 border-l-2 border-muted">
                    <Link href="/guides/muscle-building" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-accent rounded-md">💪 Muscle Building Guide</Link>
                    <Link href="/guides/weight-loss" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-accent rounded-md">📉 Weight Loss Guide</Link>
                    <Link href="/guides/protein-guide" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-accent rounded-md">🥩 Protein Guide</Link>
                    <Link href="/guides/creatine-benefits" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-accent rounded-md">⚡ Creatine Benefits</Link>
                    <Link href="/guides/pre-workout-benefits" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-accent rounded-md">🔥 Pre-Workout Guide</Link>
                    <Link href="/guides/post-workout-nutrition" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-accent rounded-md">🍗 Post-Workout Nutrition</Link>
                    <Link href="/testosterone-guide" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 text-sm hover:bg-accent rounded-md font-semibold">🧬 Testosterone Guide</Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile Auth */}
            <div className="border-t pt-3 sm:pt-4 space-y-2.5 sm:space-y-3 w-full">
              {user ? (
                <div className="space-y-2.5 sm:space-y-3 w-full">
                  <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="block w-full">
                    <div
                      className={`relative flex items-center px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-xl backdrop-blur-xl border shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-foreground hover:text-primary overflow-hidden group ${
                        settings.animationsEnabled
                          ? 'transition-all duration-500 ease-out hover:scale-[1.02] active:scale-98'
                          : 'transition-all duration-300'
                      }`}
                      style={{
                        background: currentTheme === 'musclesports' 
                          ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.08), rgba(0, 179, 65, 0.02))'
                          : currentTheme === 'vera'
                          ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.12), rgba(255, 107, 0, 0.04))'
                          : 'linear-gradient(135deg, rgba(56, 142, 233, 0.08), rgba(56, 142, 233, 0.02))',
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 relative z-10" />
                      <span className="relative z-10">Account</span>
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                        style={{
                          background: currentTheme === 'musclesports'
                            ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.15), rgba(0, 179, 65, 0.05))'
                            : currentTheme === 'vera'
                            ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.2), rgba(255, 107, 0, 0.08))'
                            : 'linear-gradient(135deg, rgba(56, 142, 233, 0.15), rgba(56, 142, 233, 0.05))'
                        }}
                      ></div>
                    </div>
                  </Link>
                  <button
                    className={`relative flex items-center w-full px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-xl backdrop-blur-xl border shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-foreground hover:text-primary overflow-hidden group ${
                      settings.animationsEnabled
                        ? 'transition-all duration-500 ease-out hover:scale-[1.02] active:scale-98'
                        : 'transition-all duration-300'
                    }`}
                    style={{
                      background: currentTheme === 'musclesports' 
                        ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.08), rgba(0, 179, 65, 0.02))'
                        : currentTheme === 'vera'
                        ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.12), rgba(255, 107, 0, 0.04))'
                        : 'linear-gradient(135deg, rgba(56, 142, 233, 0.08), rgba(56, 142, 233, 0.02))',
                      borderColor: 'rgba(255, 255, 255, 0.2)'
                    }}
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 relative z-10" />
                    <span className="relative z-10">Logout</span>
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                      style={{
                        background: currentTheme === 'musclesports'
                          ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.15), rgba(0, 179, 65, 0.05))'
                          : currentTheme === 'vera'
                          ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.2), rgba(255, 107, 0, 0.08))'
                          : 'linear-gradient(135deg, rgba(56, 142, 233, 0.15), rgba(56, 142, 233, 0.05))'
                      }}
                    ></div>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 sm:space-y-3 w-full">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full">
                    <div
                      className={`relative flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-xl backdrop-blur-xl border shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-foreground hover:text-primary overflow-hidden group ${
                        settings.animationsEnabled
                          ? 'transition-all duration-500 ease-out hover:scale-[1.02] active:scale-98'
                          : 'transition-all duration-300'
                      }`}
                      style={{
                        background: currentTheme === 'musclesports' 
                          ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.08), rgba(0, 179, 65, 0.02))'
                          : currentTheme === 'vera'
                          ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.12), rgba(255, 107, 0, 0.04))'
                          : 'linear-gradient(135deg, rgba(56, 142, 233, 0.08), rgba(56, 142, 233, 0.02))',
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      }}
                    >
                      <span className="relative z-10">Login</span>
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                        style={{
                          background: currentTheme === 'musclesports'
                            ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.15), rgba(0, 179, 65, 0.05))'
                            : currentTheme === 'vera'
                            ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.2), rgba(255, 107, 0, 0.08))'
                            : 'linear-gradient(135deg, rgba(56, 142, 233, 0.15), rgba(56, 142, 233, 0.05))'
                        }}
                      ></div>
                    </div>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="block w-full">
                    <div
                      className={`relative flex items-center justify-center px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-xl backdrop-blur-xl border shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-white overflow-hidden group ${
                        settings.animationsEnabled
                          ? 'transition-all duration-500 ease-out hover:scale-[1.02] active:scale-98'
                          : 'transition-all duration-300'
                      }`}
                      style={{
                        background: currentTheme === 'musclesports' 
                          ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.25), rgba(0, 179, 65, 0.15))'
                          : currentTheme === 'vera'
                          ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.35), rgba(255, 107, 0, 0.2))'
                          : 'linear-gradient(135deg, rgba(56, 142, 233, 0.25), rgba(56, 142, 233, 0.15))',
                        borderColor: currentTheme === 'musclesports'
                          ? 'rgba(0, 179, 65, 0.4)'
                          : currentTheme === 'vera'
                          ? 'rgba(255, 107, 0, 0.4)'
                          : 'rgba(56, 142, 233, 0.4)'
                      }}
                    >
                      <span className="relative z-10">Register</span>
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
                        style={{
                          background: currentTheme === 'musclesports'
                            ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.4), rgba(0, 179, 65, 0.25))'
                            : currentTheme === 'vera'
                            ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.5), rgba(255, 107, 0, 0.3))'
                            : 'linear-gradient(135deg, rgba(56, 142, 233, 0.4), rgba(56, 142, 233, 0.25))'
                        }}
                      ></div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
    
    </>
  );
}
