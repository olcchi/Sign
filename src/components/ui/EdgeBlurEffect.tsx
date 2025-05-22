'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ProgressiveBlur } from './noisyButterflyBackground/progressiveBlur';

interface EdgeBlurEffectProps {
  enabled: boolean;
  intensity?: number;
  className?: string;
}

// Creates vignette-like blur effect on edges to focus attention on center content
export function EdgeBlurEffect({
  enabled = false,
  intensity = 8,
  className,
}: EdgeBlurEffectProps) {
  if (!enabled) return null;
  
  // Fixed number of blur layers for consistent DOM structure
  const blurLayers = 6; // Optimal balance between smoothness and performance
  
  // Only intensity varies based on user input
  const blurIntensity = intensity * 0.1;
  
  return (
    <div className={cn(className)}>
      {/* Left edge blur with progressive intensity */}
      <div className="absolute left-0 top-0 bottom-0 w-[35%]">
        <ProgressiveBlur
          direction="left"
          blurLayers={blurLayers}
          blurIntensity={blurIntensity}
          className="w-full h-full"
        />
      </div>
      
      {/* Right edge blur with progressive intensity */}
      <div className="absolute right-0 top-0 bottom-0 w-[35%]">
        <ProgressiveBlur
          direction="right"
          blurLayers={blurLayers}
          blurIntensity={blurIntensity}
          className="w-full h-full"
        />
      </div>
    </div>
  );
} 