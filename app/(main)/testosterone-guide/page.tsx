"use client";

import { useState } from "react";
import { Activity, Apple, Moon, Pill, Zap, TrendingUp, AlertCircle, CheckCircle, ShoppingBag, Flame, Clock, Heart } from "lucide-react";
import Link from "next/link";

export default function TestosteroneGuidePage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'diet',
      title: 'Diet & Processed Foods',
      icon: Apple,
      color: 'from-orange-600 to-red-600',
      gradient: 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20',
      border: 'border-orange-200 dark:border-orange-800'
    },
    {
      id: 'activity',
      title: 'Movement & Exercise',
      icon: Activity,
      color: 'from-blue-600 to-cyan-600',
      gradient: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
      border: 'border-blue-200 dark:border-blue-800'
    },
    {
      id: 'sleep',
      title: 'Sleep & Recovery',
      icon: Moon,
      color: 'from-indigo-600 to-purple-600',
      gradient: 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20',
      border: 'border-indigo-200 dark:border-indigo-800'
    },
    {
      id: 'supplements',
      title: 'Testosterone Boosting Supplements',
      icon: Pill,
      color: 'from-green-600 to-emerald-600',
      gradient: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
      border: 'border-green-200 dark:border-green-800'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-950 dark:to-green-950/20 py-12">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-semibold text-red-700 dark:text-red-400">CRITICAL FOR YOUNG MEN</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-saira bg-gradient-to-r from-red-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
            Testosterone Crisis in Young Men
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-4">
            Testosterone levels in young men have dropped by <span className="font-bold text-red-600">25-30% over the past 30 years</span>. Learn how to naturally support your testosterone through diet, lifestyle, and <span className="font-semibold text-green-600">testosterone boosting supplements</span>.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <div className="px-6 py-3 bg-white dark:bg-card rounded-xl shadow-lg border-2 border-red-200 dark:border-red-800">
              <div className="text-3xl font-bold text-red-600">↓30%</div>
              <div className="text-sm text-muted-foreground">Since 1990s</div>
            </div>
            <div className="px-6 py-3 bg-white dark:bg-card rounded-xl shadow-lg border-2 border-orange-200 dark:border-orange-800">
              <div className="text-3xl font-bold text-orange-600">67%</div>
              <div className="text-sm text-muted-foreground">Sedentary Jobs</div>
            </div>
            <div className="px-6 py-3 bg-white dark:bg-card rounded-xl shadow-lg border-2 border-amber-200 dark:border-amber-800">
              <div className="text-3xl font-bold text-amber-600">80%</div>
              <div className="text-sm text-muted-foreground">Processed Diet</div>
            </div>
          </div>
        </div>

        {/* Warning Signs */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 mb-16 text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <AlertCircle className="w-8 h-8" />
            Warning Signs of Low Testosterone
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Chronic fatigue and low energy',
              'Difficulty building muscle',
              'Increased body fat (especially belly)',
              'Low libido and sexual dysfunction',
              'Brain fog and poor concentration',
              'Mood swings and irritability',
              'Poor sleep quality',
              'Reduced motivation and drive'
            ].map((sign, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{sign}</span>
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

                {section.id === 'diet' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Modern processed foods are destroying testosterone. Ultra-processed foods contain endocrine disruptors, excess sugar, and inflammatory seed oils that directly suppress <strong>natural testosterone support</strong>.
                    </p>
                    
                    <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-4 border-l-4 border-red-600">
                      <h3 className="font-bold text-red-900 dark:text-red-400 mb-2">❌ Avoid These Testosterone Killers:</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• Soy products (high in phytoestrogens)</li>
                        <li>• Excessive alcohol (kills Leydig cells)</li>
                        <li>• Trans fats and vegetable oils</li>
                        <li>• High sugar foods and drinks</li>
                        <li>• Plastic-wrapped foods (BPA exposure)</li>
                      </ul>
                    </div>

                    <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-4 border-l-4 border-green-600">
                      <h3 className="font-bold text-green-900 dark:text-green-400 mb-2">✅ Eat More:</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Grass-fed beef</strong> (zinc, creatine, saturated fat)</li>
                        <li>• <strong>Eggs</strong> (cholesterol for hormone production)</li>
                        <li>• <strong>Oysters</strong> (highest zinc content)</li>
                        <li>• <strong>Pomegranate</strong> (increases testosterone by 24%)</li>
                        <li>• <strong>Cruciferous vegetables</strong> (reduce estrogen)</li>
                        <li>• <strong>Extra virgin olive oil</strong> (boosts Leydig cells)</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 mt-4">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-400">
                        💡 Pro Tip: Focus on whole foods and <strong>testosterone foods and supplements</strong> to support natural hormone production.
                      </p>
                    </div>
                  </div>
                )}

                {section.id === 'activity' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Sedentary lifestyles are catastrophic for testosterone. Studies show desk workers have 15-20% lower testosterone than active individuals. Movement is medicine for <strong>mens health supplements uk</strong> users.
                    </p>

                    <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        Optimal Movement Guidelines
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                            1
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">Heavy Compound Lifts</div>
                            <div className="text-sm text-muted-foreground">Squats, deadlifts, bench press - boost testosterone by 40%</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                            2
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">10,000+ Steps Daily</div>
                            <div className="text-sm text-muted-foreground">Non-exercise activity thermogenesis (NEAT) matters</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                            3
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">HIIT Training</div>
                            <div className="text-sm text-muted-foreground">Short, intense bursts - maximize hormone response</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-4 border-l-4 border-red-600">
                      <p className="text-sm font-semibold text-red-900 dark:text-red-400">
                        ⚠️ Avoid: Excessive cardio (>60min) and overtraining - both LOWER testosterone significantly
                      </p>
                    </div>
                  </div>
                )}

                {section.id === 'sleep' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Sleep is when 70% of your daily testosterone is produced. Sleeping less than 7 hours reduces testosterone by up to 15% and increases cortisol (testosterone's enemy).
                    </p>

                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-xl">
                      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                        <Moon className="w-6 h-6" />
                        The 7-8 Hour Rule
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">5 hours sleep</div>
                          <div className="text-sm text-white/90">= 15% testosterone decrease</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">7-8 hours sleep</div>
                          <div className="text-sm text-white/90">= Optimal testosterone production</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">9+ hours sleep</div>
                          <div className="text-sm text-white/90">= Diminishing returns, may indicate health issues</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-4 border-l-4 border-green-600">
                      <h3 className="font-bold text-green-900 dark:text-green-400 mb-2">Sleep Optimization Tips:</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Complete darkness</strong> (no LED lights, blackout curtains)</li>
                        <li>• <strong>Cool room</strong> (16-19°C / 60-67°F)</li>
                        <li>• <strong>No screens 1hr before bed</strong> (blue light kills melatonin)</li>
                        <li>• <strong>Consistent schedule</strong> (same bedtime every night)</li>
                        <li>• <strong>Take zinc & magnesium</strong> 30min before bed (see supplements)</li>
                      </ul>
                    </div>
                  </div>
                )}

                {section.id === 'supplements' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Strategic <strong>testosterone boosting supplements</strong> can significantly support natural hormone production. These are evidence-based, not magical cures - they work best with proper diet, sleep, and exercise.
                    </p>

                    {/* Ashwagandha - Featured */}
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-xl border-2 border-green-400">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                          <Zap className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Ashwagandha KSM-66</h3>
                          <p className="text-sm text-white/90">The #1 Supplement Men Actually Feel</p>
                        </div>
                      </div>
                      <p className="text-white/90 mb-4">
                        This adaptogen reduces cortisol by 27%, increases testosterone by 14-17%, and improves strength, energy, and sleep quality. Most men notice effects within 2-4 weeks.
                      </p>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                        <div className="text-sm font-semibold mb-2">Dosage: 600mg KSM-66 extract daily</div>
                        <div className="text-xs text-white/80">Take with breakfast or post-workout</div>
                      </div>
                    </div>

                    {/* Evening Stack */}
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-xl p-6 border-2 border-indigo-300 dark:border-indigo-700">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-indigo-900 dark:text-indigo-400">
                        <Moon className="w-5 h-5" />
                        Evening Stack (Before Bed)
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-white dark:bg-card rounded-lg p-4">
                          <div className="font-bold text-indigo-900 dark:text-indigo-400 mb-2">Zinc (20-30mg)</div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Critical for testosterone production. Deficiency lowers T by 75%. Improves sleep quality.
                          </p>
                          <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded inline-block">
                            ✓ Zinc Picolinate best absorbed
                          </div>
                        </div>

                        <div className="bg-white dark:bg-card rounded-lg p-4">
                          <div className="font-bold text-indigo-900 dark:text-indigo-400 mb-2">Magnesium (400-500mg)</div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Increases free testosterone by 26%. Essential for deep sleep and muscle recovery.
                          </p>
                          <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded inline-block">
                            ✓ Magnesium Glycinate for sleep
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Morning Stack */}
                    <div className="bg-amber-100 dark:bg-amber-900/30 rounded-xl p-6 border-2 border-amber-300 dark:border-amber-700">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-amber-900 dark:text-amber-400">
                        <Flame className="w-5 h-5" />
                        Morning Stack (With Breakfast)
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-white dark:bg-card rounded-lg p-4">
                          <div className="font-bold text-amber-900 dark:text-amber-400 mb-2">Vitamin D3 (4,000-5,000 IU) + K2 (100mcg)</div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Men with optimal D3 levels have 20% higher testosterone. K2 ensures calcium goes to bones, not arteries. Take with fat.
                          </p>
                          <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded inline-block">
                            ✓ Essential for UK residents (low sun)
                          </div>
                        </div>

                        <div className="bg-white dark:bg-card rounded-lg p-4">
                          <div className="font-bold text-amber-900 dark:text-amber-400 mb-2">Boron (10mg)</div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Reduces SHBG (binds testosterone), increases free testosterone by 28% and lowers estrogen.
                          </p>
                          <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded inline-block">
                            ✓ Powerful but underrated
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-center text-white shadow-xl">
                      <h3 className="text-xl font-bold mb-2">Ready to Optimize Your Testosterone?</h3>
                      <p className="text-white/90 mb-4">Shop <strong>mens health supplements uk</strong> at MuscleSports</p>
                      <Link
                        href="/products?search=zinc+magnesium"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-100 transition-all"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Shop Testosterone Support
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Plan */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Your 30-Day Testosterone Transformation Plan
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4 mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Week 1-2</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>✓ Fix sleep schedule (7-8 hours)</li>
                <li>✓ Start zinc + magnesium before bed</li>
                <li>✓ Remove processed foods</li>
                <li>✓ Hit 10,000 steps daily</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Week 3-4</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>✓ Add D3+K2, Boron (morning)</li>
                <li>✓ Start Ashwagandha (600mg)</li>
                <li>✓ Begin strength training 3-4x/week</li>
                <li>✓ Optimize diet (eggs, beef, oysters)</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4 mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Ongoing</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>✓ Maintain all habits consistently</li>
                <li>✓ Track energy, strength, mood</li>
                <li>✓ Consider blood work (check levels)</li>
                <li>✓ Adjust based on results</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg mb-4 text-white/90">
              Most men notice improvements in energy, mood, and strength within 2-4 weeks of implementing these <strong>natural testosterone support</strong> strategies.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-100 transition-all text-lg"
            >
              <ShoppingBag className="w-5 h-5" />
              Shop Testosterone Boosting Supplements
            </Link>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-amber-100 dark:bg-amber-900/30 rounded-2xl p-8 border-2 border-amber-300 dark:border-amber-700">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-amber-900 dark:text-amber-400 mb-3">
                Important Medical Disclaimer
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                This guide provides educational information about <strong>boost testosterone naturally</strong> through lifestyle and supplements. It is not medical advice. If you suspect low testosterone, consult a healthcare provider for blood work (total T, free T, SHBG, estradiol).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Testosterone replacement therapy (TRT) should only be considered under medical supervision for clinically diagnosed hypogonadism. These natural methods work best for men with suboptimal but not clinically low levels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

