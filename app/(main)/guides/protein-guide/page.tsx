import ProteinGuideClientPage from "./client-page";

export const metadata = {
  title: 'Complete Protein Guide UK 2024 | How Much Protein Per Day | MuscleSports',
  description: 'Everything about protein: optimal intake (1.6-2.2g/kg), best sources, timing, and supplements. Science-backed protein guide for muscle building and fat loss. MuscleSports UK.',
  keywords: 'protein guide uk, how much protein per day, best protein sources, whey protein benefits, protein timing, protein for muscle growth, high protein foods uk',
  openGraph: {
    title: 'Complete Protein Guide 2024 | MuscleSports UK',
    description: 'Master protein nutrition: optimal intake, timing, and sources for maximum muscle growth and fat loss.',
    type: 'article',
  },
};

export default function ProteinGuidePage() {
  return <ProteinGuideClientPage />;
}

