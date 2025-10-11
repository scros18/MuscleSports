'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateBreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';

interface CategoryWithCount {
  name: string;
  count: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?pageSize=1000')
      .then(res => res.json())
      .then(data => {
        const cats = data.categories || [];
        const products = data.products || [];
        
        // Count products per category
        const counts = cats.map((cat: string) => ({
          name: cat,
          count: products.filter((p: any) => p.category === cat).length
        })).filter((c: CategoryWithCount) => c.name !== 'All');
        
        setCategories(counts);

        // Add structured data to page
        const breadcrumbSchema = generateBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Categories', url: '/categories' },
        ]);

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(breadcrumbSchema);
        document.head.appendChild(script);

        return () => {
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
        };
      })
      .catch(err => console.error('Failed to load categories', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 sm:py-8 px-4">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">Product Categories</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Browse our products by category to find exactly what you need.
        </p>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <Package className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">No categories available</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              Check back soon for our product categories.
            </p>
            <Button asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border hover:border-primary/20 rounded-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <Package className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {category.count} product{category.count !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 sm:mt-12 text-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/products">
            <Package className="mr-2 h-5 w-5" />
            Browse All Products
          </Link>
        </Button>
      </div>
    </div>
  );
}
