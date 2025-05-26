'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AnimationOptions } from '@/types';

interface LightingSystemProps {
  options: AnimationOptions;
}

export const LightingSystem: React.FC<LightingSystemProps> = ({ options }) => {
  const light1Ref = useRef<THREE.DirectionalLight>(null);
  const light2Ref = useRef<THREE.DirectionalLight>(null);
  const light3Ref = useRef<THREE.DirectionalLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  
  // Log lighting changes for debugging (client-side only)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log(`🔆 Lighting System Update:`, {
        mode: options.lightingMode || 0,
        ambient: options.ambientIntensity || 0.6,
        main: options.lightIntensity || 0.8,
        color: options.lightColor || '#ffffff',
        animated: options.animatedLighting || false
      });
    }
  }, [options.lightingMode, options.ambientIntensity, options.lightIntensity, options.lightColor, options.animatedLighting]);

  // Animated lighting effects
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (!options.animatedLighting) return;

    // Animate lights based on mode
    switch (options.lightingMode) {
      case 1: // Dramatic - moving shadows
        if (light1Ref.current) {
          light1Ref.current.position.x = Math.sin(t * 0.5) * 15;
          light1Ref.current.position.z = Math.cos(t * 0.5) * 15;
        }
        break;
        
      case 2: // Studio - rotating lights
        if (light1Ref.current) {
          light1Ref.current.position.x = Math.sin(t * 0.3) * 12;
          light1Ref.current.position.z = Math.cos(t * 0.3) * 12;
        }
        if (light2Ref.current) {
          light2Ref.current.position.x = Math.sin(t * 0.3 + Math.PI) * 8;
          light2Ref.current.position.z = Math.cos(t * 0.3 + Math.PI) * 8;
        }
        break;
        
      case 5: // Neon - pulsing intensity
        if (light1Ref.current) {
          light1Ref.current.intensity = options.lightIntensity * (0.8 + Math.sin(t * 2) * 0.3);
        }
        if (pointLightRef.current) {
          pointLightRef.current.intensity = 0.6 + Math.sin(t * 3) * 0.4;
        }
        break;
        
      case 6: // Golden Hour - sun movement
        if (light1Ref.current) {
          const sunAngle = Math.sin(t * 0.1) * 0.5 + 0.5; // 0 to 1
          light1Ref.current.position.y = 5 + sunAngle * 10;
          light1Ref.current.position.x = Math.sin(t * 0.1) * 20;
          light1Ref.current.intensity = options.lightIntensity * (0.3 + sunAngle * 0.7);
        }
        break;
        
      case 7: // Moonlight - gentle swaying
        if (light1Ref.current) {
          light1Ref.current.position.x = Math.sin(t * 0.2) * 5;
          light1Ref.current.position.z = Math.cos(t * 0.2) * 5;
          light1Ref.current.intensity = options.lightIntensity * (0.9 + Math.sin(t * 0.5) * 0.1);
        }
        break;
    }
  });

  const lightColor = new THREE.Color(options.lightColor || '#ffffff');
  
  // Render different lighting setups based on mode
  switch (options.lightingMode) {
    case 0: // Soft Even
      return (
        <>
          <ambientLight intensity={options.ambientIntensity} color={lightColor} />
          <directionalLight
            ref={light1Ref}
            position={[10, 10, 5]}
            intensity={options.lightIntensity}
            color={lightColor}
            castShadow={false}
          />
        </>
      );
      
    case 1: // Dramatic
      return (
        <>
          <ambientLight intensity={options.ambientIntensity * 0.3} color={lightColor} />
          <directionalLight
            ref={light1Ref}
            position={[15, 8, 10]}
            intensity={options.lightIntensity * 1.5}
            color={lightColor}
            castShadow={true}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight
            position={[-5, -3, -8]}
            intensity={options.lightIntensity * 0.3}
            color={new THREE.Color().setHSL(0.6, 0.8, 0.3)} // Cool fill light
          />
        </>
      );
      
    case 2: // Studio
      return (
        <>
          <ambientLight intensity={options.ambientIntensity * 0.4} color={lightColor} />
          {/* Key light */}
          <directionalLight
            ref={light1Ref}
            position={[12, 8, 8]}
            intensity={options.lightIntensity * 1.2}
            color={lightColor}
          />
          {/* Fill light */}
          <directionalLight
            ref={light2Ref}
            position={[-8, 6, 6]}
            intensity={options.lightIntensity * 0.6}
            color={new THREE.Color().setHSL(0.1, 0.3, 0.9)}
          />
          {/* Rim light */}
          <directionalLight
            ref={light3Ref}
            position={[0, -5, -10]}
            intensity={options.lightIntensity * 0.8}
            color={new THREE.Color().setHSL(0.55, 0.4, 0.8)}
          />
        </>
      );
      
    case 3: // Sunset
      return (
        <>
          <ambientLight intensity={options.ambientIntensity * 0.7} color="#ff8c42" />
          <directionalLight
            ref={light1Ref}
            position={[20, 5, 0]}
            intensity={options.lightIntensity * 1.3}
            color="#ff6b35"
          />
          <directionalLight
            position={[-10, 8, 5]}
            intensity={options.lightIntensity * 0.4}
            color="#ffa94d"
          />
        </>
      );
      
    case 4: // Cool Blue
      return (
        <>
          <ambientLight intensity={options.ambientIntensity * 0.8} color="#4dabf7" />
          <directionalLight
            ref={light1Ref}
            position={[8, 12, 8]}
            intensity={options.lightIntensity}
            color="#339af0"
          />
          <directionalLight
            position={[-6, -4, -6]}
            intensity={options.lightIntensity * 0.5}
            color="#74c0fc"
          />
        </>
      );
      
    case 5: // Neon
      return (
        <>
          <ambientLight intensity={options.ambientIntensity * 0.3} color="#1a1a1a" />
          <directionalLight
            ref={light1Ref}
            position={[10, 8, 5]}
            intensity={options.lightIntensity * 1.2}
            color="#ff6b9d"
          />
          <pointLight
            ref={pointLightRef}
            position={[0, 0, 8]}
            intensity={0.8}
            color="#da77f2"
            distance={20}
          />
          <spotLight
            ref={spotLightRef}
            position={[-8, 10, 8]}
            intensity={options.lightIntensity * 0.8}
            color="#4c6ef5"
            angle={Math.PI / 4}
            penumbra={0.3}
            distance={25}
          />
        </>
      );
      
    case 6: // Golden Hour
      return (
        <>
          <ambientLight intensity={options.ambientIntensity * 0.6} color="#ffd43b" />
          <directionalLight
            ref={light1Ref}
            position={[15, 8, 10]}
            intensity={options.lightIntensity * 1.4}
            color="#ffec99"
          />
          <directionalLight
            position={[-5, 3, -5]}
            intensity={options.lightIntensity * 0.3}
            color="#ffe066"
          />
        </>
      );
      
    case 7: // Moonlight
      return (
        <>
          <ambientLight intensity={options.ambientIntensity * 0.4} color="#e3fafc" />
          <directionalLight
            ref={light1Ref}
            position={[12, 15, 8]}
            intensity={options.lightIntensity * 0.9}
            color="#74c0fc"
          />
          <directionalLight
            position={[-8, 5, -10]}
            intensity={options.lightIntensity * 0.2}
            color="#a5f3fc"
          />
        </>
      );
      
    default:
      return (
        <>
          <ambientLight intensity={options.ambientIntensity} color={lightColor} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={options.lightIntensity}
            color={lightColor}
          />
        </>
      );
  }
};

export default LightingSystem;
