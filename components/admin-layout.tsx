'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronDown,
  Tag,
  Menu,
  X,
  Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productsExpanded, setProductsExpanded] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'ordify' | 'musclesports' | 'vera'>('ordify');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAdminAccess();
    // Load saved theme
    const savedTheme = localStorage.getItem('admin_theme') as 'ordify' | 'musclesports' | 'vera';
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (theme: 'ordify' | 'musclesports' | 'vera') => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove all theme classes first
    root.classList.remove('theme-musclesports', 'theme-vera');
    body.classList.remove('theme-musclesports', 'theme-vera');
    
    // Apply new theme
    if (theme === 'musclesports') {
      root.classList.add('theme-musclesports');
      body.classList.add('theme-musclesports');
    } else if (theme === 'vera') {
      root.classList.add('theme-vera');
      body.classList.add('theme-vera');
    }
    // ordify is default (no class needed)
  };

  const toggleTheme = () => {
    // Cycle through: ordify -> musclesports -> vera -> ordify
    let newTheme: 'ordify' | 'musclesports' | 'vera';
    if (currentTheme === 'ordify') {
      newTheme = 'musclesports';
    } else if (currentTheme === 'musclesports') {
      newTheme = 'vera';
    } else {
      newTheme = 'ordify';
    }
    setCurrentTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('admin_theme', newTheme);
  };

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
    } finally {
      setLoading(false);
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

  const closeSidebar = () => setSidebarOpen(false);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex flex-col h-20 px-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between pt-4">
          <div className="flex flex-col">
            <Link href="/admin" className="text-xl font-bold" onClick={closeSidebar}>
              {currentTheme === 'musclesports' ? (
                <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">MuscleSports</span>
              ) : (
                <span className="text-gray-900">Ordify Admin</span>
              )}
            </Link>
            <span className="text-[10px] font-medium text-muted-foreground mt-0.5">
              {currentTheme === 'musclesports' ? 'Leon\'s MuscleSports.co.uk' : 'Direct E-commerce'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={closeSidebar}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {/* Dashboard */}
        <Link
          href="/admin"
          onClick={closeSidebar}
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
            pathname === '/admin'
              ? 'bg-accent text-accent-foreground border-r-2 border-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          <Home className="mr-3 h-5 w-5" />
          Dashboard
        </Link>

        {/* Orders */}
        <Link
          href="/admin/orders"
          onClick={closeSidebar}
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
            pathname === '/admin/orders'
              ? 'bg-accent text-accent-foreground border-r-2 border-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          <ShoppingCart className="mr-3 h-5 w-5" />
          Orders
        </Link>

        {/* Customers */}
        <Link
          href="/admin/customers"
          onClick={closeSidebar}
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
            pathname === '/admin/customers'
              ? 'bg-accent text-accent-foreground border-r-2 border-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          <Users className="mr-3 h-5 w-5" />
          Customers
        </Link>

        {/* Users */}
        <Link
          href="/admin/users"
          onClick={closeSidebar}
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
            pathname === '/admin/users'
              ? 'bg-accent text-accent-foreground border-r-2 border-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
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
                onClick={closeSidebar}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  pathname === '/admin/products'
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Package className="mr-3 h-4 w-4" />
                All Products
              </Link>
              <Link
                href="/admin/products/categories"
                onClick={closeSidebar}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  pathname === '/admin/products/categories'
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
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
          onClick={closeSidebar}
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
            pathname === '/admin/analytics'
              ? 'bg-accent text-accent-foreground border-r-2 border-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          <BarChart3 className="mr-3 h-5 w-5" />
          Analytics
        </Link>

        {/* Settings */}
        <Link
          href="/admin/settings"
          onClick={closeSidebar}
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
            pathname === '/admin/settings'
              ? 'bg-accent text-accent-foreground border-r-2 border-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Link>

        {/* Theme Switcher */}
        <div className="pt-4 mt-4 border-t">
          <button
            onClick={toggleTheme}
            className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-foreground border border-primary/20 shadow-sm"
          >
            <Palette className="mr-3 h-5 w-5 text-primary" />
            <span>Theme: {currentTheme === 'musclesports' ? 'MuscleSports' : currentTheme === 'vera' ? 'VeraRP' : 'Ordify'}</span>
          </button>
          <p className="px-4 mt-2 text-xs text-muted-foreground">
            {currentTheme === 'musclesports' 
              ? '🟢 Green sports nutrition theme'
              : currentTheme === 'vera'
              ? '🟣 Purple gaming/roleplay theme'
              : '🔵 Standard e-commerce theme'}
          </p>
        </div>
      </nav>

      {/* User info */}
      <div className="p-4 border-t">
        <div className="flex items-center mb-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
        <Link
          href="/"
          onClick={closeSidebar}
          className="block text-sm text-primary hover:underline"
        >
          ← Back to Store
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:w-64 bg-white shadow-lg flex-col">
        <SidebarContent />
      </div>

      {/* Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
                  {description && (
                    <p className="text-sm text-gray-600 hidden sm:block">{description}</p>
                  )}
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
