"use client";

import { useState } from "react";
import { Scale, TrendingDown, Apple, Activity, Brain, Target, AlertCircle, CheckCircle, ShoppingBag, Flame, Clock } from "lucide-react";
import Link from "next/link";

export default function WeightLossGuideClient() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'deficit',
      title: 'Creating a Caloric Deficit',
      icon: TrendingDown,
      color: 'from-blue-600 to-cyan-600',
      gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
      border: 'border-blue-200 dark:border-blue-800'
    },
    {
      id: 'nutrition',
      title: 'Fat Loss Nutrition',
      icon: Apple,
      color: 'from-green-600 to-emerald-600',
      gradient: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
      border: 'border-green-200 dark:border-green-800'
    },
    {
      id: 'training',
      title: 'Exercise for Fat Loss',
      icon: Activity,
      color: 'from-red-600 to-orange-600',
      gradient: 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20',
      border: 'border-red-200 dark:border-red-800'
    },
    {
      id: 'mindset',
      title: 'Psychology & Sustainability',
      icon: Brain,
      color: 'from-purple-600 to-pink-600',
      gradient: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
      border: 'border-purple-200 dark:border-purple-800'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-blue-950/20 py-12">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <Scale className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">SCIENCE-BASED APPROACH</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-saira bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent">
            The Ultimate Weight Loss Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-4">
            Lose fat sustainably with evidence-based strategies. No gimmicks, no quick fixes—just proven methods that actually work long-term.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <div className="px-6 py-3 bg-white dark:bg-card rounded-xl shadow-lg border-2 border-blue-200 dark:border-blue-800">
              <div className="text-3xl font-bold text-blue-600">0.5-1%</div>
              <div className="text-sm text-muted-foreground">Body weight/week</div>
            </div>
            <div className="px-6 py-3 bg-white dark:bg-card rounded-xl shadow-lg border-2 border-cyan-200 dark:border-cyan-800">
              <div className="text-3xl font-bold text-cyan-600">10-20%</div>
              <div className="text-sm text-muted-foreground">Calorie deficit</div>
            </div>
            <div className="px-6 py-3 bg-white dark:bg-card rounded-xl shadow-lg border-2 border-teal-200 dark:border-teal-800">
              <div className="text-3xl font-bold text-teal-600">1.6-2.4g</div>
              <div className="text-sm text-muted-foreground">Protein/kg/day</div>
            </div>
          </div>
        </div>

        {/* Key Truths */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 mb-16 text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Target className="w-8 h-8" />
            3 Undeniable Fat Loss Truths
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Caloric Deficit is King', desc: 'You MUST consume fewer calories than you burn. No supplement, diet, or workout can bypass this law of thermodynamics.' },
              { title: 'Protein Preserves Muscle', desc: 'High protein (1.6-2.4g/kg) prevents muscle loss during fat loss. Losing muscle tanks your metabolism.' },
              { title: 'Consistency Beats Perfection', desc: 'An 80% adherence rate over 6 months beats 100% adherence for 2 weeks. Sustainability is everything.' }
            ].map((truth, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold mb-3">
                  {index + 1}
                </div>
                <h3 className="font-bold text-xl mb-2">{truth.title}</h3>
                <p className="text-white/90">{truth.desc}</p>
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

                {section.id === 'deficit' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Fat loss is simple physics: consume fewer calories than you expend. The challenge isn&apos;t understanding it—it&apos;s implementing it sustainably.
                    </p>

                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-xl">
                      <h3 className="font-bold text-xl mb-4">Calculate Your Deficit</h3>
                      <div className="space-y-3">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">Step 1: Find Maintenance</div>
                          <div className="text-sm text-white/90">Bodyweight (kg) × 33 = rough maintenance calories</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">Step 2: Create Deficit</div>
                          <div className="text-sm text-white/90">Subtract 10-20% (300-500 calories for most people)</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">Step 3: Track & Adjust</div>
                          <div className="text-sm text-white/90">Weigh daily, take weekly average. Adjust if not losing 0.5-1% per week</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-4 border-l-4 border-red-600">
                      <h3 className="font-bold text-red-900 dark:text-red-400 mb-2">⚠️ Avoid These Mistakes:</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• Too aggressive deficit (&gt;25%) = muscle loss + binges</li>
                        <li>• Not tracking calories = guessing (usually wrong)</li>
                        <li>• Weighing once per week = unreliable data</li>
                        <li>• Ignoring water weight fluctuations (±2kg is normal)</li>
                      </ul>
                    </div>
                  </div>
                )}

                {section.id === 'nutrition' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      What you eat matters just as much as how much. Prioritize protein, fiber, and whole foods to stay full and preserve muscle while losing fat.
                    </p>

                    <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-4 border-l-4 border-green-600">
                      <h3 className="font-bold text-green-900 dark:text-green-400 mb-2">✅ Fat Loss Macros:</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• <strong>Protein: 1.6-2.4g per kg bodyweight</strong> (highest priority - preserves muscle)</li>
                        <li>• <strong>Fats: 20-30% of total calories</strong> (essential for hormones)</li>
                        <li>• <strong>Carbs: Remaining calories</strong> (fuel for workouts)</li>
                        <li>• <strong>Fiber: 25-35g daily</strong> (keeps you full longer)</li>
                      </ul>
                    </div>

                    <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Apple className="w-5 h-5 text-green-600" />
                        High-Satiety Foods (Stay Fuller Longer)
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          'Lean chicken breast',
                          'Greek yogurt (0% fat)',
                          'Egg whites',
                          'White fish (cod, tilapia)',
                          'Vegetables (unlimited)',
                          'Potatoes (boiled)',
                          'Oatmeal',
                          'Berries'
                        ].map((food, idx) => (
                          <div key={idx} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-sm">
                            ✓ {food}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-4 border-l-4 border-red-600">
                      <h3 className="font-bold text-red-900 dark:text-red-400 mb-2">❌ Limit These (Calorie Dense, Low Satiety):</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• Oils & butter (easy to overconsume)</li>
                        <li>• Nuts & nut butters (measure portions!)</li>
                        <li>• Alcohol (7 cals/gram + reduces fat burning)</li>
                        <li>• Sugary drinks (liquid calories don&apos;t fill you up)</li>
                      </ul>
                    </div>
                  </div>
                )}

                {section.id === 'training' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      You can&apos;t out-train a bad diet, but strategic exercise accelerates fat loss and preserves muscle. Here&apos;s the optimal approach.
                    </p>

                    <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-red-600" />
                        Training Priority Pyramid
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-4">
                          <div className="font-bold text-red-900 dark:text-red-400 mb-1">1. Strength Training (3-5x/week)</div>
                          <div className="text-sm text-muted-foreground">Preserve muscle mass with progressive overload. Focus on compounds.</div>
                        </div>
                        <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-4">
                          <div className="font-bold text-orange-900 dark:text-orange-400 mb-1">2. Daily Steps (8,000-12,000)</div>
                          <div className="text-sm text-muted-foreground">NEAT (Non-Exercise Activity) burns massive calories with minimal fatigue.</div>
                        </div>
                        <div className="bg-amber-100 dark:bg-amber-900/30 rounded-lg p-4">
                          <div className="font-bold text-amber-900 dark:text-amber-400 mb-1">3. Optional: Cardio (2-3x/week)</div>
                          <div className="text-sm text-muted-foreground">HIIT or steady-state for extra calorie burn. Not mandatory if steps are high.</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-400">
                        💡 Pro Tip: Prioritize strength training over cardio during fat loss. Lifting weights signals your body to keep muscle. Excessive cardio signals it to get rid of metabolically expensive tissue (your muscles).
                      </p>
                    </div>
                  </div>
                )}

                {section.id === 'mindset' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Fat loss is 80% psychology. Master your mindset and environment, and the physical results will follow.
                    </p>

                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-xl">
                      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                        <Brain className="w-6 h-6" />
                        Sustainable Fat Loss Mindset
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">Think in Months, Not Weeks</div>
                          <div className="text-sm text-white/90">Losing 10kg properly takes 12-20 weeks. Rush it = regain it.</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">Use the 80/20 Rule</div>
                          <div className="text-sm text-white/90">80% whole foods, 20% flexibility. Perfectionism causes burnout.</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">Control Your Environment</div>
                          <div className="text-sm text-white/90">Don&apos;t keep trigger foods at home. Make good choices the default.</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-4 border-l-4 border-purple-600">
                      <h3 className="font-bold text-purple-900 dark:text-purple-400 mb-2">Success Strategies:</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Track progress beyond the scale:</strong> photos, measurements, strength</li>
                        <li>• <strong>Plan diet breaks:</strong> 1-2 weeks at maintenance every 8-12 weeks</li>
                        <li>• <strong>Find protein-rich foods you enjoy</strong> (crucial for adherence)</li>
                        <li>• <strong>Build habits, not rely on motivation</strong> (it fades)</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 16-Week Plan */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            16-Week Fat Loss Transformation
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4 mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Weeks 1-4</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>✓ Establish calorie deficit</li>
                <li>✓ Track everything you eat</li>
                <li>✓ Start lifting 3-4x/week</li>
                <li>✓ Hit 8,000+ steps daily</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4 mx-auto">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Weeks 5-8</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>✓ Losing 0.5-1kg/week</li>
                <li>✓ Increase steps to 10,000+</li>
                <li>✓ Refine food choices</li>
                <li>✓ Maintain lifting performance</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4 mx-auto">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Weeks 9-12</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>✓ Take 1-week diet break</li>
                <li>✓ Eat at maintenance</li>
                <li>✓ Restore energy levels</li>
                <li>✓ Then resume deficit</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4 mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Weeks 13-16</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>✓ Final push to goal</li>
                <li>✓ Visible abs emerging</li>
                <li>✓ Plan reverse diet</li>
                <li>✓ Transition to maintenance</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg mb-4 text-white/90">
              Expect to lose <strong>6-12kg of fat</strong> while maintaining muscle mass following this sustainable approach.
            </p>
          </div>
        </div>

        {/* Fat Loss Supplements */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 text-white shadow-2xl mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Fat Loss Supplements (Optional Boosters)</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-xl mb-2">Caffeine</h3>
              <p className="text-sm text-white/90 mb-3">Increases metabolism 3-11%, suppresses appetite, boosts workout performance.</p>
              <div className="text-xs bg-green-900/30 text-green-200 px-2 py-1 rounded inline-block">
                200-400mg daily
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-xl mb-2">Protein Powder</h3>
              <p className="text-sm text-white/90 mb-3">Helps hit protein targets. High satiety per calorie. Prevents muscle loss.</p>
              <div className="text-xs bg-green-900/30 text-green-200 px-2 py-1 rounded inline-block">
                1-2 scoops/day
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-xl mb-2">Multivitamin</h3>
              <p className="text-sm text-white/90 mb-3">Prevents micronutrient deficiencies during calorie restriction.</p>
              <div className="text-xs bg-green-900/30 text-green-200 px-2 py-1 rounded inline-block">
                1 per day
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="/products?search=protein"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-100 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              Shop Fat Loss Supplements
            </Link>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-amber-100 dark:bg-amber-900/30 rounded-2xl p-8 border-2 border-amber-300 dark:border-amber-700">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-amber-900 dark:text-amber-400 mb-3">
                Reality Check: No Magic Pills
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Fat loss supplements might contribute 5-10% extra fat loss at most. The real work is diet and training consistency. Anyone selling a &quot;miracle fat burner&quot; is lying to you.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Focus on the fundamentals: caloric deficit, high protein, strength training, and daily steps. These account for 90%+ of your results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
