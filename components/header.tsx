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
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}&pageSize=5`);
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
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
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
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 1000000,
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
      <header className="sticky top-0 z-[99999] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-visible">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src={siteSettings.logoUrl}
            alt={siteSettings.siteName}
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-3 text-sm font-medium">
          <Link
            href="/"
            className={`relative px-4 py-2 rounded-full backdrop-blur-md bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-800/40 border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl text-foreground hover:text-primary font-semibold overflow-hidden group ${
              settings.animationsEnabled
                ? 'transition-all duration-300 hover:scale-105 active:scale-95'
                : 'transition-shadow duration-200'
            }`}
          >
            <span className="relative z-10">Home</span>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]"></div>
          </Link>
          <Link
            href="/products"
            className={`relative px-4 py-2 rounded-full backdrop-blur-md bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-800/40 border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl text-foreground hover:text-primary font-semibold overflow-hidden group ${
              settings.animationsEnabled
                ? 'transition-all duration-300 hover:scale-105 active:scale-95'
                : 'transition-shadow duration-200'
            }`}
          >
            <span className="relative z-10">Products</span>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]"></div>
          </Link>
          <Link
            href="/categories"
            className={`relative px-4 py-2 rounded-full backdrop-blur-md bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-800/40 border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl text-foreground hover:text-primary font-semibold overflow-hidden group ${
              settings.animationsEnabled
                ? 'transition-all duration-300 hover:scale-105 active:scale-95'
                : 'transition-shadow duration-200'
            }`}
          >
            <span className="relative z-10">Categories</span>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]"></div>
          </Link>
        </nav>

        {/* Desktop Search and Auth/Cart */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-64"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Button type="submit" size="icon" variant="ghost">
                <Search className="h-5 w-5" />
              </Button>
            </form>

            {/* Search Results Dropdown (portal) */}
            {showResults && typeof document !== "undefined" && createPortal(
              <div style={dropdownStyle || {}} className="bg-background border rounded-md shadow-lg" data-debug="search-portal">
                {isSearching ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleResultClick(product.id)}
                        className="w-full px-4 py-2 text-left hover:bg-muted flex items-center space-x-3"
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
                      </button>
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
        <div className="md:hidden flex items-center space-x-2 flex-shrink-0">
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
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
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
        <div className="md:hidden border-t bg-background">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="flex-1"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <Button type="submit" size="icon" variant="ghost">
                  <Search className="h-5 w-5" />
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
                        <button
                          key={product.id}
                          onClick={() => {
                            handleResultClick(product.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-muted flex items-center space-x-3"
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
                        </button>
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
            <nav className="space-y-3">
              <Link
                href="/"
                className={`relative block px-4 py-3 text-base font-semibold rounded-full backdrop-blur-md bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-800/40 border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl text-center text-foreground hover:text-primary overflow-hidden group ${
                  settings.animationsEnabled
                    ? 'transition-all duration-300 active:scale-95'
                    : 'transition-colors duration-200'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]"></div>
              </Link>
              <Link
                href="/products"
                className={`relative block px-4 py-3 text-base font-semibold rounded-full backdrop-blur-md bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-800/40 border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl text-center text-foreground hover:text-primary overflow-hidden group ${
                  settings.animationsEnabled
                    ? 'transition-all duration-300 active:scale-95'
                    : 'transition-colors duration-200'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="relative z-10">Products</span>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]"></div>
              </Link>
              <Link
                href="/categories"
                className={`relative block px-4 py-3 text-base font-semibold rounded-full backdrop-blur-md bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-800/40 border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl text-center text-foreground hover:text-primary overflow-hidden group ${
                  settings.animationsEnabled
                    ? 'transition-all duration-300 active:scale-95'
                    : 'transition-colors duration-200'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="relative z-10">Categories</span>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]"></div>
              </Link>
            </nav>

            {/* Mobile Auth */}
            <div className="border-t pt-4 space-y-4 flex flex-col items-center">
              {user ? (
                <div className="space-y-3">
                  <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Account
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">
                      Register
                    </Button>
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
