'use client';

import { useState } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Upload, RotateCcw, AlertCircle, CheckCircle2, Clock, Package } from 'lucide-react';

interface ScrapedProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  imageUrl?: string;
}

export default function InventorySyncPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [scrapedProducts, setScrapedProducts] = useState<ScrapedProduct[]>([]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'scanning' | 'ready' | 'importing' | 'complete'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [importedCount, setImportedCount] = useState(0);

  const handleScanTropicana = async () => {
    setIsScanning(true);
    setSyncStatus('scanning');
    
    // Simulated scan - in production this will call the actual scraper
    setTimeout(() => {
      // Mock data
      setScrapedProducts([
        { id: '1', name: 'Tropical Protein Powder', sku: 'TROP-PP-001', price: 29.99, category: 'Supplements' },
        { id: '2', name: 'Amino Acid Complex', sku: 'TROP-AA-002', price: 34.99, category: 'Supplements' },
        { id: '3', name: 'Creatine Monohydrate', sku: 'TROP-CREAT-001', price: 24.99, category: 'Supplements' },
        { id: '4', name: 'Vitamin Stack', sku: 'TROP-VIT-001', price: 44.99, category: 'Vitamins' },
        { id: '5', name: 'BCAA Energy Drink', sku: 'TROP-BCAA-001', price: 19.99, category: 'Drinks' },
      ]);
      setIsScanning(false);
      setSyncStatus('ready');
      setLastSyncTime(new Date());
    }, 2000);
  };

  const handleImportProducts = async () => {
    setIsImporting(true);
    setSyncStatus('importing');
    
    // Simulated import - in production this will actually import to database
    setTimeout(() => {
      setImportedCount(scrapedProducts.length);
      setIsImporting(false);
      setSyncStatus('complete');
    }, 1500);
  };

  const handleReset = () => {
    setScrapedProducts([]);
    setSyncStatus('idle');
    setImportedCount(0);
  };

  return (
    <AdminLayout title="Inventory Sync" description="Sync products from Tropicana Wholesale">
      <div className="p-3 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 md:p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg">
                <Database className="h-6 md:h-8 w-6 md:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Inventory Sync
                </h1>
                <p className="text-xs md:text-sm text-slate-400">
                  Sync products from Tropicana Wholesale catalog
                </p>
              </div>
            </div>
          </div>
          {lastSyncTime && (
            <div className="text-xs md:text-sm text-slate-400">
              <span className="block">Last synced:</span>
              <span className="font-semibold text-white">
                {lastSyncTime.toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
          <Card className="p-4 md:p-5 bg-slate-900 border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/20 rounded-lg">
                <Package className="h-5 md:h-6 w-5 md:w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-slate-400">Found Products</p>
                <p className="text-lg md:text-2xl font-bold text-white">{scrapedProducts.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-5 bg-slate-900 border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-500/20 rounded-lg">
                <CheckCircle2 className="h-5 md:h-6 w-5 md:w-6 text-green-400" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-slate-400">Imported</p>
                <p className="text-lg md:text-2xl font-bold text-white">{importedCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-5 bg-slate-900 border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/20 rounded-lg">
                <Clock className="h-5 md:h-6 w-5 md:w-6 text-amber-400" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-slate-400">Status</p>
                <p className="text-sm md:text-base font-bold text-white capitalize">{syncStatus}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 md:gap-3 mb-6">
          <Button
            onClick={handleScanTropicana}
            disabled={isScanning || isImporting || syncStatus === 'importing'}
            className="flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all text-sm md:text-base flex items-center justify-center gap-2"
          >
            <Database className="h-4 md:h-5 w-4 md:w-5" />
            <span>{isScanning ? 'Scanning...' : 'Scan Tropicana'}</span>
          </Button>

          {scrapedProducts.length > 0 && (
            <>
              <Button
                onClick={handleImportProducts}
                disabled={isImporting || syncStatus === 'importing'}
                className="flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all text-sm md:text-base flex items-center justify-center gap-2"
              >
                <Upload className="h-4 md:h-5 w-4 md:w-5" />
                <span>{isImporting ? 'Importing...' : 'Import All'}</span>
              </Button>

              <Button
                onClick={handleReset}
                disabled={isImporting || isScanning}
                className="flex-1 sm:flex-none px-4 md:px-6 py-2.5 md:py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-semibold rounded-full transition-all text-sm md:text-base flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-4 md:h-5 w-4 md:w-5" />
                <span>Reset</span>
              </Button>
            </>
          )}
        </div>

        {/* Main Content */}
        {scrapedProducts.length === 0 ? (
          <Card className="p-8 md:p-12 text-center bg-slate-900 border-slate-800">
            <div className="mb-4">
              <Database className="mx-auto h-12 md:h-16 w-12 md:w-16 text-slate-600" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
              No Products Scanned Yet
            </h3>
            <p className="text-xs md:text-sm text-slate-400 mb-6">
              Click "Scan Tropicana" to discover and preview all available products from the Tropicana Wholesale catalog.
            </p>
            <div className="inline-flex items-center gap-2 text-xs md:text-sm text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 md:px-4 py-2 md:py-2.5">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>The scan will fetch the latest inventory</span>
            </div>
          </Card>
        ) : (
          <>
            {/* Summary */}
            {syncStatus === 'complete' && (
              <Card className="p-4 md:p-5 mb-6 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 md:h-6 w-5 md:w-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm md:text-base font-semibold text-green-400">
                      Successfully imported {importedCount} product{importedCount !== 1 ? 's' : ''}!
                    </p>
                    <p className="text-xs md:text-sm text-green-300/70 mt-1">
                      Your inventory has been updated. New products are now available in your catalog.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Products Table */}
            <Card className="bg-slate-900 border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-800/50">
                      <th className="px-3 md:px-4 py-3 text-left font-semibold text-slate-300">Product Name</th>
                      <th className="px-3 md:px-4 py-3 text-left font-semibold text-slate-300">SKU</th>
                      <th className="px-3 md:px-4 py-3 text-right font-semibold text-slate-300">Price</th>
                      <th className="px-3 md:px-4 py-3 text-left font-semibold text-slate-300">Category</th>
                      <th className="px-3 md:px-4 py-3 text-center font-semibold text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scrapedProducts.map((product) => (
                      <tr key={product.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <td className="px-3 md:px-4 py-3 text-white font-medium truncate">{product.name}</td>
                        <td className="px-3 md:px-4 py-3 text-slate-400 font-mono text-xs md:text-sm">{product.sku}</td>
                        <td className="px-3 md:px-4 py-3 text-right text-yellow-400 font-semibold">${product.price.toFixed(2)}</td>
                        <td className="px-3 md:px-4 py-3">
                          <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs">
                            {product.category}
                          </Badge>
                        </td>
                        <td className="px-3 md:px-4 py-3 text-center">
                          {syncStatus === 'complete' ? (
                            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs justify-center">
                              ✓ Ready
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs justify-center">
                              ○ Preview
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="px-3 md:px-4 py-3 bg-slate-800/50 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs md:text-sm text-slate-400">
                <span>Total products: <span className="font-semibold text-white">{scrapedProducts.length}</span></span>
                <span>Estimated value: <span className="font-semibold text-yellow-400">
                  ${(scrapedProducts.reduce((sum, p) => sum + p.price, 0)).toFixed(2)}
                </span></span>
              </div>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
