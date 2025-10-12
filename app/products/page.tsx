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

  // Initialize search query from URL params
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
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
  }, [currentPage, selectedCategory, searchQuery, minPrice, maxPrice, sort, currentTheme]);

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

      <div className="container">
        <div className="flex gap-6 py-6">
          {/* Mobile filters toggle */}
          <div className="md:hidden w-full mb-4">
            <Button 
              variant="outline" 
              className="w-full justify-between h-11 shadow-sm"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <span className="font-medium">Filters</span>
              <span className="text-xs text-muted-foreground">
                {selectedCategory !== "All" || minPrice || maxPrice ? "Active" : "None"}
              </span>
            </Button>

            {mobileFiltersOpen && (
              <div className="mt-3 border rounded-lg bg-card p-4 shadow-lg">
                {/* Category Filter (mobile) */}
                <div className="mb-4">
                  <Label className="text-sm font-semibold mb-3 block">Category</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        className="h-9 text-xs"
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
                {(selectedCategory !== "All" || minPrice || maxPrice) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20">
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Filters (desktop) */}
          <aside className="hidden md:block w-60 flex-shrink-0">
            <div className="sticky top-6 border rounded-lg bg-card p-5 shadow-sm">
              <h2 className="text-lg font-bold mb-5 pb-3 border-b">Filters</h2>
              
              {/* Category Filter */}
              <div className="mb-5">
                <Label className="text-sm font-semibold mb-3 block">Category</Label>
                <div className="space-y-1.5">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start h-9 text-sm font-medium"
                      onClick={() => {
                        setSelectedCategory(category);
                        setCurrentPage(1); // reset to first page when category changes
                      }}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-5">
                <Label className="text-sm font-semibold mb-3 block">Price Range</Label>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="minPriceDesktop" className="text-xs text-muted-foreground mb-1 block">Min Price</Label>
                    <Input
                      id="minPriceDesktop"
                      type="number"
                      placeholder="£0"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPriceDesktop" className="text-xs text-muted-foreground mb-1 block">Max Price</Label>
                    <Input
                      id="maxPriceDesktop"
                      type="number"
                      placeholder="Any"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="h-9"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory !== "All" || minPrice || maxPrice) && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20">
                  Clear All Filters
                </Button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Toolbar with count and sort */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b">
              <p className="text-sm font-medium">
                <span className="text-muted-foreground">Showing</span>{" "}
                <span className="font-bold text-foreground">{total ? startIndex + 1 : 0}-{endIndex}</span>{" "}
                <span className="text-muted-foreground">of</span>{" "}
                <span className="font-bold text-foreground">{total.toLocaleString()}</span>
              </p>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <label className="text-sm">Sort by:</label>
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
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-8">
                  {currentProducts.map((product, idx) => (
                    <div 
                      key={product.id}
                      style={{
                        animation: `slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.02}s backwards`
                      }}
                    >
                      <ProductCard product={product as any} hideDescription={true} />
                    </div>
                  ))}
                </div>

                {(!currentProducts || currentProducts.length === 0) && (
                  <div className="text-center py-20 border rounded-lg bg-muted/20">
                    <div className="max-w-md mx-auto">
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
