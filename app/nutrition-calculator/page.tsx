"use client";

import { useState, useEffect } from "react";
import { Sparkles, Zap, Target, TrendingUp, Clock, Dumbbell, Apple, Flame, Share2, Download, Mail } from "lucide-react";

export default function NutritionCalculatorPage() {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    bodyFat: '',
    activity: 'moderate',
    goal: 'maintain',
    trainingDays: '4',
    workoutIntensity: 'moderate',
    supplementStack: [] as string[],
  });

  const [results, setResults] = useState<{
    bmr: number;
    tdee: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    leanMass: number;
    bodyFatMass: number;
    waterIntake: number;
    mealTiming: Array<{ time: string; calories: number; type: string; focus: string }>;
    supplements: Array<{ name: string; timing: string; reason: string; product?: string }>;
    weeklyPlan: { training: number; rest: number };
  } | null>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [animateResults, setAnimateResults] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSupplementToggle = (supplement: string) => {
    setFormData(prev => ({
      ...prev,
      supplementStack: prev.supplementStack.includes(supplement)
        ? prev.supplementStack.filter(s => s !== supplement)
        : [...prev.supplementStack, supplement]
    }));
  };

  const calculateAdvancedNutrition = () => {
    const age = parseFloat(formData.age);
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);
    const bodyFat = parseFloat(formData.bodyFat) || 20;

    if (!age || !height || !weight) {
      alert('Please fill in all required fields');
      return;
    }

    // Advanced BMR calculation (Katch-McArdle if body fat provided, otherwise Mifflin-St Jeor)
    let bmr: number;
    const leanMass = weight * (1 - (bodyFat / 100));
    const bodyFatMass = weight * (bodyFat / 100);

    if (formData.bodyFat) {
      // Katch-McArdle (most accurate with body fat %)
      bmr = 370 + (21.6 * leanMass);
    } else if (formData.gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // Activity multipliers with training-specific adjustments
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };

    const trainingDays = parseInt(formData.trainingDays);
    const baseMultiplier = activityMultipliers[formData.activity as keyof typeof activityMultipliers];
    
    // Adjust for training frequency
    const trainingBoost = (trainingDays * 0.05);
    const intensityMultiplier = formData.workoutIntensity === 'high' ? 1.1 : formData.workoutIntensity === 'low' ? 0.95 : 1;
    
    const tdee = bmr * (baseMultiplier + trainingBoost) * intensityMultiplier;

    // Goal-specific calorie adjustment
    let calories: number;
    switch (formData.goal) {
      case 'lose':
        calories = tdee * 0.80; // 20% deficit
        break;
      case 'gain':
        calories = tdee * 1.15; // 15% surplus
        break;
      default:
        calories = tdee;
    }

    // Advanced macro split based on goal and lean mass
    let protein, carbs, fat;
    
    if (formData.goal === 'lose') {
      // High protein for muscle preservation during cut
      protein = Math.round(leanMass * 2.4); // 2.4g per kg lean mass
      fat = Math.round((calories * 0.25) / 9);
      carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);
    } else if (formData.goal === 'gain') {
      // Moderate protein, high carbs for muscle building
      protein = Math.round(leanMass * 2.0);
      carbs = Math.round((calories * 0.50) / 4);
      fat = Math.round((calories - (protein * 4) - (carbs * 4)) / 9);
    } else {
      // Balanced for maintenance
      protein = Math.round(leanMass * 2.2);
      carbs = Math.round((calories * 0.45) / 4);
      fat = Math.round((calories * 0.30) / 9);
    }

    // Advanced meal timing based on training schedule
    const mealTiming = [
      {
        time: '7:00 AM',
        calories: Math.round(calories * 0.25),
        type: 'Breakfast',
        focus: '30% of protein, Fast carbs, Low fat'
      },
      {
        time: '10:30 AM',
        calories: Math.round(calories * 0.15),
        type: 'Pre-Workout',
        focus: 'Complex carbs, Moderate protein'
      },
      {
        time: '1:00 PM',
        calories: Math.round(calories * 0.30),
        type: 'Post-Workout',
        focus: 'High protein, Fast carbs, Creatine'
      },
      {
        time: '4:30 PM',
        calories: Math.round(calories * 0.15),
        type: 'Snack',
        focus: 'Protein-rich, Healthy fats'
      },
      {
        time: '7:30 PM',
        calories: Math.round(calories * 0.15),
        type: 'Dinner',
        focus: 'Lean protein, Fibrous carbs, Healthy fats'
      },
    ];

    // Intelligent supplement recommendations
    const supplements = [];
    
    // Core recommendations
    supplements.push({
      name: 'Whey Protein Isolate',
      timing: 'Post-workout & breakfast',
      reason: `Essential for hitting ${protein}g daily protein target`,
      product: '/products?category=Protein+Powders'
    });

    if (formData.goal === 'gain' || formData.workoutIntensity === 'high') {
      supplements.push({
        name: 'Creatine Monohydrate',
        timing: 'Post-workout (5g daily)',
        reason: 'Increase strength & muscle mass by 8-14%',
        product: '/products?category=Creatine'
      });
    }

    if (formData.goal === 'lose') {
      supplements.push({
        name: 'L-Carnitine',
        timing: 'Pre-workout',
        reason: 'Enhanced fat oxidation during training',
        product: '/products?category=Weight+Loss'
      });
    }

    if (parseInt(formData.trainingDays) >= 4) {
      supplements.push({
        name: 'Pre-Workout Complex',
        timing: '30min before training',
        reason: 'Maximize performance & training intensity',
        product: '/products?category=Pre-Workout'
      });

      supplements.push({
        name: 'BCAA + EAA',
        timing: 'Intra-workout',
        reason: 'Prevent muscle breakdown during intense sessions',
        product: '/products?category=Amino+Acids'
      });
    }

    supplements.push({
      name: 'Multivitamin + Omega-3',
      timing: 'With breakfast',
      reason: 'Fill micronutrient gaps & reduce inflammation',
      product: '/products?category=Vitamins+%26+Supplements'
    });

    // Water intake calculation
    const waterIntake = Math.round((weight * 0.033 + (trainingDays * 0.5)) * 1000); // in ml

    setResults({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calories: Math.round(calories),
      protein,
      carbs,
      fat,
      leanMass: Math.round(leanMass * 10) / 10,
      bodyFatMass: Math.round(bodyFatMass * 10) / 10,
      waterIntake,
      mealTiming,
      supplements,
      weeklyPlan: {
        training: trainingDays,
        rest: 7 - trainingDays
      }
    });

    setAnimateResults(true);
    setTimeout(() => setAnimateResults(false), 1000);
    
    // Show email capture after calculation for lead generation
    setTimeout(() => setShowEmailCapture(true), 3000);
  };

  const shareResults = () => {
    if (results) {
      const text = `I just calculated my nutrition plan on MuscleSports! 🔥\n\n💪 ${results.calories} calories\n🥩 ${results.protein}g protein\n🍚 ${results.carbs}g carbs\n🥑 ${results.fat}g fat\n\nCalculate yours: https://musclesports.co.uk/nutrition-calculator`;
      
      if (navigator.share) {
        navigator.share({ text, url: window.location.href });
      } else {
        navigator.clipboard.writeText(text);
        alert('Results copied to clipboard! Share on social media to help others! 💚');
      }
    }
  };

  const downloadPDF = () => {
    alert('Download feature coming soon! Enter your email to get notified.');
    setShowEmailCapture(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userEmail) {
      // Store email for marketing (future API integration)
      console.log('Email captured:', userEmail);
      alert('Thanks! We\'ll send you exclusive nutrition tips and special offers! 🎉');
      setShowEmailCapture(false);
    }
  };

  const steps = [
    { title: 'Basic Info', icon: Target },
    { title: 'Activity', icon: Dumbbell },
    { title: 'Goals', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-950 dark:to-green-950/20 py-12">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">AI-POWERED ANALYSIS</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-saira bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
            Advanced Nutrition Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Revolutionary body composition analysis with supplement timing, meal planning, and performance optimization
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index + 1;
              const isCompleted = currentStep > index + 1;
              
              return (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive ? 'bg-green-600 text-white scale-110' : isCompleted ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                    <span className="font-semibold text-sm hidden sm:block">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-1 mx-2 rounded-full transition-all duration-300 ${isCompleted ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="space-y-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="bg-white dark:bg-card rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 font-saira flex items-center gap-2">
                  <Target className="w-6 h-6 text-green-600" />
                  Basic Information
                </h2>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="25"
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 transition-all"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Height (cm)</label>
                      <input
                        type="number"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        placeholder="180"
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Weight (kg)</label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="80"
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Body Fat % (optional - for accuracy)</label>
                    <input
                      type="number"
                      name="bodyFat"
                      value={formData.bodyFat}
                      onChange={handleInputChange}
                      placeholder="15"
                      step="0.1"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 transition-all"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Provides more accurate calculations</p>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 text-lg flex items-center justify-center gap-2"
                >
                  Next: Activity Level
                  <Zap className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 2: Activity */}
            {currentStep === 2 && (
              <div className="bg-white dark:bg-card rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 font-saira flex items-center gap-2">
                  <Dumbbell className="w-6 h-6 text-green-600" />
                  Activity & Training
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Daily Activity Level</label>
                    <select
                      name="activity"
                      value={formData.activity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 transition-all"
                    >
                      <option value="sedentary">Sedentary (desk job, minimal activity)</option>
                      <option value="light">Lightly Active (1-3 days/week)</option>
                      <option value="moderate">Moderately Active (3-5 days/week)</option>
                      <option value="active">Very Active (6-7 days/week)</option>
                      <option value="veryActive">Athlete (2x daily training)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Training Days Per Week</label>
                    <select
                      name="trainingDays"
                      value={formData.trainingDays}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 transition-all"
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 7].map(days => (
                        <option key={days} value={days}>{days} days</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Workout Intensity</label>
                    <select
                      name="workoutIntensity"
                      value={formData.workoutIntensity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 transition-all"
                    >
                      <option value="low">Low (walking, light weights)</option>
                      <option value="moderate">Moderate (standard gym session)</option>
                      <option value="high">High (intense HIIT, heavy lifting)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Next: Goals
                    <Zap className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Goals */}
            {currentStep === 3 && (
              <div className="bg-white dark:bg-card rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 font-saira flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Your Goals
                </h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Primary Goal</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'lose', label: 'Cut', icon: '🔥' },
                        { value: 'maintain', label: 'Maintain', icon: '⚡' },
                        { value: 'gain', label: 'Bulk', icon: '💪' }
                      ].map(goal => (
                        <button
                          key={goal.value}
                          onClick={() => setFormData(prev => ({ ...prev, goal: goal.value }))}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            formData.goal === goal.value
                              ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{goal.icon}</div>
                          <div className="font-semibold">{goal.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex-1 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={calculateAdvancedNutrition}
                    className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Calculate My Plan
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="lg:sticky lg:top-8 h-fit">
            {results ? (
              <div className={`space-y-4 ${animateResults ? 'animate-bounce-in' : ''}`}>
                {/* Main Stats */}
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 text-white shadow-2xl">
                  <h2 className="text-2xl font-bold mb-6 font-saira flex items-center gap-2">
                    <Flame className="w-6 h-6" />
                    Your Daily Targets
                  </h2>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                      <div className="text-3xl font-bold">{results.calories}</div>
                      <div className="text-sm opacity-90">Calories</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                      <div className="text-3xl font-bold">{results.tdee}</div>
                      <div className="text-sm opacity-90">TDEE</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center bg-white/10 backdrop-blur rounded-xl p-3">
                      <div className="text-2xl font-bold">{results.protein}g</div>
                      <div className="text-xs opacity-90">Protein</div>
                    </div>
                    <div className="text-center bg-white/10 backdrop-blur rounded-xl p-3">
                      <div className="text-2xl font-bold">{results.carbs}g</div>
                      <div className="text-xs opacity-90">Carbs</div>
                    </div>
                    <div className="text-center bg-white/10 backdrop-blur rounded-xl p-3">
                      <div className="text-2xl font-bold">{results.fat}g</div>
                      <div className="text-xs opacity-90">Fat</div>
                    </div>
                  </div>

                  {formData.bodyFat && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="opacity-90">Lean Mass:</span>
                          <span className="font-bold ml-2">{results.leanMass}kg</span>
                        </div>
                        <div>
                          <span className="opacity-90">Body Fat:</span>
                          <span className="font-bold ml-2">{results.bodyFatMass}kg</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Meal Timing */}
                <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-800">
                  <h3 className="text-xl font-bold mb-4 font-saira flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    Meal Timing Plan
                  </h3>
                  <div className="space-y-3">
                    {results.mealTiming.map((meal, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div>
                          <div className="font-semibold text-sm">{meal.time} - {meal.type}</div>
                          <div className="text-xs text-muted-foreground">{meal.focus}</div>
                        </div>
                        <div className="text-green-600 font-bold">{meal.calories} cal</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                      <Apple className="w-4 h-4" />
                      <span className="font-semibold text-sm">Hydration: {results.waterIntake}ml/day</span>
                    </div>
                  </div>
                </div>

                {/* Supplement Stack */}
                <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-800">
                  <h3 className="text-xl font-bold mb-4 font-saira flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    Recommended Stack
                  </h3>
                  <div className="space-y-3">
                    {results.supplements.map((supplement, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl border border-green-200 dark:border-green-800">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-green-700 dark:text-green-400">{supplement.name}</h4>
                          {supplement.product && (
                            <a 
                              href={supplement.product}
                              className="text-xs bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition-colors"
                            >
                              Shop
                            </a>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">⏰ {supplement.timing}</div>
                        <div className="text-sm">{supplement.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Sharing & Download */}
                <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-bold mb-4">Share Your Results</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={shareResults}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    <button
                      onClick={downloadPDF}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    💡 Share to help your gym buddies get results too!
                  </p>
                </div>

                {/* Email Capture Modal */}
                {showEmailCapture && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white dark:bg-card rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800 animate-scale-in">
                      <button
                        onClick={() => setShowEmailCapture(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Get Your Free Meal Plan PDF!</h3>
                        <p className="text-muted-foreground">Plus exclusive supplement deals & nutrition tips</p>
                      </div>
                      <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <input
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          type="submit"
                          className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all"
                        >
                          Get Free PDF + 10% Off
                        </button>
                        <p className="text-xs text-center text-muted-foreground">
                          🔒 We respect your privacy. Unsubscribe anytime.
                        </p>
                      </form>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white text-center">
                  <h3 className="text-xl font-bold mb-2">Ready to Transform?</h3>
                  <p className="text-sm opacity-90 mb-4">Get premium supplements to match your plan</p>
                  <a
                    href="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-bold rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    Shop Supplements
                  </a>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-xs opacity-90">🚚 FREE shipping on orders over £50</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-12 border border-green-200 dark:border-green-800 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-green-600 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-saira">AI-Powered Analysis Ready</h3>
                <p className="text-muted-foreground">Complete the form to unlock your personalized nutrition blueprint with supplement timing and meal planning</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
