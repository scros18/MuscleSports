"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  RefreshCw, 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock,
  Database,
  AlertTriangle
} from 'lucide-react';

interface SyncLog {
  id: string;
  sync_type: string;
  status: string;
  products_processed: number;
  products_updated: number;
  products_created: number;
  products_skipped: number;
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
  errors?: any[];
}

interface SyncSettings {
  autoSync: boolean;
  syncInterval: number;
  categories: string[];
  brands: string[];
  minMargin: number;
  maxProducts: number;
  updatePrices: boolean;
  updateStock: boolean;
  updateDescriptions: boolean;
}

interface TropicanaProduct {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  wholesale_price: number;
  retail_price: number;
  margin: number;
  in_stock: boolean;
  stock_quantity?: number;
  last_synced: string;
}

export default function TropicanaAdminPage() {
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [products, setProducts] = useState<TropicanaProduct[]>([]);
  const [settings, setSettings] = useState<SyncSettings>({
    autoSync: true,
    syncInterval: 60,
    categories: [],
    brands: [],
    minMargin: 30,
    maxProducts: 5000,
    updatePrices: true,
    updateStock: true,
    updateDescriptions: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [productsCount, setProductsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(50);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load sync status and logs
      const statusResponse = await fetch('/api/admin/tropicana?action=status');
      if (!statusResponse.ok) throw new Error('Failed to load sync status');
      const statusData = await statusResponse.json();
      
      setSyncLogs(statusData.data.syncStatus || []);
      setProductsCount(statusData.data.productsCount || 0);

      // Load settings
      const settingsResponse = await fetch('/api/admin/tropicana?action=settings');
      if (!settingsResponse.ok) throw new Error('Failed to load settings');
      const settingsData = await settingsResponse.json();
      
      setSettings(settingsData.data.settings);

      // Load products
      await loadProducts(1);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (page: number) => {
    try {
      const response = await fetch(`/api/admin/tropicana?action=products&page=${page}&limit=${productsPerPage}`);
      if (!response.ok) throw new Error('Failed to load products');
      const data = await response.json();
      
      setProducts(data.data.products || []);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    }
  };

  const handleSync = async (syncType: 'full' | 'incremental' | 'stock') => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/admin/tropicana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync', syncType })
      });

      if (!response.ok) throw new Error('Sync failed');
      const data = await response.json();

      setSuccess(data.message);
      await loadData(); // Reload data after sync

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/admin/tropicana', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateSettings', settings })
      });

      if (!response.ok) throw new Error('Failed to update settings');
      const data = await response.json();

      setSuccess(data.message);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      failed: 'destructive',
      running: 'secondary'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tropicana Wholesale Integration</h1>
          <p className="text-muted-foreground">
            Manage product synchronization with Tropicana Wholesale
          </p>
        </div>
        <Button 
          onClick={loadData} 
          disabled={loading}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsCount}</div>
            <p className="text-xs text-muted-foreground">
              Synced from Tropicana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {syncLogs[0] ? new Date(syncLogs[0].started_at).toLocaleDateString() : 'Never'}
            </div>
            <p className="text-xs text-muted-foreground">
              {syncLogs[0]?.sync_type || 'No syncs'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto Sync</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {settings.autoSync ? 'ON' : 'OFF'}
            </div>
            <p className="text-xs text-muted-foreground">
              Every {settings.syncInterval} minutes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Min Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{settings.minMargin}%</div>
            <p className="text-xs text-muted-foreground">
              Minimum profit margin
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="sync" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sync">Sync Management</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Sync Management Tab */}
        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Sync Operations</CardTitle>
              <CardDescription>
                Trigger manual synchronization with Tropicana Wholesale
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={() => handleSync('full')} 
                  disabled={loading}
                  className="h-20 flex flex-col"
                  variant="default"
                >
                  <Package className="h-6 w-6 mb-2" />
                  Full Sync
                  <span className="text-xs opacity-70">All products</span>
                </Button>

                <Button 
                  onClick={() => handleSync('incremental')} 
                  disabled={loading}
                  className="h-20 flex flex-col"
                  variant="secondary"
                >
                  <RefreshCw className="h-6 w-6 mb-2" />
                  Incremental Sync
                  <span className="text-xs opacity-70">Updates only</span>
                </Button>

                <Button 
                  onClick={() => handleSync('stock')} 
                  disabled={loading}
                  className="h-20 flex flex-col"
                  variant="outline"
                >
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Stock Check
                  <span className="text-xs opacity-70">Stock levels only</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sync Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Sync History</CardTitle>
              <CardDescription>
                Recent synchronization operations and their results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncLogs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No sync operations yet
                  </p>
                ) : (
                  syncLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(log.status)}
                        <div>
                          <div className="font-medium capitalize">
                            {log.sync_type} Sync
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(log.started_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm">
                            {log.products_processed} processed
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {log.products_created} created, {log.products_updated} updated
                          </div>
                        </div>
                        {getStatusBadge(log.status)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Imported Products</CardTitle>
              <CardDescription>
                Products synced from Tropicana Wholesale ({productsCount} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No products found. Run a sync to import products.
                  </p>
                ) : (
                  <>
                    <div className="grid gap-4">
                      {products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.brand} • {product.category} • SKU: {product.sku}
                            </div>
                            <div className="text-sm">
                              Wholesale: £{product.wholesale_price.toFixed(2)} • 
                              Retail: £{product.retail_price.toFixed(2)} • 
                              Margin: {product.margin.toFixed(1)}%
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={product.in_stock ? 'default' : 'destructive'}>
                              {product.in_stock ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                            {product.stock_quantity && (
                              <span className="text-sm text-muted-foreground">
                                Qty: {product.stock_quantity}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between">
                      <Button 
                        variant="outline" 
                        onClick={() => loadProducts(currentPage - 1)}
                        disabled={currentPage <= 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Page {currentPage} • {products.length} of {productsCount} products
                      </span>
                      <Button 
                        variant="outline" 
                        onClick={() => loadProducts(currentPage + 1)}
                        disabled={products.length < productsPerPage}
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync Settings</CardTitle>
              <CardDescription>
                Configure automatic synchronization behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoSync">Auto Sync Enabled</Label>
                    <Switch
                      id="autoSync"
                      checked={settings.autoSync}
                      onCheckedChange={(checked) => 
                        setSettings({...settings, autoSync: checked})
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="syncInterval">Sync Interval (minutes)</Label>
                    <Input
                      id="syncInterval"
                      type="number"
                      value={settings.syncInterval}
                      onChange={(e) => 
                        setSettings({...settings, syncInterval: parseInt(e.target.value) || 60})
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minMargin">Minimum Margin (%)</Label>
                    <Input
                      id="minMargin"
                      type="number"
                      value={settings.minMargin}
                      onChange={(e) => 
                        setSettings({...settings, minMargin: parseFloat(e.target.value) || 30})
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxProducts">Maximum Products</Label>
                    <Input
                      id="maxProducts"
                      type="number"
                      value={settings.maxProducts}
                      onChange={(e) => 
                        setSettings({...settings, maxProducts: parseInt(e.target.value) || 5000})
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="updatePrices">Update Prices</Label>
                    <Switch
                      id="updatePrices"
                      checked={settings.updatePrices}
                      onCheckedChange={(checked) => 
                        setSettings({...settings, updatePrices: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="updateStock">Update Stock</Label>
                    <Switch
                      id="updateStock"
                      checked={settings.updateStock}
                      onCheckedChange={(checked) => 
                        setSettings({...settings, updateStock: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="updateDescriptions">Update Descriptions</Label>
                    <Switch
                      id="updateDescriptions"
                      checked={settings.updateDescriptions}
                      onCheckedChange={(checked) => 
                        setSettings({...settings, updateDescriptions: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleUpdateSettings} disabled={loading}>
                <Settings className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
