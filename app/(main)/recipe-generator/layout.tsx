import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Recipe Generator | High Protein Meal Ideas UK | MuscleSports',
  description: 'Generate healthy high-protein recipes instantly with our free meal generator. Get macro-optimized recipes for muscle building, fat loss & fitness goals. Perfect for bodybuilders & athletes.',
  keywords: ['recipe generator', 'high protein recipes', 'meal ideas', 'fitness recipes', 'bodybuilding meals', 'macro friendly recipes', 'healthy meal generator', 'protein meal ideas', 'muscle building recipes', 'fitness meal plans'],
  openGraph: {
    title: 'Free Recipe Generator - High Protein Meal Ideas | MuscleSports',
    description: 'Generate macro-optimized recipes instantly. Get healthy high-protein meal ideas for muscle building and fat loss. Free recipe tool.',
    type: 'website',
    url: 'https://musclesports.co.uk/recipe-generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Recipe Generator - High Protein Meals',
    description: 'Generate macro-optimized recipes instantly. Perfect for bodybuilders and fitness enthusiasts.',
  },
  alternates: {
    canonical: 'https://musclesports.co.uk/recipe-generator',
  },
};

export default function RecipeGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

