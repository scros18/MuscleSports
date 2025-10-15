import { Metadata } from "next";
import TestosteroneGuideClient from "./client-page";

export const metadata: Metadata = {
  title: 'Testosterone Guide UK 2024 | Boost Testosterone Naturally | MuscleSports',
  description: 'Complete testosterone guide for men: natural ways to boost testosterone through diet, exercise, sleep, and supplements. Combat 30% T decline. Expert advice from MuscleSports UK.',
  keywords: 'testosterone guide uk, boost testosterone naturally, testosterone supplements uk, low testosterone symptoms, testosterone boosting foods, mens health supplements uk, ashwagandha testosterone',
  openGraph: {
    title: 'Ultimate Testosterone Guide 2024 | MuscleSports UK',
    description: 'Learn how to naturally support testosterone levels through lifestyle, nutrition, and evidence-based supplements.',
    type: 'article',
  },
};

export default function TestosteroneGuidePage() {
  return <TestosteroneGuideClient />;
}
