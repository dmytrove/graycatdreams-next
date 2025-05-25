/**
 * Memory management utilities for Three.js applications
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface MemoryStats {
  geometries: number;
  textures: number;
  materials: number;
  programs: number;
}

export function useMemoryManager(interval = 30000) {
  const statsRef = useRef<MemoryStats>({ geometries: 0, textures: 0, materials: 0, programs: 0 });
  
  useEffect(() => {
    const checkMemory = () => {
      if (typeof window !== 'undefined') {
        const renderer = (window as any).__THREE_RENDERER__;
        if (renderer && renderer.info) {
          const info = renderer.info;
          statsRef.current = {
            geometries: info.memory?.geometries || 0,
            textures: info.memory?.textures || 0,
            materials: info.programs?.length || 0,
            programs: info.programs?.length || 0
          };
          
          // Log memory usage in development
          if (process.env.NODE_ENV === 'development') {
            console.log('Three.js Memory Usage:', statsRef.current);
          }
          
          // Warn if memory usage is high
          if (statsRef.current.textures > 50 || statsRef.current.geometries > 100) {
            console.warn('High Three.js memory usage detected', statsRef.current);
          }
        }
        
        // Force garbage collection if available (development only)
        if (process.env.NODE_ENV === 'development' && (window as any).gc) {
          (window as any).gc();
        }
      }
    };

    checkMemory();
    const intervalId = setInterval(checkMemory, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return statsRef.current;
}

// Utility to properly dispose of Three.js objects
export function disposeObject(obj: any): void {
  if (!obj) return;
  
  if (obj.geometry) {
    obj.geometry.dispose();
  }
  
  if (obj.material) {
    if (Array.isArray(obj.material)) {
      obj.material.forEach((material: any) => disposeMaterial(material));
    } else {
      disposeMaterial(obj.material);
    }
  }
  
  if (obj.texture) {
    obj.texture.dispose();
  }
  
  if (obj.dispose && typeof obj.dispose === 'function') {
    obj.dispose();
  }
}

function disposeMaterial(material: any): void {
  if (!material) return;
  
  // Dispose of textures
  Object.keys(material).forEach(key => {
    const value = material[key];
    if (value && value.isTexture) {
      value.dispose();
    }
  });
  
  if (material.dispose) {
    material.dispose();
  }
}

// Hook to clean up Three.js scene on unmount
export function useThreeCleanup(sceneRef: React.RefObject<THREE.Scene | null>) {
  useEffect(() => {
    return () => {
      if (sceneRef.current) {
        // Traverse scene and dispose of all objects
        sceneRef.current.traverse((child) => {
          disposeObject(child);
        });
        
        // Clear the scene
        sceneRef.current.clear();
      }
    };
  }, [sceneRef]);
}

// Optimized texture loader with memory management
export class ManagedTextureLoader extends THREE.TextureLoader {
  private loadedTextures = new Set<THREE.Texture>();
  
  load(
    url: string,
    onLoad?: (texture: THREE.Texture) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (err: unknown) => void
  ): THREE.Texture {
    const texture = super.load(
      url,
      (tex) => {
        this.loadedTextures.add(tex);
        onLoad?.(tex);
      },
      onProgress,
      onError
        ? (err) => {
            // Safely narrow to ErrorEvent if possible
            if (err instanceof ErrorEvent) {
              (onError as (event: ErrorEvent) => void)?.(err);
            } else {
              // Optionally handle other error types or ignore
            }
          }
        : undefined
    );
    return texture;
  }
  
  dispose(): void {
    this.loadedTextures.forEach(texture => {
      texture.dispose();
    });
    this.loadedTextures.clear();
  }
  
  getLoadedCount(): number {
    return this.loadedTextures.size;
  }
}

// Performance monitoring
export function usePerformanceMonitor() {
  const frameTimeRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(performance.now());
  
  useEffect(() => {
    const updateFrameTime = () => {
      const now = performance.now();
      const frameTime = now - lastFrameTimeRef.current;
      lastFrameTimeRef.current = now;
      
      frameTimeRef.current.push(frameTime);
      
      // Keep only last 60 frame times
      if (frameTimeRef.current.length > 60) {
        frameTimeRef.current.shift();
      }
      
      // Calculate average FPS
      if (frameTimeRef.current.length > 10) {
        const avgFrameTime = frameTimeRef.current.reduce((a, b) => a + b, 0) / frameTimeRef.current.length;
        const fps = 1000 / avgFrameTime;
        
        // Warn if FPS is too low
        if (fps < 30 && process.env.NODE_ENV === 'development') {
          console.warn(`Low FPS detected: ${fps.toFixed(1)}`);
        }
      }
      
      requestAnimationFrame(updateFrameTime);
    };
    
    const rafId = requestAnimationFrame(updateFrameTime);
    return () => cancelAnimationFrame(rafId);
  }, []);
  
  return {
    getCurrentFPS: () => {
      if (frameTimeRef.current.length === 0) return 0;
      const avgFrameTime = frameTimeRef.current.reduce((a, b) => a + b, 0) / frameTimeRef.current.length;
      return 1000 / avgFrameTime;
    },
    getFrameTimes: () => [...frameTimeRef.current]
  };
}
