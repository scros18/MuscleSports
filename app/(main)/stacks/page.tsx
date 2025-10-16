"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DynamicPageTitle } from "@/components/dynamic-page-title";
import { Package, TrendingUp, Zap, Heart, Award, ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";

interface ProductStack {
  id: string;
  name: string;
  description: string;
  goal: string;
  products: {
    name: string;
    size: string;
    price: number;
  }[];
  originalPrice: number;
  stackPrice: number;
  savings: number;
  icon: any;
  color: string;
  benefits: string[];
}

export default function StacksPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [currentTheme, setCurrentTheme] = useState("ordify");

  useEffect(() => {
    const detectTheme = () => {
      const classList = document.documentElement.classList;
      if (classList.contains('theme-musclesports')) return 'musclesports';
      if (classList.contains('theme-vera')) return 'vera';
      return 'ordify';
    };
    
    setCurrentTheme(detectTheme());
    const observer = new MutationObserver(() => setCurrentTheme(detectTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const stacks: ProductStack[] = [
    {
      id: "muscle-gain-stack",
      name: "Muscle Building Stack",
      description: "Everything you need to pack on lean muscle mass",
      goal: "Build Muscle",
      products: [
        { name: "Whey Protein Isolate", size: "2.5kg", price: 45.99 },
        { name: "Creatine Monohydrate", size: "500g", price: 19.99 },
        { name: "Pre-Workout", size: "450g", price: 29.99 },
        { name: "BCAAs", size: "500g", price: 24.99 }
      ],
      originalPrice: 120.96,
      stackPrice: 99.99,
      savings: 20.97,
      icon: TrendingUp,
      color: "green",
      benefits: [
        "25g protein per serving",
        "5g creatine for strength gains",
        "Enhanced workout performance",
        "Faster muscle recovery"
      ]
    },
    {
      id: "fat-loss-stack",
      name: "Fat Loss Stack",
      description: "Accelerate fat burning while preserving muscle",
      goal: "Lose Fat",
      products: [
        { name: "Whey Protein", size: "2kg", price: 39.99 },
        { name: "Fat Burner", size: "90 caps", price: 34.99 },
        { name: "L-Carnitine", size: "500ml", price: 24.99 },
        { name: "CLA", size: "180 softgels", price: 19.99 }
      ],
      originalPrice: 119.96,
      stackPrice: 94.99,
      savings: 24.97,
      icon: Zap,
      color: "orange",
      benefits: [
        "Boost metabolism naturally",
        "Maintain muscle during cutting",
        "Enhanced fat oxidation",
        "Appetite control support"
      ]
    },
    {
      id: "performance-stack",
      name: "Performance Stack",
      description: "Maximize strength, power, and endurance",
      goal: "Boost Performance",
      products: [
        { name: "Pre-Workout Extreme", size: "500g", price: 39.99 },
        { name: "Creatine + Beta-Alanine", size: "600g", price: 29.99 },
        { name: "Intra-Workout", size: "900g", price: 34.99 },
        { name: "Post-Workout", size: "1.8kg", price: 44.99 }
      ],
      originalPrice: 149.96,
      stackPrice: 119.99,
      savings: 29.97,
      icon: Award,
      color: "blue",
      benefits: [
        "Explosive power output",
        "Delay muscle fatigue",
        "Enhanced endurance",
        "Optimal recovery"
      ]
    },
    {
      id: "health-stack",
      name: "Complete Health Stack",
      description: "Essential vitamins and minerals for overall wellness",
      goal: "General Health",
      products: [
        { name: "Multivitamin", size: "120 caps", price: 24.99 },
        { name: "Omega-3", size: "180 softgels", price: 19.99 },
        { name: "Vitamin D3", size: "365 caps", price: 14.99 },
        { name: "Probiotics", size: "60 caps", price: 29.99 }
      ],
      originalPrice: 89.96,
      stackPrice: 69.99,
      savings: 19.97,
      icon: Heart,
      color: "pink",
      benefits: [
        "Complete nutritional support",
        "Immune system boost",
        "Heart & brain health",
        "Digestive wellness"
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, any> = {
      green: {
        bg: "from-green-500 to-emerald-600",
        text: "text-green-600",
        badge: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400",
        button: "bg-green-600 hover:bg-green-700"
      },
      orange: {
        bg: "from-orange-500 to-red-600",
        text: "text-orange-600",
        badge: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400",
        button: "bg-orange-600 hover:bg-orange-700"
      },
      blue: {
        bg: "from-blue-500 to-indigo-600",
        text: "text-blue-600",
        badge: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
        button: "bg-blue-600 hover:bg-blue-700"
      },
      pink: {
        bg: "from-pink-500 to-rose-600",
        text: "text-pink-600",
        badge: "bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-400",
        button: "bg-pink-600 hover:bg-pink-700"
      }
    };
    return colors[color] || colors.green;
  };

  return (
    <>
      <DynamicPageTitle pageTitle="Product Stacks - Pre-Built Supplement Bundles" />
      
      <div className="container py-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2">
            <Package className="w-4 h-4 mr-2" />
            Pre-Built Stacks
          </Badge>
          
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r ${
            currentTheme === 'musclesports'
              ? 'from-green-600 to-emerald-600'
              : currentTheme === 'vera'
              ? 'from-orange-600 to-red-600'
              : 'from-blue-600 to-indigo-600'
          } bg-clip-text text-transparent`}>
            Expert Supplement Stacks
          </h1>
          
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-6">
            Save big with our pre-built supplement stacks, scientifically formulated for maximum results. Each stack is designed to work synergistically for your specific goals.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-card border rounded-lg px-4 py-2">
              <Award className="w-5 h-5 text-green-600" />
              <span className="font-semibold">Expert Formulated</span>
            </div>
            <div className="flex items-center gap-2 bg-card border rounded-lg px-4 py-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">Up to 25% Savings</span>
            </div>
            <div className="flex items-center gap-2 bg-card border rounded-lg px-4 py-2">
              <Package className="w-5 h-5 text-purple-600" />
              <span className="font-semibold">All-In-One Solution</span>
            </div>
          </div>
        </div>

        {/* Product Stacks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {stacks.map((stack) => {
            const colors = getColorClasses(stack.color);
            const Icon = stack.icon;

            return (
              <div
                key={stack.id}
                className="group bg-card border-2 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${colors.bg} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="w-7 h-7" />
                      </div>
                      <Badge className="bg-white/20 text-white border-white/30">
                        Save £{stack.savings.toFixed(2)}
                      </Badge>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{stack.name}</h3>
                    <p className="text-white/90 text-sm md:text-base">{stack.description}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Products List */}
                  <div className="mb-6">
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <Package className={`w-5 h-5 ${colors.text}`} />
                      What&apos;s Included:
                    </h4>
                    <div className="space-y-2">
                      {stack.products.map((product, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <Check className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
                            <span className="font-medium">{product.name}</span>
                          </div>
                          <span className="text-muted-foreground text-xs">{product.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-6">
                    <h4 className="font-bold mb-3">Key Benefits:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {stack.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full ${colors.text} mt-1.5 flex-shrink-0`}></div>
                          <span className="text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="border-t pt-6">
                    <div className="flex items-baseline gap-3 mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Stack Price:</div>
                        <div className="text-3xl md:text-4xl font-bold">£{stack.stackPrice.toFixed(2)}</div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground line-through">Was £{stack.originalPrice.toFixed(2)}</div>
                        <Badge className={colors.badge}>
                          Save {Math.round((stack.savings / stack.originalPrice) * 100)}%
                        </Badge>
                      </div>
                    </div>

                    <Button 
                      className={`w-full ${colors.button} text-white font-bold py-6 text-lg group-hover:scale-105 transition-transform`}
                      onClick={() => {
                        // In real implementation, add entire stack to cart
                        alert(`Adding ${stack.name} to cart!`);
                      }}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add Stack to Cart
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-8 md:p-12 text-center border-2 border-green-200 dark:border-green-800">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Need a Custom Stack?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Not sure which stack is right for you? Take our Supplement Finder quiz to get personalized recommendations based on your specific goals.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => router.push('/supplement-finder')}
            >
              Take the Quiz
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push('/products')}
            >
              Browse All Products
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

