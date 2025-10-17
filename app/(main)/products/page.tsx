"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { SkeletonLoader } from "@/components/skeleton-loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateBreadcrumbSchema } from "@/lib/seo";

type P = { id: string; name: string; price: number; image?: string | null; category?: string; inStock?: boolean; featured?: boolean };

// Ensure this page is dynamically rendered to prevent build-time stalls
export const dynamic = 'force-dynamic';

// Helper to detect current theme
function getCurrentTheme(): string {
  if (typeof window === 'undefined') return 'ordify';
  const classList = document.documentElement.classList;
  if (classList.contains('theme-musclesports')) return 'musclesports';
  if (classList.contains('theme-lumify')) return 'lumify';
  if (classList.contains('theme-vera')) return 'verap';
  if (classList.contains('theme-blisshair')) return 'blisshair';
  return 'ordify';
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 48;
  const [products, setProducts] = useState<P[]>([]);
  const [total, setTotal] = useState(0);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<string>("best_match");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('ordify');
  const [stockFilter, setStockFilter] = useState<"all" | "inStock" | "outOfStock">("all");

  // Initialize search query and category from URL params
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }

    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }

    // Detect theme and watch for changes
    setCurrentTheme(getCurrentTheme());
    const observer = new MutationObserver(() => {
      setCurrentTheme(getCurrentTheme());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Add structured data to page
    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Products', url: '/products' },
    ]);

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);

    return () => {
      observer.disconnect();
      document.head.removeChild(script);
    };
  }, [searchParams]);

  // Fetch products whenever page, category, search, price filters, or THEME change
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('pageSize', String(PRODUCTS_PER_PAGE));
    params.set('theme', currentTheme); // Add theme parameter
    if (sort) params.set('sort', sort);
    if (selectedCategory && selectedCategory !== 'All') params.set('category', selectedCategory);
    if (searchQuery.trim()) params.set('search', searchQuery);
    if (minPrice.trim()) params.set('minPrice', minPrice);
    if (maxPrice.trim()) params.set('maxPrice', maxPrice);
    if (stockFilter !== 'all') params.set('stockFilter', stockFilter);

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then((data) => {
        if (!mounted) return;
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setCategories(['All', ...(data.categories || [])]);
      })
      .catch((err) => {
        console.error('Failed to load products', err);
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false };
  }, [currentPage, selectedCategory, searchQuery, minPrice, maxPrice, sort, currentTheme, stockFilter]);

  // Server returns already-filtered results; use total for pagination
  const totalPages = Math.ceil((total || 0) / PRODUCTS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = Math.min(startIndex + PRODUCTS_PER_PAGE, total);
  const currentProducts = products;

  const handlePageChange = (page: number) => {
    const next = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(next);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    // Update URL without search param
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('search');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setStockFilter("inStock");
    setCurrentPage(1);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-card/50">
        <div className="container py-6">
          <h1 className="text-3xl font-bold mb-2">
            {searchQuery ? <>Search Results for &quot;{searchQuery}&quot;</> : "All Products"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${total.toLocaleString()} results`}
          </p>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && !loading && (
        <div className="border-b bg-blue-50/50 dark:bg-blue-950/20">
          <div className="container py-3 flex items-center justify-between">
            <span className="text-sm">
              Found {total} product{total !== 1 ? 's' : ''} matching &quot;{searchQuery}&quot;
            </span>
            <Button variant="outline" size="sm" onClick={clearSearch}>
              Clear Search
            </Button>
          </div>
        </div>
      )}

      <div className="container px-2 sm:px-4 max-w-full overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 py-4 sm:py-6">
          {/* Mobile filters toggle */}
          <div className="md:hidden w-full">
            <Button 
              variant="outline" 
              className={`w-full justify-between h-11 shadow-sm transition-all duration-200 font-saira ${
                selectedCategory !== "All" || minPrice || maxPrice || stockFilter !== "inStock" 
                  ? "border-primary/50 bg-primary/5" 
                  : ""
              }`}
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <span className="font-medium text-sm">Filters</span>
              <span className={`text-xs font-medium ${
                selectedCategory !== "All" || minPrice || maxPrice || stockFilter !== "inStock"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}>
                {selectedCategory !== "All" || minPrice || maxPrice || stockFilter !== "inStock" ? "Active" : "None"}
              </span>
            </Button>

            {mobileFiltersOpen && (
              <div className="mt-3 border rounded-lg bg-card p-4 shadow-lg animate-in slide-in-from-top-2 duration-300">
                {/* Stock Filter (mobile) */}
                <div className="mb-4">
                  <Label className="text-sm font-semibold mb-3 block">Stock Status</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={stockFilter === "inStock" ? "default" : "outline"}
                      size="sm"
                      className="h-9 text-xs transition-all duration-200 hover:scale-105 active:scale-95 font-saira"
                      onClick={() => {
                        setStockFilter("inStock");
                        setCurrentPage(1);
                      }}
                    >
                      In Stock
                    </Button>
                    <Button
                      variant={stockFilter === "outOfStock" ? "default" : "outline"}
                      size="sm"
                      className="h-9 text-xs transition-all duration-200 hover:scale-105 active:scale-95 font-saira"
                      onClick={() => {
                        setStockFilter("outOfStock");
                        setCurrentPage(1);
                      }}
                    >
                      Out of Stock
                    </Button>
                    <Button
                      variant={stockFilter === "all" ? "default" : "outline"}
                      size="sm"
                      className="h-9 text-xs transition-all duration-200 hover:scale-105 active:scale-95 font-saira"
                      onClick={() => {
                        setStockFilter("all");
                        setCurrentPage(1);
                      }}
                    >
                      All
                    </Button>
                  </div>
                </div>

                {/* Category Filter (mobile) */}
                <div className="mb-4">
                  <Label className="text-sm font-semibold mb-3 block">Category</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        className="h-9 text-xs transition-all duration-200 hover:scale-105 active:scale-95 font-saira"
                        onClick={() => {
                          setSelectedCategory(category);
                          setCurrentPage(1);
                        }}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Price Filter (mobile) */}
                <div className="mb-4">
                  <Label className="text-sm font-semibold mb-3 block">Price Range</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="minPrice" className="text-xs text-muted-foreground mb-1 block">Min</Label>
                      <Input
                        id="minPrice"
                        type="number"
                        placeholder="£0"
                        value={minPrice}
                        onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }}
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxPrice" className="text-xs text-muted-foreground mb-1 block">Max</Label>
                      <Input
                        id="maxPrice"
                        type="number"
                        placeholder="Any"
                        value={maxPrice}
                        onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                        className="h-9"
                      />
                    </div>
                  </div>
                </div>

                {/* Sort (mobile) */}
                <div className="mb-4">
                  <Label className="text-sm font-semibold mb-3 block">Sort</Label>
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); setCurrentPage(1); }}
                    className="w-full h-9 px-2 rounded-md bg-background border text-sm"
                  >
                    <option value="best_match">Best Match</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>

                {/* Clear Filters (mobile) */}
                {(selectedCategory !== "All" || minPrice || maxPrice || stockFilter !== "inStock") && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20">
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Filters (desktop) */}
          <aside className="hidden md:block w-60 flex-shrink-0">
            <div className="sticky top-20 border rounded-xl bg-card p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-5 pb-3 border-b">
                <h2 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Filters</h2>
                {(selectedCategory !== "All" || minPrice || maxPrice || stockFilter !== "inStock") && (
                  <button 
                    onClick={clearFilters} 
                    className="text-xs text-red-600 hover:text-red-700 hover:underline transition-colors hover-shake font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              {/* Stock Filter */}
              <div className="mb-6">
                <Label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Stock Status
                </Label>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setStockFilter("inStock");
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:translate-x-1 font-saira ${
                      stockFilter === "inStock"
                        ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {stockFilter === "inStock" && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      In Stock
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setStockFilter("outOfStock");
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:translate-x-1 font-saira ${
                      stockFilter === "outOfStock"
                        ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {stockFilter === "outOfStock" && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      Out of Stock
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setStockFilter("all");
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:translate-x-1 font-saira ${
                      stockFilter === "all"
                        ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                        : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {stockFilter === "all" && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      All
                    </span>
                  </button>
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <Label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Category
                </Label>
                <div className="space-y-2 max-h-64 overflow-y-auto category-scroll">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:translate-x-1 font-saira ${
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {selectedCategory === category && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-5">
                <Label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Price Range
                </Label>
                <div className="space-y-3">
                  <div className="relative">
                    <Label htmlFor="minPriceDesktop" className="text-xs text-muted-foreground mb-1.5 block">Min Price (£)</Label>
                    <Input
                      id="minPriceDesktop"
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="h-10 pl-8 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="absolute left-3 top-[34px] text-muted-foreground text-sm">£</span>
                  </div>
                  <div className="relative">
                    <Label htmlFor="maxPriceDesktop" className="text-xs text-muted-foreground mb-1.5 block">Max Price (£)</Label>
                    <Input
                      id="maxPriceDesktop"
                      type="number"
                      placeholder="Any"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="h-10 pl-8 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="absolute left-3 top-[34px] text-muted-foreground text-sm">£</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 w-full">
            {/* Toolbar with count and sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-4 border-b">
              <p className="text-xs sm:text-sm font-medium whitespace-nowrap">
                <span className="text-muted-foreground">Showing</span>{" "}
                <span className="font-bold text-foreground">{total ? startIndex + 1 : 0}-{endIndex}</span>{" "}
                <span className="text-muted-foreground">of</span>{" "}
                <span className="font-bold text-foreground">{total.toLocaleString()}</span>
              </p>
              <div className="flex sm:hidden w-full items-center gap-2 text-xs">
                <label className="text-xs whitespace-nowrap">Sort:</label>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setCurrentPage(1); }}
                  className="flex-1 h-9 px-2 rounded-md bg-background border text-xs"
                >
                  <option value="best_match">Best Match</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <label className="text-sm whitespace-nowrap">Sort by:</label>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setCurrentPage(1); }}
                  className="h-8 px-3 rounded-md bg-background border text-sm"
                >
                  <option value="best_match">Best Match</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid - Optimized for mobile with smooth loading */}
            {loading ? (
              <SkeletonLoader type="product" count={12} />
            ) : currentProducts && currentProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 mb-8">
                  {currentProducts.map((product, idx) => (
                    <div 
                      key={product.id}
                      className="w-full"
                    >
                      <ProductCard product={product as any} hideDescription={true} />
                    </div>
                  ))}
                </div>

                {(!currentProducts || currentProducts.length === 0) && (
                  <div className="text-center py-20 border rounded-lg bg-muted/20">
                    <div className="max-w-md mx-auto px-4">
                      <svg className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-lg font-semibold mb-2">No products found</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Try adjusting your filters or search terms
                      </p>
                      {(selectedCategory !== "All" || minPrice || maxPrice || searchQuery) && (
                        <Button variant="outline" onClick={clearFilters}>
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 border rounded-lg bg-muted/20">
                <div className="max-w-md mx-auto px-4">
                  <svg className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  {(selectedCategory !== "All" || minPrice || maxPrice || searchQuery) && (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10 pt-8 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-4"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (pageNum > totalPages) return null;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        className="h-10 w-10"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-4"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
