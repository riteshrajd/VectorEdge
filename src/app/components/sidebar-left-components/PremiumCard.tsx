'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/store';
import { Button } from '@/components/shadcn/ui/button';
import { Crown } from 'lucide-react';
import { useViewportHeight } from '@/app/hooks/useViewportHeight';

const PremiumCard = () => {
  const router = useRouter();
  const { isLeftCollapsed } = useStore();
  const isShortScreen = useViewportHeight(700); // Get the boolean from the hook

  const handleGetPremium = () => {
    router.push('/subscription');
  };

  // Logic for the collapsed desktop sidebar
  if (isLeftCollapsed) {
    return (
      <div className="p-3 border-t border-sidebar-border">
        <Button
          onClick={handleGetPremium}
          size="sm"
          className="w-full bg-primary text-primary-foreground"
          title="Get Premium"
        >
          <Crown size={16} />
        </Button>
      </div>
    );
  }

  return (
    <div className="p-3 border-t border-sidebar-border">
      {/* --- Conditional Rendering Logic --- */}
      {isShortScreen ? (
        // Renders ONLY the button on short screens
        <Button
          onClick={handleGetPremium}
          className="w-full bg-primary text-primary-foreground"
          size="sm"
        >
          Get Premium
        </Button>
      ) : (
        // Renders the full card on taller screens
        <div
          onClick={handleGetPremium}
          className="group relative cursor-pointer overflow-hidden rounded-lg bg-sidebar-accent p-3 text-center shadow-sm transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-blue-500/10 to-emerald-400/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative">
            <h3 className="font-bold text-base text-sidebar-foreground pt-1">
              Get Premium
            </h3>
            <p className="text-sm text-sidebar-accent-foreground my-2">
              Unlock all features.
            </p>
            <Button
              className="w-full bg-primary text-primary-foreground transition-transform duration-300 ease-in-out group-hover:scale-105 "
              size="sm"
            >
              Get Premium
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumCard;