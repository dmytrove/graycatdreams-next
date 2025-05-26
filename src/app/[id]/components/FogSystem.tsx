'use client';

import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { AnimationOptions } from '@/types';

interface FogSystemProps {
  options: AnimationOptions;
}

export default function FogSystem({ options }: FogSystemProps) {
  const { scene } = useThree();

  useEffect(() => {
    // ALWAYS clear fog first to ensure clean state
    scene.fog = null;
    
    // Only apply fog if explicitly enabled (strict check)
    if (options.fogEnabled !== true) {
      return;
    }

    // Only apply fog if explicitly enabled
    const fogColor = new THREE.Color(options.fogColor || '#666666');
    const fogType = options.fogType || 0;
    const fogNear = options.fogNear || 10;
    const fogFar = options.fogFar || 50;
    const fogDensity = options.fogDensity || 0.02;

    // Apply fog based on type
    switch (fogType) {
      case 0: // Linear fog
        scene.fog = new THREE.Fog(
          fogColor,
          fogNear,
          fogFar
        );
        break;
        
      case 1: // Exponential fog
        scene.fog = new THREE.FogExp2(
          fogColor,
          fogDensity
        );
        break;
        
      case 2: // Exponential squared fog (same as case 1 but with different density interpretation)
        scene.fog = new THREE.FogExp2(
          fogColor,
          fogDensity * 0.5 // Reduce density for squared effect
        );
        break;
        
      default:
        scene.fog = null;
    }
    
  }, [
    scene, 
    options.fogEnabled, 
    options.fogType, 
    options.fogColor, 
    options.fogNear, 
    options.fogFar, 
    options.fogDensity
  ]);

  // Cleanup effect to ensure fog is removed when component unmounts
  useEffect(() => {
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  // Component doesn't render anything visible, just manages fog state
  return null;
}

// Enhanced helper function to get fog-appropriate background colors
export function getFogBackgroundGradient(options: AnimationOptions): string {
  // ALWAYS use default gradient when fog is disabled
  if (!options.fogEnabled || options.fogEnabled !== true) {
    return 'linear-gradient(to bottom, #111, #222)'; // Default gradient
  }

  const fogColor = options.fogColor;
  
  // Create a gradient that works well with the fog color
  const color = new THREE.Color(fogColor);
  const darker = color.clone().multiplyScalar(0.3);
  const lighter = color.clone().multiplyScalar(0.8);
  
  return `linear-gradient(to bottom, ${darker.getStyle()}, ${lighter.getStyle()})`;
}

// Utility function to calculate optimal fog parameters based on scene size
export function getOptimalFogParameters(imageCount: number, sceneSize: number = 20): {
  near: number;
  far: number;
  density: number;
} {
  // Adjust fog parameters based on number of images and scene complexity
  const complexity = Math.min(imageCount / 10, 1); // 0-1 based on image count
  
  return {
    near: 5 + complexity * 5,        // 5-10 range
    far: 25 + complexity * 25,       // 25-50 range  
    density: 0.01 + complexity * 0.03, // 0.01-0.04 range
  };
}

// Fog preset configurations that work well with different lighting modes
export const FOG_LIGHTING_COMBINATIONS = [
  // Soft Even + Soft Gray
  { lightingMode: 0, fogColor: '#666666', fogType: 0, description: 'Gentle atmospheric depth' },
  // Dramatic + Deep Blue  
  { lightingMode: 1, fogColor: '#1a237e', fogType: 1, description: 'Dramatic depth with mystery' },
  // Studio + Smoke Gray
  { lightingMode: 2, fogColor: '#424242', fogType: 0, description: 'Professional studio atmosphere' },
  // Sunset + Warm Amber
  { lightingMode: 3, fogColor: '#ff8f00', fogType: 2, description: 'Golden hour warmth' },
  // Cool Blue + Cool Cyan
  { lightingMode: 4, fogColor: '#00acc1', fogType: 1, description: 'Cool, refreshing depth' },
  // Neon + Purple Haze
  { lightingMode: 5, fogColor: '#7b1fa2', fogType: 2, description: 'Mystical neon atmosphere' },
  // Golden Hour + Warm Amber
  { lightingMode: 6, fogColor: '#ff8f00', fogType: 0, description: 'Perfect golden hour blend' },
  // Moonlight + Deep Blue
  { lightingMode: 7, fogColor: '#1a237e', fogType: 1, description: 'Mysterious moonlit night' },
] as const;
