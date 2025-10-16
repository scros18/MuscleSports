"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DynamicPageTitle } from "@/components/dynamic-page-title";
import { Target, Zap, Heart, TrendingUp, Award, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuizStep {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    icon?: string;
    description?: string;
  }[];
}

export default function SupplementFinderPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const quizSteps: QuizStep[] = [
    {
      id: "goal",
      question: "What&apos;s your primary fitness goal?",
      options: [
        { value: "muscle-gain", label: "Build Muscle", icon: "💪", description: "Increase muscle mass and strength" },
        { value: "weight-loss", label: "Lose Weight", icon: "🔥", description: "Burn fat and get lean" },
        { value: "performance", label: "Boost Performance", icon: "⚡", description: "Enhance athletic performance" },
        { value: "general-health", label: "General Health", icon: "❤️", description: "Maintain overall wellness" },
        { value: "endurance", label: "Build Endurance", icon: "🏃", description: "Improve stamina and cardio" }
      ]
    },
    {
      id: "experience",
      question: "What&apos;s your fitness experience level?",
      options: [
        { value: "beginner", label: "Beginner", icon: "🌱", description: "Just starting out" },
        { value: "intermediate", label: "Intermediate", icon: "📈", description: "6-12 months experience" },
        { value: "advanced", label: "Advanced", icon: "🏆", description: "1+ years consistent training" },
        { value: "athlete", label: "Athlete", icon: "🥇", description: "Professional/competitive level" }
      ]
    },
    {
      id: "workout-frequency",
      question: "How often do you work out?",
      options: [
        { value: "1-2", label: "1-2 times/week", icon: "🗓️" },
        { value: "3-4", label: "3-4 times/week", icon: "📅" },
        { value: "5-6", label: "5-6 times/week", icon: "🔄" },
        { value: "daily", label: "Daily", icon: "💯" }
      ]
    },
    {
      id: "diet",
      question: "What&apos;s your dietary preference?",
      options: [
        { value: "omnivore", label: "Omnivore", icon: "🍖", description: "Eat everything" },
        { value: "vegetarian", label: "Vegetarian", icon: "🥗", description: "No meat" },
        { value: "vegan", label: "Vegan", icon: "🌱", description: "Plant-based only" },
        { value: "keto", label: "Keto/Low-Carb", icon: "🥑", description: "High fat, low carb" }
      ]
    },
    {
      id: "budget",
      question: "What&apos;s your monthly supplement budget?",
      options: [
        { value: "budget", label: "£30-50", icon: "💷", description: "Essential basics" },
        { value: "moderate", label: "£50-100", icon: "💰", description: "Quality essentials" },
        { value: "premium", label: "£100-200", icon: "💎", description: "Premium stack" },
        { value: "unlimited", label: "£200+", icon: "👑", description: "Best of everything" }
      ]
    }
  ];

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [quizSteps[currentStep].id]: value };
    setAnswers(newAnswers);

    if (currentStep < quizSteps.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const getRecommendations = () => {
    const goal = answers.goal;
    const budget = answers.budget;
    const diet = answers.diet;

    const recommendations: any[] = [];

    // Core essentials based on goal
    if (goal === "muscle-gain") {
      recommendations.push(
        { name: "Whey Protein Isolate", reason: "Essential for muscle growth and recovery", category: "Protein", priority: "Essential" },
        { name: "Creatine Monohydrate", reason: "Proven to increase strength and muscle mass", category: "Performance", priority: "Essential" },
        { name: "Pre-Workout", reason: "Boost energy and workout intensity", category: "Energy", priority: "Recommended" },
        { name: "BCAAs", reason: "Reduce muscle breakdown during training", category: "Recovery", priority: "Recommended" }
      );
    } else if (goal === "weight-loss") {
      recommendations.push(
        { name: "Whey Protein", reason: "Maintain muscle while cutting calories", category: "Protein", priority: "Essential" },
        { name: "Fat Burner", reason: "Support metabolism and energy levels", category: "Weight Loss", priority: "Recommended" },
        { name: "L-Carnitine", reason: "Enhance fat burning during cardio", category: "Weight Loss", priority: "Recommended" },
        { name: "Multivitamin", reason: "Fill nutritional gaps during calorie deficit", category: "Health", priority: "Essential" }
      );
    } else if (goal === "performance") {
      recommendations.push(
        { name: "Pre-Workout", reason: "Maximize workout intensity and focus", category: "Energy", priority: "Essential" },
        { name: "Creatine", reason: "Increase power output and strength", category: "Performance", priority: "Essential" },
        { name: "Beta-Alanine", reason: "Improve muscular endurance", category: "Performance", priority: "Recommended" },
        { name: "Electrolytes", reason: "Maintain hydration and performance", category: "Recovery", priority: "Recommended" }
      );
    } else if (goal === "endurance") {
      recommendations.push(
        { name: "Endurance Carbs", reason: "Sustained energy for long workouts", category: "Energy", priority: "Essential" },
        { name: "Electrolytes", reason: "Prevent cramping and dehydration", category: "Recovery", priority: "Essential" },
        { name: "Beta-Alanine", reason: "Delay muscle fatigue", category: "Performance", priority: "Recommended" },
        { name: "L-Glutamine", reason: "Support recovery and immunity", category: "Recovery", priority: "Recommended" }
      );
    } else {
      recommendations.push(
        { name: "Multivitamin", reason: "Complete daily nutritional support", category: "Health", priority: "Essential" },
        { name: "Omega-3 Fish Oil", reason: "Heart and brain health", category: "Health", priority: "Essential" },
        { name: "Vitamin D3", reason: "Immune system and bone health", category: "Health", priority: "Recommended" },
        { name: "Protein Powder", reason: "Convenient protein intake", category: "Protein", priority: "Recommended" }
      );
    }

    // Adjust for vegan diet
    if (diet === "vegan") {
      recommendations.forEach(rec => {
        if (rec.name.includes("Whey")) {
          rec.name = rec.name.replace("Whey", "Vegan");
        }
      });
    }

    return recommendations;
  };

  const restartQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  };

  if (showResults) {
    const recommendations = getRecommendations();
    const essential = recommendations.filter(r => r.priority === "Essential");
    const recommended = recommendations.filter(r => r.priority === "Recommended");

    return (
      <>
        <DynamicPageTitle pageTitle="Your Personalized Supplement Stack" />
        <div className="container py-8 max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <Award className="w-4 h-4 mr-2" />
              Results Ready
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Your Perfect Supplement Stack
            </h1>
            <p className="text-muted-foreground text-lg">
              Based on your goal: <span className="font-semibold text-foreground">{answers.goal?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            </p>
          </div>

          {/* Essential Products */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Essential Stack</h2>
                <p className="text-sm text-muted-foreground">Must-have supplements for your goals</p>
              </div>
            </div>
            <div className="grid gap-4">
              {essential.map((rec, index) => (
                <div key={index} className="bg-card border-2 border-green-200 dark:border-green-800 rounded-xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{rec.name}</h3>
                        <Badge variant="default" className="bg-green-600">Essential</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{rec.reason}</p>
                      <Badge variant="outline">{rec.category}</Badge>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700 flex-shrink-0">
                      View Products
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Products */}
          {recommended.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Recommended Add-Ons</h2>
                  <p className="text-sm text-muted-foreground">Optimize your results even further</p>
                </div>
              </div>
              <div className="grid gap-4">
                {recommended.map((rec, index) => (
                  <div key={index} className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold">{rec.name}</h3>
                          <Badge variant="secondary">Recommended</Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{rec.reason}</p>
                        <Badge variant="outline">{rec.category}</Badge>
                      </div>
                      <Button variant="outline" className="flex-shrink-0">
                        View Products
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-8 text-center border-2 border-green-200 dark:border-green-800">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Shop our curated products that match your goals and get expert support every step of the way.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={() => router.push('/products')}>
                <Target className="w-5 h-5 mr-2" />
                Shop All Products
              </Button>
              <Button size="lg" variant="outline" onClick={restartQuiz}>
                Retake Quiz
              </Button>
            </div>
          </div>

          {/* Price Match Guarantee */}
          <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold mb-1">Price Match Guarantee</h4>
                <p className="text-sm text-muted-foreground">
                  Found it cheaper elsewhere? We&apos;ll match the price + give you an extra 5% off. We&apos;re committed to being the best value in the UK.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const currentQuizStep = quizSteps[currentStep];
  const progress = ((currentStep + 1) / quizSteps.length) * 100;

  return (
    <>
      <DynamicPageTitle pageTitle="Supplement Finder Quiz - Find Your Perfect Stack" />
      <div className="container py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <Target className="w-4 h-4 mr-2" />
            Smart Recommendation Engine
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Find Your Perfect Supplements
          </h1>
          <p className="text-muted-foreground text-lg">
            Answer 5 quick questions to get a personalized supplement stack tailored to your goals
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentStep + 1} of {quizSteps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-600 to-emerald-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-card border-2 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            {currentQuizStep.question}
          </h2>

          <div className="grid gap-4">
            {currentQuizStep.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="group relative overflow-hidden bg-muted/50 hover:bg-muted border-2 border-transparent hover:border-green-500 rounded-xl p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="flex items-center gap-4">
                  {option.icon && (
                    <div className="text-4xl flex-shrink-0">
                      {option.icon}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-bold text-lg mb-1">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-muted-foreground">
                        {option.description}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 via-green-600/5 to-green-600/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Back Button */}
        {currentStep > 0 && (
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="text-muted-foreground"
            >
              ← Back to Previous Question
            </Button>
          </div>
        )}

        {/* Trust Signals */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-card border rounded-xl p-6">
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-bold mb-1">Expert Approved</div>
            <div className="text-sm text-muted-foreground">Recommendations from certified nutritionists</div>
          </div>
          <div className="bg-card border rounded-xl p-6">
            <div className="text-3xl mb-2">🔬</div>
            <div className="font-bold mb-1">Science-Backed</div>
            <div className="text-sm text-muted-foreground">Based on latest research and studies</div>
          </div>
          <div className="bg-card border rounded-xl p-6">
            <div className="text-3xl mb-2">💰</div>
            <div className="font-bold mb-1">Best Value</div>
            <div className="text-sm text-muted-foreground">Price match guarantee on all products</div>
          </div>
        </div>
      </div>
    </>
  );
}

