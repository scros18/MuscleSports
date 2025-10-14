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
    <AdminLayout title={simpleMode ? "Admin (Simple)" : "Dashboard"} description={simpleMode ? 'Easy mode for quick tasks' : 'Welcome back!'}>
      <div className="p-4 sm:p-6">
        {/* Mode Toggle */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Switch between Simple and Advanced views.</div>
          <Button variant="outline" size="sm" onClick={() => setSimpleMode(!simpleMode)}>
            {simpleMode ? 'Switch to Advanced' : 'Switch to Simple'}
          </Button>
        </div>

        {/* Simple Admin - large clear actions */}
        {simpleMode ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Link href="/admin/products/new">
              <Card className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Add Product</div>
                    <div className="text-sm text-muted-foreground">Create a new product listing</div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/products">
              <Card className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Manage Products</div>
                    <div className="text-sm text-muted-foreground">Edit prices, stock and details</div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/products/categories">
              <Card className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <ChevronRight className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Categories</div>
                    <div className="text-sm text-muted-foreground">Organise your catalog</div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/orders">
              <Card className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Orders</div>
                    <div className="text-sm text-muted-foreground">See and manage recent orders</div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/users">
              <Card className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Customers</div>
                    <div className="text-sm text-muted-foreground">View customer list</div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/settings">
              <Card className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-500/10 text-slate-600 flex items-center justify-center">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Settings</div>
                    <div className="text-sm text-muted-foreground">Business details & theme</div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Maintenance Mode Toggle */}
            <MaintenanceToggle />
          </div>
        ) : (
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

  useEffect(() => {
    // Fetch current maintenance status
    fetch('/api/admin/maintenance')
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
          alert('✅ Maintenance mode enabled! All users will see the maintenance page.\n\nThe site is now in maintenance mode.');
        } else {
          alert('✅ Maintenance mode disabled! Site is now live.\n\nCustomers can now access the site normally.');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to update maintenance mode: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
      alert('Error updating maintenance mode. Please try again.');
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
        alert('✅ Maintenance message updated successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to update message: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Error updating message. Please try again.');
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
    </Card>
  );
}