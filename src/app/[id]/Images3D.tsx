'use client';

import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import PlaceholderSprites from './components/PlaceholderSprites';
import SceneContent from './components/SceneContent';
import CameraControls from './components/CameraControls';
import FogSystem, { getFogBackgroundGradient } from './components/FogSystem';
import { ThreeJSErrorBoundary } from '@/components/ThreeJSErrorBoundary';
import { useMemoryManager } from '@/hooks/useMemoryManager';
import * as THREE from 'three';
import { DEFAULT_ANIMATION_OPTIONS, AnimationOptions as TypedAnimationOptions } from '@/types';

// Emergency fog disabler
function ForceFogDisable() {
  const { scene } = useThree();
  
  useEffect(() => {
    scene.fog = null;
  });
  
  return null;
}

export interface Images3DProps {
  images: string[];
  options: TypedAnimationOptions;
}

// Helper to get a random camera target
function getRandomCameraTarget(): [number, number, number] {
  // Random position in a cube around the origin, z always positive
  return [
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 6,
    8 + Math.random() * 8
  ];
}

function ParallaxCamera({ enabled, speed, interval }: { enabled: boolean; speed: number; interval: number }) {
  const { camera } = useThree();
  const targetRef = useRef<[number, number, number]>([0, 0, 12]);
  const lastSwitchRef = useRef(Date.now());
  const nextIntervalRef = useRef(interval * 1000);

  useEffect(() => {
    // Reset on disable
    if (!enabled) {
      targetRef.current = [0, 0, 12];
      camera.position.set(0, 0, 12);
    }
  }, [enabled, camera]);

  useFrame(() => {
    if (!enabled) return;
    // Time to switch?
    const now = Date.now();
    if (now - lastSwitchRef.current > nextIntervalRef.current) {
      targetRef.current = getRandomCameraTarget();
      lastSwitchRef.current = now;
      // Randomize next interval within [interval, 10] seconds
      nextIntervalRef.current = (interval + Math.random() * (10 - interval)) * 1000;
    }
    // Smoothly interpolate camera position
    camera.position.lerp(
      new THREE.Vector3(...targetRef.current),
      speed
    );
    camera.updateProjectionMatrix();
  });
  return null;
}

// Enhanced Canvas with memory management
function MemoryManagedCanvas({ children, ...props }: any) {
  useMemoryManager();
  
  useEffect(() => {
    // Store renderer reference for memory monitoring
    const canvas = document.querySelector('canvas');
    if (canvas && (canvas as any).__r3f) {
      (window as any).__THREE_RENDERER__ = (canvas as any).__r3f.gl;
    }
  }, []);
  
  return <Canvas {...props}>{children}</Canvas>;
}

// Main component that renders the 3D scene
export default function Images3D({ images, options }: Images3DProps) {
  // Filter out empty strings or invalid URLs
  const validImages = images?.filter(url => url && url.trim() && url.startsWith('http')) || [];
  // Remove duplicates
  const uniqueValidImages = Array.from(new Set(validImages));

  // Ensure all required option fields are present and FORCE fog to be disabled by default
  const mergedOptions = { 
    ...DEFAULT_ANIMATION_OPTIONS, 
    ...options,
    // FORCE fog to be disabled unless explicitly enabled
    fogEnabled: options?.fogEnabled === true ? true : false
  };

  return (
    <ThreeJSErrorBoundary>
      <MemoryManagedCanvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        frameloop="always" // Ensure animation never stops running
        performance={{ min: 0.5 }} // Allow frame rate to drop to 30fps during heavy load
        dpr={[1, 2]} // Adaptive pixel ratio based on device capability
        style={{ 
          width: '100%', 
          height: '100vh', 
          background: 'linear-gradient(to bottom, #111, #222)', // FORCE default background
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false, // Better performance
        }}
      >
        {/* EMERGENCY: Force disable any fog */}
        <ForceFogDisable />
        
        {/* Fog System - Enhanced atmospheric effects - TEMPORARILY DISABLED FOR DEBUGGING */}
        {/* <FogSystem options={mergedOptions} /> */}
        
        <ParallaxCamera
          enabled={!!mergedOptions.parallaxEnabled}
          speed={mergedOptions.parallaxSpeed || 0.03}
          interval={mergedOptions.parallaxInterval || 6}
        />
        <Suspense fallback={null}>
          {uniqueValidImages.length > 0 ? (
            <>
              <SceneContent 
                images={uniqueValidImages} 
                options={mergedOptions} 
              />
              <CameraControls
                groups={uniqueValidImages.length}
                transitionSpeed={mergedOptions.cameraSpeed || 0.05}
              />
            </>
          ) : (
            <PlaceholderSprites />
          )}
        </Suspense>
        {/* Fog is now handled by FogSystem component */}
      </MemoryManagedCanvas>
    </ThreeJSErrorBoundary>
  );
}


