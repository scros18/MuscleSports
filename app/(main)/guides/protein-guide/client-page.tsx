"use client";

import { useState } from "react";
import { Beef, TrendingUp, Zap, Clock, AlertCircle, CheckCircle, ShoppingBag, Target, Award, Apple } from "lucide-react";
import Link from "next/link";

export default function ProteinGuideClientPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'science',
      title: 'Why Protein Matters',
      icon: Target,
      color: 'from-blue-600 to-indigo-600',
      gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20',
      border: 'border-blue-200 dark:border-blue-800'
    },
    {
      id: 'howmuch',
      title: 'How Much Protein',
      icon: TrendingUp,
      color: 'from-green-600 to-emerald-600',
      gradient: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
      border: 'border-green-200 dark:border-green-800'
    },
    {
      id: 'timing',
      title: 'Protein Timing',
      icon: Clock,
      color: 'from-purple-600 to-pink-600',
      gradient: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
      border: 'border-purple-200 dark:border-purple-800'
    },
    {
      id: 'sources',
      title: 'Best Protein Sources',
      icon: Beef,
      color: 'from-red-600 to-orange-600',
      gradient: 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20',
      border: 'border-red-200 dark:border-red-800'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-blue-950/20 py-12">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <Beef className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">COMPLETE GUIDE</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-saira bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            The Complete Protein Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-4">
            Everything you need to know about protein: how much, when, what type, and why it&apos;s the most important macronutrient for building muscle and losing fat.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <div className="px-6 py-3 bg-white dark:bg-card rounded-xl shadow-lg border-2 border-blue-200 dark:border-blue-800">
              <div className="text-3xl font-bold text-blue-600">1.6-2.2g</div>
              <div className="text-sm text-muted-foreground">Per kg bodyweight</div>
            </div>
            <div className="px-6 py-3 bg-white dark:bg-card rounded-xl shadow-lg border-2 border-indigo-200 dark:border-indigo-800">
              <div className="text-3xl font-bold text-indigo-600">20-40g</div>
              <div className="text-sm text-muted-foreground">Per meal optimal</div>
            </div>
            <div className="px-6 py-3 bg-white dark:bg-card rounded-xl shadow-lg border-2 border-purple-200 dark:border-purple-800">
              <div className="text-3xl font-bold text-purple-600">3-5</div>
              <div className="text-sm text-muted-foreground">Meals per day</div>
            </div>
          </div>
        </div>

        {/* Key Facts */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-16 text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Award className="w-8 h-8" />
            Why Protein is King
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Builds & Repairs Muscle', desc: 'Protein provides amino acids—the building blocks your body uses to repair and grow muscle tissue after training.' },
              { title: 'Highest Satiety', desc: 'Protein keeps you fuller longer than carbs or fats. High protein diets make fat loss easier by reducing hunger.' },
              { title: 'Thermic Effect', desc: 'Your body burns 20-30% of protein calories just digesting it (vs 5-10% for carbs, 0-3% for fats).' }
            ].map((fact, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold mb-3">
                  {index + 1}
                </div>
                <h3 className="font-bold text-xl mb-2">{fact.title}</h3>
                <p className="text-white/90">{fact.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Sections */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <div
                key={section.id}
                className={`${section.gradient} rounded-2xl p-8 border-2 ${section.border} shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer ${isActive ? 'scale-105' : ''}`}
                onClick={() => setActiveSection(isActive ? null : section.id)}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold font-saira">{section.title}</h2>
                </div>

                {section.id === 'science' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Protein is made up of 20 amino acids. 9 are &quot;essential&quot;—your body can&apos;t make them, so you must get them from food. Complete proteins contain all 9 essential amino acids.
                    </p>

                    <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                      <h3 className="font-bold text-lg mb-4">What Happens When You Eat Protein</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                            1
                          </div>
                          <div>
                            <div className="font-semibold">Digestion (1-4 hours)</div>
                            <div className="text-sm text-muted-foreground">Broken down into amino acids in stomach and intestines</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                            2
                          </div>
                          <div>
                            <div className="font-semibold">Absorption</div>
                            <div className="text-sm text-muted-foreground">Amino acids enter bloodstream and travel to muscles</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                            3
                          </div>
                          <div>
                            <div className="font-semibold">Muscle Protein Synthesis</div>
                            <div className="text-sm text-muted-foreground">Body uses amino acids to repair and build new muscle tissue</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-4 border-l-4 border-blue-600">
                      <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-2">📊 Muscle Protein Synthesis (MPS):</h3>
                      <p className="text-sm text-muted-foreground">
                        MPS is elevated for 2-5 hours after eating protein. This is why eating protein regularly throughout the day maximizes muscle growth.
                      </p>
                    </div>
                  </div>
                )}

                {section.id === 'howmuch' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      The &quot;optimal&quot; protein intake depends on your goals, training status, and whether you&apos;re bulking or cutting. Here are evidence-based recommendations.
                    </p>

                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-xl">
                      <h3 className="font-bold text-xl mb-4">Protein Targets by Goal</h3>
                      <div className="space-y-3">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                          <div className="font-semibold mb-1">Building Muscle (Bulking)</div>
                          <div className="text-sm text-white/90">1.6-2.2g per kg bodyweight</div>
                          <div className="text-xs text-white/70 mt-1">Example: 80kg person = 128-176g daily</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                          <div className="font-semibold mb-1">Losing Fat (Cutting)</div>
                          <div className="text-sm text-white/90">1.8-2.4g per kg bodyweight</div>
                          <div className="text-xs text-white/70 mt-1">Higher protein prevents muscle loss in deficit</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                          <div className="font-semibold mb-1">Maintenance / General Health</div>
                          <div className="text-sm text-white/90">1.2-1.6g per kg bodyweight</div>
                          <div className="text-xs text-white/70 mt-1">Minimum for active individuals</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-4 border-l-4 border-green-600">
                      <h3 className="font-bold text-green-900 dark:text-green-400 mb-2">✅ Simple Rule of Thumb:</h3>
                      <p className="text-sm">
                        <strong>2g per kg bodyweight</strong> is ideal for most active people who train regularly. It&apos;s high enough to maximize muscle growth/retention, but not excessively high.
                      </p>
                    </div>

                    <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-4 border-l-4 border-red-600">
                      <h3 className="font-bold text-red-900 dark:text-red-400 mb-2">❌ Myth: Too Much Protein Damages Kidneys</h3>
                      <p className="text-sm">
                        FALSE for healthy individuals. Studies show 2-3g/kg is perfectly safe for people with normal kidney function. Only those with pre-existing kidney disease need to limit protein.
                      </p>
                    </div>
                  </div>
                )}

                {section.id === 'timing' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      While total daily protein matters most, strategic timing can optimize muscle protein synthesis and recovery.
                    </p>

                    <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-purple-600" />
                        Optimal Protein Distribution
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                          <div className="font-semibold text-purple-900 dark:text-purple-400 mb-2">Option 1: 4 Meals</div>
                          <div className="text-sm text-muted-foreground">
                            Breakfast: 40g | Lunch: 40g | Dinner: 40g | Snack: 30g
                          </div>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                          <div className="font-semibold text-purple-900 dark:text-purple-400 mb-2">Option 2: 3 Meals + Shake</div>
                          <div className="text-sm text-muted-foreground">
                            Breakfast: 35g | Lunch: 45g | Post-workout shake: 30g | Dinner: 50g
                          </div>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                          <div className="font-semibold text-purple-900 dark:text-purple-400 mb-2">Option 3: OMAD/IF (Advanced)</div>
                          <div className="text-sm text-muted-foreground">
                            2 large meals in eating window: 75g + 75g (works but not optimal)
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-4 border-l-4 border-purple-600">
                      <h3 className="font-bold text-purple-900 dark:text-purple-400 mb-2">The Anabolic Window (Post-Workout):</h3>
                      <p className="text-sm mb-2">
                        The &quot;30-minute window&quot; is largely a myth. You have 3-4 hours post-workout to consume protein. As long as you had protein 3-4 hours before training, the urgency is minimal.
                      </p>
                      <p className="text-sm font-semibold">
                        💡 Practical tip: Have protein within 2 hours post-workout for peace of mind.
                      </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                      <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-2">Before Bed Protein:</h3>
                      <p className="text-sm">
                        Casein protein or Greek yogurt before bed provides slow-release amino acids overnight, supporting muscle recovery during sleep. Not essential but beneficial.
                      </p>
                    </div>
                  </div>
                )}

                {section.id === 'sources' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Not all protein sources are created equal. Here&apos;s a breakdown of the best options for muscle growth and overall health.
                    </p>

                    <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-red-600" />
                        Top 10 Protein Sources (Ranked)
                      </h3>
                      <div className="space-y-2">
                        {[
                          { name: 'Chicken Breast', protein: '31g per 100g', quality: 'Complete, lean, versatile' },
                          { name: 'Whey Protein', protein: '24g per scoop', quality: 'Fast-digesting, complete, convenient' },
                          { name: 'Eggs', protein: '13g per 2 eggs', quality: 'Complete, bioavailable, nutrient-dense' },
                          { name: 'Greek Yogurt (0% fat)', protein: '10g per 100g', quality: 'Complete, high satiety, probiotics' },
                          { name: 'Lean Beef', protein: '26g per 100g', quality: 'Complete, high in iron & zinc' },
                          { name: 'Salmon', protein: '25g per 100g', quality: 'Complete, omega-3s, vitamin D' },
                          { name: 'Cottage Cheese', protein: '12g per 100g', quality: 'Casein-rich (slow-digesting)' },
                          { name: 'Lentils', protein: '9g per 100g cooked', quality: 'Plant-based, fiber-rich' },
                          { name: 'Tofu', protein: '8g per 100g', quality: 'Plant-based, versatile' },
                          { name: 'Protein Bars', protein: '15-20g per bar', quality: 'Convenient, check sugar content' }
                        ].map((source, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                            <div>
                              <div className="font-semibold text-sm">{idx + 1}. {source.name}</div>
                              <div className="text-xs text-muted-foreground">{source.quality}</div>
                            </div>
                            <div className="text-sm font-bold text-red-600 dark:text-red-400">
                              {source.protein}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-4 border-l-4 border-green-600">
                      <h3 className="font-bold text-green-900 dark:text-green-400 mb-2">Complete vs Incomplete Proteins:</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Complete:</strong> Animal sources (meat, dairy, eggs) + quinoa, soy</li>
                        <li>• <strong>Incomplete:</strong> Most plant sources (combine beans + rice, etc.)</li>
                        <li>• <strong>For muscle building:</strong> Complete proteins are superior but incomplete can work if varied</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 text-center text-white shadow-xl">
                      <h3 className="text-xl font-bold mb-2">Shop Premium Protein Supplements</h3>
                      <p className="text-white/90 mb-4">Whey, casein, and plant-based options</p>
                      <Link
                        href="/products?category=Protein+Powders"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 font-bold rounded-xl hover:bg-gray-100 transition-all"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        View Protein Products
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sample Day */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Sample High-Protein Day (150g total)
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-xl mb-2">Breakfast</h3>
              <p className="text-sm text-white/90 mb-3">3 scrambled eggs + 2 slices toast + Greek yogurt</p>
              <div className="text-2xl font-bold text-blue-300">35g</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-xl mb-2">Lunch</h3>
              <p className="text-sm text-white/90 mb-3">200g chicken breast + rice + vegetables</p>
              <div className="text-2xl font-bold text-blue-300">50g</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-xl mb-2">Snack</h3>
              <p className="text-sm text-white/90 mb-3">Whey protein shake + banana</p>
              <div className="text-2xl font-bold text-blue-300">25g</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-xl mb-2">Dinner</h3>
              <p className="text-sm text-white/90 mb-3">200g salmon + sweet potato + broccoli</p>
              <div className="text-2xl font-bold text-blue-300">40g</div>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-white/90">
              This provides <strong>150g protein</strong> spread across 4 meals for optimal muscle protein synthesis throughout the day.
            </p>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-amber-100 dark:bg-amber-900/30 rounded-2xl p-8 border-2 border-amber-300 dark:border-amber-700">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-amber-900 dark:text-amber-400 mb-3">
                The Bottom Line
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Protein is the single most important macronutrient for body composition. Whether your goal is building muscle or losing fat, hitting your protein target daily is non-negotiable.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Aim for <strong>1.6-2.2g per kg bodyweight</strong>, spread across 3-5 meals, and prioritize complete protein sources. Everything else is secondary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


