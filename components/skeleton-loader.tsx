"use client";

interface SkeletonLoaderProps {
  type?: "product" | "category" | "card" | "list";
  count?: number;
}

export function SkeletonLoader({ type = "product", count = 4 }: SkeletonLoaderProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (type === "product") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {skeletons.map((i) => (
          <div 
            key={i} 
            className="bg-card rounded-lg overflow-hidden border border-border shadow-sm"
            style={{
              animation: `slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s backwards`
            }}
          >
            {/* Image skeleton */}
            <div className="aspect-square bg-gradient-to-br from-muted/40 to-muted/20 animate-shimmer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            </div>
            
            {/* Content skeleton */}
            <div className="p-4 space-y-3">
              {/* Title */}
              <div className="h-4 bg-gradient-to-r from-muted/60 to-muted/30 rounded-md animate-shimmer"></div>
              
              {/* Price */}
              <div className="flex items-center gap-2">
                <div className="h-6 w-20 bg-gradient-to-r from-primary/20 to-primary/10 rounded-md animate-shimmer"></div>
              </div>
              
              {/* Button */}
              <div className="h-9 bg-gradient-to-r from-muted/40 to-muted/20 rounded-md animate-shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "category") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {skeletons.map((i) => (
          <div 
            key={i} 
            className="bg-card rounded-lg overflow-hidden border border-border shadow-sm"
            style={{
              animation: `slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s backwards`
            }}
          >
            <div className="aspect-video bg-gradient-to-br from-muted/40 to-muted/20 animate-shimmer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            </div>
            <div className="p-4 space-y-2">
              <div className="h-5 bg-gradient-to-r from-muted/60 to-muted/30 rounded-md animate-shimmer"></div>
              <div className="h-3 w-16 bg-gradient-to-r from-primary/20 to-primary/10 rounded-md animate-shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-3">
        {skeletons.map((i) => (
          <div 
            key={i} 
            className="bg-card rounded-lg p-4 border border-border"
            style={{
              animation: `slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s backwards`
            }}
          >
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-muted/40 to-muted/20 rounded-md animate-shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-muted/60 to-muted/30 rounded-md animate-shimmer"></div>
                <div className="h-3 w-3/4 bg-gradient-to-r from-muted/40 to-muted/20 rounded-md animate-shimmer"></div>
                <div className="h-5 w-24 bg-gradient-to-r from-primary/20 to-primary/10 rounded-md animate-shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default card skeleton
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {skeletons.map((i) => (
        <div 
          key={i} 
          className="bg-card rounded-lg p-6 border border-border"
          style={{
            animation: `slideInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s backwards`
          }}
        >
          <div className="space-y-4">
            <div className="h-6 bg-gradient-to-r from-muted/60 to-muted/30 rounded-md animate-shimmer"></div>
            <div className="h-4 w-3/4 bg-gradient-to-r from-muted/40 to-muted/20 rounded-md animate-shimmer"></div>
            <div className="h-4 w-1/2 bg-gradient-to-r from-muted/40 to-muted/20 rounded-md animate-shimmer"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
