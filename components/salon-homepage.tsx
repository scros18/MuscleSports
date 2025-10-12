"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Scissors, Sparkles } from 'lucide-react';
import { useBusinessSettings } from '@/context/business-settings-context';
import Link from 'next/link';

interface SalonService {
  id: string;
  category: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes?: number;
  isActive: boolean;
}

interface GroupedServices {
  [category: string]: SalonService[];
}

export function SalonHomepage() {
  const { settings } = useBusinessSettings();
  const [services, setServices] = useState<SalonService[]>([]);
  const [groupedServices, setGroupedServices] = useState<GroupedServices>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch salon services
    fetch('/api/salon-services')
      .then(res => res.json())
      .then(data => {
        setServices(data.services || []);
        setGroupedServices(data.grouped || {});
      })
      .catch(err => console.error('Failed to load services:', err))
      .finally(() => setLoading(false));
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(price);
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <Scissors className="h-4 w-4" />
                <span className="text-sm font-medium">Professional Hair & Beauty</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                {settings.businessName || 'Bliss Hair Studio'}
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-2xl">
                {settings.description || 'Transform your look with our expert stylists. Premium hair care and beauty services tailored just for you.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="text-lg px-8" asChild>
                  <a href="#services">View Our Services</a>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                  <a href="#contact">Contact Us</a>
                </Button>
              </div>
            </div>

            {/* Right Content - Contact Info Card */}
            <div className="w-full lg:w-auto">
              <Card className="shadow-xl">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Visit Us Today
                  </h3>
                  
                  {settings.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{settings.address}</p>
                      </div>
                    </div>
                  )}

                  {settings.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium">Call Us</p>
                        <a href={`tel:${settings.phone}`} className="text-sm text-primary hover:underline">
                          {settings.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {settings.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium">Email Us</p>
                        <a href={`mailto:${settings.email}`} className="text-sm text-primary hover:underline">
                          {settings.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {settings.openingHours && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="w-full">
                        <p className="font-medium mb-2">Opening Hours</p>
                        <div className="text-sm space-y-1">
                          {Object.entries(settings.openingHours).map(([day, hours]: [string, any]) => (
                            <div key={day} className="flex justify-between">
                              <span className="capitalize">{day}:</span>
                              <span className="text-muted-foreground">
                                {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Social Media Links */}
                  {settings.socialMedia && (
                    <div className="flex gap-3 pt-2 border-t">
                      {settings.socialMedia.facebook && (
                        <a
                          href={settings.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                      {settings.socialMedia.instagram && (
                        <a
                          href={settings.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Our Services & Prices</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional hair and beauty treatments at competitive prices
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : Object.keys(groupedServices).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No services available at the moment.</p>
            </div>
          ) : (
            <div className="grid gap-8 max-w-5xl mx-auto">
              {Object.entries(groupedServices).map(([category, categoryServices]) => (
                <Card key={category} className="overflow-hidden shadow-lg">
                  <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-4">
                    <h3 className="text-2xl font-bold">{category}</h3>
                  </div>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {categoryServices.map((service) => (
                        <div
                          key={service.id}
                          className="px-6 py-4 hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg mb-1">{service.name}</h4>
                              {service.description && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {service.description}
                                </p>
                              )}
                              {service.durationMinutes && (
                                <Badge variant="secondary" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatDuration(service.durationMinutes)}
                                </Badge>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                {formatPrice(service.price)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Google Maps Section */}
      {settings.googleMapsEmbed && (
        <section id="location" className="py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Find Us</h2>
              <p className="text-lg text-muted-foreground">
                {settings.address || 'Visit us at our location'}
              </p>
            </div>
            <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
              <div 
                className="w-full h-[400px] sm:h-[500px]"
                dangerouslySetInnerHTML={{ __html: settings.googleMapsEmbed }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Products Section (if any) */}
      <section id="products" className="py-12 sm:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Shop Our Products</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional hair care products recommended by our stylists
            </p>
          </div>
          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact/CTA Section */}
      <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready for a New Look?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book your appointment today and let our expert team transform your style
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {settings.phone && (
              <Button size="lg" className="text-lg px-8" asChild>
                <a href={`tel:${settings.phone}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  Call to Book
                </a>
              </Button>
            )}
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
