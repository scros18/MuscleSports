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
      <div className="p-4 sm:p-6">
        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base sm:text-lg">Orders</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by Order ID" className="pl-9" />
                <Search className="h-4 w-4 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 border rounded-md px-2 text-sm">
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <Button variant="outline" size="sm" onClick={load} className="shrink-0"><RefreshCcw className="h-4 w-4 mr-1"/>Refresh</Button>
              <Button size="sm" className="shrink-0"><Download className="h-4 w-4 mr-1"/>Export CSV</Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">Loading orders…</div>
            ) : visible.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">No orders found</div>
            ) : (
              <div className="space-y-4">
                {visible.map((o) => (
                  <div key={o.id} className="rounded-xl border p-4 sm:p-5 bg-card">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm">#{o.id}</span>
                        <Badge variant="secondary" className="text-xs">{new Date(o.createdAt).toLocaleString()}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {o.status === 'delivered' ? <CheckCircle2 className="h-4 w-4 text-green-600"/> : o.status === 'shipped' ? <Truck className="h-4 w-4 text-blue-600"/> : o.status === 'pending' ? <Clock className="h-4 w-4 text-amber-600"/> : o.status === 'cancelled' ? <XCircle className="h-4 w-4 text-red-600"/> : <Clock className="h-4 w-4"/>}
                        <Badge variant={o.status === 'cancelled' ? 'destructive' : 'default'} className="text-xs capitalize">{o.status}</Badge>
                        <div className="font-semibold">£{o.total?.toFixed?.(2) ?? o.total}</div>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Items</p>
                        <ul className="list-disc list-inside space-y-1">
                          {o.items?.map?.((it, idx) => (
                            <li key={String(idx)} className="truncate">{it.name ?? it.id} × {it.quantity ?? 1} {it.price ? `— £${it.price.toFixed(2)}` : ''}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Actions</p>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">Mark Processing</Button>
                          <Button variant="outline" size="sm">Mark Shipped</Button>
                          <Button variant="outline" size="sm">Mark Delivered</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}


