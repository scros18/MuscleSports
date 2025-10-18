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
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Maintenance Mode</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge 
                variant={isMaintenanceMode ? "destructive" : "default"}
                className={isMaintenanceMode ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"}
              >
                {isMaintenanceMode ? 'Offline' : 'Live'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {isMaintenanceMode ? 'Site is down' : 'Site is running'}
              </span>
            </div>
          </div>
          <Button 
            onClick={toggleMaintenance} 
            disabled={updating}
            variant={isMaintenanceMode ? "default" : "outline"}
            className={`w-full ${isMaintenanceMode ? 'bg-green-600 hover:bg-green-700' : ''}`}
            size="sm"
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

  return (
    <AdminLayout title="Home" description="">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
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

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                    <Link href="/admin/products/new" className="group">
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
              <Card>
                <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                  <CardTitle className="text-base font-semibold">Quick links</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-1">
                    <Link href="/admin/products">
                      <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                        <LayoutGrid className="h-4 w-4 mr-2" />
                        Products
                      </Button>
                    </Link>
                    <Link href="/admin/products/categories">
                      <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                        <Tag className="h-4 w-4 mr-2" />
                        Categories
                      </Button>
                    </Link>
                    <Link href="/admin/orders">
                      <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Orders
                      </Button>
                    </Link>
                    <Link href="/admin/users">
                      <Button variant="ghost" className="w-full justify-start text-sm" size="sm">
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

        {/* Hidden Advanced View */}
        {!simpleMode && (
        <>
        {/* Dashboard Content (Advanced) - redesigned performance view */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Server Stats */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Server Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ring-1 ${serverOk ? 'ring-emerald-400/50 bg-emerald-500/10' : 'ring-red-400/50 bg-red-500/10'}`} style={{ boxShadow: serverOk ? '0 0 18px rgba(16,185,129,0.35)' : '0 0 18px rgba(239,68,68,0.35)' }}>
                    <Timer className={`h-4 w-4 ${serverOk ? 'text-emerald-500' : 'text-red-500'}`} />
                  </div>
                  <div><p className="text-xs text-muted-foreground">Uptime</p><p className="font-semibold text-sm">{serverStats ? `${Math.floor(serverStats.process.uptimeSeconds/3600)}h ${(Math.floor(serverStats.process.uptimeSeconds/60)%60)}m` : '—'}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ring-1 ${serverOk ? 'ring-emerald-400/50 bg-emerald-500/10' : 'ring-red-400/50 bg-red-500/10'}`} style={{ boxShadow: serverOk ? '0 0 18px rgba(16,185,129,0.35)' : '0 0 18px rgba(239,68,68,0.35)' }}>
                    <Cpu className={`h-4 w-4 ${serverOk ? 'text-emerald-500' : 'text-red-500'}`} />
                  </div>
                  <div><p className="text-xs text-muted-foreground">RSS</p><p className="font-semibold text-sm">{serverStats ? `${(serverStats.process.memory.rss/1024/1024).toFixed(0)} MB` : '—'}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ring-1 ${serverOk ? 'ring-emerald-400/50 bg-emerald-500/10' : 'ring-red-400/50 bg-red-500/10'}`} style={{ boxShadow: serverOk ? '0 0 18px rgba(16,185,129,0.35)' : '0 0 18px rgba(239,68,68,0.35)' }}>
                    <Gauge className={`h-4 w-4 ${serverOk ? 'text-emerald-500' : 'text-red-500'}`} />
                  </div>
                  <div><p className="text-xs text-muted-foreground">Heap Used</p><p className="font-semibold text-sm">{serverStats ? `${(serverStats.process.memory.heapUsed/1024/1024).toFixed(0)} MB` : '—'}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ring-1 ${serverOk ? 'ring-emerald-400/50 bg-emerald-500/10' : 'ring-red-400/50 bg-red-500/10'}`} style={{ boxShadow: serverOk ? '0 0 18px rgba(16,185,129,0.35)' : '0 0 18px rgba(239,68,68,0.35)' }}>
                    <Gauge className={`h-4 w-4 ${serverOk ? 'text-emerald-500' : 'text-red-500'}`} />
                  </div>
                  <div><p className="text-xs text-muted-foreground">Heap Total</p><p className="font-semibold text-sm">{serverStats ? `${(serverStats.process.memory.heapTotal/1024/1024).toFixed(0)} MB` : '—'}</p></div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">PID: {serverStats?.process?.pid} • Node: {serverStats?.process?.version}</div>
            </CardContent>
          </Card>

          {/* Client Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Browser Performance</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-muted-foreground"/><div><p className="text-xs text-muted-foreground">FPS</p><p className="font-semibold text-sm">{clientPerf.fps}</p></div></div>
              <div className="flex items-center gap-2"><Timer className="h-4 w-4 text-muted-foreground"/><div><p className="text-xs text-muted-foreground">Event Loop Lag</p><p className="font-semibold text-sm">{clientPerf.eventLoopLagMs} ms</p></div></div>
              <div className="flex items-center gap-2"><Gauge className="h-4 w-4 text-muted-foreground"/><div><p className="text-xs text-muted-foreground">JS Heap Used</p><p className="font-semibold text-sm">{clientPerf.jsHeapUsedMB ?? '—'} {clientPerf.jsHeapUsedMB ? 'MB' : ''}</p></div></div>
              <div className="flex items-center gap-2"><Gauge className="h-4 w-4 text-muted-foreground"/><div><p className="text-xs text-muted-foreground">JS Heap Total</p><p className="font-semibold text-sm">{clientPerf.jsHeapTotalMB ?? '—'} {clientPerf.jsHeapTotalMB ? 'MB' : ''}</p></div></div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart - Hidden on small mobile, visible on sm+ */}
        <div className="mb-6 sm:mb-8 hidden sm:block">
          <SimpleChart title="Monthly Revenue" data={stats.salesData} height={300} />
        </div>

        {/* Recent Orders and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium truncate">{order.id}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{order.customer}</p>
                    </div>
                    <div className="text-right ml-2">
                      <p className="text-xs sm:text-sm font-medium">£{order.amount}</p>
                      <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                <Link
                  href="/admin/orders"
                  className="text-xs sm:text-sm text-primary hover:underline flex items-center"
                >
                  View all orders
                  <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 sm:space-y-3">
                <Button asChild className="w-full justify-start text-sm">
                  <Link href="/admin/products/new">
                    <Package className="mr-2 h-4 w-4" />
                    Add New Product
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start text-sm">
                  <Link href="/admin/products">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Manage Products
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start text-sm">
                  <Link href="/admin/customers">
                    <Users className="mr-2 h-4 w-4" />
                    View Customers
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        </>
        )}
      </div>
    </AdminLayout>
  );
}

// Maintenance Toggle Component
function MaintenanceToggle() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    // Fetch current maintenance status
    const authToken = localStorage.getItem('auth_token');
    fetch('/api/admin/maintenance', {
      credentials: 'include',
      headers: {
        ...(authToken && { 'Authorization': `Bearer ${authToken}` })
      }
    })
      .then(res => res.json())
      .then(data => {
        setIsMaintenanceMode(data.isMaintenanceMode || false);
        setMaintenanceMessage(data.maintenanceMessage || '');
        setEstimatedTime(data.estimatedTime || '');
      })
      .catch(err => console.error('Error fetching maintenance status:', err));
  }, []);

  const toggleMaintenance = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          isMaintenanceMode: !isMaintenanceMode,
          maintenanceMessage: maintenanceMessage || 'We are currently performing scheduled maintenance. Please check back soon!',
          estimatedTime: estimatedTime || null
        })
      });

      if (response.ok) {
        const newMode = !isMaintenanceMode;
        setIsMaintenanceMode(newMode);
        if (newMode) {
          setModalConfig({
            title: 'Maintenance Mode Enabled',
            message: 'All users will see the maintenance page. The site is now in maintenance mode.',
            type: 'success'
          });
        } else {
          setModalConfig({
            title: 'Site is Now Live',
            message: 'Maintenance mode disabled! Customers can now access the site normally.',
            type: 'success'
          });
        }
        setShowModal(true);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setModalConfig({
          title: 'Update Failed',
          message: errorData.error || 'Unknown error occurred',
          type: 'error'
        });
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
      setModalConfig({
        title: 'Error',
        message: 'Error updating maintenance mode. Please try again.',
        type: 'error'
      });
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  const updateMessage = async () => {
    setUpdating(true);
    try {
      const authToken = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        credentials: 'include',
        body: JSON.stringify({
          isMaintenanceMode,
          maintenanceMessage: maintenanceMessage || 'We are currently performing scheduled maintenance. Please check back soon!',
          estimatedTime: estimatedTime || null
        })
      });

      if (response.ok) {
        setModalConfig({
          title: 'Message Updated',
          message: 'Maintenance message updated successfully!',
          type: 'success'
        });
        setShowModal(true);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setModalConfig({
          title: 'Update Failed',
          message: errorData.error || 'Unknown error occurred',
          type: 'error'
        });
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error updating message:', error);
      setModalConfig({
        title: 'Error',
        message: 'Error updating message. Please try again.',
        type: 'error'
      });
      setShowModal(true);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card className={`group hover:shadow-lg transition-shadow ${isMaintenanceMode ? 'border-orange-200 bg-orange-50/50' : 'border-gray-200'}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${isMaintenanceMode ? 'bg-orange-500/10 text-orange-600' : 'bg-gray-500/10 text-gray-600'}`}>
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <div className="font-semibold text-lg">Maintenance Mode</div>
              <div className="text-sm text-muted-foreground">
                {isMaintenanceMode ? 'Site is under maintenance' : 'Site is live'}
              </div>
            </div>
          </div>
          <Button
            onClick={toggleMaintenance}
            disabled={loading}
            variant={isMaintenanceMode ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {isMaintenanceMode ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            {loading ? 'Updating...' : (isMaintenanceMode ? 'Disable' : 'Enable')}
          </Button>
        </div>
        
        {isMaintenanceMode && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Maintenance Message</label>
              <textarea
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                rows={2}
                placeholder="Enter maintenance message..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Estimated Time</label>
              <input
                type="text"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                placeholder="e.g., 2 hours, Tomorrow 9 AM"
              />
            </div>
            <Button 
              onClick={updateMessage} 
              disabled={updating}
              variant="outline"
              className="w-full"
            >
              {updating ? 'Updating...' : 'Update Message & Time'}
            </Button>
          </div>
        )}
      </CardContent>

      {/* Modern Modal */}
      {showModal && modalConfig && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <div 
            className="relative bg-background rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              modalConfig.type === 'success' 
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {modalConfig.type === 'success' ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-center text-foreground mb-2">
              {modalConfig.title}
            </h3>

            {/* Message */}
            <p className="text-center text-muted-foreground mb-6">
              {modalConfig.message}
            </p>

            {/* Close Button */}
            <Button 
              onClick={() => setShowModal(false)}
              className={`w-full ${
                modalConfig.type === 'success' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}