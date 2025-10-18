'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Download, Search, RefreshCcw, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { AdminLayout } from '@/components/admin-layout';

interface OrderItem { id: string; name?: string; price?: number; quantity?: number }
interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string>('');

  const load = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const r = await fetch('/api/admin/users/orders', { // fallback route if exists
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (r.ok) {
        const data = await r.json();
        setOrders(data.orders || []);
      } else {
        // try user orders route as fallback
        const r2 = await fetch('/api/orders', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        const d2 = await r2.json();
        setOrders(d2.orders || []);
      }
    } catch (e) {
      console.error('Failed to load orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const visible = orders
    .filter(o => (status ? o.status === status : true))
    .filter(o => (query ? o.id.toLowerCase().includes(query.toLowerCase()) : true));

  return (
    <AdminLayout title="Orders" description="View and manage orders">
      <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Orders</h2>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col gap-3 mb-6 overflow-visible">
            <div className="flex-1 relative">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by Order ID"
                className="pr-10 bg-slate-900 border-slate-800 text-white placeholder-slate-400 placeholder:font-medium focus:placeholder-transparent w-full"
              />
              <Search className={`h-5 w-5 absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                query ? 'text-cyan-400' : 'text-slate-500'
              }`} />
            </div>
            <div className="flex gap-3 flex-col sm:flex-row overflow-visible">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 px-3 bg-slate-900 border border-slate-800 text-white rounded-xl text-sm font-medium appearance-none cursor-pointer hover:bg-slate-800 transition-colors sm:w-40"
                style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Button
                onClick={load}
                size="sm"
                className="bg-slate-800 hover:bg-slate-700 text-white h-10 px-4 whitespace-nowrap"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white h-10 px-4 whitespace-nowrap"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading orders…</div>
        ) : visible.length === 0 ? (
          <div className="py-12 text-center text-slate-400">No orders found</div>
        ) : (
          <div className="space-y-4">
            {visible.map((o) => (
              <div key={o.id} className="bg-slate-900 rounded-lg border border-slate-800 p-4 hover:border-slate-700 transition-colors">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold text-white">#{o.id}</span>
                    <Badge className="bg-slate-800 text-slate-300 text-xs">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {o.status === 'delivered' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : o.status === 'shipped' ? (
                      <Truck className="h-4 w-4 text-blue-500" />
                    ) : o.status === 'pending' ? (
                      <Clock className="h-4 w-4 text-amber-500" />
                    ) : o.status === 'cancelled' ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-slate-500" />
                    )}
                    <Badge
                      className={`text-xs capitalize ${
                        o.status === 'delivered'
                          ? 'bg-green-500/20 text-green-400'
                          : o.status === 'shipped'
                          ? 'bg-blue-500/20 text-blue-400'
                          : o.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-400'
                          : o.status === 'cancelled'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {o.status}
                    </Badge>
                    <span className="font-semibold text-white text-lg">£{o.total?.toFixed?.(2) ?? o.total}</span>
                  </div>
                </div>

                <Separator className="bg-slate-800 mb-4" />

                {/* Order Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-slate-400 mb-2 font-medium">Items</p>
                    <ul className="space-y-1">
                      {o.items?.map?.((it, idx) => (
                        <li key={String(idx)} className="text-slate-300 text-xs">
                          {it.name ?? it.id} × {it.quantity ?? 1}
                          {it.price ? ` — £${it.price.toFixed(2)}` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-2 font-medium">Quick Actions</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs h-8 px-2"
                      >
                        Processing
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs h-8 px-2"
                      >
                        Shipped
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-700 text-slate-300 hover:bg-slate-800 text-xs h-8 px-2"
                      >
                        Delivered
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
