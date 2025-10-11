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
    <AdminLayout title="Dashboard" description={`Welcome back!`}>
      <div className="p-4 sm:p-6">
        {/* Dashboard Content */}
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.totalOrders}</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+12%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-500 rounded-lg">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-xl sm:text-2xl font-bold">£{stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+8%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Customers</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.totalCustomers}</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+15%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.totalProducts}</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
                <span className="text-green-500 font-medium">+5%</span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Chart - Hidden on small mobile, visible on sm+ */}
        <div className="mb-6 sm:mb-8 hidden sm:block">
          <SimpleChart
            title="Monthly Revenue"
            data={stats.salesData}
            height={300}
          />
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
      </div>
    </AdminLayout>
  );
}