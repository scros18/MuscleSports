"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateBreadcrumbSchema } from "@/lib/seo";

type P = { id: string; name: string; price: number; image?: string | null; category?: string; inStock?: boolean; featured?: boolean };

// Ensure this page is dynamically rendered to prevent build-time stalls
export const dynamic = 'force-dynamic';

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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Initialize search query from URL params
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }

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
      document.head.removeChild(script);
    };
  }, [searchParams]);

  // Fetch products whenever page, category, search, or price filters change
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('pageSize', String(PRODUCTS_PER_PAGE));
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
  }, [currentPage, selectedCategory, searchQuery, minPrice, maxPrice]);

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
  
  if (loading) return <LoadingSpinner message="Loading products..." />;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">
          {searchQuery ? `Search Results for &quot;${searchQuery}&quot;` : "All Products"}
        </h1>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-4 p-4 bg-muted rounded-lg flex items-center justify-between">
            <span className="text-sm">
              Found {total} product{total !== 1 ? 's' : ''} matching &quot;{searchQuery}&quot;
            </span>
            <Button variant="outline" size="sm" onClick={clearSearch}>
              Clear Search
            </Button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Mobile filters toggle */}
          <div className="md:hidden w-full mb-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Showing {total ? startIndex + 1 : 0}-{endIndex} of {total} products</div>
              <Button variant="outline" size="sm" onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}>
                {mobileFiltersOpen ? 'Close Filters' : 'Filters'}
              </Button>
            </div>

            {mobileFiltersOpen && (
              <div className="mt-3 bg-muted/50 p-4 rounded-lg">
                {/* Category Filter (mobile) */}
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2 block">Category</Label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
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
                  <Label className="text-sm font-medium mb-2 block">Price Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="minPrice" className="text-xs text-muted-foreground">Min</Label>
                      <Input
                        id="minPrice"
                        type="number"
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">Max</Label>
                      <Input
                        id="maxPrice"
                        type="number"
                        placeholder="No limit"
                        value={maxPrice}
                        onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Clear Filters (mobile) */}
                {(selectedCategory !== "All" || minPrice || maxPrice) && (
                  <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Filters (desktop) */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-muted/50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-3 block">Category</Label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
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
              <div className="mb-6">
                <Label className="text-sm font-medium mb-3 block">Price Range</Label>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="minPrice" className="text-xs text-muted-foreground">Min Price</Label>
                    <Input
                      id="minPrice"
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">Max Price</Label>
                    <Input
                      id="maxPrice"
                      type="number"
                      placeholder="No limit"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory !== "All" || minPrice || maxPrice) && (
                <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Products Count */}
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {total ? startIndex + 1 : 0}-{endIndex} of {total} products
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>

            {(!currentProducts || currentProducts.length === 0) && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your filters.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
