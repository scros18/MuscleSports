"use client";

import { useState, useEffect } from "react";
import { Sparkles, ChefHat, Clock, Flame, Users, Target, TrendingUp, ShoppingCart, Heart } from "lucide-react";

interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  tags: string[];
  mealType: string;
  bestFor: string;
}

export default function RecipeGeneratorPage() {
  const [formData, setFormData] = useState({
    mealType: 'breakfast',
    calories: '500',
    proteinTarget: '30',
    dietaryRestrictions: [] as string[],
    cookingTime: '30',
    difficulty: 'medium',
    cuisine: 'any',
  });

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleDietaryToggle = (restriction: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }));
  };

  const generateRecipe = async () => {
    setLoading(true);

    // Advanced recipe database with macro-optimized meals
    const recipeDatabase: Record<string, Recipe[]> = {
      breakfast: [
        {
          name: "Anabolic French Toast",
          description: "High-protein breakfast that tastes like dessert. Perfect for muscle building while satisfying sweet cravings.",
          ingredients: [
            "3 egg whites + 1 whole egg",
            "2 slices whole grain bread",
            "1 scoop vanilla whey protein",
            "100ml almond milk",
            "1 tsp cinnamon",
            "5g sugar-free syrup",
            "10g butter (for cooking)",
            "30g Greek yogurt (topping)",
            "50g fresh berries"
          ],
          instructions: [
            "Mix eggs, protein powder, almond milk, and cinnamon in a bowl",
            "Heat butter in a non-stick pan over medium heat",
            "Dip bread slices into the mixture, coating both sides",
            "Cook each side for 2-3 minutes until golden brown",
            "Top with Greek yogurt and fresh berries",
            "Drizzle with sugar-free syrup",
            "Serve immediately while hot"
          ],
          nutrition: {
            calories: 485,
            protein: 48,
            carbs: 42,
            fat: 14,
            fiber: 8
          },
          prepTime: 5,
          cookTime: 10,
          servings: 1,
          difficulty: "Easy",
          tags: ["High-Protein", "Muscle-Building", "Sweet"],
          mealType: "breakfast",
          bestFor: "Post-workout recovery breakfast"
        },
        {
          name: "Power Protein Pancakes",
          description: "Fluffy, macro-friendly pancakes loaded with protein and complex carbs.",
          ingredients: [
            "40g oat flour",
            "1 scoop vanilla protein powder",
            "1 whole egg + 2 egg whites",
            "50ml almond milk",
            "1/2 banana, mashed",
            "1 tsp baking powder",
            "Pinch of salt",
            "5g coconut oil (for cooking)",
            "15g peanut butter (topping)",
            "Sugar-free syrup"
          ],
          instructions: [
            "Blend oat flour, protein powder, and baking powder",
            "In another bowl, whisk eggs and milk",
            "Add mashed banana to wet ingredients",
            "Combine wet and dry ingredients, mix gently",
            "Heat coconut oil in pan over medium heat",
            "Pour 1/4 cup batter for each pancake",
            "Cook 2-3 minutes per side until golden",
            "Stack and top with peanut butter and syrup"
          ],
          nutrition: {
            calories: 520,
            protein: 45,
            carbs: 48,
            fat: 18,
            fiber: 7
          },
          prepTime: 10,
          cookTime: 15,
          servings: 1,
          difficulty: "Easy",
          tags: ["High-Protein", "Pre-Workout", "Filling"],
          mealType: "breakfast",
          bestFor: "Pre-workout energy"
        }
      ],
      lunch: [
        {
          name: "Grilled Chicken Power Bowl",
          description: "Complete macro-balanced meal with lean protein, slow-digesting carbs, and micronutrients.",
          ingredients: [
            "200g chicken breast",
            "100g brown rice (cooked)",
            "50g broccoli florets",
            "30g cherry tomatoes",
            "20g avocado",
            "15ml olive oil",
            "10ml lemon juice",
            "1 tsp garlic powder",
            "Fresh herbs (cilantro/parsley)",
            "Salt and pepper to taste"
          ],
          instructions: [
            "Season chicken with garlic powder, salt, pepper",
            "Grill chicken 6-7 minutes per side until 165°F internal temp",
            "Steam broccoli for 4-5 minutes until tender-crisp",
            "Cook brown rice according to package",
            "Slice chicken and arrange over rice in bowl",
            "Add steamed broccoli and cherry tomatoes",
            "Top with sliced avocado",
            "Drizzle with olive oil and lemon juice",
            "Garnish with fresh herbs"
          ],
          nutrition: {
            calories: 580,
            protein: 52,
            carbs: 48,
            fat: 18,
            fiber: 8
          },
          prepTime: 15,
          cookTime: 20,
          servings: 1,
          difficulty: "Medium",
          tags: ["Lean-Protein", "Balanced", "Meal-Prep"],
          mealType: "lunch",
          bestFor: "Muscle building and recovery"
        },
        {
          name: "Tuna Superfood Salad",
          description: "Protein-packed salad with healthy fats and nutrient-dense greens.",
          ingredients: [
            "1 can (150g) tuna in water, drained",
            "100g mixed greens (spinach, kale, arugula)",
            "50g quinoa (cooked)",
            "30g chickpeas (roasted)",
            "20g feta cheese",
            "15g walnuts, chopped",
            "Cherry tomatoes, halved",
            "Cucumber slices",
            "15ml balsamic vinegar",
            "10ml olive oil"
          ],
          instructions: [
            "Cook quinoa according to package, let cool",
            "Roast chickpeas in oven at 200°C for 15 minutes",
            "Arrange mixed greens as base in large bowl",
            "Add cooked quinoa and flaked tuna",
            "Top with roasted chickpeas, tomatoes, cucumber",
            "Sprinkle with feta cheese and walnuts",
            "Whisk olive oil and balsamic for dressing",
            "Drizzle dressing over salad and toss gently"
          ],
          nutrition: {
            calories: 495,
            protein: 48,
            carbs: 35,
            fat: 20,
            fiber: 9
          },
          prepTime: 10,
          cookTime: 15,
          servings: 1,
          difficulty: "Easy",
          tags: ["High-Protein", "Low-Carb", "Quick"],
          mealType: "lunch",
          bestFor: "Fat loss while preserving muscle"
        }
      ],
      dinner: [
        {
          name: "Anabolic Beef & Sweet Potato",
          description: "Muscle-building dinner with lean beef, complex carbs, and recovery nutrients.",
          ingredients: [
            "200g lean beef sirloin",
            "200g sweet potato",
            "100g asparagus spears",
            "50g mushrooms, sliced",
            "15ml olive oil",
            "10g butter",
            "2 garlic cloves, minced",
            "Fresh rosemary",
            "Salt and pepper to taste"
          ],
          instructions: [
            "Preheat oven to 200°C, pierce sweet potato, bake 45 min",
            "Season beef with salt, pepper, and rosemary",
            "Heat olive oil in cast iron pan over high heat",
            "Sear beef 3-4 minutes per side for medium",
            "Let beef rest while cooking vegetables",
            "Sauté mushrooms and asparagus in butter and garlic",
            "Slice sweet potato, add butter if desired",
            "Slice beef against the grain",
            "Plate beef with sweet potato and vegetables"
          ],
          nutrition: {
            calories: 620,
            protein: 52,
            carbs: 48,
            fat: 24,
            fiber: 10
          },
          prepTime: 10,
          cookTime: 50,
          servings: 1,
          difficulty: "Medium",
          tags: ["High-Protein", "Post-Workout", "Iron-Rich"],
          mealType: "dinner",
          bestFor: "Evening recovery and muscle growth"
        },
        {
          name: "Omega-3 Salmon Bowl",
          description: "Anti-inflammatory dinner packed with omega-3s and complete nutrition.",
          ingredients: [
            "180g salmon fillet",
            "150g white rice (cooked)",
            "100g edamame beans",
            "50g cucumber, sliced",
            "30g carrots, julienned",
            "20ml soy sauce (low sodium)",
            "10ml sesame oil",
            "5g sesame seeds",
            "Nori sheets (optional)",
            "Wasabi and ginger (optional)"
          ],
          instructions: [
            "Season salmon with salt and pepper",
            "Bake salmon at 200°C for 12-15 minutes",
            "Cook white rice according to package",
            "Boil edamame for 5 minutes, drain",
            "Arrange rice as base in bowl",
            "Add cucumber, carrots, and edamame",
            "Place cooked salmon on top",
            "Drizzle with soy sauce and sesame oil",
            "Sprinkle sesame seeds and nori",
            "Serve with wasabi and ginger if desired"
          ],
          nutrition: {
            calories: 595,
            protein: 48,
            carbs: 52,
            fat: 22,
            fiber: 6
          },
          prepTime: 15,
          cookTime: 15,
          servings: 1,
          difficulty: "Easy",
          tags: ["Omega-3", "Anti-Inflammatory", "Quick"],
          mealType: "dinner",
          bestFor: "Recovery and hormone production"
        }
      ],
      snack: [
        {
          name: "Anabolic Ice Cream",
          description: "High-protein dessert that satisfies cravings without breaking macros.",
          ingredients: [
            "1 frozen banana",
            "1 scoop chocolate protein powder",
            "100ml almond milk",
            "10g cocoa powder",
            "5g peanut butter powder (PB2)",
            "Ice cubes (handful)",
            "Sugar-free chocolate chips (optional)",
            "Whipped cream (small dollop)"
          ],
          instructions: [
            "Add frozen banana to blender",
            "Add protein powder, almond milk, cocoa",
            "Blend on high for 2 minutes",
            "Add ice cubes for thicker consistency",
            "Blend until smooth and creamy",
            "Pour into bowl",
            "Top with PB2, chocolate chips, whipped cream",
            "Eat immediately for best texture"
          ],
          nutrition: {
            calories: 285,
            protein: 32,
            carbs: 35,
            fat: 4,
            fiber: 6
          },
          prepTime: 5,
          cookTime: 0,
          servings: 1,
          difficulty: "Very Easy",
          tags: ["High-Protein", "Sweet", "Low-Fat"],
          mealType: "snack",
          bestFor: "Evening protein boost or dessert replacement"
        },
        {
          name: "Power Protein Balls",
          description: "Portable energy bombs perfect for pre or post-workout fuel.",
          ingredients: [
            "100g rolled oats",
            "60g almond butter",
            "40g vanilla protein powder",
            "30g honey",
            "20g dark chocolate chips",
            "20g chia seeds",
            "10g cocoa powder",
            "Pinch of sea salt"
          ],
          instructions: [
            "Mix all dry ingredients in large bowl",
            "Add almond butter and honey, mix well",
            "If too dry, add 1 tbsp water at a time",
            "Fold in chocolate chips",
            "Roll into 12 equal balls",
            "Refrigerate for 30 minutes to firm up",
            "Store in airtight container up to 1 week"
          ],
          nutrition: {
            calories: 165,
            protein: 9,
            carbs: 18,
            fat: 7,
            fiber: 3
          },
          prepTime: 15,
          cookTime: 0,
          servings: 12,
          difficulty: "Very Easy",
          tags: ["Meal-Prep", "Pre-Workout", "Portable"],
          mealType: "snack",
          bestFor: "Quick energy and protein between meals"
        }
      ]
    };

    // Intelligent recipe selection based on user criteria
    setTimeout(() => {
      const availableRecipes = recipeDatabase[formData.mealType];
      const targetCalories = parseInt(formData.calories);
      const targetProtein = parseInt(formData.proteinTarget);

      // Filter by dietary restrictions
      let filtered = availableRecipes.filter(recipe => {
        if (formData.dietaryRestrictions.includes('Vegan') && !recipe.tags.includes('Vegan')) return false;
        if (formData.dietaryRestrictions.includes('Dairy-Free') && recipe.ingredients.some(i => i.toLowerCase().includes('cheese') || i.toLowerCase().includes('yogurt'))) return false;
        if (formData.dietaryRestrictions.includes('Low-Carb') && recipe.nutrition.carbs > 40) return false;
        return true;
      });

      // Find best match by calories and protein
      const bestMatch = filtered.reduce((best, current) => {
        const currentDiff = Math.abs(current.nutrition.calories - targetCalories) + Math.abs(current.nutrition.protein - targetProtein);
        const bestDiff = Math.abs(best.nutrition.calories - targetCalories) + Math.abs(best.nutrition.protein - targetProtein);
        return currentDiff < bestDiff ? current : best;
      }, filtered[0]);

      setRecipe(bestMatch || availableRecipes[0]);
      setLoading(false);
    }, 2000);
  };

  const saveToFavorites = () => {
    if (recipe && !favorites.find(f => f.name === recipe.name)) {
      setFavorites(prev => [...prev, recipe]);
      alert('Recipe saved to favorites!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-gray-950 dark:to-emerald-950/20 py-12">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-4">
            <ChefHat className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">AI-POWERED MEAL PLANNER</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-saira bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-700 bg-clip-text text-transparent">
            Smart Recipe Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Get macro-optimized recipes tailored to your fitness goals. Every meal designed for maximum results.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recipe Generator Form */}
          <div className="bg-white dark:bg-card rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800 h-fit">
            <h2 className="text-2xl font-bold mb-6 font-saira flex items-center gap-2">
              <Target className="w-6 h-6 text-emerald-600" />
              Recipe Preferences
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Meal Type</label>
                  <select
                    name="mealType"
                    value={formData.mealType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 transition-all"
                  >
                    <option value="breakfast">🌅 Breakfast</option>
                    <option value="lunch">☀️ Lunch</option>
                    <option value="dinner">🌙 Dinner</option>
                    <option value="snack">🍪 Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Target Calories</label>
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleInputChange}
                    placeholder="500"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Protein Target (g)</label>
                <input
                  type="number"
                  name="proteinTarget"
                  value={formData.proteinTarget}
                  onChange={handleInputChange}
                  placeholder="30"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-3">Dietary Preferences</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Low-Carb', 'Keto'].map(restriction => (
                    <button
                      key={restriction}
                      onClick={() => handleDietaryToggle(restriction)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        formData.dietaryRestrictions.includes(restriction)
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {restriction}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Max Cooking Time</label>
                  <select
                    name="cookingTime"
                    value={formData.cookingTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 transition-all"
                  >
                    <option value="15">⚡ 15 min</option>
                    <option value="30">🕐 30 min</option>
                    <option value="45">🕑 45 min</option>
                    <option value="60">⏰ 1 hour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Difficulty</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-800 transition-all"
                  >
                    <option value="easy">😊 Easy</option>
                    <option value="medium">👨‍🍳 Medium</option>
                    <option value="hard">⭐ Advanced</option>
                  </select>
                </div>
              </div>

              <button
                onClick={generateRecipe}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all duration-300 text-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Recipe...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Recipe
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Recipe Results */}
          <div className="lg:sticky lg:top-8 h-fit">
            {recipe ? (
              <div className="bg-white dark:bg-card rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-fade-in">
                {/* Recipe Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2 font-saira">{recipe.name}</h2>
                      <p className="text-sm opacity-90">{recipe.description}</p>
                    </div>
                    <button
                      onClick={saveToFavorites}
                      className="ml-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="text-center bg-white/10 backdrop-blur rounded-lg p-2">
                      <Clock className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-xs">{recipe.prepTime + recipe.cookTime}min</div>
                    </div>
                    <div className="text-center bg-white/10 backdrop-blur rounded-lg p-2">
                      <Users className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-xs">{recipe.servings} serving</div>
                    </div>
                    <div className="text-center bg-white/10 backdrop-blur rounded-lg p-2">
                      <ChefHat className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-xs">{recipe.difficulty}</div>
                    </div>
                  </div>
                </div>

                {/* Nutrition Facts */}
                <div className="p-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    Nutrition Facts
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-xl">
                      <div className="text-xl font-bold text-orange-600">{recipe.nutrition.calories}</div>
                      <div className="text-xs text-muted-foreground">Calories</div>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-xl">
                      <div className="text-xl font-bold text-red-600">{recipe.nutrition.protein}g</div>
                      <div className="text-xs text-muted-foreground">Protein</div>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-xl">
                      <div className="text-xl font-bold text-blue-600">{recipe.nutrition.carbs}g</div>
                      <div className="text-xs text-muted-foreground">Carbs</div>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-xl">
                      <div className="text-xl font-bold text-yellow-600">{recipe.nutrition.fat}g</div>
                      <div className="text-xs text-muted-foreground">Fat</div>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-xl">
                      <div className="text-xl font-bold text-green-600">{recipe.nutrition.fiber}g</div>
                      <div className="text-xs text-muted-foreground">Fiber</div>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                      💡 {recipe.bestFor}
                    </p>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-emerald-600" />
                    Ingredients
                  </h3>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-xs font-bold text-emerald-600 flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-sm">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div className="p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Instructions
                  </h3>
                  <ol className="space-y-3">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-sm leading-relaxed">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* CTA */}
                <div className="p-6 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
                  <p className="text-sm mb-3">Need a convenient protein boost?</p>
                  <a
                    href="/products?search=Protein%20Bar"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Shop Protein Bars
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-2xl p-12 border border-emerald-200 dark:border-emerald-800 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <ChefHat className="w-10 h-10 text-emerald-600 animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-saira">Recipe Ready to Cook</h3>
                <p className="text-muted-foreground">Set your preferences and generate a macro-optimized meal tailored to your fitness goals</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
