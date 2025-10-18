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
        loadStats();
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
    <AdminLayout title="Cache+" description="Performance optimization">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header with Save Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Cache+ Performance Suite</h2>
              <p className="text-sm text-slate-400">Professional caching & optimization</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full shadow-lg hover:shadow-xl font-semibold transition-all duration-300"
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
          <div className={`p-4 rounded-xl font-medium shadow-md ${message.includes('✅') ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
            {message}
          </div>
        )}

        {/* Cache Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <HardDrive className="h-5 w-5 text-blue-400" />
                <span className="text-xs font-semibold text-blue-400">CACHE SIZE</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.totalSize}</div>
              <div className="text-xs text-slate-400 mt-1">{stats.pageCache.entries + stats.assetCache.entries + stats.databaseCache.entries} entries</div>
            </Card>

            <Card className="p-5 bg-slate-900 border-slate-800 hover:border-green-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-5 w-5 text-green-400" />
                <span className="text-xs font-semibold text-green-400">HIT RATE</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.pageCache.hitRate}%</div>
              <div className="text-xs text-slate-400 mt-1">Avg. success rate</div>
            </Card>

            <Card className="p-5 bg-slate-900 border-slate-800 hover:border-cyan-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <Gauge className="h-5 w-5 text-cyan-400" />
                <span className="text-xs font-semibold text-cyan-400">SPEED</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.avgLoadTime}</div>
              <div className="text-xs text-slate-400 mt-1">{stats.improvement} faster</div>
            </Card>

            <Card className="p-5 bg-slate-900 border-slate-800 hover:border-yellow-500/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-5 w-5 text-yellow-400" />
                <span className="text-xs font-semibold text-yellow-400">SAVED</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.bandwidthSaved}</div>
              <div className="text-xs text-slate-400 mt-1">{stats.compressionRatio} ratio</div>
            </Card>
          </div>
        )}

        {/* Master Toggle */}
        <Card className="p-6 bg-gradient-to-r from-blue-600 to-cyan-600 border-0 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Rocket className="h-8 w-8 text-white" />
              <div>
                <h3 className="text-xl font-bold text-white">Master Cache Control</h3>
                <p className="text-sm text-blue-100">Enable or disable all caching features</p>
              </div>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => updateSetting('enabled', checked)}
              className="data-[state=checked]:bg-white scale-110"
            />
          </div>
        </Card>

        {/* Page Caching */}
        <Card className="p-6 bg-slate-900 border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <FileCode className="h-6 w-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Page Caching</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-all">
              <div>
                <Label className="font-medium text-white">Enable Page Cache</Label>
                <p className="text-sm text-slate-400">Cache entire HTML pages for faster load times</p>
              </div>
              <Switch
                checked={settings.pageCache}
                onCheckedChange={(checked) => updateSetting('pageCache', checked)}
                disabled={!settings.enabled}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-all">
              <div>
                <Label className="font-medium text-white">HTML Minification</Label>
                <p className="text-sm text-slate-400">Remove unnecessary whitespace from HTML</p>
              </div>
              <Switch
                checked={settings.htmlMinification}
                onCheckedChange={(checked) => updateSetting('htmlMinification', checked)}
                disabled={!settings.enabled}
              />
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <Label className="font-medium text-white mb-2 block">Cache TTL (seconds)</Label>
              <Input
                type="number"
                value={settings.cacheTtl}
                onChange={(e) => updateSetting('cacheTtl', parseInt(e.target.value) || 3600)}
                disabled={!settings.enabled}
                className="max-w-xs bg-slate-900 border-slate-700 text-white"
              />
              <p className="text-xs text-slate-400 mt-2">How long to cache pages (default: 3600 = 1 hour)</p>
            </div>
          </div>
        </Card>

        {/* CSS & JavaScript Optimization */}
        <Card className="p-6 bg-slate-900 border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-6 w-6 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">CSS & JavaScript Optimization</h3>
          </div>

          <div className="space-y-4">
            {[
              { key: 'cssMinification', label: 'CSS Minification', desc: 'Compress CSS files to reduce size' },
              { key: 'jsMinification', label: 'JavaScript Minification', desc: 'Compress JavaScript files' },
              { key: 'criticalCss', label: 'Critical CSS', desc: 'Inline critical CSS for above-the-fold content' },
              { key: 'removeUnusedCss', label: 'Remove Unused CSS', desc: 'Strip out CSS not used on the page' },
              { key: 'deferJavascript', label: 'Defer JavaScript', desc: 'Load JavaScript after page content' }
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all">
                <div>
                  <Label className="font-medium text-white">{label}</Label>
                  <p className="text-sm text-slate-400">{desc}</p>
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

        {/* Browser & Server Optimization */}
        <Card className="p-6 bg-slate-900 border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-6 w-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Browser & Server Optimization</h3>
          </div>

          <div className="space-y-4">
            {[
              { key: 'browserCache', label: 'Browser Caching', desc: 'Set cache headers for browser caching' },
              { key: 'gzipCompression', label: 'GZIP Compression', desc: 'Compress responses for faster transmission' },
              { key: 'preloadFonts', label: 'Preload Fonts', desc: 'Preload web fonts to prevent FOUT' },
              { key: 'imageLazyLoad', label: 'Lazy Load Images', desc: 'Load images only when they enter viewport' },
              { key: 'databaseOptimization', label: 'Database Query Caching', desc: 'Cache database queries' }
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-green-500/50 transition-all">
                <div>
                  <Label className="font-medium text-white">{label}</Label>
                  <p className="text-sm text-slate-400">{desc}</p>
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

        {/* Cache Management */}
        <Card className="p-6 bg-gradient-to-br from-red-900/30 to-orange-900/30 border-red-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="h-6 w-6 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Cache Management</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button
              onClick={() => handleClearCache('all')}
              disabled={clearing}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
            <Button
              onClick={() => handleClearCache('page')}
              disabled={clearing}
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <FileCode className="mr-2 h-4 w-4" />
              Page
            </Button>
            <Button
              onClick={() => handleClearCache('css')}
              disabled={clearing}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Code className="mr-2 h-4 w-4" />
              CSS
            </Button>
            <Button
              onClick={() => handleClearCache('js')}
              disabled={clearing}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Code className="mr-2 h-4 w-4" />
              JS
            </Button>
            <Button
              onClick={() => handleClearCache('images')}
              disabled={clearing}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Image className="mr-2 h-4 w-4" />
              Images
            </Button>
            <Button
              onClick={() => handleClearCache('database')}
              disabled={clearing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Database className="mr-2 h-4 w-4" />
              Database
            </Button>
          </div>
        </Card>

        {/* Footer Info */}
        <Card className="p-6 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-500/30">
          <div className="flex items-center gap-4">
            <Zap className="h-8 w-8 text-blue-400" />
            <div>
              <h3 className="font-semibold text-white">Cache+ is Active</h3>
              <p className="text-sm text-slate-300 mt-1">
                Your site is optimized for maximum performance with enterprise-level caching built directly into Lumify.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
