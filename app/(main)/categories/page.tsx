'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkeletonLoader } from '@/components/skeleton-loader';
import { generateBreadcrumbSchema } from '@/lib/seo';

export const dynamic = 'force-dynamic';

interface CategoryWithCount {
  name: string;
  count: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<string>('ordify');

  // Detect theme from documentElement class
  useEffect(() => {
    const detectTheme = () => {
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
    
    const htmlObserver = new MutationObserver(detectTheme);
    const bodyObserver = new MutationObserver(detectTheme);
    htmlObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    htmlObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      htmlObserver.disconnect();
      bodyObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const themeParam = currentTheme === 'musclesports' ? '&theme=musclesports' : '';
    fetch(`/api/products?pageSize=1000${themeParam}`)
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
  }, [currentTheme]);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">Product Categories</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Browse our products by category to find exactly what you need.
          </p>
        </div>
        <SkeletonLoader type="category" count={8} />
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category, idx) => {
            const themeParam = currentTheme === 'musclesports' ? '&theme=musclesports' : '';
            return (
            <Link
              key={category.name}
              href={`/products?category=${encodeURIComponent(category.name)}${themeParam}`}
              style={{
                animation: `slideInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.05}s backwards`
              }}
              className="group"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] border hover:border-primary/30 rounded-lg premium-card overflow-hidden">
                <CardContent className="p-4 sm:p-5 md:p-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                        <Package className="h-5 w-5 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
                      </div>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300" />
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {category.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs md:text-sm text-muted-foreground font-medium">
                      {category.count} product{category.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
          })}
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
