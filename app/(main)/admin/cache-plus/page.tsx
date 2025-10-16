'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Zap,
  Database,
  Image,
  Code,
  FileCode,
  Globe,
  Rocket,
  Trash2,
  RefreshCw,
  Check,
  TrendingUp,
  Activity,
  HardDrive,
  Gauge,
} from 'lucide-react';

interface CacheSettings {
  id: string;
  enabled: boolean;
  pageCache: boolean;
  cssMinification: boolean;
  jsMinification: boolean;
  htmlMinification: boolean;
  imageLazyLoad: boolean;
  criticalCss: boolean;
  removeUnusedCss: boolean;
  deferJavascript: boolean;
  preloadFonts: boolean;
  browserCache: boolean;
  gzipCompression: boolean;
  cdnEnabled: boolean;
  cdnUrl: string;
  preloadKeyRequests: boolean;
  dnsPrefetch: boolean;
  dnsPrefetchDomains: string[];
  preconnectDomains: string[];
  cacheTtl: number;
  excludeUrls: string[];
  databaseOptimization: boolean;
}

interface CacheStats {
  totalSize: string;
  pageCache: { size: string; entries: number; hitRate: number };
  assetCache: { size: string; entries: number; hitRate: number };
  databaseCache: { size: string; entries: number; hitRate: number };
  lastCleared: string;
  compressionRatio: string;
  bandwidthSaved: string;
  avgLoadTime: string;
  improvement: string;
}

export default function CachePlusPage() {
  const [settings, setSettings] = useState<CacheSettings | null>(null);
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState('');
  const [dnsPrefetchInput, setDnsPrefetchInput] = useState('');
  const [preconnectInput, setPreconnectInput] = useState('');
  const [excludeUrlInput, setExcludeUrlInput] = useState('');

  useEffect(() => {
    loadSettings();
    loadStats();
  }, []);

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/cache', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading cache settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/cache/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading cache stats:', error);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    setMessage('');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage('✅ Cache settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('❌ Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleClearCache = async (type: string) => {
    setClearing(true);
    setMessage('');

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/cache/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ type }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ ${data.message}`);
        loadStats(); // Reload stats after clearing
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage('❌ Failed to clear cache');
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      setMessage('❌ Error clearing cache');
    } finally {
      setClearing(false);
    }
  };

  const updateSetting = (key: keyof CacheSettings, value: any) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  const addDomain = (type: 'dnsPrefetch' | 'preconnect') => {
    if (!settings) return;

    const input = type === 'dnsPrefetch' ? dnsPrefetchInput : preconnectInput;
    if (!input.trim()) return;

    const key = type === 'dnsPrefetch' ? 'dnsPrefetchDomains' : 'preconnectDomains';
    const current = settings[key] || [];
    
    if (!current.includes(input.trim())) {
      updateSetting(key, [...current, input.trim()]);
    }

    if (type === 'dnsPrefetch') {
      setDnsPrefetchInput('');
    } else {
      setPreconnectInput('');
    }
  };

  const removeDomain = (type: 'dnsPrefetch' | 'preconnect', domain: string) => {
    if (!settings) return;

    const key = type === 'dnsPrefetch' ? 'dnsPrefetchDomains' : 'preconnectDomains';
    const current = settings[key] || [];
    updateSetting(key, current.filter(d => d !== domain));
  };

  const addExcludeUrl = () => {
    if (!settings || !excludeUrlInput.trim()) return;

    const current = settings.excludeUrls || [];
    if (!current.includes(excludeUrlInput.trim())) {
      updateSetting('excludeUrls', [...current, excludeUrlInput.trim()]);
    }
    setExcludeUrlInput('');
  };

  const removeExcludeUrl = (url: string) => {
    if (!settings) return;

    const current = settings.excludeUrls || [];
    updateSetting('excludeUrls', current.filter(u => u !== url));
  };

  if (loading) {
    return (
      <AdminLayout title="Cache+" description="Performance optimization and caching">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!settings) {
    return (
      <AdminLayout title="Cache+" description="Performance optimization and caching">
        <div className="p-6">
          <p className="text-red-500">Failed to load cache settings</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Cache+" description="FlyingPress-inspired performance optimization">
      <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header with Save Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg shadow-lg">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Cache+ Performance Suite
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Professional caching - inspired by FlyingPress
              </p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg"
          >
            {saving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 sm:p-4 rounded-lg text-sm sm:text-base font-medium shadow-md animate-in fade-in slide-in-from-top-2 duration-300 ${message.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message}
          </div>
        )}

        {/* Cache Statistics */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <Card className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <HardDrive className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span className="text-[10px] sm:text-xs font-medium text-blue-600">CACHE</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-blue-900">{stats.totalSize}</div>
              <div className="text-[10px] sm:text-xs text-blue-600 mt-0.5 sm:mt-1">{stats.pageCache.entries + stats.assetCache.entries + stats.databaseCache.entries} entries</div>
            </Card>

            <Card className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                <span className="text-[10px] sm:text-xs font-medium text-green-600">HIT RATE</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-green-900">{stats.pageCache.hitRate}%</div>
              <div className="text-[10px] sm:text-xs text-green-600 mt-0.5 sm:mt-1">Avg. success</div>
            </Card>

            <Card className="p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <Gauge className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                <span className="text-[10px] sm:text-xs font-medium text-purple-600">SPEED</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-purple-900">{stats.avgLoadTime}</div>
              <div className="text-[10px] sm:text-xs text-purple-600 mt-0.5 sm:mt-1">{stats.improvement} faster</div>
            </Card>

            <Card className="p-3 sm:p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                <span className="text-[10px] sm:text-xs font-medium text-orange-600">SAVED</span>
              </div>
              <div className="text-lg sm:text-2xl font-bold text-orange-900">{stats.bandwidthSaved}</div>
              <div className="text-[10px] sm:text-xs text-orange-600 mt-0.5 sm:mt-1">{stats.compressionRatio} ratio</div>
            </Card>
          </div>
        )}

        {/* Master Toggle */}
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-purple-500 to-blue-600 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <Rocket className="h-6 w-6 sm:h-8 sm:w-8 text-white animate-pulse" />
              <div>
                <h3 className="text-base sm:text-xl font-bold text-white">Master Cache Control</h3>
                <p className="text-xs sm:text-sm text-purple-100 hidden sm:block">Enable or disable all caching features at once</p>
                <p className="text-xs text-purple-100 sm:hidden">Toggle all cache features</p>
              </div>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => updateSetting('enabled', checked)}
              className="data-[state=checked]:bg-white scale-110 sm:scale-100"
            />
          </div>
        </Card>

        {/* Page Caching */}
        <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <FileCode className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold">Page Caching</h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150">
              <div className="flex-1 pr-3">
                <Label className="font-medium text-sm sm:text-base">Enable Page Cache</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">Cache entire HTML pages for faster load times</p>
              </div>
              <Switch
                checked={settings.pageCache}
                onCheckedChange={(checked) => updateSetting('pageCache', checked)}
                disabled={!settings.enabled}
              />
            </div>

            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150">
              <div className="flex-1 pr-3">
                <Label className="font-medium text-sm sm:text-base">HTML Minification</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">Remove unnecessary whitespace from HTML</p>
              </div>
              <Switch
                checked={settings.htmlMinification}
                onCheckedChange={(checked) => updateSetting('htmlMinification', checked)}
                disabled={!settings.enabled}
              />
            </div>

            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <Label className="font-medium mb-2 block text-sm sm:text-base">Cache TTL (seconds)</Label>
              <Input
                type="number"
                value={settings.cacheTtl}
                onChange={(e) => updateSetting('cacheTtl', parseInt(e.target.value) || 3600)}
                disabled={!settings.enabled}
                className="w-full sm:max-w-xs"
              />
              <p className="text-xs text-muted-foreground mt-1">How long to cache pages (default: 3600 = 1 hour)</p>
            </div>
          </div>
        </Card>

        {/* CSS & JavaScript Optimization */}
        <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Code className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold">CSS & JavaScript Optimization</h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {[
              { key: 'cssMinification', label: 'CSS Minification', desc: 'Compress CSS files to reduce size' },
              { key: 'jsMinification', label: 'JavaScript Minification', desc: 'Compress JavaScript files to reduce size' },
              { key: 'criticalCss', label: 'Critical CSS', desc: 'Inline critical CSS for above-the-fold content' },
              { key: 'removeUnusedCss', label: 'Remove Unused CSS', desc: 'Strip out CSS that is not used on the page' },
              { key: 'deferJavascript', label: 'Defer JavaScript', desc: 'Load JavaScript after page content' }
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                <div className="flex-1 pr-3">
                  <Label className="font-medium text-sm sm:text-base">{label}</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">{desc}</p>
                </div>
                <Switch
                  checked={settings[key as keyof CacheSettings] as boolean}
                  onCheckedChange={(checked) => updateSetting(key as keyof CacheSettings, checked)}
                  disabled={!settings.enabled}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Image Optimization */}
        <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Image className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold">Image Optimization</h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150">
              <div className="flex-1 pr-3">
                <Label className="font-medium text-sm sm:text-base">Lazy Load Images</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">Load images only when they enter the viewport</p>
              </div>
              <Switch
                checked={settings.imageLazyLoad}
                onCheckedChange={(checked) => updateSetting('imageLazyLoad', checked)}
                disabled={!settings.enabled}
              />
            </div>
          </div>
        </Card>

        {/* Browser & Server Optimization */}
        <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold">Browser & Server Optimization</h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {[
              { key: 'browserCache', label: 'Browser Caching', desc: 'Set cache headers for browser caching' },
              { key: 'gzipCompression', label: 'GZIP Compression', desc: 'Compress responses for faster transmission' },
              { key: 'preloadFonts', label: 'Preload Fonts', desc: 'Preload web fonts to prevent FOUT' },
              { key: 'preloadKeyRequests', label: 'Preload Key Requests', desc: 'Preload critical resources' },
              { key: 'dnsPrefetch', label: 'DNS Prefetch', desc: 'Resolve DNS for external domains early' }
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                <div className="flex-1 pr-3">
                  <Label className="font-medium text-sm sm:text-base">{label}</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">{desc}</p>
                </div>
                <Switch
                  checked={settings[key as keyof CacheSettings] as boolean}
                  onCheckedChange={(checked) => updateSetting(key as keyof CacheSettings, checked)}
                  disabled={!settings.enabled}
                />
              </div>
            ))}

            {settings.dnsPrefetch && (
              <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Label className="font-medium mb-2 block text-sm sm:text-base">DNS Prefetch Domains</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="https://fonts.googleapis.com"
                    value={dnsPrefetchInput}
                    onChange={(e) => setDnsPrefetchInput(e.target.value)}
                    disabled={!settings.enabled}
                    onKeyPress={(e) => e.key === 'Enter' && addDomain('dnsPrefetch')}
                    className="text-sm"
                  />
                  <Button onClick={() => addDomain('dnsPrefetch')} disabled={!settings.enabled} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.dnsPrefetchDomains?.map((domain) => (
                    <div key={domain} className="flex items-center gap-1 bg-white px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm">
                      <span className="truncate max-w-[150px] sm:max-w-none">{domain}</span>
                      <button
                        onClick={() => removeDomain('dnsPrefetch', domain)}
                        className="text-red-500 hover:text-red-700 text-base sm:text-lg"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* CDN Configuration */}
        <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold">CDN Configuration</h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150">
              <div className="flex-1 pr-3">
                <Label className="font-medium text-sm sm:text-base">Enable CDN</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">Use a Content Delivery Network for static assets</p>
              </div>
              <Switch
                checked={settings.cdnEnabled}
                onCheckedChange={(checked) => updateSetting('cdnEnabled', checked)}
                disabled={!settings.enabled}
              />
            </div>

            {settings.cdnEnabled && (
              <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Label className="font-medium mb-2 block text-sm sm:text-base">CDN URL</Label>
                <Input
                  placeholder="https://cdn.example.com"
                  value={settings.cdnUrl || ''}
                  onChange={(e) => updateSetting('cdnUrl', e.target.value)}
                  disabled={!settings.enabled}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">Your CDN base URL</p>
              </div>
            )}
          </div>
        </Card>

        {/* Database Optimization */}
        <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Database className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold">Database Optimization</h3>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150">
              <div className="flex-1 pr-3">
                <Label className="font-medium text-sm sm:text-base">Database Query Caching</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">Cache database queries for faster retrieval</p>
              </div>
              <Switch
                checked={settings.databaseOptimization}
                onCheckedChange={(checked) => updateSetting('databaseOptimization', checked)}
                disabled={!settings.enabled}
              />
            </div>
          </div>
        </Card>

        {/* Exclude URLs */}
        <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold">Cache Exclusions</h3>
          </div>

          <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
            <Label className="font-medium mb-2 block text-sm sm:text-base">Exclude URLs from Caching</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="/admin, /cart, /checkout"
                value={excludeUrlInput}
                onChange={(e) => setExcludeUrlInput(e.target.value)}
                disabled={!settings.enabled}
                onKeyPress={(e) => e.key === 'Enter' && addExcludeUrl()}
                className="text-sm"
              />
              <Button onClick={addExcludeUrl} disabled={!settings.enabled} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.excludeUrls?.map((url) => (
                <div key={url} className="flex items-center gap-1 bg-white px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm">
                  <span>{url}</span>
                  <button
                    onClick={() => removeExcludeUrl(url)}
                    className="text-red-500 hover:text-red-700 text-base sm:text-lg"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Cache Management */}
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            <h3 className="text-base sm:text-lg font-semibold text-red-900">Cache Management</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => handleClearCache('all')}
              disabled={clearing}
              className="border-red-300 hover:bg-red-100 text-xs sm:text-sm"
              size="sm"
            >
              <Trash2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Clear All</span>
              <span className="sm:hidden">All</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleClearCache('page')}
              disabled={clearing}
              className="border-orange-300 hover:bg-orange-100 text-xs sm:text-sm"
              size="sm"
            >
              <FileCode className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Page</span>
              <span className="sm:hidden">Page</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleClearCache('css')}
              disabled={clearing}
              className="border-blue-300 hover:bg-blue-100 text-xs sm:text-sm"
              size="sm"
            >
              <Code className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">CSS</span>
              <span className="sm:hidden">CSS</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleClearCache('js')}
              disabled={clearing}
              className="border-purple-300 hover:bg-purple-100 text-xs sm:text-sm"
              size="sm"
            >
              <Code className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">JS</span>
              <span className="sm:hidden">JS</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleClearCache('images')}
              disabled={clearing}
              className="border-green-300 hover:bg-green-100 text-xs sm:text-sm"
              size="sm"
            >
              <Image className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Images</span>
              <span className="sm:hidden">Img</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleClearCache('database')}
              disabled={clearing}
              className="border-indigo-300 hover:bg-indigo-100 text-xs sm:text-sm"
              size="sm"
            >
              <Database className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Database</span>
              <span className="sm:hidden">DB</span>
            </Button>
          </div>
        </Card>

        {/* Footer Info */}
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 shadow-md">
          <div className="flex items-start sm:items-center gap-3">
            <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 flex-shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <h3 className="font-semibold text-purple-900 text-sm sm:text-base">Cache+ is Active</h3>
              <p className="text-xs sm:text-sm text-purple-700 mt-1">
                Your site is optimized for maximum performance. Cache+ provides enterprise-level caching
                and optimization features inspired by FlyingPress, built directly into your admin panel.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

