'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Home, ShoppingCart, Users, Package, BarChart3, Settings, Tag, ChevronDown, ChevronRight, Search, ChevronLeft } from 'lucide-react';

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

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminProductsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<'update-stock' | 'update-featured' | 'delete' | null>(null);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const [productsExpanded, setProductsExpanded] = useState(false);
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
    checkAdminAccess();
    loadCategories();
    
    // Check for URL parameters on initial load
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    
    // Load products with URL parameters
    loadProducts(1, searchParam || '', categoryParam || '');
  }, [searchParams]);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/auth/me', {
        headers,
      });

      if (response.ok) {
        const userData = await response.json();
        if (userData.role === 'admin') {
          setUser(userData);
        } else {
          router.push('/');
        }
      } else {
        router.push('/login');
      }
    } catch (error) {
      router.push('/login');
    }
  };

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

  const handleSelectProduct = (productId: string, checked: boolean, index?: number) => {
    const newSelected = new Set(selectedProducts);
    if (checked) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProducts(newSelected);
    if (index !== undefined) {
      setLastClickedIndex(index);
    }
  };

  const handleRowClick = (productId: string, event: React.MouseEvent, index: number) => {
    // Don't trigger row selection if clicking on interactive elements
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'SELECT' ||
      target.tagName === 'OPTION' ||
      target.closest('button') ||
      target.closest('select') ||
      target.closest('input')
    ) {
      return;
    }

    if (event.shiftKey && lastClickedIndex !== null) {
      // Range selection with shift+click
      const startIndex = Math.min(lastClickedIndex, index);
      const endIndex = Math.max(lastClickedIndex, index);
      const rangeProductIds = products.slice(startIndex, endIndex + 1).map(p => p.id);

      const newSelected = new Set(selectedProducts);
      rangeProductIds.forEach(id => newSelected.add(id));
      setSelectedProducts(newSelected);
    } else {
      // Regular click - toggle selection
      const isSelected = selectedProducts.has(productId);
      handleSelectProduct(productId, !isSelected);
      setLastClickedIndex(index);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(new Set(products.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleBulkStockUpdate = async (inStock: boolean) => {
    if (selectedProducts.size === 0) return;

    if (!confirm(`Are you sure you want to set ${selectedProducts.size} product(s) to ${inStock ? 'in stock' : 'out of stock'}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'update-stock',
          productIds: Array.from(selectedProducts),
          inStock
        }),
      });

      if (response.ok) {
        setProducts(products.map(p => selectedProducts.has(p.id) ? { ...p, inStock } : p));
        setSelectedProducts(new Set());
        setBulkAction(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update product stock');
      }
    } catch (error) {
      console.error('Error updating product stock:', error);
      alert('Failed to update product stock');
    }
  };

  const handleBulkFeaturedUpdate = async (featured: boolean) => {
    if (selectedProducts.size === 0) return;

    if (!confirm(`Are you sure you want to set ${selectedProducts.size} product(s) to ${featured ? 'featured' : 'not featured'}?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'update-featured',
          productIds: Array.from(selectedProducts),
          featured
        }),
      });

      if (response.ok) {
        setProducts(products.map(p => selectedProducts.has(p.id) ? { ...p, featured } : p));
        setSelectedProducts(new Set());
        setBulkAction(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update product featured status');
      }
    } catch (error) {
      console.error('Error updating product featured status:', error);
      alert('Failed to update product featured status');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedProducts.size} product(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'delete',
          productIds: Array.from(selectedProducts)
        }),
      });

      if (response.ok) {
        setProducts(products.filter(p => !selectedProducts.has(p.id)));
        setSelectedProducts(new Set());
        setBulkAction(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete products');
      }
    } catch (error) {
      console.error('Error deleting products:', error);
      alert('Failed to delete products');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-white border-b border-gray-200">
            <Link href="/admin" className="text-xl font-bold text-gray-900 hover:text-gray-700">
              Ordify Admin
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {/* Dashboard */}
            <Link
              href="/admin"
              className="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </Link>

            {/* Orders */}
            <Link
              href="/admin/orders"
              className="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <ShoppingCart className="mr-3 h-5 w-5" />
              Orders
            </Link>

            {/* Customers */}
            <Link
              href="/admin/customers"
              className="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Users className="mr-3 h-5 w-5" />
              Customers
            </Link>

            {/* Users */}
            <Link
              href="/admin/users"
              className="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Users className="mr-3 h-5 w-5" />
              Users
            </Link>

            {/* Products Section */}
            <div>
              <button
                onClick={() => setProductsExpanded(!productsExpanded)}
                className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Package className="mr-3 h-5 w-5" />
                <span>Products</span>
                {productsExpanded ? (
                  <ChevronDown className="ml-auto h-4 w-4" />
                ) : (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </button>

              {productsExpanded && (
                <div className="ml-6 mt-2 space-y-1">
                  <Link
                    href="/admin/products"
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 bg-accent text-accent-foreground border-r-2 border-primary"
                  >
                    <Package className="mr-3 h-4 w-4" />
                    All Products
                  </Link>
                  <Link
                    href="/admin/products/categories"
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <Tag className="mr-3 h-4 w-4" />
                    Categories
                  </Link>
                </div>
              )}
            </div>

            {/* Analytics */}
            <Link
              href="/admin/analytics"
              className="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              Analytics
            </Link>

            {/* Settings */}
            <Link
              href="/admin/settings"
              className="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
          </nav>

          {/* User info */}
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Link
              href="/"
              className="mt-3 block text-sm text-primary hover:underline"
            >
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
                <p className="text-sm text-gray-600">Manage your product inventory</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/products/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Add Product
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Filters and Search */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {(searchTerm || selectedCategory) && (
                    <button
                      onClick={handleClearFilters}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-blue-800">
                    {selectedProducts.size} product{selectedProducts.size !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    value={bulkAction || ''}
                    onChange={(e) => setBulkAction(e.target.value as 'update-stock' | 'update-featured' | 'delete' | null)}
                    className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <option value="">Choose action...</option>
                    <option value="update-stock">Update Stock Status</option>
                    <option value="update-featured">Update Featured Status</option>
                    <option value="delete">Delete Products</option>
                  </select>
                  {bulkAction === 'update-stock' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBulkStockUpdate(true)}
                        className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Set In Stock
                      </button>
                      <button
                        onClick={() => handleBulkStockUpdate(false)}
                        className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Set Out of Stock
                      </button>
                    </div>
                  )}
                  {bulkAction === 'update-featured' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBulkFeaturedUpdate(true)}
                        className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Set Featured
                      </button>
                      <button
                        onClick={() => handleBulkFeaturedUpdate(false)}
                        className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Remove Featured
                      </button>
                    </div>
                  )}
                  {bulkAction === 'delete' && (
                    <button
                      onClick={handleBulkDelete}
                      className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Selected
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedProducts(new Set());
                      setBulkAction(null);
                    }}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {/* Table Header */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedProducts.size === products.length && products.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-3 text-sm font-medium text-gray-900">Select All</span>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || selectedCategory ? 'Try adjusting your search or filters.' : 'Get started by adding your first product.'}
                </p>
                <div className="mt-6">
                  <Link
                    href="/admin/products/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Add Product
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {products.map((product, index) => (
                  <li
                    key={product.id}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedProducts.has(product.id) ? 'bg-blue-50' : ''
                    }`}
                    onClick={(e) => handleRowClick(product.id, e, index)}
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedProducts.has(product.id)}
                            onChange={(e) => handleSelectProduct(product.id, e.target.checked, index)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-4"
                          />
                          <div className="flex-shrink-0 h-12 w-12">
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500">£{product.price.toFixed(2)}</div>
                            <div className="text-sm text-gray-400">
                              {product.category && <span className="mr-2">Category: {product.category}</span>}
                              Created: {new Date(product.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {product.inStock ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                In Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Out of Stock
                              </span>
                            )}
                            {product.featured && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Edit
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(product.id);
                              }}
                              disabled={deleting === product.id}
                              className="inline-flex items-center px-3 py-1 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            >
                              {deleting === product.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-lg">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => loadProducts(Math.max(1, currentPage - 1), searchTerm, selectedCategory)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => loadProducts(Math.min(pagination.totalPages, currentPage + 1), searchTerm, selectedCategory)}
                  disabled={currentPage === pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * pagination.limit + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pagination.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => loadProducts(Math.max(1, currentPage - 1), searchTerm, selectedCategory)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, currentPage - 2)) + i;
                      if (pageNum > pagination.totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => loadProducts(pageNum, searchTerm, selectedCategory)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            pageNum === currentPage
                              ? 'z-10 bg-primary border-primary text-white'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => loadProducts(Math.min(pagination.totalPages, currentPage + 1), searchTerm, selectedCategory)}
                      disabled={currentPage === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}