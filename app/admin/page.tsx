'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BarChart3,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  UserCheck,
  Settings,
  Home,
  ChevronRight,
  ChevronDown,
  Tag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SimpleChart } from '@/components/simple-chart';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: any[];
  salesData: any[];
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [productsExpanded, setProductsExpanded] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: [],
    salesData: []
  });
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
    loadDashboardStats();
  }, []);

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

  const loadDashboardStats = async () => {
    try {
      // Load mock data for now - in a real app, these would come from APIs
      setStats({
        totalOrders: 156,
        totalRevenue: 12450.99,
        totalCustomers: 89,
        totalProducts: 234,
        recentOrders: [
          { id: 'ORD-001', customer: 'John Doe', amount: 299.99, status: 'completed', date: '2025-10-11' },
          { id: 'ORD-002', customer: 'Jane Smith', amount: 149.50, status: 'pending', date: '2025-10-11' },
          { id: 'ORD-003', customer: 'Bob Johnson', amount: 79.99, status: 'completed', date: '2025-10-10' },
        ],
        salesData: [
          { name: 'Jan', value: 2400, color: 'hsl(var(--primary))' },
          { name: 'Feb', value: 1398, color: 'hsl(var(--primary))' },
          { name: 'Mar', value: 9800, color: 'hsl(var(--primary))' },
          { name: 'Apr', value: 3908, color: 'hsl(var(--primary))' },
          { name: 'May', value: 4800, color: 'hsl(var(--primary))' },
          { name: 'Jun', value: 3800, color: 'hsl(var(--primary))' },
          { name: 'Jul', value: 4300, color: 'hsl(var(--primary))' },
        ]
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
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

  const sidebarItems = [
    { name: 'Dashboard', href: '/admin', icon: Home, current: true },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, current: false },
    { name: 'Customers', href: '/admin/customers', icon: Users, current: false },
    { name: 'Products', href: '/admin/products', icon: Package, current: false },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, current: false },
    { name: 'Settings', href: '/admin/settings', icon: Settings, current: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-white border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Ordify Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {/* Dashboard */}
            <Link
              href="/admin"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                true
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
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+12%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">£{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+8%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                    <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+15%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+5%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Chart */}
          <div className="mb-8">
            <SimpleChart
              title="Monthly Revenue"
              data={stats.salesData}
              height={300}
            />
          </div>

          {/* Recent Orders and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">£{order.amount}</p>
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link
                    href="/admin/orders"
                    className="text-sm text-primary hover:underline flex items-center"
                  >
                    View all orders
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button asChild className="w-full justify-start">
                    <Link href="/admin/products/new">
                      <Package className="mr-2 h-4 w-4" />
                      Add New Product
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/admin/products">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Manage Products
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/admin/customers">
                      <Users className="mr-2 h-4 w-4" />
                      View Customers
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}