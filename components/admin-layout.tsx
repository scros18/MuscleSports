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
  Scissors,
  Wrench,
  Percent,
  Zap,
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
  const [currentTheme, setCurrentTheme] = useState<'lumify' | 'ordify' | 'musclesports' | 'vera' | 'blisshair'>('lumify');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAdminAccess();
    // Load saved theme
    const savedTheme = localStorage.getItem('admin_theme') as 'lumify' | 'ordify' | 'musclesports' | 'vera' | 'blisshair';
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
    // Check maintenance mode status
    checkMaintenanceMode();
    // Poll every 10 seconds
    const interval = setInterval(checkMaintenanceMode, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkMaintenanceMode = async () => {
    try {
      const response = await fetch('/api/maintenance-status');
      if (response.ok) {
        const data = await response.json();
        setIsMaintenanceMode(data.isMaintenanceMode || false);
      }
    } catch (error) {
      console.error('Failed to check maintenance mode:', error);
    }
  };

  const applyTheme = (theme: 'lumify' | 'ordify' | 'musclesports' | 'vera' | 'blisshair') => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove all theme classes first
    root.classList.remove('theme-lumify', 'theme-musclesports', 'theme-vera', 'theme-blisshair');
    body.classList.remove('theme-lumify', 'theme-musclesports', 'theme-vera', 'theme-blisshair');
    
    // Apply new theme
    if (theme === 'lumify') {
      root.classList.add('theme-lumify');
      body.classList.add('theme-lumify');
    } else if (theme === 'musclesports') {
      root.classList.add('theme-musclesports');
      body.classList.add('theme-musclesports');
    } else if (theme === 'vera') {
      root.classList.add('theme-vera');
      body.classList.add('theme-vera');
    } else if (theme === 'blisshair') {
      root.classList.add('theme-blisshair');
      body.classList.add('theme-blisshair');
    }
    // ordify is default (no class needed)
  };

  const toggleTheme = () => {
    // Cycle through: lumify -> ordify -> musclesports -> vera -> blisshair -> lumify
    let newTheme: 'lumify' | 'ordify' | 'musclesports' | 'vera' | 'blisshair';
    if (currentTheme === 'lumify') {
      newTheme = 'ordify';
    } else if (currentTheme === 'ordify') {
      newTheme = 'musclesports';
    } else if (currentTheme === 'musclesports') {
      newTheme = 'vera';
    } else if (currentTheme === 'vera') {
      newTheme = 'blisshair';
    } else {
      newTheme = 'lumify';
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
      {/* Navigation */}
      <nav className="flex-1 px-3 pt-3 pb-3 space-y-1 overflow-y-auto">
        {/* Dashboard */}
        <Link
          href="/admin"
          onClick={closeSidebar}
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
            pathname === '/admin'
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Home className="h-5 w-5 flex-shrink-0" />
          <span>Dashboard</span>
        </Link>

        {/* Orders */}
        <Link
          href="/admin/orders"
          onClick={closeSidebar}
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
            pathname === '/admin/orders'
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <ShoppingCart className="h-5 w-5 flex-shrink-0" />
          <span>Orders</span>
        </Link>

        {/* Customers */}
        <Link
          href="/admin/customers"
          onClick={closeSidebar}
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
            pathname === '/admin/customers'
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Users className="h-5 w-5 flex-shrink-0" />
          <span>Customers</span>
        </Link>

        {/* Users */}
        <Link
          href="/admin/users"
          onClick={closeSidebar}
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
            pathname === '/admin/users'
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Users className="h-5 w-5 flex-shrink-0" />
          <span>Users</span>
        </Link>

        {/* Products Section */}
        <div>
          <button
            onClick={() => setProductsExpanded(!productsExpanded)}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
          >
            <Package className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1 text-left">Products</span>
            {productsExpanded ? (
              <ChevronDown className="h-4 w-4 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 flex-shrink-0" />
            )}
          </button>

          {productsExpanded && (
            <div className="ml-8 mt-1 space-y-1">
              <Link
                href="/admin/products"
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-150 ${
                  pathname === '/admin/products'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                All Products
              </Link>
              <Link
                href="/admin/products/categories"
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-150 ${
                  pathname === '/admin/products/categories'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Categories
              </Link>
            </div>
          )}
        </div>

        {/* Analytics */}
        <Link
          href="/admin/analytics"
          onClick={closeSidebar}
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
            pathname === '/admin/analytics'
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="h-5 w-5 flex-shrink-0" />
          <span>Analytics</span>
        </Link>

        {/* Salon Management (for salon-type businesses) */}
        {currentTheme === 'blisshair' && (
          <Link
            href="/admin/salon"
            onClick={closeSidebar}
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
              pathname === '/admin/salon'
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Scissors className="h-5 w-5 flex-shrink-0" />
            <span>Salon Management</span>
          </Link>
        )}

        {/* Site Builder */}
        <Link
          href="/admin/site-builder"
          onClick={closeSidebar}
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
            pathname === '/admin/site-builder'
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Wrench className="h-5 w-5 flex-shrink-0" />
          <span>Site Builder</span>
        </Link>

        {/* Layout Builder */}
        <Link
          href="/admin/layout-builder"
          onClick={closeSidebar}
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
            pathname === '/admin/layout-builder'
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Package className="h-5 w-5 flex-shrink-0" />
          <span>Layout Builder</span>
        </Link>

        {/* Cache+ */}
        <Link
          href="/admin/cache-plus"
          onClick={closeSidebar}
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
            pathname === '/admin/cache-plus'
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Zap className="h-5 w-5 flex-shrink-0" />
          <span className="flex items-center gap-2">
            Cache+
            <span className="text-[10px] px-1.5 py-0.5 bg-yellow-400 text-yellow-900 rounded font-bold">PRO</span>
          </span>
        </Link>

        {/* Settings */}
        <Link
          href="/admin/settings"
          onClick={closeSidebar}
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
            pathname === '/admin/settings'
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          <span>Settings</span>
        </Link>

        {/* Promo Codes */}
        <Link
          href="/admin/promo-codes"
          onClick={closeSidebar}
          className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
            pathname === '/admin/promo-codes'
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Percent className="h-5 w-5 flex-shrink-0" />
          <span>Promo Codes</span>
        </Link>
      </nav>

      {/* Footer with Theme Switcher */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-150 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white mb-3"
        >
          <Palette className="h-5 w-5 flex-shrink-0" />
          <span className="flex items-center gap-2">
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">
              {currentTheme === 'lumify' ? 'Lumify' : currentTheme === 'musclesports' ? 'MuscleSports' : currentTheme === 'vera' ? 'VeraRP' : currentTheme === 'blisshair' ? 'Bliss Hair' : 'Ordify'}
            </span>
          </span>
        </button>

        {/* User info */}
        <div className="px-1">
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
        {/* Maintenance Mode Warning Banner */}
        {isMaintenanceMode && (
          <div className="bg-orange-600 text-white px-4 py-3 flex items-center justify-center gap-3 sticky top-0 z-50 shadow-lg">
            <Wrench className="h-5 w-5 animate-pulse" />
            <div className="font-semibold text-sm sm:text-base">
              🚧 MAINTENANCE MODE ACTIVE - Site is down for all customers. Only you can access /admin
            </div>
            <Wrench className="h-5 w-5 animate-pulse" />
          </div>
        )}

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
