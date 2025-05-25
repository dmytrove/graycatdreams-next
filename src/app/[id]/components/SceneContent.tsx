import React, { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTextureLoader } from './useTextureLoader';
import ImageInstancedMesh from './ImageInstancedMesh';
import LightingSystem from './LightingSystem';
import { AnimationOptions, FloatingObject } from '@/types';

interface SceneContentProps {
  images: string[];
  options: AnimationOptions & { movementTemplate?: number; distinguishGroups?: boolean };
}

const SceneContent = ({ images, options }: SceneContentProps): React.ReactNode => {
  const { textures, aspectRatios, validUrls } = useTextureLoader(images);
  const [objects, setObjects] = useState<FloatingObject[]>([]);
  
  // Helper function to generate a deterministic ID based on index
  const generateId = (index: number) => `obj_${index}`;
  
  // Create floating objects when images or options change
  useEffect(() => {
    if (validUrls.length === 0) {
      setObjects([]);
      return;
    }

    if (typeof window !== 'undefined') {
      console.log(`Creating objects for ${validUrls.length} images, maxCount: ${options.maxImageCount}, movement: ${options.movementTemplate || 0}, lighting: ${options.lightingMode || 0}`);
    }
    
    const newObjects: FloatingObject[] = [];
    const totalImages = Math.min(options.maxImageCount, validUrls.length * 10);
    const movementTemplate = options.movementTemplate || 0;
    
    for (let i = 0; i < totalImages; i++) {
      const url = validUrls[i % validUrls.length];
      const baseScale = options.imageMinSize + 
        Math.random() * (options.imageMaxSize - options.imageMinSize);
      
      // Initial position based on movement template
      let position: THREE.Vector3;
      let velocity: THREE.Vector3;
      let orbitRadius = 2 + Math.random() * 4;
      let orbitSpeed = 0.01 + Math.random() * 0.03;
      const orbitCenter = new THREE.Vector3(0, 0, 0);
      
      switch (movementTemplate) {
        case 1: // Orbit
          const orbitAngle = (i / totalImages) * Math.PI * 2;
          orbitRadius = 3 + Math.random() * 3;
          position = new THREE.Vector3(
            Math.cos(orbitAngle) * orbitRadius,
            (Math.random() - 0.5) * 4,
            Math.sin(orbitAngle) * orbitRadius
          );
          velocity = new THREE.Vector3(0, 0, 0); // Orbit handles movement
          break;
          
        case 2: // Spiral
          const spiralAngle = (i / totalImages) * Math.PI * 6;
          const spiralRadius = (i / totalImages) * 5;
          position = new THREE.Vector3(
            Math.cos(spiralAngle) * spiralRadius,
            (i / totalImages) * 8 - 4,
            Math.sin(spiralAngle) * spiralRadius
          );
          velocity = new THREE.Vector3(0, 0.1, 0);
          break;
          
        case 3: // Bounce - high energy
          position = new THREE.Vector3(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 5
          );
          velocity = new THREE.Vector3(
            (Math.random() - 0.5) * options.spinMaxSpeed * 0.3,
            (Math.random() - 0.5) * options.spinMaxSpeed * 0.3,
            (Math.random() - 0.5) * options.spinMaxSpeed * 0.3
          );
          break;
          
        case 4: // Wave
          const waveX = (i / totalImages) * 12 - 6;
          position = new THREE.Vector3(
            waveX,
            Math.sin(waveX * 0.5) * 2,
            (Math.random() - 0.5) * 4
          );
          velocity = new THREE.Vector3(0.1, 0, 0);
          break;
          
        case 5: // Swirl
          const swirlAngle = (i / totalImages) * Math.PI * 4;
          const swirlRadius = 1 + (i / totalImages) * 4;
          position = new THREE.Vector3(
            Math.cos(swirlAngle) * swirlRadius,
            Math.sin(swirlAngle * 2) * 2,
            Math.sin(swirlAngle) * swirlRadius
          );
          velocity = new THREE.Vector3(0, 0, 0);
          orbitSpeed = 0.02 + Math.random() * 0.02;
          break;
          
        case 6: // Figure-8
          const fig8T = (i / totalImages) * Math.PI * 2;
          position = new THREE.Vector3(
            Math.sin(fig8T) * 4,
            Math.sin(fig8T * 2) * 2,
            Math.cos(fig8T) * 2
          );
          velocity = new THREE.Vector3(0, 0, 0);
          break;
          
        default: // Random Drift (0)
          position = new THREE.Vector3(
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 6
          );
          velocity = new THREE.Vector3(
            (Math.random() - 0.5) * options.spinMaxSpeed * 0.1,
            (Math.random() - 0.5) * options.spinMaxSpeed * 0.1,
            (Math.random() - 0.5) * options.spinMaxSpeed * 0.1
          );
          break;
      }

      newObjects.push({
        id: generateId(i),
        url,
        position,
        velocity,
        scale: baseScale,
        baseScale,
        targetScale: baseScale,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        orbitAngle: Math.random() * Math.PI * 2,
        groupIndex: movementTemplate,
        timeOffset: Math.random() * Math.PI * 2,
        orbitRadius,
        orbitSpeed,
        orbitCenter
      });
    }

    if (typeof window !== 'undefined') {
      console.log(`Created ${newObjects.length} floating objects with movement template ${movementTemplate}`);
    }
    setObjects(newObjects);
  }, [validUrls, options.maxImageCount, options.imageMinSize, options.imageMaxSize, options.spinMaxSpeed, options.movementTemplate, options.lightingMode]);

  // Animation frame updates with movement templates
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const movementTemplate = options.movementTemplate || 0;
    
    setObjects(prevObjects => prevObjects.map(obj => {
      let newScale = obj.baseScale;
      let newRotation = obj.rotation;
      const newPos = obj.position.clone();
      
      // Movement boundaries
      const bounds = { x: 10, y: 6, z: 5 };

      // Apply movement based on template
      switch (movementTemplate) {
        case 1: // Orbit
          obj.orbitAngle += obj.orbitSpeed;
          newPos.x = obj.orbitCenter.x + Math.cos(obj.orbitAngle) * obj.orbitRadius;
          newPos.z = obj.orbitCenter.z + Math.sin(obj.orbitAngle) * obj.orbitRadius;
          newPos.y += Math.sin(t * 0.5 + obj.timeOffset) * 0.3;
          break;
          
        case 2: // Spiral
          obj.orbitAngle += 0.02;
          newPos.x += Math.cos(t + obj.timeOffset) * 0.05;
          newPos.y += obj.velocity.y * delta;
          newPos.z += Math.sin(t + obj.timeOffset) * 0.05;
          // Reset spiral if it goes too high
          if (newPos.y > 6) newPos.y = -6;
          break;
          
        case 3: // Bounce - enhanced bouncing
          newPos.add(obj.velocity.clone().multiplyScalar(delta));
          ['x', 'y', 'z'].forEach((axis, idx) => {
            const bound = bounds[axis as keyof typeof bounds];
            const value = newPos.getComponent(idx);
            if (Math.abs(value) > bound) {
              newPos.setComponent(idx, Math.sign(value) * bound);
              // Clone velocity to avoid mutating read-only property
              const newVelocity = obj.velocity.clone();
              newVelocity.setComponent(idx, newVelocity.getComponent(idx) * -options.bounciness * 1.2);
              // More randomness on bounce
              [0, 1, 2].forEach(otherIdx => {
                if (otherIdx !== idx) {
                  newVelocity.setComponent(otherIdx, newVelocity.getComponent(otherIdx) + (Math.random() - 0.5) * 0.05);
                }
              });
              obj.velocity = newVelocity;
            }
          });
          break;
          
        case 4: // Wave
          newPos.add(obj.velocity.clone().multiplyScalar(delta));
          newPos.y = Math.sin(newPos.x * 0.5 + t) * 2 + Math.sin(t * 0.3 + obj.timeOffset) * 0.5;
          // Reset wave if it goes too far
          if (newPos.x > 8) newPos.x = -8;
          break;
          
        case 5: // Swirl
          obj.orbitAngle += obj.orbitSpeed;
          const swirlRadius = obj.orbitRadius + Math.sin(t * 0.5 + obj.timeOffset) * 0.5;
          newPos.x = Math.cos(obj.orbitAngle) * swirlRadius;
          newPos.z = Math.sin(obj.orbitAngle) * swirlRadius;
          newPos.y = Math.sin(obj.orbitAngle * 2 + t * 0.3) * 2;
          break;
          
        case 6: // Figure-8
          obj.orbitAngle += 0.01;
          newPos.x = Math.sin(obj.orbitAngle) * 4;
          newPos.y = Math.sin(obj.orbitAngle * 2) * 2;
          newPos.z = Math.cos(obj.orbitAngle) * 2;
          break;
          
        default: // Random Drift (0)
          newPos.add(obj.velocity.clone().multiplyScalar(delta));
          // Bounce off boundaries using vector methods
          ['x', 'y', 'z'].forEach((axis, idx) => {
            const bound = bounds[axis as keyof typeof bounds];
            const value = newPos.getComponent(idx);
            if (Math.abs(value) > bound) {
              newPos.setComponent(idx, Math.sign(value) * bound);
              // Clone velocity to avoid mutating read-only property
              const newVelocity = obj.velocity.clone();
              newVelocity.setComponent(idx, newVelocity.getComponent(idx) * -options.bounciness);
              // Add some randomness on bounce
              if (axis === 'x') {
                newVelocity.setComponent(1, newVelocity.getComponent(1) + (Math.random() - 0.5) * 0.02); // y
                newVelocity.setComponent(2, newVelocity.getComponent(2) + (Math.random() - 0.5) * 0.02); // z
              } else if (axis === 'y') {
                newVelocity.setComponent(0, newVelocity.getComponent(0) + (Math.random() - 0.5) * 0.02); // x
                newVelocity.setComponent(2, newVelocity.getComponent(2) + (Math.random() - 0.5) * 0.02); // z
              } else {
                newVelocity.setComponent(0, newVelocity.getComponent(0) + (Math.random() - 0.5) * 0.02); // x
                newVelocity.setComponent(1, newVelocity.getComponent(1) + (Math.random() - 0.5) * 0.02); // y
              }
              obj.velocity = newVelocity;
            }
          });
          
          // Add gentle wave motion
          newPos.y += Math.sin(t * 0.3 + obj.timeOffset) * 0.02;
          break;
      }

      // Apply pulsation effect
      if (options.pulsationAmount > 0) {
        const pulse = Math.sin(t * options.pulsationRate + obj.timeOffset);
        newScale = obj.baseScale * (1 + pulse * options.pulsationAmount);
      }

      // Apply rotation
      newRotation = obj.rotation + obj.rotationSpeed * options.spinMaxSpeed;

      return {
        ...obj,
        position: newPos,
        scale: newScale,
        rotation: newRotation,
      };
    }));
  });

  // Group objects by texture for efficient rendering
  const groups: Record<string, { indices: number[], aspect: number, texture: THREE.Texture }> = {};
  
  objects.forEach((obj, idx) => {
    const urlIdx = validUrls.indexOf(obj.url);
    if (urlIdx === -1 || !textures[urlIdx]) return;
    
    const url = obj.url;
    if (!groups[url]) {
      groups[url] = { 
        indices: [], 
        aspect: aspectRatios[urlIdx] || 1, 
        texture: textures[urlIdx] 
      };
    }
    groups[url].indices.push(idx);
  });

  if (typeof window !== 'undefined') {
    console.log(`Rendering groups:`, Object.keys(groups), `Total objects:`, objects.length);
  }

  if (objects.length === 0 || textures.length === 0) {
    return null;
  }

  return (
    <>
      {/* Advanced Lighting System */}
      <LightingSystem options={options} />
      
      {/* Rendered Objects */}
      {Object.entries(groups).map(([url, group]) => (
        <ImageInstancedMesh
          key={url}
          objects={group.indices.map(idx => objects[idx])}
          aspect={group.aspect}
          texture={group.texture}
        />
      ))}
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#111', 10, 30]} />
    </>
  );
};

export default SceneContent;
