"use client";

import { useState } from "react";
import { Dumbbell, TrendingUp, Apple, Moon, Zap, Target, AlertCircle, CheckCircle, ShoppingBag, Flame, Award } from "lucide-react";
import Link from "next/link";

export default function MuscleBuildingClientPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'training',
      title: 'Optimal Training Protocols',
      icon: Dumbbell,
      color: 'from-red-600 to-orange-600',
      gradient: 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20',
      border: 'border-red-200 dark:border-red-800'
    },
    {
      id: 'nutrition',
      title: 'Muscle Building Nutrition',
      icon: Apple,
      color: 'from-green-600 to-emerald-600',
      gradient: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20',
      border: 'border-green-200 dark:border-green-800'
    },
    {
      id: 'recovery',
      title: 'Recovery & Growth',
      icon: Moon,
      color: 'from-blue-600 to-indigo-600',
      gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20',
      border: 'border-blue-200 dark:border-blue-800'
    },
    {
      id: 'supplements',
      title: 'Essential Supplements',
      icon: Zap,
      color: 'from-purple-600 to-pink-600',
      gradient: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
      border: 'border-purple-200 dark:border-purple-800'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-950 dark:to-red-950/20 py-12">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <Dumbbell className="w-4 h-4 text-red-600" />
            <span className="text-sm font-semibold text-red-700 dark:text-red-400">COMPLETE GUIDE</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-saira bg-gradient-to-r from-red-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
            The Ultimate Muscle Building Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-4">
            Build lean muscle mass faster with science-backed training, nutrition, and supplementation strategies. Learn exactly what works and why.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <div className="px-6 py-3 bg-white dark:bg-card rounded-xl shadow-lg border-2 border-red-200 dark:border-red-800">
              <div className="text-3xl font-bold text-red-600">0.5-1kg</div>
              <div className="text-sm text-muted-foreground">Muscle/Month</div>
            </div>
            <div className="px-6 py-3 bg-white dark:bg-card rounded-xl shadow-lg border-2 border-orange-200 dark:border-orange-800">
              <div className="text-3xl font-bold text-orange-600">3-4x</div>
              <div className="text-sm text-muted-foreground">Weekly Training</div>
            </div>
            <div className="px-6 py-3 bg-white dark:bg-card rounded-xl shadow-lg border-2 border-amber-200 dark:border-amber-800">
              <div className="text-3xl font-bold text-amber-600">1.6-2.2g</div>
              <div className="text-sm text-muted-foreground">Protein/kg/day</div>
            </div>
          </div>
        </div>

        {/* Key Principles */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 mb-16 text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Target className="w-8 h-8" />
            3 Non-Negotiable Principles
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Progressive Overload', desc: 'Consistently increase weight, reps, or volume over time. No progress = no growth.' },
              { title: 'Caloric Surplus', desc: 'Eat 10-20% above maintenance calories. You cannot build significant muscle in a deficit.' },
              { title: 'Protein Prioritization', desc: 'Hit 1.6-2.2g protein per kg bodyweight daily. Non-negotiable for muscle protein synthesis.' }
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

                {section.id === 'training' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      The most effective muscle building programs focus on compound movements with progressive overload. Train each muscle group 2-3x per week for optimal growth.
                    </p>

                    <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-red-600" />
                        The Big 5 Compound Lifts
                      </h3>
                      <div className="space-y-3">
                        {[
                          { name: 'Barbell Squat', muscles: 'Quads, Glutes, Core', sets: '3-5 sets of 6-12 reps' },
                          { name: 'Deadlift', muscles: 'Full Posterior Chain', sets: '3-4 sets of 5-8 reps' },
                          { name: 'Bench Press', muscles: 'Chest, Triceps, Shoulders', sets: '3-5 sets of 6-12 reps' },
                          { name: 'Overhead Press', muscles: 'Shoulders, Triceps, Core', sets: '3-4 sets of 6-10 reps' },
                          { name: 'Barbell Row', muscles: 'Back, Biceps, Rear Delts', sets: '3-5 sets of 8-12 reps' }
                        ].map((lift, idx) => (
                          <div key={idx} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                            <div className="font-semibold text-red-700 dark:text-red-400">{lift.name}</div>
                            <div className="text-sm text-muted-foreground">{lift.muscles}</div>
                            <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">{lift.sets}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-4 border-l-4 border-red-600">
                      <h3 className="font-bold text-red-900 dark:text-red-400 mb-2">📈 Progressive Overload Methods:</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• Add 2.5-5kg when you hit top of rep range</li>
                        <li>• Increase reps (stay in 6-12 rep range)</li>
                        <li>• Add sets (up to 10-20 sets per muscle/week)</li>
                        <li>• Improve form and tempo control</li>
                      </ul>
                    </div>
                  </div>
                )}

                {section.id === 'nutrition' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      You can&apos;t out-train a bad diet. Muscle growth requires a caloric surplus with optimal protein intake. Here&apos;s your complete nutrition blueprint.
                    </p>

                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-xl">
                      <h3 className="font-bold text-xl mb-4">Calculate Your Bulking Calories</h3>
                      <div className="space-y-3">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">Step 1: Maintenance Calories</div>
                          <div className="text-sm text-white/90">Bodyweight (kg) × 33 = maintenance</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">Step 2: Add 10-20% Surplus</div>
                          <div className="text-sm text-white/90">+300-500 calories for lean gains</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">Step 3: Set Macros</div>
                          <div className="text-sm text-white/90">Protein: 2g/kg | Fats: 25% cals | Carbs: rest</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-4 border-l-4 border-green-600">
                      <h3 className="font-bold text-green-900 dark:text-green-400 mb-2">✅ Best Muscle Building Foods:</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Lean meats:</strong> Chicken, turkey, lean beef (high protein, zinc)</li>
                        <li>• <strong>Eggs:</strong> Complete protein + healthy fats</li>
                        <li>• <strong>Greek yogurt:</strong> Protein + probiotics</li>
                        <li>• <strong>Rice & oats:</strong> Clean carbs for energy</li>
                        <li>• <strong>Sweet potato:</strong> Complex carbs + vitamins</li>
                        <li>• <strong>Salmon:</strong> Protein + omega-3s</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4">
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-400">
                        💡 Pro Tip: Track your weight weekly. Aim for 0.25-0.5kg gain per week. Faster = excess fat gain.
                      </p>
                    </div>
                  </div>
                )}

                {section.id === 'recovery' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Muscle growth happens during recovery, not training. Sleep, stress management, and proper rest days are critical for maximizing gains.
                    </p>

                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-xl">
                      <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                        <Moon className="w-6 h-6" />
                        Sleep: The Anabolic Window
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">7-9 Hours Nightly</div>
                          <div className="text-sm text-white/90">Growth hormone peaks during deep sleep</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">Consistent Schedule</div>
                          <div className="text-sm text-white/90">Same bedtime = better recovery</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <div className="font-semibold mb-1">Cool & Dark Room</div>
                          <div className="text-sm text-white/90">16-19°C optimal for deep sleep</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-4 border-l-4 border-blue-600">
                      <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-2">Recovery Strategies:</h3>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Rest days:</strong> 1-2 per week (active recovery OK)</li>
                        <li>• <strong>Deload weeks:</strong> Every 4-6 weeks reduce volume 40-50%</li>
                        <li>• <strong>Hydration:</strong> 3-4L water daily minimum</li>
                        <li>• <strong>Manage stress:</strong> High cortisol kills gains</li>
                      </ul>
                    </div>
                  </div>
                )}

                {section.id === 'supplements' && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Supplements are only 5-10% of the equation, but these evidence-based options can optimize your muscle building results when combined with proper training and nutrition.
                    </p>

                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-xl border-2 border-purple-400">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">The Essential Stack</h3>
                          <p className="text-sm text-white/90">Backed by thousands of studies</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                          <div className="font-bold text-lg mb-2">1. Whey Protein</div>
                          <p className="text-sm text-white/90 mb-2">Fast-digesting complete protein. Ideal post-workout and between meals.</p>
                          <div className="text-xs bg-purple-900/30 text-purple-200 px-2 py-1 rounded inline-block">
                            20-40g per serving | 1-3 servings daily
                          </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                          <div className="font-bold text-lg mb-2">2. Creatine Monohydrate</div>
                          <p className="text-sm text-white/90 mb-2">Increases strength, power, and muscle mass. Most researched supplement ever.</p>
                          <div className="text-xs bg-purple-900/30 text-purple-200 px-2 py-1 rounded inline-block">
                            5g daily | Take anytime
                          </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                          <div className="font-bold text-lg mb-2">3. Beta-Alanine</div>
                          <p className="text-sm text-white/90 mb-2">Buffers lactic acid for more reps. Especially effective for 60-240 second sets.</p>
                          <div className="text-xs bg-purple-900/30 text-purple-200 px-2 py-1 rounded inline-block">
                            3-6g daily | Pre or post workout
                          </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                          <div className="font-bold text-lg mb-2">4. Caffeine (Pre-Workout)</div>
                          <p className="text-sm text-white/90 mb-2">Increases strength, focus, and training intensity. Take before heavy sessions.</p>
                          <div className="text-xs bg-purple-900/30 text-purple-200 px-2 py-1 rounded inline-block">
                            200-400mg | 30-60min pre-workout
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-center text-white shadow-xl">
                      <h3 className="text-xl font-bold mb-2">Ready to Build Serious Muscle?</h3>
                      <p className="text-white/90 mb-4">Shop premium muscle building supplements</p>
                      <Link
                        href="/products?category=Protein+Powders"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-100 transition-all"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        Shop Supplements
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 12-Week Plan */}
        <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            12-Week Muscle Building Plan
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold">1-4</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Weeks 1-4: Foundation</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>✓ Master form on big 5 lifts</li>
                <li>✓ Establish caloric surplus (+300-500)</li>
                <li>✓ Train 4x/week full body or upper/lower</li>
                <li>✓ Track all workouts and meals</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold">5-8</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Weeks 5-8: Progression</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>✓ Add 5-10% to all major lifts</li>
                <li>✓ Increase volume (add 1-2 sets)</li>
                <li>✓ Refine nutrition based on results</li>
                <li>✓ Add isolation exercises</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl font-bold">9-12</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Weeks 9-12: Peak</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>✓ Push for PRs on compound lifts</li>
                <li>✓ Peak muscle fullness & definition</li>
                <li>✓ Deload in week 12 (reduce 50%)</li>
                <li>✓ Assess gains, plan next phase</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg mb-4 text-white/90">
              Expect to gain <strong>2-4kg of lean muscle</strong> in 12 weeks following this program with proper nutrition and recovery.
            </p>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-amber-100 dark:bg-amber-900/30 rounded-2xl p-8 border-2 border-amber-300 dark:border-amber-700">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-amber-900 dark:text-amber-400 mb-3">
                Important: Realistic Expectations
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Natural muscle building is a slow process. Expect to gain 0.5-1kg of lean muscle per month as a beginner, 0.25-0.5kg as intermediate, and even less as advanced. Anyone promising faster results is likely promoting unhealthy practices or unrealistic expectations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Consistency over months and years is what builds impressive physiques. Stay patient, track progress, and trust the process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


