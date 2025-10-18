'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Package,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  UserCheck,
  Users,
  ChevronRight,
  Cpu,
  Activity,
  Gauge,
  Timer,
  Wrench,
  ToggleLeft,
  ToggleRight,
  Plus,
  Search,
  Bell,
  Menu,
  Home,
  Settings,
  LayoutGrid,
  FileText,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SimpleChart } from '@/components/simple-chart';
import { AdminLayout } from '@/components/admin-layout';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: any[];
  salesData: any[];
}

// Modern Maintenance Toggle Component for Sidebar
function MaintenanceToggleModern() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/admin/maintenance');
      const data = await res.json();
      setIsMaintenanceMode(data.isMaintenanceMode || false);
    } catch (err) {
      console.error('Failed to fetch maintenance status:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMaintenance = async () => {
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isMaintenanceMode: !isMaintenanceMode 
        }),
      });

      if (!res.ok) throw new Error('Failed to toggle maintenance mode');

      const data = await res.json();
      setIsMaintenanceMode(data.isMaintenanceMode);
    } catch (err) {
      console.error('Error toggling maintenance:', err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
        <CardTitle className="text-base font-semibold">Maintenance Mode</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge 
                variant={isMaintenanceMode ? "destructive" : "default"}
                className={isMaintenanceMode ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"}
              >
                {isMaintenanceMode ? 'Offline' : 'Live'}
              </Badge>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isMaintenanceMode ? 'Site is down' : 'Site is running'}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isMaintenanceMode 
              ? 'Your store is currently offline. Enable it to make it accessible to customers.' 
              : 'Toggle maintenance mode to perform updates or maintenance on your store.'}
          </p>
          <Button 
            onClick={toggleMaintenance} 
            disabled={updating}
            variant={isMaintenanceMode ? "default" : "outline"}
            className={`w-full ${isMaintenanceMode ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
          >
            {updating ? 'Updating...' : isMaintenanceMode ? 'Enable Site' : 'Enable Maintenance'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  const [simpleMode, setSimpleMode] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: [],
    salesData: []
  });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  // Live client-side performance metrics (FPS, JS heap, event-loop lag)
  const [clientPerf, setClientPerf] = useState({ fps: 60, jsHeapUsedMB: null as null | number, jsHeapTotalMB: null as null | number, eventLoopLagMs: 0 });
  useEffect(() => {
    let rafId: number;
    let last = performance.now();
    let frames = 0;
    let tickStart = performance.now();
    let lagSamples: number[] = [];
    const loop = () => {
      const now = performance.now();
      frames++;
      if (now - last >= 1000) {
        const fps = Math.round((frames * 1000) / (now - last));
        const memory: any = (performance as any).memory;
        const jsHeapUsedMB = memory ? Math.round(memory.usedJSHeapSize / (1024 * 1024)) : null;
        const jsHeapTotalMB = memory ? Math.round(memory.totalJSHeapSize / (1024 * 1024)) : null;
        const lag = lagSamples.length ? Math.max(...lagSamples) : 0;
        setClientPerf({ fps, jsHeapUsedMB, jsHeapTotalMB, eventLoopLagMs: Math.round(lag) });
        last = now;
        frames = 0;
        lagSamples = [];
      }
      const expected = tickStart + 50;
      const drift = Math.max(0, now - expected);
      lagSamples.push(drift);
      tickStart = now;
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Poll server stats
  const [serverStats, setServerStats] = useState<any | null>(null);
  const [lastServerTs, setLastServerTs] = useState<number>(0);
  const [serverOk, setServerOk] = useState<boolean>(true);
  useEffect(() => {
    let mounted = true;
    const poll = async () => {
      try {
        const r = await fetch('/api/admin/system-stats', { cache: 'no-store' });
        const data = await r.json();
        if (mounted) {
          setServerStats(data);
          if (data?.timestamp) setLastServerTs(data.timestamp);
          setServerOk(true);
        }
      } catch {
        if (mounted) setServerOk(false);
      }
    };
    poll();
    const id = setInterval(poll, 3000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  // Derive stale connection (no updates in > 7s)
  useEffect(() => {
    const id = setInterval(() => {
      if (!lastServerTs) return;
      const stale = Date.now() - lastServerTs > 7000;
      if (stale !== !serverOk) {
        setServerOk(!stale);
      }
    }, 1500);
    return () => clearInterval(id);
  }, [lastServerTs, serverOk]);

  const loadDashboardStats = async () => {
    try {
      // Fetch actual orders from API
      const ordersRes = await fetch('/api/admin/orders');
      let recentOrders = [];
      let totalOrders = 156;
      let totalRevenue = 12450.99;
      
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        if (ordersData.orders && Array.isArray(ordersData.orders)) {
          // Get the 3 most recent orders
          recentOrders = ordersData.orders
            .slice(0, 3)
            .map((order: any) => ({
              id: order.id || order.order_id,
              customer: `${order.first_name || ''} ${order.last_name || ''}`.trim() || order.email,
              amount: parseFloat(order.total_amount || order.amount || 0),
              status: order.status || 'pending',
              date: new Date(order.created_at || Date.now()).toISOString().split('T')[0]
            }));
          
          totalOrders = ordersData.orders.length;
          totalRevenue = ordersData.orders.reduce((sum: number, order: any) => 
            sum + parseFloat(order.total_amount || order.amount || 0), 0
          );
        }
      }
      
      // If no orders from API, use mock data
      if (recentOrders.length === 0) {
        recentOrders = [
          { id: 'ORD-001', customer: 'John Doe', amount: 299.99, status: 'completed', date: '2025-10-11' },
          { id: 'ORD-002', customer: 'Jane Smith', amount: 149.50, status: 'pending', date: '2025-10-11' },
          { id: 'ORD-003', customer: 'Bob Johnson', amount: 79.99, status: 'completed', date: '2025-10-10' },
        ];
      }

      setStats({
        totalOrders,
        totalRevenue,
        totalCustomers: 89,
        totalProducts: 234,
        recentOrders,
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
      // Fallback to mock data on error
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
        salesData: []
      });
    }
  };

  return (
    <AdminLayout title="Home" description="">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Mobile Simple View - Shows on mobile only */}
        <div className="md:hidden">
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Dashboard</h1>
            
            {/* Simple Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sales</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">£{stats.totalRevenue.toLocaleString()}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Orders</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalOrders}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Customers</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalCustomers}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Products</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalProducts}</div>
              </div>
            </div>

            {/* Quick Actions */}
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden md:block bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Home</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage your store from one place</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add product</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Desktop View Only */}
        <div className="hidden md:block px-6 py-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total sales</div>
                  <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                    <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">£{stats.totalRevenue.toLocaleString()}</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-green-600 dark:text-green-400">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Orders</div>
                  <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <ShoppingBag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-green-600 dark:text-green-400">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>8% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Customers</div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCustomers}</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-green-600 dark:text-green-400">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>5% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Products</div>
                  <div className="p-2 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <Package className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <span>In catalog</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                  <CardTitle className="text-base font-semibold">Get started</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Link href="/admin/products" className="group">
                      <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Add your first product</h3>
                          <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg group-hover:scale-110 transition-transform">
                            <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Start by adding a product and a few key details. Not ready? Start with a sample product</p>
                        <Button variant="link" className="p-0 h-auto mt-2 text-green-600 hover:text-green-700">
                          Add product →
                        </Button>
                      </div>
                    </Link>

                    <Link href="/admin/settings" className="group">
                      <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">Customize your store</h3>
                          <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg group-hover:scale-110 transition-transform">
                            <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Choose a theme and add your logo</p>
                        <Button variant="link" className="p-0 h-auto mt-2 text-blue-600 hover:text-blue-700">
                          Customize theme →
                        </Button>
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card>
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">Recent orders</CardTitle>
                    <Link href="/admin/orders">
                      <Button variant="link" className="text-sm text-green-600 hover:text-green-700">View all</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {stats.recentOrders.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {stats.recentOrders.map((order) => (
                        <div key={order.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <div className="font-medium text-gray-900 dark:text-white">{order.id}</div>
                                <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                                  {order.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{order.customer}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900 dark:text-white">£{order.amount.toFixed(2)}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{order.date}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <ShoppingBag className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400">No orders yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Maintenance Mode */}
              <MaintenanceToggleModern />

              {/* Quick Links */}
              <Card className="h-full">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                  <CardTitle className="text-base font-semibold">Quick links</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-1">
                    <Link href="/admin/products">
                      <Button variant="ghost" className="w-full justify-start text-sm hover:bg-gray-50 dark:hover:bg-gray-800" size="sm">
                        <LayoutGrid className="h-4 w-4 mr-2" />
                        Products
                      </Button>
                    </Link>
                    <Link href="/admin/products/categories">
                      <Button variant="ghost" className="w-full justify-start text-sm hover:bg-gray-50 dark:hover:bg-gray-800" size="sm">
                        <Tag className="h-4 w-4 mr-2" />
                        Categories
                      </Button>
                    </Link>
                    <Link href="/admin/orders">
                      <Button variant="ghost" className="w-full justify-start text-sm hover:bg-gray-50 dark:hover:bg-gray-800" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Orders
                      </Button>
                    </Link>
                    <Link href="/admin/customers">
                      <Button variant="ghost" className="w-full justify-start text-sm hover:bg-gray-50 dark:hover:bg-gray-800" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Customers
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Stats - Compact */}
              {!simpleMode && (
                <Card>
                  <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                    <CardTitle className="text-base font-semibold">Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Server uptime</span>
                      <span className="font-medium">{serverStats ? `${Math.floor(serverStats.process.uptimeSeconds/3600)}h ${(Math.floor(serverStats.process.uptimeSeconds/60)%60)}m` : '—'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Browser FPS</span>
                      <Badge variant={clientPerf.fps >= 55 ? 'default' : 'destructive'}>{clientPerf.fps}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Status</span>
                      <Badge variant={serverOk ? 'default' : 'destructive'} className={serverOk ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400' : ''}>
                        {serverOk ? 'Healthy' : 'Offline'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
