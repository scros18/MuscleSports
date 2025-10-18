'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Search, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AdminLayout } from '@/components/admin-layout';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  inStock: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  const router = useRouter();
  const searchParams = useSearchParams();

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/admin/products/categories', {
        headers,
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    loadCategories();
    
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    loadProducts(1, searchParam || '', categoryParam || '');
  }, [searchParams]);

  const loadProducts = async (page: number = 1, search: string = '', category: string = '') => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      let url = `/api/admin/products?page=${page}&limit=50`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (category) url += `&category=${encodeURIComponent(category)}`;

      const response = await fetch(url, {
        headers,
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
        setPagination(data.pagination);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    loadProducts(1, value, selectedCategory);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCategory(value);
    loadProducts(1, searchTerm, value);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    loadProducts(1, '', '');
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    setDeleting(productId);
    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers,
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminLayout title="Products" description="Manage your product inventory">
      <div className="p-4 sm:p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">Product Management</h2>
          <Link href="/admin/products/new">
            <Button className="bg-blue-600 hover:bg-blue-700">Add Product</Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="bg-slate-900 border-slate-800 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {(searchTerm || selectedCategory) && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="border-slate-700 text-slate-300"
                >
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-slate-400">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="p-8 text-center text-slate-400">No products found</div>
            ) : (
              <div className="space-y-2">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-slate-800"></div>
                      )}
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{product.name}</p>
                        <p className="text-slate-400 text-sm">£{product.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {product.inStock ? (
                        <Badge className="bg-green-500/20 text-green-400">In Stock</Badge>
                      ) : (
                        <Badge className="bg-red-500/20 text-red-400">Out of Stock</Badge>
                      )}
                      {product.featured && (
                        <Badge className="bg-yellow-500/20 text-yellow-400">Featured</Badge>
                      )}
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleting === product.id}
                        className="text-red-400 hover:text-red-300"
                      >
                        {deleting === product.id ? '...' : <Trash2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => loadProducts(Math.max(1, currentPage - 1), searchTerm, selectedCategory)}
              disabled={currentPage === 1}
              className="border-slate-700 text-slate-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, currentPage - 2)) + i;
              if (pageNum > pagination.totalPages) return null;
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? 'default' : 'outline'}
                  onClick={() => loadProducts(pageNum, searchTerm, selectedCategory)}
                  className={pageNum === currentPage ? 'bg-blue-600' : 'border-slate-700 text-slate-300'}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              onClick={() => loadProducts(Math.min(pagination.totalPages, currentPage + 1), searchTerm, selectedCategory)}
              disabled={currentPage === pagination.totalPages}
              className="border-slate-700 text-slate-300"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
