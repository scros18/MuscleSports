import { Metadata } from "next";
import PreWorkoutBenefitsClient from "./client-page";

export const metadata: Metadata = {
  title: "Pre-Workout Supplements Guide UK 2024 | Performance Boosters | MuscleSports",
  description: "Complete pre-workout guide: ingredient breakdown, optimal dosing, timing, and safety. Boost workout performance 5-15% with science-backed supplements from MuscleSports UK.",
  keywords: "pre-workout supplements uk, best pre-workout, caffeine dosage, beta-alanine, citrulline malate, pre-workout timing, workout boosters",
};

export default function PreWorkoutBenefitsPage() {
  return <PreWorkoutBenefitsClient />;
}

