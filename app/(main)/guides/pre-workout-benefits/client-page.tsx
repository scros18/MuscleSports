"use client";

import { useState } from "react";
import { Zap, TrendingUp, Clock, Heart, AlertCircle, CheckCircle, ShoppingBag, Award, Flame, Brain } from "lucide-react";
import Link from "next/link";

export default function PreWorkoutBenefitsClient() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'benefits',
      title: 'Pre-Workout Benefits',
      icon: Flame,
      color: 'from-orange-600 to-red-600',
      gradient: 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20',
      border: 'border-orange-200 dark:border-orange-800'
    },
    {
      id: 'ingredients',
      title: 'Key Ingredients',
      icon: Zap,
      color: 'from-blue-600 to-indigo-600',
      gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20',
      border: 'border-blue-200 dark:border-blue-800'
    },
    {
      id: 'timing',
      title: 'When & How to Use',
      icon: Clock,
      color: 'from-green-600 to-emerald-600',
      gradient: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
      border: 'border-green-200 dark:border-green-800'
    },
    {
      id: 'choosing',
      title: 'Choosing the Right One',
      icon: Award,
      color: 'from-purple-600 to-pink-600',
      gradient: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
      border: 'border-purple-200 dark:border-purple-800'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-950 dark:to-orange-950/20 py-12">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4">
            <Flame className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-700 dark:text-orange-400">MAXIMIZE PERFORMANCE</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-saira bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent">
            Pre-Workout Supplements Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-4">
            Gain <span className="font-bold text-orange-600">5-15% performance boost</span> with science-backed ingredients. Learn which supplements work, optimal dosing, and how to choose quality products without hype.
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="px-6 py-4 bg-white dark:bg-card rounded-xl shadow-lg border-l-4 border-orange-500">
            <div className="text-2xl font-bold text-orange-600">+15%</div>
            <div className="text-sm text-muted-foreground">Performance boost</div>
          </div>
          <div className="px-6 py-4 bg-white dark:bg-card rounded-xl shadow-lg border-l-4 border-red-500">
            <div className="text-2xl font-bold text-red-600">30-45min</div>
            <div className="text-sm text-muted-foreground">Optimal timing</div>
          </div>
          <div className="px-6 py-4 bg-white dark:bg-card rounded-xl shadow-lg border-l-4 border-pink-500">
            <div className="text-2xl font-bold text-pink-600">4-6 weeks</div>
            <div className="text-sm text-muted-foreground">Effective cycling</div>
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
                      Pre-workout supplements enhance training performance through multiple mechanisms. Results are modest but real when combined with proper training and nutrition.
                    </p>

                    <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white shadow-xl">
                      <h3 className="font-bold text-xl mb-4">Performance Benefits</h3>
                      <div className="space-y-3">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">Increased Strength & Power</div>
                          <div className="text-sm text-white/90">More reps, heavier weights, better explosiveness</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">Improved Endurance</div>
                          <div className="text-sm text-white/90">Train harder for longer without fatigue</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">Enhanced Focus & Drive</div>
                          <div className="text-sm text-white/90">Motivation and mental clarity during intense sets</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">Better Blood Flow & Pumps</div>
                          <div className="text-sm text-white/90">More oxygen and nutrients to muscles</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-100 dark:bg-amber-900/30 rounded-xl p-4">
                      <p className="text-sm font-semibold text-amber-900 dark:text-amber-400">
                        💡 Important: Pre-workouts amplify training - they do NOT replace proper sleep, nutrition, and training consistency. They&apos;re 10% of the equation.
                      </p>
                    </div>
                  </div>
                )}

                {section.id === 'ingredients' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Not all pre-workout ingredients are created equal. Focus on clinically-dosed compounds with strong evidence. Avoid proprietary blends hiding weak doses.
                    </p>

                    <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                      <h3 className="font-bold text-lg mb-4">Essential Ingredients</h3>
                      <div className="space-y-4">
                        <div className="bg-white dark:bg-card rounded-xl p-5 shadow-lg border-l-4 border-orange-500">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                              <Zap className="w-5 h-5 text-orange-600" />
                            </div>
                            <h3 className="font-bold text-lg">Caffeine (200-400mg)</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            The most studied performance enhancer. Increases alertness, strength, and endurance. Not for the caffeine-sensitive.
                          </p>
                          <div className="flex gap-2">
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">Evidence: Very Strong</span>
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">Dose: 200-400mg</span>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-card rounded-xl p-5 shadow-lg border-l-4 border-blue-500">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <Brain className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-lg">L-Citrulline (8-10g Citrulline Malate)</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Increases nitric oxide for better blood flow, massive pumps, and reduced fatigue during high-rep training.
                          </p>
                          <div className="flex gap-2">
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">Evidence: Strong</span>
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">Dose: 6-8g</span>
                          </div>
                        </div>

                        <div className="bg-white dark:bg-card rounded-xl p-5 shadow-lg border-l-4 border-indigo-500">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                              <TrendingUp className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h3 className="font-bold text-lg">Beta-Alanine (3-6g)</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Buffers lactic acid in muscles. Delays fatigue in 60-240 second sets. Causes harmless tingling sensation.
                          </p>
                          <div className="flex gap-2">
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">Evidence: Strong</span>
                            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">Dose: 3-6g</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-4 border-l-4 border-red-600">
                      <h3 className="font-bold text-red-900 dark:text-red-400 mb-2">❌ Avoid Proprietary Blends</h3>
                      <p className="text-sm">
                        If the label says &quot;proprietary blend&quot; without exact doses, skip it. You deserve to know what and how much you&apos;re taking.
                      </p>
                    </div>
                  </div>
                )}

                {section.id === 'timing' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Timing is crucial for maximizing effectiveness and avoiding side effects. Optimal dosing and timing protocols.
                    </p>

                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-xl">
                      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                        <Clock className="w-6 h-6" />
                        Perfect Timing Protocol
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">30-45 Minutes Before Training</div>
                          <div className="text-sm text-white/90">
                            Sweet spot for caffeine and other ingredients to peak during your workout
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">On Empty or Light Stomach</div>
                          <div className="text-sm text-white/90">
                            Faster absorption. If nauseous, have a small snack 60-90min before
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">Not After 2pm (if sensitive)</div>
                          <div className="text-sm text-white/90">
                            Caffeine half-life is 5-6 hours. Late afternoon = sleep disruption
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                      <h3 className="font-bold text-lg mb-4">Usage Guidelines</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <strong>Start with half dose:</strong> Assess tolerance. Some people are caffeine-sensitive.
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <strong>Cycle it:</strong> Use 4-6 weeks, then take 1-2 weeks off to reset caffeine tolerance.
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <strong>Hydrate well:</strong> Drink 500ml water with your pre-workout to prevent dehydration.
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <strong>Not every workout:</strong> Save it for heavy compound days or when you really need it.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {section.id === 'choosing' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      The pre-workout market is flooded with products. Here&apos;s how to identify quality formulations and avoid marketing hype.
                    </p>

                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border-l-4 border-red-500">
                      <h4 className="font-bold text-red-900 dark:text-red-400 mb-2">❌ Red Flags (Avoid)</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Proprietary blends (hiding doses)</li>
                        <li>• Excessive caffeine (&gt;400mg) unless experienced</li>
                        <li>• Artificial sweeteners you react to</li>
                        <li>• Sketchy &quot;fat burner&quot; ingredients with no evidence</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-center text-white shadow-xl">
                      <h3 className="text-xl font-bold mb-2">Shop Premium Pre-Workouts</h3>
                      <p className="text-white/90 mb-4">Clinically dosed, transparent labels</p>
                      <Link
                        href="/products?category=Pre-Workout"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-all"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        View Pre-Workout Products
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Safety & Side Effects */}
        <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            Safety &amp; Side Effects
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <Heart className="w-6 h-6" />
                Common (Harmless) Side Effects
              </h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• <strong>Tingling:</strong> Beta-alanine causes this. Totally safe, goes away in 60-90 min.</li>
                <li>• <strong>Energy crash:</strong> Caffeine comedown. Taper off gradually to avoid.</li>
                <li>• <strong>Jitters:</strong> Too much caffeine for your tolerance. Start with half dose.</li>
                <li>• <strong>Upset stomach:</strong> Take with small meal or reduce dose.</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6" />
                When to Avoid or Be Cautious
              </h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• <strong>Heart conditions:</strong> High caffeine can raise heart rate/BP. Consult doctor.</li>
                <li>• <strong>Anxiety disorders:</strong> Stimulants can worsen anxiety. Try stim-free versions.</li>
                <li>• <strong>Pregnancy:</strong> Avoid high-caffeine supplements during pregnancy.</li>
                <li>• <strong>Medication interactions:</strong> Check with pharmacist if on meds.</li>
              </ul>
            </div>
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
                Pre-workout supplements can enhance performance by 5-15%, but they are not magic. Sleep, nutrition, and training consistency matter far more.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Use them strategically for heavy sessions, not as a crutch for poor sleep or nutrition. Look for transparent labels with clinically effective doses, and cycle off every 4-6 weeks to maintain effectiveness.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
