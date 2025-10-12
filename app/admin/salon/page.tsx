"use client";

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Scissors, Plus, Edit, Trash2, Save, X, MapPin, Phone, Mail, Clock, Facebook, Instagram } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SalonService {
  id: string;
  category: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes?: number;
  isActive: boolean;
  displayOrder: number;
}

export default function SalonManagementPage() {
  const [services, setServices] = useState<SalonService[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<SalonService | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const { toast } = useToast();

  // Business Settings State
  const [businessSettings, setBusinessSettings] = useState({
    businessName: '',
    businessType: 'salon',
    address: '',
    phone: '',
    email: '',
    description: '',
    googleMapsEmbed: '',
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
      instagram: ''
    }
  });

  // Form state for new/edit service
  const [serviceForm, setServiceForm] = useState({
    category: '',
    name: '',
    description: '',
    price: '',
    durationMinutes: '',
    isActive: true,
    displayOrder: 0
  });

  useEffect(() => {
    loadServices();
    loadBusinessSettings();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch('/api/salon-services?includeInactive=true');
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load services', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const loadBusinessSettings = async () => {
    try {
      const response = await fetch('/api/business-settings');
      if (response.ok) {
        const data = await response.json();
        if (data.businessName) {
          setBusinessSettings({
            businessName: data.businessName || '',
            businessType: data.businessType || 'salon',
            address: data.address || '',
            phone: data.phone || '',
            email: data.email || '',
            description: data.description || '',
            googleMapsEmbed: data.googleMapsEmbed || '',
            openingHours: data.openingHours || businessSettings.openingHours,
            socialMedia: data.socialMedia || { facebook: '', instagram: '' }
          });
        }
      }
    } catch (error) {
      console.error('Failed to load business settings:', error);
    }
  };

  const saveBusinessSettings = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/business-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(businessSettings)
      });

      if (response.ok) {
        toast({ title: 'Success', description: 'Business settings saved successfully' });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save business settings', variant: 'destructive' });
    }
  };

  const handleAddService = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/salon-services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...serviceForm,
          price: parseFloat(serviceForm.price),
          durationMinutes: serviceForm.durationMinutes ? parseInt(serviceForm.durationMinutes) : undefined
        })
      });

      if (response.ok) {
        toast({ title: 'Success', description: 'Service added successfully' });
        setIsAddingNew(false);
        setServiceForm({
          category: '',
          name: '',
          description: '',
          price: '',
          durationMinutes: '',
          isActive: true,
          displayOrder: 0
        });
        loadServices();
      } else {
        throw new Error('Failed to add service');
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add service', variant: 'destructive' });
    }
  };

  const handleUpdateService = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/salon-services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingService)
      });

      if (response.ok) {
        toast({ title: 'Success', description: 'Service updated successfully' });
        setEditingService(null);
        loadServices();
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update service', variant: 'destructive' });
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/salon-services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast({ title: 'Success', description: 'Service deleted successfully' });
        loadServices();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete service', variant: 'destructive' });
    }
  };

  const groupedServices = services.reduce((acc: any, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  return (
    <AdminLayout title="Salon Management" description="Manage your salon services and business settings">
      <div className="p-6 space-y-8">
        {/* Business Settings Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Business Settings
            </CardTitle>
            <CardDescription>Configure your salon information and location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Business Name</Label>
                <Input
                  value={businessSettings.businessName}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, businessName: e.target.value })}
                  placeholder="Bliss Hair Studio"
                />
              </div>
              <div>
                <Label>Business Type</Label>
                <Select
                  value={businessSettings.businessType}
                  onValueChange={(value) => setBusinessSettings({ ...businessSettings, businessType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salon">Hair Salon</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="gym">Gym</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={businessSettings.description}
                onChange={(e) => setBusinessSettings({ ...businessSettings, description: e.target.value })}
                placeholder="Brief description of your business..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Input
                  value={businessSettings.address}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, address: e.target.value })}
                  placeholder="123 Main Street, City"
                />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </Label>
                <Input
                  value={businessSettings.phone}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, phone: e.target.value })}
                  placeholder="+44 1234 567890"
                />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  type="email"
                  value={businessSettings.email}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, email: e.target.value })}
                  placeholder="info@salon.com"
                />
              </div>
            </div>

            <div>
              <Label>Google Maps Embed Code</Label>
              <Textarea
                value={businessSettings.googleMapsEmbed}
                onChange={(e) => setBusinessSettings({ ...businessSettings, googleMapsEmbed: e.target.value })}
                placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get embed code from Google Maps → Share → Embed a map
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-2">
                  <Facebook className="h-4 w-4" />
                  Facebook URL
                </Label>
                <Input
                  value={businessSettings.socialMedia.facebook}
                  onChange={(e) => setBusinessSettings({
                    ...businessSettings,
                    socialMedia: { ...businessSettings.socialMedia, facebook: e.target.value }
                  })}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Instagram URL
                </Label>
                <Input
                  value={businessSettings.socialMedia.instagram}
                  onChange={(e) => setBusinessSettings({
                    ...businessSettings,
                    socialMedia: { ...businessSettings.socialMedia, instagram: e.target.value }
                  })}
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={saveBusinessSettings} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save Business Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Services Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5" />
                  Salon Services & Prices
                </CardTitle>
                <CardDescription>Manage your service menu and pricing</CardDescription>
              </div>
              <Button onClick={() => setIsAddingNew(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isAddingNew && (
              <Card className="mb-6 border-2 border-primary">
                <CardHeader>
                  <CardTitle className="text-lg">Add New Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Category *</Label>
                      <Input
                        value={serviceForm.category}
                        onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                        placeholder="e.g., Haircuts, Coloring, Treatments"
                      />
                    </div>
                    <div>
                      <Label>Service Name *</Label>
                      <Input
                        value={serviceForm.name}
                        onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                        placeholder="e.g., Women's Cut & Blow Dry"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                      placeholder="Brief description of the service..."
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Price (£) *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={serviceForm.price}
                        onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                        placeholder="45.00"
                      />
                    </div>
                    <div>
                      <Label>Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={serviceForm.durationMinutes}
                        onChange={(e) => setServiceForm({ ...serviceForm, durationMinutes: e.target.value })}
                        placeholder="60"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleAddService}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Service
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : Object.keys(groupedServices).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Scissors className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No services yet. Add your first service to get started!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedServices).map(([category, categoryServices]: [string, any]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold mb-3 text-primary">{category}</h3>
                    <div className="space-y-2">
                      {categoryServices.map((service: SalonService) => (
                        <Card key={service.id} className="overflow-hidden">
                          {editingService?.id === service.id ? (
                            <CardContent className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Service Name</Label>
                                  <Input
                                    value={editingService.name}
                                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label>Price (£)</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    value={editingService.price}
                                    onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) })}
                                  />
                                </div>
                              </div>
                              <div>
                                <Label>Description</Label>
                                <Textarea
                                  value={editingService.description || ''}
                                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                                  rows={2}
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => setEditingService(null)}>
                                  Cancel
                                </Button>
                                <Button size="sm" onClick={() => handleUpdateService(service.id)}>
                                  Save
                                </Button>
                              </div>
                            </CardContent>
                          ) : (
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-semibold">{service.name}</h4>
                                  {service.description && (
                                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                                  )}
                                  <div className="flex gap-2 mt-2">
                                    {service.durationMinutes && (
                                      <Badge variant="secondary" className="text-xs">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {service.durationMinutes}min
                                      </Badge>
                                    )}
                                    <Badge variant={service.isActive ? 'default' : 'secondary'} className="text-xs">
                                      {service.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-xl font-bold text-primary">£{service.price.toFixed(2)}</span>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setEditingService(service)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteService(service.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      ))}
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
