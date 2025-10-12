"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Save, 
  Globe, 
  Palette, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Image as ImageIcon,
  Building,
  FileText,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useBusinessSettings } from '@/context/business-settings-context';

export default function SiteBuilderPage() {
  const { settings: contextSettings, updateSettings, loading: contextLoading } = useBusinessSettings();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'location' | 'social'>('general');

  const [settings, setSettings] = useState({
    businessName: '',
    businessType: 'ecommerce' as 'salon' | 'ecommerce' | 'gym' | 'other',
    description: '',
    logoUrl: '',
    address: '',
    phone: '',
    email: '',
    googleMapsEmbed: '',
    latitude: 0,
    longitude: 0,
    primaryColor: '#e11d48',
    secondaryColor: '#fda4af',
    theme: 'ordify',
    openingHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '17:00', closed: false },
      sunday: { open: '', close: '', closed: true }
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      tiktok: ''
    }
  });

  useEffect(() => {
    if (!contextLoading && contextSettings) {
      setSettings({
        businessName: contextSettings.businessName || '',
        businessType: contextSettings.businessType || 'ecommerce',
        description: contextSettings.description || '',
        logoUrl: contextSettings.logoUrl || '',
        address: contextSettings.address || '',
        phone: contextSettings.phone || '',
        email: contextSettings.email || '',
        googleMapsEmbed: contextSettings.googleMapsEmbed || '',
        latitude: contextSettings.latitude || 0,
        longitude: contextSettings.longitude || 0,
        primaryColor: contextSettings.primaryColor || '#e11d48',
        secondaryColor: contextSettings.secondaryColor || '#fda4af',
        theme: contextSettings.theme || 'ordify',
        openingHours: contextSettings.openingHours || settings.openingHours,
        socialMedia: contextSettings.socialMedia || settings.socialMedia
      });
    }
  }, [contextSettings, contextLoading]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      toast({ 
        title: 'Success', 
        description: 'Site settings saved successfully! Your changes are now live.' 
      });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to save settings. Please try again.', 
        variant: 'destructive' 
      });
    } finally {
      setSaving(false);
    }
  };

  const updateOpeningHours = (day: string, field: 'open' | 'close' | 'closed', value: string | boolean) => {
    setSettings({
      ...settings,
      openingHours: {
        ...settings.openingHours,
        [day]: {
          ...settings.openingHours[day as keyof typeof settings.openingHours],
          [field]: value
        }
      }
    });
  };

  const tabs = [
    { id: 'general' as const, label: 'General Info', icon: Building },
    { id: 'branding' as const, label: 'Branding', icon: Palette },
    { id: 'location' as const, label: 'Location & Hours', icon: MapPin },
    { id: 'social' as const, label: 'Social Media', icon: Globe }
  ];

  return (
    <AdminLayout 
      title="Site Builder" 
      description="Customize your website's appearance and information"
    >
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header with Save Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Build Your Site</h1>
              <p className="text-sm text-muted-foreground">
                Customize every aspect of your online presence
              </p>
            </div>
          </div>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            size="lg"
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* General Info Tab */}
          {activeTab === 'general' && (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Business Information
                  </CardTitle>
                  <CardDescription>
                    Basic information about your business
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={settings.businessName}
                      onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                      placeholder="e.g., Bliss Hair Studio"
                      className="text-lg font-semibold"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This will appear in the browser tab, header, and throughout your site
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select
                      value={settings.businessType}
                      onValueChange={(value: any) => setSettings({ ...settings, businessType: value })}
                    >
                      <SelectTrigger id="businessType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="salon">Hair Salon / Beauty</SelectItem>
                        <SelectItem value="ecommerce">E-commerce Store</SelectItem>
                        <SelectItem value="gym">Gym / Fitness</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      This determines which features and layouts are available
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Site Description</Label>
                    <Textarea
                      id="description"
                      value={settings.description}
                      onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                      placeholder="Brief description of your business and what you offer..."
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This appears in search results and social media previews
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    How customers can reach you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        placeholder="+44 1234 567890"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        placeholder="info@yourbusiness.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Branding Tab */}
          {activeTab === 'branding' && (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Logo & Visual Identity
                  </CardTitle>
                  <CardDescription>
                    Customize your brand's visual appearance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={settings.logoUrl}
                      onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                      placeholder="https://example.com/logo.png"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload your logo to an image hosting service and paste the URL here
                    </p>
                    {settings.logoUrl && (
                      <div className="mt-3 p-4 border rounded-lg bg-muted/30">
                        <p className="text-sm font-medium mb-2">Preview:</p>
                        <img 
                          src={settings.logoUrl} 
                          alt="Logo preview" 
                          className="h-16 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) => setSettings({ ...settings, theme: value })}
                    >
                      <SelectTrigger id="theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lumify">Lumify - Bright Blue</SelectItem>
                        <SelectItem value="ordify">Ordify - Classic Gray/Blue</SelectItem>
                        <SelectItem value="musclesports">MuscleSports - Green</SelectItem>
                        <SelectItem value="vera">VeraRP - Purple</SelectItem>
                        <SelectItem value="blisshair">Bliss Hair - Rose/Pink</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          value={settings.primaryColor}
                          onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                          placeholder="#e11d48"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          value={settings.secondaryColor}
                          onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                          placeholder="#fda4af"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Location Tab */}
          {activeTab === 'location' && (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Physical Location
                  </CardTitle>
                  <CardDescription>
                    Where customers can find you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Textarea
                      id="address"
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      placeholder="123 Main Street, City, Postcode"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="googleMaps">Google Maps Embed Code</Label>
                    <Textarea
                      id="googleMaps"
                      value={settings.googleMapsEmbed}
                      onChange={(e) => setSettings({ ...settings, googleMapsEmbed: e.target.value })}
                      placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Go to Google Maps → Find your location → Share → Embed a map → Copy HTML
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Opening Hours
                  </CardTitle>
                  <CardDescription>
                    When your business is open
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(settings.openingHours).map(([day, hours]) => (
                      <div key={day} className="grid grid-cols-[120px_1fr_1fr_auto] gap-3 items-center">
                        <Label className="capitalize">{day}</Label>
                        <Input
                          type="time"
                          value={hours.open}
                          onChange={(e) => updateOpeningHours(day, 'open', e.target.value)}
                          disabled={hours.closed}
                        />
                        <Input
                          type="time"
                          value={hours.close}
                          onChange={(e) => updateOpeningHours(day, 'close', e.target.value)}
                          disabled={hours.closed}
                        />
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={hours.closed}
                            onChange={(e) => updateOpeningHours(day, 'closed', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm">Closed</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Social Media Links
                </CardTitle>
                <CardDescription>
                  Connect your social media profiles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="facebook" className="flex items-center gap-2">
                    <Facebook className="h-4 w-4 text-blue-600" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook"
                    value={settings.socialMedia.facebook}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, facebook: e.target.value }
                    })}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div>
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-pink-600" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    value={settings.socialMedia.instagram}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, instagram: e.target.value }
                    })}
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-blue-400" />
                    Twitter / X
                  </Label>
                  <Input
                    id="twitter"
                    value={settings.socialMedia.twitter}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, twitter: e.target.value }
                    })}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>

                <div>
                  <Label htmlFor="tiktok">TikTok</Label>
                  <Input
                    id="tiktok"
                    value={settings.socialMedia.tiktok}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, tiktok: e.target.value }
                    })}
                    placeholder="https://tiktok.com/@yourhandle"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bottom Save Button */}
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={saving}
            size="lg"
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
