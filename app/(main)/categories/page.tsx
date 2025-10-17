"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateBreadcrumbSchema } from "@/lib/seo";

// Tropicana Wholesale categories for MuscleSports rebrand
const categories = [
  { 
    name: 'Amino Acids', 
    slug: 'amino-acids',
    description: 'Essential amino acids for muscle recovery and growth',
    icon: '💪',
    color: 'bg-blue-500'
  },
  { 
    name: 'Anti Inflammatory', 
    slug: 'anti-inflammatory',
    description: 'Natural anti-inflammatory supplements for joint health',
    icon: '🌿',
    color: 'bg-green-500'
  },
  { 
    name: 'Antioxidant Support', 
    slug: 'antioxidant-support',
    description: 'Powerful antioxidants to fight free radicals',
    icon: '🛡️',
    color: 'bg-purple-500'
  },
  { 
    name: 'Appetite Control', 
    slug: 'appetite-control',
    description: 'Supplements to help manage hunger and cravings',
    icon: '🍽️',
    color: 'bg-orange-500'
  },
  { 
    name: 'Ashwagandha', 
    slug: 'ashwagandha',
    description: 'Adaptogenic herb for stress relief and energy',
    icon: '🧘',
    color: 'bg-yellow-500'
  },
  { 
    name: 'Caffeine', 
    slug: 'caffeine',
    description: 'Energy boosters and pre-workout caffeine supplements',
    icon: '☕',
    color: 'bg-amber-500'
  },
  { 
    name: 'Carbohydrate Powders', 
    slug: 'carbohydrate-powders',
    description: 'Fast-acting carbs for energy and recovery',
    icon: '⚡',
    color: 'bg-red-500'
  },
  { 
    name: 'CBD', 
    slug: 'cbd',
    description: 'CBD products for relaxation and recovery',
    icon: '🌱',
    color: 'bg-emerald-500'
  },
  { 
    name: 'CLA', 
    slug: 'cla',
    description: 'Conjugated linoleic acid for fat loss support',
    icon: '🔥',
    color: 'bg-pink-500'
  },
  { 
    name: 'Probiotics & Digestion', 
    slug: 'probiotics-digestion',
    description: 'Digestive health and gut support supplements',
    icon: '🦠',
    color: 'bg-teal-500'
  },
  { 
    name: 'Clothing', 
    slug: 'clothing',
    description: 'Premium fitness and sports apparel',
    icon: '👕',
    color: 'bg-gray-500'
  },
  { 
    name: 'Cognitive Support', 
    slug: 'cognitive-support',
    description: 'Brain health and mental performance supplements',
    icon: '🧠',
    color: 'bg-indigo-500'
  },
  { 
    name: 'Collagen', 
    slug: 'collagen',
    description: 'Collagen peptides for skin, hair, and joint health',
    icon: '✨',
    color: 'bg-rose-500'
  },
  { 
    name: 'Cream Of Rice', 
    slug: 'cream-of-rice',
    description: 'Clean carbohydrate source for pre/post workout',
    icon: '🍚',
    color: 'bg-stone-500'
  },
  { 
    name: 'Creams, Gels, Lotions, Ointments', 
    slug: 'creams-gels-lotions-ointments',
    description: 'Topical products for muscle relief and recovery',
    icon: '🧴',
    color: 'bg-cyan-500'
  },
  { 
    name: 'Creatine', 
    slug: 'creatine',
    description: 'The most researched supplement for strength and power',
    icon: '💥',
    color: 'bg-violet-500'
  },
  { 
    name: 'Egg Whites', 
    slug: 'egg-whites',
    description: 'Pure protein from egg whites for muscle building',
    icon: '🥚',
    color: 'bg-slate-500'
  },
  { 
    name: 'Electrolytes', 
    slug: 'electrolytes',
    description: 'Essential minerals for hydration and performance',
    icon: '🧂',
    color: 'bg-sky-500'
  },
  { 
    name: 'Energy & Endurance', 
    slug: 'energy-endurance',
    description: 'Supplements to boost energy and athletic endurance',
    icon: '🏃',
    color: 'bg-lime-500'
  },
  { 
    name: 'Fish Oils & Omega', 
    slug: 'fish-oils-omega',
    description: 'Essential fatty acids for heart and brain health',
    icon: '🐟',
    color: 'bg-blue-600'
  },
  { 
    name: 'Functional Foods', 
    slug: 'functional-foods',
    description: 'Nutritious foods with added health benefits',
    icon: '🥗',
    color: 'bg-green-600'
  },
  { 
    name: 'Glutamine', 
    slug: 'glutamine',
    description: 'Amino acid for muscle recovery and immune support',
    icon: '🔋',
    color: 'bg-yellow-600'
  },
  { 
    name: 'Health & Wellness', 
    slug: 'health-wellness',
    description: 'General health and wellness supplements',
    icon: '❤️',
    color: 'bg-red-600'
  },
  { 
    name: 'Joint Support', 
    slug: 'joint-support',
    description: 'Supplements for joint health and mobility',
    icon: '🦴',
    color: 'bg-orange-600'
  },
  { 
    name: 'Mass Gainers', 
    slug: 'mass-gainers',
    description: 'High-calorie supplements for weight gain',
    icon: '📈',
    color: 'bg-purple-600'
  },
  { 
    name: 'Meal Replacements', 
    slug: 'meal-replacements',
    description: 'Convenient meal replacement shakes and bars',
    icon: '🥤',
    color: 'bg-pink-600'
  },
  { 
    name: 'Multivitamins', 
    slug: 'multivitamins',
    description: 'Complete vitamin and mineral supplements',
    icon: '💊',
    color: 'bg-emerald-600'
  },
  { 
    name: 'Muscle Recovery', 
    slug: 'muscle-recovery',
    description: 'Supplements to speed up muscle recovery',
    icon: '🔄',
    color: 'bg-teal-600'
  },
  { 
    name: 'Omega 3', 
    slug: 'omega-3',
    description: 'Essential omega-3 fatty acids for health',
    icon: '🌊',
    color: 'bg-cyan-600'
  },
  { 
    name: 'Pre-Workout', 
    slug: 'pre-workout',
    description: 'Energy and performance boosters for training',
    icon: '⚡',
    color: 'bg-amber-600'
  },
  { 
    name: 'Protein Bars', 
    slug: 'protein-bars',
    description: 'Convenient protein snacks for on-the-go nutrition',
    icon: '🍫',
    color: 'bg-stone-600'
  },
  { 
    name: 'Protein Powders', 
    slug: 'protein-powders',
    description: 'High-quality protein powders for muscle building',
    icon: '🥤',
    color: 'bg-slate-600'
  },
  { 
    name: 'Protein RTDs', 
    slug: 'protein-rtds',
    description: 'Ready-to-drink protein shakes',
    icon: '🥛',
    color: 'bg-sky-600'
  },
  { 
    name: 'Ready-To-Drinks', 
    slug: 'ready-to-drinks',
    description: 'Convenient ready-to-drink supplements',
    icon: '🍹',
    color: 'bg-lime-600'
  },
  { 
    name: 'Sleep Support', 
    slug: 'sleep-support',
    description: 'Natural supplements for better sleep quality',
    icon: '😴',
    color: 'bg-indigo-600'
  },
  { 
    name: 'Sports Nutrition', 
    slug: 'sports-nutrition',
    description: 'Complete sports nutrition solutions',
    icon: '🏆',
    color: 'bg-rose-600'
  },
  { 
    name: 'Testosterone Support', 
    slug: 'testosterone-support',
    description: 'Natural testosterone boosting supplements',
    icon: '👑',
    color: 'bg-violet-600'
  },
  { 
    name: 'Vitamins & Minerals', 
    slug: 'vitamins-minerals',
    description: 'Essential vitamins and minerals for health',
    icon: '💎',
    color: 'bg-gray-600'
  },
  { 
    name: 'Weight Management', 
    slug: 'weight-management',
    description: 'Supplements to support healthy weight management',
    icon: '⚖️',
    color: 'bg-blue-700'
  },
  { 
    name: 'Whey Protein', 
    slug: 'whey-protein',
    description: 'Fast-absorbing whey protein for muscle building',
    icon: '🥛',
    color: 'bg-green-700'
  }
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchQuery]);

  // Add structured data
  useEffect(() => {
    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Categories', url: '/categories' },
    ]);

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50">
        <div className="container py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Product Categories
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Explore our complete range of sports supplements and nutrition products. 
              All products are sourced from premium suppliers and updated automatically.
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <Link key={category.slug} href={`/products?category=${encodeURIComponent(category.name)}`}>
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/20">
                <CardHeader className="pb-3">
                  <div className={`w-16 h-16 rounded-xl ${category.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm text-muted-foreground mb-4">
                    {category.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      View Products
                    </Badge>
                    <svg 
                      className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold mb-2">No categories found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your search terms
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="border-t bg-muted/20">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Product Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">Products Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">6hrs</div>
              <div className="text-sm text-muted-foreground">Auto-Update Frequency</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}