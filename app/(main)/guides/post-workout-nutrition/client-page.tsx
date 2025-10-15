"use client";

import { useState } from "react";
import { Apple, Clock, Zap, TrendingUp, AlertCircle, CheckCircle, ShoppingBag, Award, Droplets, Flame } from "lucide-react";
import Link from "next/link";

export default function PostWorkoutNutritionClientPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'window',
      title: 'The Anabolic Window',
      icon: Clock,
      color: 'from-blue-600 to-cyan-600',
      gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
      border: 'border-blue-200 dark:border-blue-800'
    },
    {
      id: 'protein',
      title: 'Post-Workout Protein',
      icon: Zap,
      color: 'from-red-600 to-orange-600',
      gradient: 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20',
      border: 'border-red-200 dark:border-red-800'
    },
    {
      id: 'carbs',
      title: 'Carbohydrate Replenishment',
      icon: Flame,
      color: 'from-green-600 to-emerald-600',
      gradient: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
      border: 'border-green-200 dark:border-green-800'
    },
    {
      id: 'supplements',
      title: 'Recovery Supplements',
      icon: Droplets,
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
            <Apple className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">MAXIMIZE RECOVERY & GROWTH</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-saira bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent">
            Post-Workout Nutrition Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-4">
            Optimize your post-workout nutrition for maximum muscle growth and recovery. Learn what to eat, when to eat it, and which supplements actually work. Shop premium recovery supplements at <strong>MuscleSports UK</strong>.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <div className="px-6 py-3 bg-white dark:bg-card rounded-xl shadow-lg border-2 border-blue-200 dark:border-blue-800">
              <div className="text-3xl font-bold text-blue-600">20-40g</div>
              <div className="text-sm text-muted-foreground">Protein needed</div>
            </div>
            <div className="px-6 py-3 bg-white dark:bg-card rounded-xl shadow-lg border-2 border-cyan-200 dark:border-cyan-800">
              <div className="text-3xl font-bold text-cyan-600">0.5-1g/kg</div>
              <div className="text-sm text-muted-foreground">Carbs for recovery</div>
            </div>
            <div className="px-6 py-3 bg-white dark:bg-card rounded-xl shadow-lg border-2 border-teal-200 dark:border-teal-800">
              <div className="text-3xl font-bold text-teal-600">0-2hrs</div>
              <div className="text-sm text-muted-foreground">Optimal window</div>
            </div>
          </div>
        </div>

        {/* Key Principles */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 mb-16 text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Award className="w-8 h-8" />
            Why Post-Workout Nutrition Matters
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Muscle Protein Synthesis', desc: 'Training breaks down muscle. Post-workout protein provides amino acids to rebuild stronger.' },
              { title: 'Glycogen Replenishment', desc: 'Hard training depletes muscle glycogen (stored carbs). Refilling it speeds recovery for next session.' },
              { title: 'Reduced Muscle Breakdown', desc: 'Post-workout nutrition shifts your body from catabolic (breakdown) to anabolic (growth) state.' }
            ].map((principle, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold mb-3">
                  {index + 1}
                </div>
                <h3 className="font-bold text-xl mb-2">{principle.title}</h3>
                <p className="text-white/90">{principle.desc}</p>
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

                {section.id === 'window' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      The &quot;anabolic window&quot; is one of the most debated topics in fitness. Here&apos;s what the latest research actually shows.
                    </p>

                    <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        The Truth About Timing
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4 border-l-4 border-green-500">
                          <div className="font-bold text-green-900 dark:text-green-400 mb-2">✅ What We Know:</div>
                          <ul className="space-y-1 text-sm">
                            <li>• Post-workout nutrition IS important for recovery</li>
                            <li>• Muscle protein synthesis is elevated 24-48 hours post-training</li>
                            <li>• Earlier is better than later (0-2 hours optimal)</li>
                            <li>• The &quot;window&quot; is 3-4 hours, not 30 minutes</li>
                          </ul>
                        </div>

                        <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-4 border-l-4 border-red-500">
                          <div className="font-bold text-red-900 dark:text-red-400 mb-2">❌ Myth Debunked:</div>
                          <p className="text-sm">
                            The old &quot;30-minute window or your gains disappear&quot; is WRONG. If you ate protein 3-4 hours before training, you have several hours post-workout to refuel.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-4 border-l-4 border-blue-600">
                      <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-2">📋 Practical Guidelines:</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Trained fasted:</strong> Eat within 30-60 minutes (more urgent)</li>
                        <li>• <strong>Had pre-workout meal:</strong> Within 2-3 hours is fine</li>
                        <li>• <strong>Long session (&gt;90 min):</strong> Sooner is better</li>
                        <li>• <strong>Short session (&lt;45 min):</strong> Less urgent</li>
                      </ul>
                    </div>
                  </div>
                )}

                {section.id === 'protein' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Post-workout protein is the cornerstone of recovery. Here&apos;s exactly how much you need and what type works best.
                    </p>

                    <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 text-white shadow-xl">
                      <h3 className="font-bold text-xl mb-4">Optimal Post-Workout Protein</h3>
                      <div className="space-y-3">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                          <div className="font-semibold mb-1">Amount: 20-40g</div>
                          <div className="text-sm text-white/90">
                            20g minimum to maximize muscle protein synthesis. 40g optimal for larger individuals (&gt;90kg) or hard sessions.
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                          <div className="font-semibold mb-1">Type: Fast-Digesting Protein</div>
                          <div className="text-sm text-white/90">
                            Whey protein is ideal—absorbed within 30-60 minutes. Whole food works too but digests slower.
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                          <div className="font-semibold mb-1">Leucine Content: 2-3g</div>
                          <div className="text-sm text-white/90">
                            Leucine triggers muscle protein synthesis. Whey is naturally high in leucine.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                      <h3 className="font-bold text-lg mb-4">Best Post-Workout Protein Sources</h3>
                      <div className="space-y-2">
                        {[
                          { name: 'Whey Protein Shake', protein: '20-30g per scoop', speed: '⚡ Fast (30-60 min)', rank: '🥇 BEST' },
                          { name: 'Chicken Breast', protein: '30g per 100g', speed: '⏱️ Medium (2-3 hrs)', rank: '🥈 Great' },
                          { name: 'Eggs (4 whole)', protein: '24g', speed: '⏱️ Medium (2 hrs)', rank: '🥈 Great' },
                          { name: 'Greek Yogurt (200g)', protein: '20g', speed: '⏱️ Medium (2 hrs)', rank: '🥉 Good' },
                          { name: 'Tuna (1 can)', protein: '25g', speed: '⏱️ Medium (2-3 hrs)', rank: '🥉 Good' }
                        ].map((source, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                            <div>
                              <div className="font-semibold text-sm flex items-center gap-2">
                                <span>{source.rank}</span>
                                {source.name}
                              </div>
                              <div className="text-xs text-muted-foreground">{source.protein} • {source.speed}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-6 text-center text-white shadow-xl">
                      <h3 className="text-xl font-bold mb-2">Shop Premium Whey Protein</h3>
                      <p className="text-white/90 mb-4">Fast-absorbing recovery protein at MuscleSports UK</p>
                      <Link
                        href="/products?category=Protein+Powders"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 font-bold rounded-xl hover:bg-gray-100 transition-all"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Browse Protein Powders
                      </Link>
                    </div>
                  </div>
                )}

                {section.id === 'carbs' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Carbs refill muscle glycogen depleted during training. How much you need depends on workout intensity and your goals.
                    </p>

                    <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-green-600" />
                        Post-Workout Carb Guidelines
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4">
                          <div className="font-bold text-green-900 dark:text-green-400 mb-2">High Intensity / Bulking</div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Heavy lifting, HIIT, or muscle-building phase
                          </p>
                          <div className="text-xs bg-green-200 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-1 rounded inline-block font-semibold">
                            0.8-1.2g carbs per kg bodyweight
                          </div>
                        </div>

                        <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4">
                          <div className="font-bold text-blue-900 dark:text-blue-400 mb-2">Moderate Intensity / Maintenance</div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Standard workout, maintaining weight
                          </p>
                          <div className="text-xs bg-blue-200 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded inline-block font-semibold">
                            0.4-0.8g carbs per kg bodyweight
                          </div>
                        </div>

                        <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-4">
                          <div className="font-bold text-orange-900 dark:text-orange-400 mb-2">Fat Loss / Low Carb</div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Cutting phase or keto diet
                          </p>
                          <div className="text-xs bg-orange-200 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 px-2 py-1 rounded inline-block font-semibold">
                            0-0.3g carbs per kg (optional)
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-4 border-l-4 border-green-600">
                      <h3 className="font-bold text-green-900 dark:text-green-400 mb-2">✅ Best Post-Workout Carbs:</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>• White rice</div>
                        <div>• Sweet potato</div>
                        <div>• Oats</div>
                        <div>• Pasta</div>
                        <div>• Bananas</div>
                        <div>• Rice cakes</div>
                        <div>• Honey</div>
                        <div>• White bread</div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-400">
                        💡 Pro Tip: Add carbs to your protein shake for faster glycogen replenishment and better insulin response (helps shuttle nutrients into muscles).
                      </p>
                    </div>
                  </div>
                )}

                {section.id === 'supplements' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      These evidence-based supplements can enhance recovery when added to your post-workout nutrition. Available at <strong>MuscleSports UK</strong>.
                    </p>

                    <div className="space-y-3">
                      <div className="bg-white dark:bg-card rounded-xl p-5 shadow-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Award className="w-5 h-5 text-purple-600" />
                          </div>
                          <h3 className="font-bold text-lg">Creatine (5g)</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Replenishes phosphocreatine stores. Take daily—post-workout with carbs improves absorption.
                        </p>
                        <div className="flex gap-2">
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">Evidence: Very Strong</span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-card rounded-xl p-5 shadow-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                          </div>
                          <h3 className="font-bold text-lg">BCAAs (5-10g)</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Branched-chain amino acids reduce muscle soreness. Only useful if training fasted—otherwise get BCAAs from whey protein.
                        </p>
                        <div className="flex gap-2">
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">Evidence: Moderate</span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-card rounded-xl p-5 shadow-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <Droplets className="w-5 h-5 text-red-600" />
                          </div>
                          <h3 className="font-bold text-lg">Electrolytes</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Sodium, potassium, magnesium lost through sweat. Important for hydration and preventing cramping.
                        </p>
                        <div className="flex gap-2">
                          <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">Evidence: Strong</span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-card rounded-xl p-5 shadow-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-green-600" />
                          </div>
                          <h3 className="font-bold text-lg">L-Glutamine (5g)</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          May reduce muscle soreness and support immune function. Not essential but can help during high-volume training.
                        </p>
                        <div className="flex gap-2">
                          <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded">Evidence: Limited</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-center text-white shadow-xl">
                      <h3 className="text-xl font-bold mb-2">Recovery Supplements UK</h3>
                      <p className="text-white/90 mb-4">Creatine, BCAAs, electrolytes & more</p>
                      <Link
                        href="/products?search=recovery"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-all"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Shop Recovery Supplements
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sample Meals */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Sample Post-Workout Meals
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-xl mb-4">🥤 Quick Shake (5 min)</h3>
              <ul className="space-y-2 text-sm text-white/90 mb-4">
                <li>• 1 scoop whey protein (25g protein)</li>
                <li>• 1 banana (27g carbs)</li>
                <li>• 5g creatine</li>
                <li>• 300ml water/milk</li>
              </ul>
              <div className="text-lg font-bold border-t border-white/20 pt-3">
                ~350 calories | 30g protein | 35g carbs
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-xl mb-4">🍗 Solid Meal (20 min)</h3>
              <ul className="space-y-2 text-sm text-white/90 mb-4">
                <li>• 150g chicken breast (45g protein)</li>
                <li>• 200g white rice (50g carbs)</li>
                <li>• Vegetables</li>
                <li>• 1 tbsp olive oil</li>
              </ul>
              <div className="text-lg font-bold border-t border-white/20 pt-3">
                ~550 calories | 45g protein | 55g carbs
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-xl mb-4">🥗 Balanced Option</h3>
              <ul className="space-y-2 text-sm text-white/90 mb-4">
                <li>• 4 whole eggs (24g protein)</li>
                <li>• 2 slices toast (30g carbs)</li>
                <li>• Greek yogurt (15g protein)</li>
                <li>• Berries</li>
              </ul>
              <div className="text-lg font-bold border-t border-white/20 pt-3">
                ~500 calories | 40g protein | 40g carbs
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Schema Markup for SEO */}
        <div className="bg-white dark:bg-card rounded-2xl p-8 shadow-xl mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: "What should I eat immediately after a workout?",
                a: "Consume 20-40g of fast-digesting protein (like whey protein) and 0.4-1.2g carbs per kg bodyweight within 0-2 hours post-workout for optimal recovery."
              },
              {
                q: "Is post-workout nutrition necessary for muscle growth?",
                a: "Yes, post-workout nutrition is important but the \"30-minute window\" is a myth. You have 2-4 hours to consume protein and carbs for optimal recovery."
              },
              {
                q: "What's the best post-workout protein?",
                a: "Whey protein is optimal due to fast absorption and high leucine content. Whole foods like chicken, eggs, and fish also work but digest slower."
              },
              {
                q: "Do I need carbs after a workout?",
                a: "It depends on your goals. For muscle building or intense training, yes (0.8-1.2g/kg). For fat loss, carbs are optional but can aid recovery."
              },
              {
                q: "Are BCAAs necessary post-workout?",
                a: "No, if you're consuming whey protein or a complete protein source. BCAAs are only beneficial if training fasted or on a vegan diet."
              }
            ].map((faq, idx) => (
              <div key={idx} className="border-b border-gray-200 dark:border-gray-800 last:border-0 pb-6 last:pb-0">
                <h3 className="font-bold text-lg mb-2 text-primary">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
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
                Post-workout nutrition is important for recovery, but total daily nutrition matters more. Don&apos;t stress about hitting a 30-minute window—focus on consuming quality protein and carbs within 2-3 hours post-training.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Simple rule:</strong> 20-40g protein + carbs based on goals. Whey protein shakes are convenient, but whole foods work great too. Shop premium <Link href="/products?category=Protein+Powders" className="text-blue-600 hover:underline font-semibold">recovery supplements at MuscleSports UK</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


