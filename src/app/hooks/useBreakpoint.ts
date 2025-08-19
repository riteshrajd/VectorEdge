'use client'
// --- Step 1: The Breakpoint Hook ---

import { useEffect, useState } from "react";

// You can place this in a separate file like `/hooks/useBreakpoint.ts`
export const useBreakpoint = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Tailwind's default 'md' breakpoint is 768px
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    
    const handleResize = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Set the initial state
    setIsMobile(mediaQuery.matches);
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleResize);
    
    // Cleanup listener on component unmount
    return () => mediaQuery.removeEventListener('change', handleResize);
  }, []);

  return isMobile;
};
