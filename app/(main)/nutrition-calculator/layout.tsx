import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Nutrition Calculator | Macro & Calorie Calculator UK | MuscleSports',
  description: 'Calculate your daily calories, protein, carbs & fats with our advanced nutrition calculator. Get personalized meal plans, supplement recommendations & macro targets for your fitness goals. Free bodybuilding nutrition tool.',
  keywords: ['nutrition calculator', 'macro calculator', 'calorie calculator uk', 'tdee calculator', 'protein calculator', 'carb calculator', 'bodybuilding nutrition', 'fitness macro calculator', 'free nutrition calculator', 'meal plan calculator', 'bmr calculator', 'body composition calculator'],
  openGraph: {
    title: 'Free Nutrition Calculator - Calculate Your Macros | MuscleSports',
    description: 'Get your personalized nutrition plan with our advanced macro calculator. Calculate calories, protein, carbs & fats based on your goals. Free tool for bodybuilders & fitness enthusiasts.',
    type: 'website',
    url: 'https://musclesports.co.uk/nutrition-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Nutrition Calculator - Calculate Your Macros',
    description: 'Get your personalized nutrition plan. Calculate calories, protein, carbs & fats based on your fitness goals.',
  },
  alternates: {
    canonical: 'https://musclesports.co.uk/nutrition-calculator',
  },
};

export default function NutritionCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

