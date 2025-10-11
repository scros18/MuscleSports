"use client";

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
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Animated spinner with gradient - SMOOTH ANIMATION */}
      <div className="relative">
        {/* Outer ring - very thin */}
        <div className={`${sizeClasses[size]} rounded-full border-2 border-gray-100 dark:border-gray-800`}></div>
        
        {/* Spinning gradient ring - smooth continuous spin */}
        <div 
          className={`${sizeClasses[size]} rounded-full absolute inset-0`}
          style={{
            background: 'conic-gradient(from 0deg, transparent 0deg, hsl(var(--primary)) 90deg, transparent 180deg)',
            WebkitMask: 'radial-gradient(circle, transparent 50%, black 50%, black 63%, transparent 63%)',
            mask: 'radial-gradient(circle, transparent 50%, black 50%, black 63%, transparent 63%)',
            animation: 'spin 1s linear infinite'
          }}
        ></div>
        
        {/* Inner glow pulse */}
        <div 
          className={`${sizeClasses[size]} rounded-full absolute inset-0 opacity-20 blur-lg`}
          style={{ 
            background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        ></div>
      </div>

      {/* Loading message - thin elegant font */}
      {message && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-light tracking-wide text-foreground/80">
            {message}
          </p>
          <div className="flex gap-1.5">
            <span 
              className="w-1.5 h-1.5 bg-primary rounded-full"
              style={{ animation: 'bounce 1.4s ease-in-out infinite', animationDelay: '0ms' }}
            ></span>
            <span 
              className="w-1.5 h-1.5 bg-primary rounded-full"
              style={{ animation: 'bounce 1.4s ease-in-out infinite', animationDelay: '0.2s' }}
            ></span>
            <span 
              className="w-1.5 h-1.5 bg-primary rounded-full"
              style={{ animation: 'bounce 1.4s ease-in-out infinite', animationDelay: '0.4s' }}
            ></span>
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
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
