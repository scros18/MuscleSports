'use client';

import { useState, useEffect } from 'react';
import { Dumbbell, Rocket, Sparkles, Zap, Trophy, Target, TrendingUp } from 'lucide-react';
import Image from 'next/image';

interface MaintenancePageProps {
  message?: string;
  estimatedTime?: string;
}

export function MaintenancePage({ message, estimatedTime }: MaintenancePageProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [progress, setProgress] = useState(0);

  // Initialize time on client only to avoid hydration mismatch
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Animated progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Check if maintenance mode is actually active
  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const response = await fetch('/api/maintenance-status');
        const data = await response.json();
        
        // If maintenance is no longer active, redirect to home immediately
        if (!data.isMaintenanceMode) {
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error checking maintenance status:', error);
      }
    };

    // Check immediately on mount
    checkMaintenance();
    
    // Check every 5 seconds
    const interval = setInterval(checkMaintenance, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900" suppressHydrationWarning>
      {/* Animated geometric background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-emerald-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-5xl mx-auto w-full">
          {/* Main Card */}
          <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-emerald-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-500/20 p-8 md:p-12 lg:p-16">
            
            {/* Logo Section */}
            <div className="text-center mb-12">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 blur-2xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-6 rounded-3xl shadow-2xl transform hover:scale-110 transition-transform duration-300">
                  <Dumbbell className="w-16 h-16 text-white drop-shadow-2xl" strokeWidth={2.5} />
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 mb-4 tracking-tight">
                MUSCLESPORTS
              </h1>
              
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-1 w-16 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full"></div>
                <Sparkles className="w-5 h-5 text-emerald-400 animate-spin-slow" />
                <div className="h-1 w-16 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full"></div>
              </div>

              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-6 py-3 mb-8">
                <Rocket className="w-5 h-5 text-emerald-400 animate-bounce" />
                <span className="text-emerald-300 font-bold text-lg">POWERING UP</span>
                <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
              </div>
            </div>

            {/* Main Message */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                We&apos;re <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">Building Something Epic</span>
              </h2>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                {message || "Our team is supercharging the platform with cutting-edge features, lightning-fast performance, and an unbeatable user experience. Get ready for something extraordinary!"}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-3">
                <span className="text-emerald-400 font-semibold text-sm">UPGRADE PROGRESS</span>
                <span className="text-emerald-400 font-mono text-sm">{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden border border-emerald-500/20">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="group bg-gradient-to-br from-slate-800/50 to-emerald-900/30 backdrop-blur-sm rounded-2xl p-6 border border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Trophy className="w-7 h-7 text-emerald-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Premium Quality</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Enhanced product catalog with detailed specs and reviews</p>
              </div>

              <div className="group bg-gradient-to-br from-slate-800/50 to-green-900/30 backdrop-blur-sm rounded-2xl p-6 border border-green-500/10 hover:border-green-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Lightning Fast</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Blazing speeds with our new Cache+ technology</p>
              </div>

              <div className="group bg-gradient-to-br from-slate-800/50 to-teal-900/30 backdrop-blur-sm rounded-2xl p-6 border border-teal-500/10 hover:border-teal-500/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-7 h-7 text-teal-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Smart Features</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Personalized recommendations and fitness tracking</p>
              </div>
            </div>

            {/* MEGA DISCOUNT BANNER */}
            <div className="relative mb-12 group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity animate-pulse"></div>
              
              <div className="relative bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 rounded-3xl p-8 md:p-12 border-4 border-white/20 shadow-2xl overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
                  }}></div>
                </div>

                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center gap-2 bg-yellow-400 text-slate-900 px-6 py-2 rounded-full font-black text-sm md:text-base mb-6 animate-bounce shadow-lg">
                    <Sparkles className="w-5 h-5" />
                    LIMITED TIME LAUNCH OFFER
                    <Sparkles className="w-5 h-5" />
                  </div>

                  <h3 className="text-6xl md:text-8xl font-black text-white mb-4 drop-shadow-2xl tracking-tighter">
                    10% OFF
                  </h3>

                  <p className="text-3xl md:text-4xl font-bold text-white mb-8 drop-shadow-lg">
                    YOUR FIRST ORDER!
                  </p>

                  <div className="inline-block bg-white/20 backdrop-blur-md rounded-2xl px-8 py-5 mb-6 border-2 border-white/30 shadow-xl">
                    <p className="text-sm text-white/80 mb-2 font-semibold">USE PROMO CODE</p>
                    <p className="text-3xl md:text-4xl font-black text-yellow-300 tracking-widest font-mono drop-shadow-lg">
                      WELCOME10
                    </p>
                  </div>

                  <p className="text-white text-lg md:text-xl font-semibold mb-4">
                    💪 Valid on ALL products when we launch!
                  </p>
                  
                  <p className="text-white/80 text-sm">
                    Save this code • Share with your gym buddies • Get ready to save big!
                  </p>
                </div>

                {/* Corner decorations */}
                <div className="absolute top-4 right-4 text-yellow-300 text-4xl animate-pulse">✨</div>
                <div className="absolute bottom-4 left-4 text-yellow-300 text-4xl animate-pulse" style={{animationDelay: '0.5s'}}>⚡</div>
              </div>
            </div>

            {/* Time Display */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-400 animate-pulse" />
                <span className="text-slate-400 font-semibold">CURRENT TIME</span>
              </div>
              <p className="text-3xl font-mono font-bold text-emerald-400" suppressHydrationWarning>
                {currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}
              </p>
              {estimatedTime && (
                <p className="text-slate-400 text-sm mt-3">
                  Estimated completion: <span className="text-emerald-400 font-semibold">{estimatedTime}</span>
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-slate-500 text-sm">
              <p>This page auto-refreshes every 5 seconds • We&apos;ll redirect you automatically when ready</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.5; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
