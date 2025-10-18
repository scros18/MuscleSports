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
import { MaintenanceModeModal } from '@/components/maintenance-mode-modal';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: any[];
  salesData: any[];
}

export default function AdminPage() {
  const [simpleMode, setSimpleMode] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
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
    checkMaintenanceMode();
  }, []);

  const checkMaintenanceMode = async () => {
    try {
      const res = await fetch('/api/maintenance-status');
      if (res.ok) {
        const data = await res.json();
        setMaintenanceMode(data.isMaintenanceMode || false);
      }
    } catch (error) {
      console.error('Failed to check maintenance mode:', error);
    }
  };

  const toggleMaintenanceMode = async () => {
    setMaintenanceLoading(true);
    
    try {
      const res = await fetch('/api/maintenance-mode', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`
        },
        body: JSON.stringify({ enabled: !maintenanceMode })
      });
      
      if (res.ok) {
        const data = await res.json();
        const newMaintenanceState = !maintenanceMode;
        setMaintenanceMode(newMaintenanceState);
        setMaintenanceModalOpen(false);
        
        // Trigger haptic feedback ONLY when maintenance is enabled (true)
        if (newMaintenanceState) {
          // iOS Haptic Feedback - works on iPhone
          if ('ontouchstart' in window) {
            // Create invisible button and trigger click for iOS haptic feedback
            const btn = document.createElement('button');
            btn.style.position = 'fixed';
            btn.style.left = '-9999px';
            btn.style.pointerEvents = 'none';
            document.body.appendChild(btn);
            
            // Trigger multiple clicks for double-vibration effect
            setTimeout(() => {
              btn.click();
              setTimeout(() => {
                btn.click();
                document.body.removeChild(btn);
              }, 100);
            }, 0);
          }
          
          // Standard vibration API for Android
          if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
          }
        }
        
        // Refresh the page to show the maintenance banner if enabled
        if (newMaintenanceState) {
          window.location.reload();
        }
      } else {
        const error = await res.json();
        console.error('Failed to toggle maintenance mode:', error);
        alert('Failed to toggle maintenance mode. Please try again.');
      }
    } catch (error) {
      console.error('Failed to toggle maintenance mode:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setMaintenanceLoading(false);
    }
  };

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
      // Fetch actual products from API
      const productsRes = await fetch('/api/products');
      
      let recentOrders = [];
      let totalOrders = 0;
      let totalRevenue = 0;
      let totalProducts = 0;
      
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
      
      // Get real product count
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        if (productsData.products && Array.isArray(productsData.products)) {
          totalProducts = productsData.products.length;
        }
      }

      setStats({
        totalOrders,
        totalRevenue,
        totalCustomers: 0, // Set to 0 as requested
        totalProducts,
        recentOrders,
        salesData: [
          { name: 'Jan', value: 0, color: 'hsl(var(--primary))' },
          { name: 'Feb', value: 0, color: 'hsl(var(--primary))' },
          { name: 'Mar', value: 0, color: 'hsl(var(--primary))' },
          { name: 'Apr', value: 0, color: 'hsl(var(--primary))' },
          { name: 'May', value: 0, color: 'hsl(var(--primary))' },
          { name: 'Jun', value: 0, color: 'hsl(var(--primary))' },
          { name: 'Jul', value: 0, color: 'hsl(var(--primary))' },
        ]
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      // Fallback to 0 values on error
      setStats({
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        totalProducts: 0,
        recentOrders: [],
        salesData: []
      });
    }
  };

  return (
    <AdminLayout
      title="Home"
      description=""
      isMaintenanceMode={maintenanceMode}
      onMaintenanceModeClick={() => setMaintenanceModalOpen(true)}
    >
      <MaintenanceModeModal
        isOpen={maintenanceModalOpen}
        isMaintenanceMode={maintenanceMode}
        isLoading={maintenanceLoading}
        onClose={() => setMaintenanceModalOpen(false)}
        onToggle={toggleMaintenanceMode}
      />
      <div className="min-h-screen bg-slate-950">
        {/* Mobile Simple View - Shows on mobile only */}
        <div className="md:hidden">
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-4">
            <h1 className="text-xl font-semibold text-white mb-4">Dashboard</h1>
            
            {/* Simple Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-800 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Sales</div>
                <div className="text-lg font-bold text-white">£{stats.totalRevenue.toLocaleString()}</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Orders</div>
                <div className="text-lg font-bold text-white">{stats.totalOrders}</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Customers</div>
                <div className="text-lg font-bold text-white">{stats.totalCustomers}</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-3">
                <div className="text-xs text-slate-400 mb-1">Products</div>
                <div className="text-lg font-bold text-white">{stats.totalProducts}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden md:block bg-slate-900 border-b border-slate-800">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-white">Home</h1>
                <p className="text-sm text-slate-400 mt-0.5">Welcome back to your dashboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Desktop View Only */}
        <div className="hidden md:block px-6 py-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-slate-400">Total sales</div>
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <DollarSign className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">£{stats.totalRevenue.toLocaleString()}</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-green-500">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-slate-400">Orders</div>
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <ShoppingBag className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-green-500">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>8% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-slate-400">Customers</div>
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Users className="h-4 w-4 text-purple-500" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">{stats.totalCustomers}</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-green-500">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>5% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-slate-400">Products</div>
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Package className="h-4 w-4 text-orange-500" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                  <span>In catalog</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Placeholder for future content */}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Performance Stats - Compact */}
              {!simpleMode && (
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader className="border-b border-slate-800 pb-4">
                    <CardTitle className="text-base font-semibold text-white">Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Server uptime</span>
                      <span className="font-medium text-white">{serverStats ? `${Math.floor(serverStats.process.uptimeSeconds/3600)}h ${(Math.floor(serverStats.process.uptimeSeconds/60)%60)}m` : '—'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Browser FPS</span>
                      <Badge variant={clientPerf.fps >= 55 ? 'default' : 'destructive'} className={clientPerf.fps >= 55 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>{clientPerf.fps}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Status</span>
                      <Badge variant={serverOk ? 'default' : 'destructive'} className={serverOk ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
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
