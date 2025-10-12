"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    setTransitionStage("fadeOut");
  }, [pathname]);

  useEffect(() => {
    if (transitionStage === "fadeOut") {
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage("fadeIn");
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [transitionStage, children]);

  return (
    <div
      className={`transition-all duration-300 ${
        transitionStage === "fadeOut" 
          ? "opacity-0 translate-y-2" 
          : "opacity-100 translate-y-0"
      }`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {displayChildren}
    </div>
  );
}
