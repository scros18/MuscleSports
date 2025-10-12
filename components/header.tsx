"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ShoppingCart, Search, User, LogOut, X, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { usePerformance } from "@/context/performance-context";
import { useSiteSettings } from "@/context/site-settings-context";
import { Badge } from "@/components/ui/badge";
import { SaleBanner } from "@/components/sale-banner";

export function Header() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { settings } = usePerformance();
  const { settings: siteSettings } = useSiteSettings();
  const router = useRouter();
  const [currentTheme, setCurrentTheme] = useState<string>('ordify');

  // Detect theme from documentElement class or localStorage
  useEffect(() => {
    const detectTheme = () => {
      // Check both documentElement and body
      const htmlClasses = document.documentElement.classList;
      const bodyClasses = document.body.classList;
      if (htmlClasses.contains('theme-musclesports') || bodyClasses.contains('theme-musclesports')) {
        setCurrentTheme('musclesports');
      } else if (htmlClasses.contains('theme-vera') || bodyClasses.contains('theme-vera')) {
        setCurrentTheme('vera');
      } else {
        setCurrentTheme('ordify');
      }
    };

    detectTheme();
    
    // Watch for theme changes on both elements
    const htmlObserver = new MutationObserver(detectTheme);
    const bodyObserver = new MutationObserver(detectTheme);
    htmlObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      htmlObserver.disconnect();
      bodyObserver.disconnect();
    };
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties | null>(null);

  const handleLogout = () => {
    logout();
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
      <header className="sticky top-0 z-[99999] w-full max-w-full bg-background/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/60 overflow-visible border-b border-white/10 dark:border-white/5 shadow-lg shadow-black/5">
      <div className="container mx-auto flex h-16 items-center justify-between px-3 sm:px-4 gap-2 sm:gap-4">
        <Link href="/" className="flex items-center flex-shrink-0 min-w-0">
          <Image
            src={currentTheme === 'musclesports' 
              ? '/ms.png'
              : currentTheme === 'vera'
              ? 'https://i.imgur.com/verarp-logo.png'
              : siteSettings.logoUrl}
            alt={currentTheme === 'musclesports' ? 'MuscleSports' : currentTheme === 'vera' ? 'VeraRP' : siteSettings.siteName}
            width={currentTheme === 'musclesports' ? 280 : 120}
            height={currentTheme === 'musclesports' ? 100 : 40}
            className={currentTheme === 'musclesports' ? 'h-16 md:h-20 lg:h-24 w-auto' : 'h-8 md:h-10 w-auto'}
            style={currentTheme === 'musclesports' ? {
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1)) brightness(1.05)',
              imageRendering: 'crisp-edges'
            } : undefined}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2 text-sm font-medium transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]">
          <Link
            href="/"
            className={`relative px-5 py-2.5 rounded-xl backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-foreground hover:text-primary font-medium overflow-hidden group ${
              settings.animationsEnabled
                ? 'transition-all duration-500 ease-out hover:scale-[1.02] active:scale-98'
                : 'transition-all duration-300'
            }`}
            style={{
              background: currentTheme === 'musclesports' 
                ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.08), rgba(0, 179, 65, 0.02))'
                : currentTheme === 'vera'
                ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.12), rgba(255, 107, 0, 0.04))'
                : 'linear-gradient(135deg, rgba(56, 142, 233, 0.08), rgba(56, 142, 233, 0.02))'
            }}
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
            className={`relative px-5 py-2.5 rounded-xl backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-foreground hover:text-primary font-medium overflow-hidden group ${
              settings.animationsEnabled
                ? 'transition-all duration-500 ease-out hover:scale-[1.02] active:scale-98'
                : 'transition-all duration-300'
            }`}
            style={{
              background: currentTheme === 'musclesports' 
                ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.08), rgba(0, 179, 65, 0.02))'
                : currentTheme === 'vera'
                ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.12), rgba(255, 107, 0, 0.04))'
                : 'linear-gradient(135deg, rgba(56, 142, 233, 0.08), rgba(56, 142, 233, 0.02))'
            }}
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
            className={`relative px-5 py-2.5 rounded-xl backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] text-foreground hover:text-primary font-medium overflow-hidden group ${
              settings.animationsEnabled
                ? 'transition-all duration-500 ease-out hover:scale-[1.02] active:scale-98'
                : 'transition-all duration-300'
            }`}
            style={{
              background: currentTheme === 'musclesports' 
                ? 'linear-gradient(135deg, rgba(0, 179, 65, 0.08), rgba(0, 179, 65, 0.02))'
                : currentTheme === 'vera'
                ? 'linear-gradient(135deg, rgba(255, 107, 0, 0.12), rgba(255, 107, 0, 0.04))'
                : 'linear-gradient(135deg, rgba(56, 142, 233, 0.08), rgba(56, 142, 233, 0.02))'
            }}
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
        </nav>

        {/* Desktop Search and Auth/Cart */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="relative group" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <div className="relative flex items-center">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="h-10 w-10 group-hover:w-64 focus:w-64 transition-[width] duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] rounded-xl backdrop-blur-xl bg-background/50 border placeholder:opacity-0 group-hover:placeholder:opacity-100 focus:placeholder:opacity-100 placeholder:transition-opacity placeholder:duration-500 placeholder:delay-200 pr-10"
                    style={{
                      borderColor: searchQuery ? (
                        currentTheme === 'musclesports' 
                          ? 'rgba(0, 179, 65, 0.4)'
                          : currentTheme === 'vera'
                          ? 'rgba(255, 107, 0, 0.4)'
                          : 'rgba(56, 142, 233, 0.4)'
                      ) : 'rgba(255, 255, 255, 0.2)',
                      borderWidth: '1px',
                      boxShadow: searchQuery ? (
                        currentTheme === 'musclesports' 
                          ? '0 0 15px rgba(0, 179, 65, 0.15)'
                          : currentTheme === 'vera'
                          ? '0 0 15px rgba(255, 107, 0, 0.15)'
                          : '0 0 15px rgba(56, 142, 233, 0.15)'
                      ) : 'none'
                    }}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setShowResults(true)}
                  />
                  {/* Search Icon - Show when collapsed (no text) OR when typing (with text, on the right) */}
                  {!searchQuery && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-100 group-hover:opacity-0 group-focus-within:opacity-0 transition-opacity duration-300">
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  {/* Right side buttons - Clear (X) and Search icon when expanded */}
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                          setShowResults(false);
                        }}
                        className="h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
                        style={{
                          background: currentTheme === 'musclesports'
                            ? 'rgba(0, 179, 65, 0.1)'
                            : currentTheme === 'vera'
                            ? 'rgba(255, 107, 0, 0.1)'
                            : 'rgba(56, 142, 233, 0.1)',
                        }}
                      >
                        <X className="h-3.5 w-3.5" style={{
                          color: currentTheme === 'musclesports'
                            ? '#00B341'
                            : currentTheme === 'vera'
                            ? '#FF6B00'
                            : '#388EE9'
                        }} />
                      </button>
                    )}
                    {/* Search Submit Button - Always visible when expanded or has text */}
                    <Button 
                      type="submit" 
                      size="icon" 
                      variant="ghost" 
                      className={`h-7 w-7 rounded-lg transition-all duration-300 ${
                        searchQuery ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
                      }`}
                      style={{
                        background: currentTheme === 'musclesports'
                          ? 'rgba(0, 179, 65, 0.1)'
                          : currentTheme === 'vera'
                          ? 'rgba(255, 107, 0, 0.1)'
                          : 'rgba(56, 142, 233, 0.1)',
                      }}
                    >
                      <Search className="h-4 w-4" style={{
                        color: currentTheme === 'musclesports'
                          ? '#00B341'
                          : currentTheme === 'vera'
                          ? '#FF6B00'
                          : '#388EE9'
                      }} />
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
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}

          <Link href="/cart">
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
            </Button>
          </Link>
        </div>

        {/* Mobile menu button and cart - always visible on mobile */}
        <div className="md:hidden flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-auto">
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-[10px] sm:text-xs"
                >
                  {totalItems}
                </Badge>
              )}
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
          <nav className="flex items-center space-x-6 py-2 text-sm" ref={dropdownRef}>
            <Link
              href="/products?category=Vapes"
              className="whitespace-nowrap hover:text-primary transition-colors text-muted-foreground hover:text-foreground"
            >
              Vapes
            </Link>
            <Link
              href="/products?category=Computers+%26+Electronics"
              className="whitespace-nowrap hover:text-primary transition-colors text-muted-foreground hover:text-foreground"
            >
              Computers & Electronics
            </Link>
            
            {/* Home & Office Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'home-office' ? null : 'home-office')}
                className="whitespace-nowrap hover:text-primary transition-colors text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                Home & Office
                <ChevronDown className="h-3 w-3" />
              </button>
              {openDropdown === 'home-office' && (
                <div className="absolute top-full left-0 mt-1 bg-background border rounded-md shadow-lg z-[1000000] min-w-48 py-2">
                  <Link
                    href="/products?category=Home+Goods"
                    className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Home Goods
                  </Link>
                  <Link
                    href="/products?category=Office"
                    className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Office
                  </Link>
                </div>
              )}
            </div>

            {/* Garden & Outdoor Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'garden-outdoor' ? null : 'garden-outdoor')}
                className="whitespace-nowrap hover:text-primary transition-colors text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                Garden & Outdoor
                <ChevronDown className="h-3 w-3" />
              </button>
              {openDropdown === 'garden-outdoor' && (
                <div className="absolute top-full left-0 mt-1 bg-background border rounded-md shadow-lg z-[1000000] min-w-48 py-2">
                  <Link
                    href="/products?category=Garden+%26+Outdoor"
                    className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Garden & Outdoor
                  </Link>
                  <Link
                    href="/products?category=Sports+%26+Leisure"
                    className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Sports & Leisure
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/products?category=Pet+Supplies"
              className="whitespace-nowrap hover:text-primary transition-colors text-muted-foreground hover:text-foreground"
            >
              Pet Supplies
            </Link>
          </nav>
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
    
    {/* Sale Banner */}
    <SaleBanner />
    </>
  );
}
