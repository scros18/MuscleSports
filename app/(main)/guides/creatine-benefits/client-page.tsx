"use client";

import { useState } from "react";
import { Zap, TrendingUp, Brain, Dumbbell, AlertCircle, CheckCircle, ShoppingBag, Award, Droplets, Clock } from "lucide-react";
import Link from "next/link";

export default function CreatineBenefitsClientPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'benefits',
      title: 'Proven Benefits',
      icon: Award,
      color: 'from-green-600 to-emerald-600',
      gradient: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
      border: 'border-green-200 dark:border-green-800'
    },
    {
      id: 'howto',
      title: 'How to Take Creatine',
      icon: Clock,
      color: 'from-blue-600 to-cyan-600',
      gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
      border: 'border-blue-200 dark:border-blue-800'
    },
    {
      id: 'types',
      title: 'Types of Creatine',
      icon: Droplets,
      color: 'from-purple-600 to-pink-600',
      gradient: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
      border: 'border-purple-200 dark:border-purple-800'
    },
    {
      id: 'myths',
      title: 'Myths vs Facts',
      icon: Brain,
      color: 'from-red-600 to-orange-600',
      gradient: 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20',
      border: 'border-red-200 dark:border-red-800'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-950 dark:to-green-950/20 py-12">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <Zap className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-400">MOST RESEARCHED SUPPLEMENT</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-saira bg-gradient-to-r from-green-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
            The Ultimate Creatine Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-4">
            Creatine monohydrate is the single most effective supplement for increasing muscle mass and strength. Backed by over 1,000 studies and decades of safe use.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <div className="px-6 py-3 bg-white dark:bg-card rounded-xl shadow-lg border-2 border-green-200 dark:border-green-800">
              <div className="text-3xl font-bold text-green-600">+15%</div>
              <div className="text-sm text-muted-foreground">Strength Gains</div>
            </div>
            <div className="px-6 py-3 bg-white dark:bg-card rounded-xl shadow-lg border-2 border-emerald-200 dark:border-emerald-800">
              <div className="text-3xl font-bold text-emerald-600">+5%</div>
              <div className="text-sm text-muted-foreground">Lean Mass</div>
            </div>
            <div className="px-6 py-3 bg-white dark:bg-card rounded-xl shadow-lg border-2 border-teal-200 dark:border-teal-800">
              <div className="text-3xl font-bold text-teal-600">5g</div>
              <div className="text-sm text-muted-foreground">Daily Dose</div>
            </div>
          </div>
        </div>

        {/* What is Creatine */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 mb-16 text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Zap className="w-8 h-8" />
            What is Creatine?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-xl mb-3">The Science</h3>
              <p className="text-white/90 mb-3">
                Creatine is a naturally occurring compound made from 3 amino acids (glycine, arginine, methionine). Your body produces it in the liver, kidneys, and pancreas.
              </p>
              <p className="text-white/90">
                It&apos;s stored in muscles as phosphocreatine and used to rapidly regenerate ATP—your muscles&apos; primary energy currency during high-intensity exercise.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-xl mb-3">Why Supplement?</h3>
              <p className="text-white/90 mb-3">
                Your body naturally stores about 120g of creatine. Supplementing increases stores to 140-150g (+15-20%), which enhances performance during explosive movements like lifting, sprinting, and jumping.
              </p>
              <p className="text-white/90">
                You&apos;d need to eat 1kg of raw beef daily to get 5g of creatine from food. Supplementation is far more practical.
              </p>
            </div>
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

                {section.id === 'benefits' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Creatine is one of the few supplements with overwhelming evidence for safety and effectiveness. Here&apos;s what the research shows.
                    </p>

                    <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Dumbbell className="w-5 h-5 text-green-600" />
                        Performance & Physique Benefits
                      </h3>
                      <div className="space-y-3">
                        {[
                          { title: '📈 Increased Strength (8-15%)', desc: 'Particularly in 1-5 rep max lifts and explosive movements' },
                          { title: '💪 More Muscle Mass', desc: '1-2kg lean mass gains in first month (partly water, partly muscle)' },
                          { title: '⚡ Better Power Output', desc: 'Enhanced performance in sprints, jumps, throws' },
                          { title: '🔁 Improved Recovery', desc: 'Faster ATP regeneration between sets = more total volume' },
                          { title: '🧠 Cognitive Benefits', desc: 'Improved memory, focus, and mental clarity (especially in sleep-deprived states)' },
                          { title: '🛡️ Neuroprotection', desc: 'May protect against neurological diseases (ongoing research)' }
                        ].map((benefit, idx) => (
                          <div key={idx} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                            <div className="font-semibold text-sm mb-1">{benefit.title}</div>
                            <div className="text-xs text-muted-foreground">{benefit.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-4 border-l-4 border-green-600">
                      <h3 className="font-bold text-green-900 dark:text-green-400 mb-2">✅ Who Benefits Most:</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• Strength athletes & bodybuilders</li>
                        <li>• Sprinters & explosive sport athletes</li>
                        <li>• Vegetarians/vegans (lower natural creatine stores)</li>
                        <li>• Anyone over 50 (helps maintain muscle mass)</li>
                      </ul>
                    </div>
                  </div>
                )}

                {section.id === 'howto' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Taking creatine is simple, but there are two main protocols. Both work—choose based on your preference.
                    </p>

                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-xl">
                      <h3 className="font-bold text-xl mb-4">Two Loading Protocols</h3>
                      <div className="space-y-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                          <div className="font-semibold mb-2 flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Option 1: Loading Phase (Fast)
                          </div>
                          <div className="text-sm text-white/90 mb-3">
                            <strong>Days 1-5:</strong> 20g daily (4 doses of 5g spread throughout day)<br />
                            <strong>Day 6+:</strong> 5g daily maintenance
                          </div>
                          <div className="text-xs bg-cyan-900/30 text-cyan-200 px-2 py-1 rounded inline-block">
                            ✓ Saturates muscles in 5-7 days
                          </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                          <div className="font-semibold mb-2 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Option 2: No Loading (Simple)
                          </div>
                          <div className="text-sm text-white/90 mb-3">
                            <strong>Every day:</strong> 5g daily from day 1
                          </div>
                          <div className="text-xs bg-cyan-900/30 text-cyan-200 px-2 py-1 rounded inline-block">
                            ✓ Saturates muscles in 3-4 weeks
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                      <h3 className="font-bold text-lg mb-4">Best Practices</h3>
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <strong>Take with carbs/protein:</strong> Insulin helps creatine uptake. Mix with post-workout shake or juice.
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <strong>Timing doesn&apos;t matter much:</strong> Take whenever convenient. Consistency matters more than timing.
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <strong>Drink more water:</strong> Creatine pulls water into muscles. Aim for 3-4L daily.
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <strong>No cycling needed:</strong> Safe to take year-round. No need for breaks.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {section.id === 'types' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      There are many forms of creatine on the market. Here&apos;s the truth: creatine monohydrate is king.
                    </p>

                    <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-600" />
                        Creatine Types Comparison
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4 border-2 border-green-500">
                          <div className="font-bold text-green-900 dark:text-green-400 mb-2 flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Creatine Monohydrate (BEST)
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Most researched form. 99.9% purity. Cheapest. Most effective. This is what 95% of studies use.
                          </p>
                          <div className="text-xs bg-green-200 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-2 py-1 rounded inline-block font-semibold">
                            ✓ RECOMMENDED
                          </div>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                          <div className="font-bold text-gray-900 dark:text-gray-300 mb-2">Micronized Creatine</div>
                          <p className="text-sm text-muted-foreground">
                            Just monohydrate with smaller particles. Slightly better mixability. Same effectiveness. Worth it if you dislike texture.
                          </p>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                          <div className="font-bold text-gray-900 dark:text-gray-300 mb-2">Creatine HCl</div>
                          <p className="text-sm text-muted-foreground">
                            More expensive. Claims &quot;better absorption&quot; but no evidence it works better than monohydrate. Marketing hype.
                          </p>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                          <div className="font-bold text-gray-900 dark:text-gray-300 mb-2">Buffered Creatine (Kre-Alkalyn)</div>
                          <p className="text-sm text-muted-foreground">
                            Claims reduced bloating. Research shows no advantage over monohydrate. More expensive for no benefit.
                          </p>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                          <div className="font-bold text-gray-900 dark:text-gray-300 mb-2">Creatine Ethyl Ester</div>
                          <p className="text-sm text-muted-foreground">
                            Marketed as &quot;better absorption.&quot; Studies show it&apos;s LESS effective than monohydrate. Avoid.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-4 border-l-4 border-purple-600">
                      <h3 className="font-bold text-purple-900 dark:text-purple-400 mb-2">💡 Bottom Line:</h3>
                      <p className="text-sm">
                        Buy <strong>Creapure® creatine monohydrate</strong>. It&apos;s the gold standard, backed by 1,000+ studies, and costs £10-15 for 3 months supply. Everything else is marketing.
                      </p>
                    </div>
                  </div>
                )}

                {section.id === 'myths' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Creatine is one of the most misunderstood supplements. Let&apos;s debunk the common myths with science.
                    </p>

                    <div className="space-y-3">
                      <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-red-600 font-bold">✗</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-red-900 dark:text-red-400">MYTH: Creatine damages kidneys</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                              <strong className="text-green-600">FACT:</strong> Decades of research show creatine is safe for healthy individuals. Studies on 5-30g daily for years show no kidney damage. Only avoid if you have pre-existing kidney disease.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-red-600 font-bold">✗</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-red-900 dark:text-red-400">MYTH: Creatine causes hair loss</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                              <strong className="text-green-600">FACT:</strong> Based on ONE study from 2009 showing increased DHT. No follow-up studies confirmed this. Millions of users for 30+ years with no pattern of baldness. Extremely unlikely.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-red-600 font-bold">✗</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-red-900 dark:text-red-400">MYTH: You need to cycle creatine</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                              <strong className="text-green-600">FACT:</strong> No evidence you need breaks. Your body doesn&apos;t &quot;get used to it&quot; or stop responding. Take it year-round for sustained benefits.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-red-600 font-bold">✗</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-red-900 dark:text-red-400">MYTH: Creatine is just water weight</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                              <strong className="text-green-600">FACT:</strong> Initial 1-2kg gain is water in muscles (good thing—it aids protein synthesis). Long-term studies show real lean mass gains beyond water retention.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-red-600 font-bold">✗</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-red-900 dark:text-red-400">MYTH: Creatine is a steroid</h3>
                            <p className="text-sm text-muted-foreground mt-2">
                              <strong className="text-green-600">FACT:</strong> Creatine is a naturally occurring compound made from amino acids. It&apos;s found in meat and fish. It&apos;s not hormonal, not a steroid, and completely legal in all sports.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Start Guide */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Quick Start Guide
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Buy Quality Creatine</h3>
              <p className="text-sm text-white/90 text-center">
                Get Creapure® creatine monohydrate. Micronized if you prefer smoother texture. Avoid fancy forms.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Take 5g Daily</h3>
              <p className="text-sm text-white/90 text-center">
                Mix with water, juice, or protein shake. Take anytime. Load with 20g for 5 days if you want faster results.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Stay Consistent</h3>
              <p className="text-sm text-white/90 text-center">
                Take every single day. Drink 3-4L water. Expect strength gains in 1-2 weeks.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/products?search=creatine"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-100 transition-all text-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              Shop Creatine Products
            </Link>
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
                Creatine monohydrate is the most effective, safest, and most researched supplement for building muscle and strength. If you only take one supplement, make it creatine.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                It&apos;s cheap (£10-15 for 3+ months), safe (thousands of studies), and actually works (8-15% strength gains). No hype—just science.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


