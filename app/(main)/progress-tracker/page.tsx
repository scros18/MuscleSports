"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DynamicPageTitle } from "@/components/dynamic-page-title";
import { TrendingUp, Target, Calendar, Award, Plus, Trash2, Edit2 } from "lucide-react";

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  category: "weight" | "strength" | "cardio" | "nutrition";
  deadline: string;
}

interface ProgressEntry {
  id: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  arms?: number;
  legs?: number;
  notes?: string;
}

export default function ProgressTrackerPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [progressLog, setProgressLog] = useState<ProgressEntry[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showAddProgress, setShowAddProgress] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("ordify");

  // Load saved data from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('fitness_goals');
    const savedProgress = localStorage.getItem('progress_log');
    
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedProgress) setProgressLog(JSON.parse(savedProgress));

    const detectTheme = () => {
      const classList = document.documentElement.classList;
      if (classList.contains('theme-musclesports')) return 'musclesports';
      if (classList.contains('theme-vera')) return 'vera';
      return 'ordify';
    };
    
    setCurrentTheme(detectTheme());
  }, []);

  // Save to localStorage whenever goals or progress changes
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('fitness_goals', JSON.stringify(goals));
    }
  }, [goals]);

  useEffect(() => {
    if (progressLog.length > 0) {
      localStorage.setItem('progress_log', JSON.stringify(progressLog));
    }
  }, [progressLog]);

  const addGoal = (goal: Omit<Goal, "id">) => {
    const newGoal = { ...goal, id: Date.now().toString() };
    setGoals([...goals, newGoal]);
    setShowAddGoal(false);
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const addProgress = (entry: Omit<ProgressEntry, "id">) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setProgressLog([newEntry, ...progressLog]);
    setShowAddProgress(false);
  };

  const getProgress = (goal: Goal) => {
    const percentage = (goal.current / goal.target) * 100;
    return Math.min(percentage, 100);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      weight: "bg-green-500",
      strength: "bg-blue-500",
      cardio: "bg-orange-500",
      nutrition: "bg-purple-500"
    };
    return colors[category] || "bg-gray-500";
  };

  const defaultGoals: Omit<Goal, "id">[] = [
    { name: "Lose Weight", target: 80, current: 90, unit: "kg", category: "weight", deadline: "2025-06-01" },
    { name: "Bench Press", target: 100, current: 80, unit: "kg", category: "strength", deadline: "2025-05-01" },
    { name: "Run 5K", target: 30, current: 40, unit: "minutes", category: "cardio", deadline: "2025-04-15" }
  ];

  return (
    <>
      <DynamicPageTitle pageTitle="Progress Tracker - Track Your Fitness Journey" />
      
      <div className="container py-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className={`mb-4 px-4 py-2 ${
            currentTheme === 'musclesports'
              ? 'bg-gradient-to-r from-green-600 to-emerald-600'
              : currentTheme === 'vera'
              ? 'bg-gradient-to-r from-orange-600 to-red-600'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600'
          } text-white`}>
            <TrendingUp className="w-4 h-4 mr-2" />
            Track Your Progress
          </Badge>
          
          <h1 className={`text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r ${
            currentTheme === 'musclesports'
              ? 'from-green-600 to-emerald-600'
              : currentTheme === 'vera'
              ? 'from-orange-600 to-red-600'
              : 'from-blue-600 to-indigo-600'
          } bg-clip-text text-transparent`}>
            Fitness Progress Tracker
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Set goals, track measurements, and visualize your transformation journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Goals Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Target className="w-6 h-6" />
                Your Goals
              </h2>
              <Button 
                onClick={() => setShowAddGoal(!showAddGoal)}
                className={
                  currentTheme === 'musclesports'
                    ? 'bg-green-600 hover:bg-green-700'
                    : currentTheme === 'vera'
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </div>

            {/* Add Goal Form */}
            {showAddGoal && (
              <div className="bg-card border-2 rounded-xl p-6 mb-6">
                <h3 className="font-bold mb-4">Create New Goal</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  addGoal({
                    name: formData.get('name') as string,
                    target: Number(formData.get('target')),
                    current: Number(formData.get('current')),
                    unit: formData.get('unit') as string,
                    category: formData.get('category') as any,
                    deadline: formData.get('deadline') as string
                  });
                  e.currentTarget.reset();
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input name="name" placeholder="Goal name" required />
                    <select name="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                      <option value="weight">Weight</option>
                      <option value="strength">Strength</option>
                      <option value="cardio">Cardio</option>
                      <option value="nutrition">Nutrition</option>
                    </select>
                    <Input name="current" type="number" step="0.1" placeholder="Current value" required />
                    <Input name="target" type="number" step="0.1" placeholder="Target value" required />
                    <Input name="unit" placeholder="Unit (kg, reps, etc.)" required />
                    <Input name="deadline" type="date" required />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">Create Goal</Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddGoal(false)}>Cancel</Button>
                  </div>
                </form>
              </div>
            )}

            {/* Goals List */}
            {goals.length === 0 && !showAddGoal && (
              <div className="bg-card border-2 border-dashed rounded-xl p-12 text-center">
                <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">No Goals Yet</h3>
                <p className="text-muted-foreground mb-6">Start tracking your fitness journey by creating your first goal</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {defaultGoals.map((goal, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => addGoal(goal)}
                    >
                      Add: {goal.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {goals.map((goal) => {
                const progress = getProgress(goal);
                const isCompleted = progress >= 100;
                
                return (
                  <div key={goal.id} className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{goal.name}</h3>
                          <Badge className={getCategoryColor(goal.category) + " text-white"}>
                            {goal.category}
                          </Badge>
                          {isCompleted && (
                            <Badge className="bg-green-600 text-white">
                              <Award className="w-3 h-3 mr-1" />
                              Completed!
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{goal.current} / {goal.target} {goal.unit}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(goal.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="text-muted-foreground hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">Progress</span>
                        <span className="font-bold">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${getCategoryColor(goal.category)}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Log Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Progress Log</h2>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddProgress(!showAddProgress)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Log
                </Button>
              </div>

              {/* Add Progress Form */}
              {showAddProgress && (
                <div className="bg-card border rounded-xl p-4 mb-4">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    addProgress({
                      date: formData.get('date') as string,
                      weight: Number(formData.get('weight')) || undefined,
                      bodyFat: Number(formData.get('bodyFat')) || undefined,
                      notes: formData.get('notes') as string
                    });
                    e.currentTarget.reset();
                  }}>
                    <div className="space-y-3">
                      <Input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                      <Input name="weight" type="number" step="0.1" placeholder="Weight (kg)" />
                      <Input name="bodyFat" type="number" step="0.1" placeholder="Body Fat (%)" />
                      <textarea name="notes" placeholder="Notes..." className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                      <div className="flex gap-2">
                        <Button type="submit" size="sm" className="flex-1">Save</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => setShowAddProgress(false)}>Cancel</Button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Progress Entries */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {progressLog.length === 0 ? (
                  <div className="bg-card border border-dashed rounded-xl p-6 text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No entries yet. Start logging your progress!</p>
                  </div>
                ) : (
                  progressLog.map((entry) => (
                    <div key={entry.id} className="bg-card border rounded-lg p-4">
                      <div className="text-sm font-semibold mb-2">
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {entry.weight && <div>Weight: {entry.weight}kg</div>}
                        {entry.bodyFat && <div>Body Fat: {entry.bodyFat}%</div>}
                        {entry.notes && <div className="mt-2 text-xs italic">{entry.notes}</div>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

