// hooks/useViewportHeight.ts
'use client';

import { useState, useEffect } from 'react';

// This hook returns `true` if the viewport height is less than the specified threshold.
export const useViewportHeight = (threshold = 700) => {
  const [isShort, setIsShort] = useState(false);

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setIsShort(window.innerHeight < threshold);
    };

    // Set the initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [threshold]); // Only re-run effect if threshold changes

  return isShort;
};