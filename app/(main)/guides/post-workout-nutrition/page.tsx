import PostWorkoutNutritionClientPage from "./client-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Post-Workout Nutrition Guide UK | Best Recovery Foods & Supplements | MuscleSports',
  description: 'Complete guide to post-workout nutrition: optimal protein timing, carb replenishment, recovery supplements. Science-backed advice for maximum muscle growth.',
  keywords: 'post workout nutrition, post workout meal, recovery nutrition, protein after workout, post workout supplements uk, muscle recovery nutrition',
};

export default function PostWorkoutNutritionPage() {
  return <PostWorkoutNutritionClientPage />;
}

