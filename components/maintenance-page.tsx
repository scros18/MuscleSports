'use client';

import { useState, useEffect } from 'react';
import { Wrench, Clock, Mail, Phone, ArrowLeft } from 'lucide-react';

interface MaintenancePageProps {
  message?: string;
  estimatedTime?: string;
}

export function MaintenancePage({ message, estimatedTime }: MaintenancePageProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isActive, setIsActive] = useState(true);

  // Initialize time on client only to avoid hydration mismatch
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
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
          setIsActive(false);
        } else {
          setIsActive(true);
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

  // Don't render if not active
  if (!isActive) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4" suppressHydrationWarning>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Logo/Brand */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-2xl mb-6">
            <Wrench className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-saira">
            MuscleSports
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
        </div>

        {/* Main message */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            We&apos;re Upgrading Our System
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {message || "We are currently performing scheduled maintenance to improve your experience. Please check back soon!"}
          </p>
        </div>

        {/* Status indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Wrench className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Maintenance</h3>
            <p className="text-gray-400 text-sm">System upgrades in progress</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Current Time</h3>
            <p className="text-gray-400 text-sm font-mono" suppressHydrationWarning>
              {currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <ArrowLeft className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Status</h3>
            <p className="text-gray-400 text-sm">We&apos;ll be back soon</p>
          </div>
        </div>

        {/* Estimated time */}
        {estimatedTime && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30 mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">Estimated Completion</span>
            </div>
            <p className="text-white text-lg font-mono">{estimatedTime}</p>
          </div>
        )}

          {/* WELCOME DISCOUNT - 10% OFF */}
        <div className="mb-8 relative overflow-hidden">
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          
          <div className="relative bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 rounded-2xl p-8 border-4 border-green-400/50 shadow-2xl">
            {/* Sparkle decorations */}
            <div className="absolute top-2 right-2 text-yellow-300 text-2xl animate-pulse">✨</div>
            <div className="absolute bottom-2 left-2 text-yellow-300 text-2xl animate-pulse delay-500">✨</div>
            
            <div className="text-center">
              <div className="inline-block bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold mb-4 animate-bounce">
                🎉 EXCLUSIVE LAUNCH OFFER 🎉
              </div>
              
              <h3 className="text-4xl md:text-5xl font-black text-white mb-3 font-saira">
                10% OFF
              </h3>
              
              <p className="text-xl md:text-2xl font-bold text-white mb-4">
                YOUR FIRST ORDER!
              </p>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-4 inline-block mb-3">
                <p className="text-white font-mono text-lg md:text-xl font-bold tracking-wider">
                  CODE: <span className="text-yellow-300">WELCOME10</span>
                </p>
              </div>
              
              <p className="text-green-100 text-sm md:text-base">
                Use this code when we&apos;re back online! 💪
              </p>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-white/80 text-xs">
                <Clock className="w-4 h-4" />
                <span>Valid for your first purchase after launch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-white font-semibold mb-4">Need Immediate Assistance?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@musclesports.co.uk" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              support@musclesports.co.uk
            </a>
            <a 
              href="tel:+441234567890" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              +44 123 456 7890
            </a>
          </div>
        </div>

        {/* Auto-refresh notice */}
        <div className="mt-8 text-gray-500 text-sm">
          <p>This page checks for updates every 10 seconds and will automatically redirect when maintenance is complete.</p>
        </div>
      </div>

      {/* Floating maintenance icon */}
      <div className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
        <Wrench className="w-8 h-8 text-white" />
      </div>
    </div>
  );
}
