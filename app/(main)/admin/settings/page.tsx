"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { usePerformance } from "@/context/performance-context";
import { useSiteSettings } from "@/context/site-settings-context";
import { Zap, Sparkles, Eye, Gauge, Check, Globe, Image as ImageIcon, Type } from "lucide-react";

export default function SettingsPage() {
  const { settings, toggleAnimations, updateSettings } = usePerformance();
  const { settings: siteSettings, updateSettings: updateSiteSettings } = useSiteSettings();
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [siteSaved, setSiteSaved] = useState(false);
  const [localSiteSettings, setLocalSiteSettings] = useState(siteSettings);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLocalSiteSettings(siteSettings);
  }, [siteSettings]);

  const handleSaveSiteSettings = () => {
    updateSiteSettings(localSiteSettings);
    setSiteSaved(true);
    setTimeout(() => setSiteSaved(false), 2000);
  };

  const handleResetToDefaults = () => {
    const defaults = {
      siteName: "MuscleSports",
      siteUrl: "https://musclesports.co.uk",
      logoUrl: "/musclesports-logo.png",
      tagline: "Your Premier Sports Nutrition Destination",
      showSaleBanner: false
    };
    setLocalSiteSettings(defaults);
    updateSiteSettings(defaults);
    setSiteSaved(true);
    setTimeout(() => setSiteSaved(false), 2000);
  };

  const handleToggleAnimations = () => {
    toggleAnimations();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your application preferences and performance settings
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6">
        {/* Site Settings */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle>Site Settings</CardTitle>
            </div>
            <CardDescription>
              Configure your site name, logo, and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Site Name */}
            <div className="space-y-2">
              <Label htmlFor="siteName" className="flex items-center gap-2 text-base font-semibold">
                <Type className="h-4 w-4" />
                Site Name
              </Label>
              <Input
                id="siteName"
                value={localSiteSettings.siteName}
                onChange={(e) => setLocalSiteSettings({ ...localSiteSettings, siteName: e.target.value })}
                placeholder="Enter site name"
                className="text-base"
              />
              <p className="text-xs text-muted-foreground">This appears in the header and footer</p>
            </div>

            {/* Site URL */}
            <div className="space-y-2">
              <Label htmlFor="siteUrl" className="flex items-center gap-2 text-base font-semibold">
                <Globe className="h-4 w-4" />
                Site URL
              </Label>
              <Input
                id="siteUrl"
                value={localSiteSettings.siteUrl}
                onChange={(e) => setLocalSiteSettings({ ...localSiteSettings, siteUrl: e.target.value })}
                placeholder="https://example.com"
                className="text-base"
              />
              <p className="text-xs text-muted-foreground">Your site&apos;s primary URL</p>
            </div>

            {/* Logo URL */}
            <div className="space-y-2">
              <Label htmlFor="logoUrl" className="flex items-center gap-2 text-base font-semibold">
                <ImageIcon className="h-4 w-4" />
                Logo URL
              </Label>
              <Input
                id="logoUrl"
                value={localSiteSettings.logoUrl}
                onChange={(e) => setLocalSiteSettings({ ...localSiteSettings, logoUrl: e.target.value })}
                placeholder="/logo.png"
                className="text-base"
              />
              <p className="text-xs text-muted-foreground">Path to your logo image (place in /public folder)</p>
            </div>

            {/* Tagline */}
            <div className="space-y-2">
              <Label htmlFor="tagline" className="flex items-center gap-2 text-base font-semibold">
                <Sparkles className="h-4 w-4" />
                Tagline
              </Label>
              <Input
                id="tagline"
                value={localSiteSettings.tagline}
                onChange={(e) => setLocalSiteSettings({ ...localSiteSettings, tagline: e.target.value })}
                placeholder="Enter site tagline"
                className="text-base"
              />
              <p className="text-xs text-muted-foreground">A short description of your site</p>
            </div>

            {/* Sale Banner Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg border-2 bg-gradient-to-br from-background to-muted/30">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">
                  <Sparkles className={`h-5 w-5 ${localSiteSettings.showSaleBanner !== false ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <Label htmlFor="saleBanner" className="text-base font-semibold cursor-pointer flex items-center gap-2">
                    Special Offer Banner
                    {localSiteSettings.showSaleBanner !== false && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                        Active
                      </span>
                    )}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Show the &quot;Save 15% on all items&quot; banner at the top of the site
                  </p>
                </div>
              </div>
              <div className="ml-4">
                <button
                  id="saleBanner"
                  onClick={() => setLocalSiteSettings({ ...localSiteSettings, showSaleBanner: localSiteSettings.showSaleBanner === false ? true : false })}
                  className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    localSiteSettings.showSaleBanner !== false ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  role="switch"
                  aria-checked={localSiteSettings.showSaleBanner !== false}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ease-spring ${
                      localSiteSettings.showSaleBanner !== false ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button onClick={handleSaveSiteSettings} className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleResetToDefaults} variant="outline">
                Reset to Defaults
              </Button>
            </div>

            {/* Save Confirmation */}
            {siteSaved && (
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-900 dark:text-green-200">
                  Site settings saved successfully
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Settings */}
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle>Performance</CardTitle>
            </div>
            <CardDescription>
              Optimize application performance and visual effects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Animations Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg border-2 bg-gradient-to-br from-background to-muted/30">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">
                  <Sparkles className={`h-5 w-5 ${settings.animationsEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <Label htmlFor="animations" className="text-base font-semibold cursor-pointer flex items-center gap-2">
                    iOS-style Animations
                    {settings.animationsEnabled && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                        Active
                      </span>
                    )}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enable smooth, iOS-like animations throughout the application. Includes spring animations, elastic transitions, and interactive feedback effects.
                  </p>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-primary" />
                      <span>Card hover effects & scale transforms</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-primary" />
                      <span>Button press feedback & elastic bounces</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-primary" />
                      <span>Smooth page transitions & fades</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="h-3 w-3 text-primary" />
                      <span>Quantity selector spring animations</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <button
                  id="animations"
                  onClick={handleToggleAnimations}
                  className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    settings.animationsEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  role="switch"
                  aria-checked={settings.animationsEnabled}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ease-spring ${
                      settings.animationsEnabled ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* System Preference Info */}
            {settings.reducedMotion && (
              <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
                <Eye className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                    Reduced Motion Detected
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    Your system preferences indicate a preference for reduced motion. Animations are automatically disabled for accessibility.
                  </p>
                </div>
              </div>
            )}

            {/* Performance Tips */}
            <div className="p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center gap-2 mb-3">
                <Gauge className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold">Performance Tips</h4>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Disabling animations can improve performance on older devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Animations use hardware acceleration and are GPU-optimized</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Settings are saved locally and persist across sessions</span>
                </li>
              </ul>
            </div>

            {/* Save Confirmation */}
            {saved && (
              <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-900 dark:text-green-200">
                  Settings saved successfully
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
