"use client";

import { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ 
  size = "lg", 
  message = "Loading products...", 
  fullScreen = false 
}: LoadingSpinnerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-14 w-14",
    lg: "h-20 w-20",
    xl: "h-28 w-28"
  };

  const content = (
    <div 
      className="flex flex-col items-center justify-center gap-6"
      style={{
        animation: mounted ? 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
      }}
    >
      {/* Shopify-inspired premium spinner */}
      <div className="relative" style={{ filter: 'drop-shadow(0 4px 20px rgba(74, 144, 226, 0.15))' }}>
        {/* Outer decorative ring with shimmer */}
        <div 
          className={`${sizeClasses[size]} rounded-full absolute inset-0`}
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, rgba(74, 144, 226, 0.1) 180deg, transparent 360deg)',
            animation: 'spin 3s linear infinite reverse'
          }}
        ></div>

        {/* Main spinning ring - smooth and elegant */}
        <svg 
          className={sizeClasses[size]}
          viewBox="0 0 50 50"
          style={{
            animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite'
          }}
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="90, 150"
            strokeDashoffset="0"
            className="text-primary"
            style={{
              animation: 'dash 1.5s ease-in-out infinite',
              transformOrigin: 'center'
            }}
          />
        </svg>

        {/* Inner pulsing glow */}
        <div 
          className={`${sizeClasses[size]} rounded-full absolute inset-0 opacity-30 blur-xl`}
          style={{ 
            background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 65%)",
            animation: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        ></div>

        {/* Center dot - subtle branding */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
        >
          <div 
            className="w-2 h-2 rounded-full bg-primary"
            style={{ 
              animation: 'scale-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              boxShadow: '0 0 10px rgba(74, 144, 226, 0.4)'
            }}
          ></div>
        </div>
      </div>

      {/* Loading message with elegant typography */}
      {message && (
        <div className="flex flex-col items-center gap-3">
          <p 
            className="text-sm font-medium tracking-wide text-foreground/70"
            style={{
              animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both'
            }}
          >
            {message}
          </p>
          {/* Bouncing dots indicator */}
          <div className="flex gap-1.5 h-2">
            <span 
              className="w-1.5 h-1.5 bg-primary rounded-full"
              style={{ animation: 'bounce-smooth 1.4s ease-in-out infinite', animationDelay: '0s' }}
            ></span>
            <span 
              className="w-1.5 h-1.5 bg-primary rounded-full"
              style={{ animation: 'bounce-smooth 1.4s ease-in-out infinite', animationDelay: '0.2s' }}
            ></span>
            <span 
              className="w-1.5 h-1.5 bg-primary rounded-full"
              style={{ animation: 'bounce-smooth 1.4s ease-in-out infinite', animationDelay: '0.4s' }}
            ></span>
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center"
        style={{
          animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      {content}
    </div>
  );
}
