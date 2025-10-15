import { Metadata } from "next";
import WeightLossGuideClient from "./client-page";

export const metadata: Metadata = {
  title: 'Weight Loss Guide UK 2024 | Lose Fat Sustainably | MuscleSports',
  description: 'Science-based weight loss guide: create caloric deficit, optimal nutrition, exercise plans. Lose 0.5-1% body weight per week sustainably. Expert fat loss advice from MuscleSports UK.',
  keywords: 'weight loss guide uk, how to lose weight, fat loss tips, caloric deficit, sustainable weight loss, best fat loss supplements uk, weight loss nutrition plan',
  openGraph: {
    title: 'Ultimate Weight Loss Guide 2024 | MuscleSports UK',
    description: 'Lose fat sustainably with evidence-based strategies. No gimmicks—just proven methods for long-term weight loss success.',
    type: 'article',
  },
};

export default function WeightLossGuidePage() {
  return <WeightLossGuideClient />;
}
