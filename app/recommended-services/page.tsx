'use client';

import { useState } from 'react';
import { Heart, MapPin, Globe, Phone, Mail, Star, ChevronRight, ExternalLink } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  website: string;
  phone?: string;
  email?: string;
  rating: number;
  reviews: number;
  image?: string;
  embedUrl?: string;
  tags: string[];
}

const recommendedServices: Service[] = [
  {
    id: '1',
    name: '100 Gym',
    category: 'Fitness & Gym',
    location: 'Boston, UK',
    description: '100 Gym is an excellent fitness facility in Boston offering state-of-the-art equipment, professional coaching, and a welcoming community. Perfect for all fitness levels from beginners to advanced athletes.',
    website: 'https://www.100gym.co.uk/',
    rating: 4.8,
    reviews: 156,
    embedUrl: 'https://www.100gym.co.uk/',
    tags: ['Gym', 'Fitness', 'Strength Training', 'Coaching'],
  },
  {
    id: '2',
    name: 'Nutrition Pro Services',
    category: 'Nutrition & Supplements',
    location: 'Online / Multiple Locations',
    description: 'Professional nutrition consultation and custom supplement plans tailored to your fitness goals. Expert nutritionists ready to help optimize your diet.',
    website: 'https://example.com/nutrition-pro',
    phone: '+44 123 456 7890',
    rating: 4.7,
    reviews: 89,
    tags: ['Nutrition', 'Consulting', 'Supplements', 'Diet Plans'],
  },
  {
    id: '3',
    name: 'Performance Physiotherapy',
    category: 'Health & Recovery',
    location: 'Multiple Locations',
    description: 'Specialized physiotherapy and sports injury recovery. Award-winning team helping athletes get back to peak performance.',
    website: 'https://example.com/physio',
    phone: '+44 234 567 8901',
    email: 'contact@physio.com',
    rating: 4.9,
    reviews: 234,
    tags: ['Physiotherapy', 'Recovery', 'Injury Treatment', 'Sports Medicine'],
  },
  {
    id: '4',
    name: 'Elite Personal Training',
    category: 'Personal Training',
    location: 'London, UK',
    description: 'One-on-one personal training sessions with certified coaches. Customized workout plans designed to maximize your results in minimal time.',
    website: 'https://example.com/elite-training',
    phone: '+44 345 678 9012',
    rating: 4.9,
    reviews: 412,
    tags: ['Personal Training', 'Coaching', 'Fitness Plans', 'Transformation'],
  },
];

export default function RecommendedServicesPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', ...new Set(recommendedServices.map(s => s.category))];
  
  const filteredServices = filterCategory === 'All' 
    ? recommendedServices 
    : recommendedServices.filter(s => s.category === filterCategory);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_25%,rgba(68,68,68,.2)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.2)_75%,rgba(68,68,68,.2))] bg-[length:40px_40px] animate-pulse"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 md:h-10 md:w-10 text-red-500" fill="currentColor" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Recommended Services
            </h1>
          </div>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl">
            Handpicked businesses and services we trust and recommend to our community. All partners share our commitment to quality and excellence.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  filterCategory === cat
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="group cursor-pointer bg-slate-900 border border-slate-800 rounded-lg hover:border-blue-500/50 transition-all duration-300 overflow-hidden hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            >
              {/* Service Card */}
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
                      {service.name}
                    </h3>
                    <p className="text-sm text-blue-400">{service.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                      <span className="font-bold text-white">{service.rating}</span>
                    </div>
                    <p className="text-xs text-slate-400">{service.reviews} reviews</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 mb-4 text-slate-300">
                  <MapPin className="h-4 w-4 text-slate-500 flex-shrink-0" />
                  <p className="text-sm">{service.location}</p>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-full border border-blue-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <a
                    href={service.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Visit Website</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Details Modal/Drawer */}
        {selectedService && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center">
            <div
              className="w-full md:max-w-2xl bg-slate-900 rounded-t-lg md:rounded-lg border border-slate-800 max-h-[90vh] overflow-y-auto md:overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 z-10 p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Details Content */}
              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(selectedService.rating)
                              ? 'text-yellow-400'
                              : 'text-slate-700'
                          }`}
                          fill="currentColor"
                        />
                      ))}
                    </div>
                    <span className="text-white font-bold">{selectedService.rating}</span>
                    <span className="text-slate-400">({selectedService.reviews} reviews)</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedService.name}</h2>
                  <p className="text-blue-400 font-medium">{selectedService.category}</p>
                </div>

                {/* Description */}
                <p className="text-slate-300 mb-6 leading-relaxed">{selectedService.description}</p>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Location</p>
                      <p className="text-white font-medium">{selectedService.location}</p>
                    </div>
                  </div>

                  {selectedService.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-blue-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-400">Phone</p>
                        <a
                          href={`tel:${selectedService.phone}`}
                          className="text-white font-medium hover:text-blue-400 transition-colors"
                        >
                          {selectedService.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {selectedService.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-slate-400">Email</p>
                        <a
                          href={`mailto:${selectedService.email}`}
                          className="text-white font-medium hover:text-blue-400 transition-colors"
                        >
                          {selectedService.email}
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-400">Website</p>
                      <a
                        href={selectedService.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white font-medium hover:text-blue-400 transition-colors truncate"
                      >
                        Visit Site
                      </a>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">Services & Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-blue-500/15 text-blue-300 text-sm rounded-full border border-blue-500/30 hover:border-blue-500/50 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href={selectedService.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
                >
                  <Globe className="h-5 w-5" />
                  <span>Visit {selectedService.name}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Overlay Click Handler */}
            <div
              className="fixed inset-0 -z-10 md:hidden"
              onClick={() => setSelectedService(null)}
            />
          </div>
        )}

        {/* Call to Action - Add More Services */}
        <div className="mt-16 p-8 md:p-12 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border border-blue-500/30 rounded-lg text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Know a Great Service?
          </h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            If you own or know of a business that provides exceptional services aligned with our values, we'd love to hear from you!
          </p>
          <a
            href="mailto:partnerships@musclesports.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            <Mail className="h-5 w-5" />
            Suggest a Service
          </a>
        </div>
      </div>
    </div>
  );
}
