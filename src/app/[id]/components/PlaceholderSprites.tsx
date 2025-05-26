'use client';

import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SHAPES = ['cube', 'sphere', 'ring', 'pyramid'] as const;
const COLORS = [
  '#FF5E5B', '#D8D8D8', '#FFFFEA', '#00CECB', 
  '#FFED66', '#6CCFF6', '#9772FB', '#FF8E72',
  '#90E0EF', '#FFC6FF', '#BDB2FF', '#A0C4FF'
];

export default function PlaceholderSprites() {
  const numPlaceholders = 20;
  const [time, setTime] = useState(0);
  const [placeholders] = useState(() => {
    // Ensure at least one of each shape
    const base = SHAPES.map(shape => ({
      shape,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.08,
        (Math.random() - 0.5) * 0.08,
        (Math.random() - 0.5) * 0.08
      ),
      rotation: new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      ),
      rotationSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03
      ),
      baseScale: 0.4 + Math.random() * 0.8,
      scale: 0.4 + Math.random() * 0.8,
      pulseRate: 0.3 + Math.random() * 0.7,
      pulsePhase: Math.random() * Math.PI * 2
    }));
    // Fill the rest with random shapes/colors
    const rest = Array.from({ length: numPlaceholders - SHAPES.length }).map(() => {
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        shape,
        color,
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.08,
          (Math.random() - 0.5) * 0.08,
          (Math.random() - 0.5) * 0.08
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        ),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.03,
          (Math.random() - 0.5) * 0.03,
          (Math.random() - 0.5) * 0.03
        ),
        baseScale: 0.4 + Math.random() * 0.8,
        scale: 0.4 + Math.random() * 0.8,
        pulseRate: 0.3 + Math.random() * 0.7,
        pulsePhase: Math.random() * Math.PI * 2
      };
    });
    return [...base, ...rest];
  });

  useFrame(() => {
    setTime(prevTime => prevTime + 0.01);
    placeholders.forEach((obj) => {
      obj.velocity.x += (Math.random() - 0.5) * 0.005;
      obj.velocity.y += (Math.random() - 0.5) * 0.005;
      obj.velocity.z += (Math.random() - 0.5) * 0.005;
      const speed = obj.velocity.length();
      if (speed < 0.02) {
        obj.velocity.add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.04,
          (Math.random() - 0.5) * 0.04,
          (Math.random() - 0.5) * 0.04
        ));
      }
      obj.velocity.x += Math.sin(time * 0.4 + obj.pulsePhase) * 0.0015;
      obj.velocity.y += Math.cos(time * 0.6 + obj.pulsePhase * 1.3) * 0.0015;
      obj.velocity.z += Math.sin(time * 0.5 + obj.pulsePhase * 0.7) * 0.0015;
      if (obj.velocity.length() > 0.15) {
        obj.velocity.normalize().multiplyScalar(0.15);
      }
      obj.velocity.multiplyScalar(0.998);
      obj.position.add(obj.velocity);
      (['x', 'y', 'z'] as const).forEach((axis) => {
        const limit = axis === 'x' ? 12 : 8;
        if (Math.abs(obj.position[axis]) > limit) {
          obj.position[axis] = Math.sign(obj.position[axis]) * limit;
          obj.velocity[axis] *= -0.95;
          const perpAxis1 = axis === 'x' ? 'y' : 'x';
          const perpAxis2 = axis === 'z' ? 'y' : 'z';
          obj.velocity[perpAxis1] += (Math.random() - 0.5) * 0.03;
          obj.velocity[perpAxis2] += (Math.random() - 0.5) * 0.03;
        }
      });
      obj.rotation.x += obj.rotationSpeed.x + obj.velocity.x * 0.03;
      obj.rotation.y += obj.rotationSpeed.y + obj.velocity.y * 0.03;
      obj.rotation.z += obj.rotationSpeed.z;
      const pulseAmount = 0.25;
      obj.scale = obj.baseScale * (1 + Math.sin(time * obj.pulseRate + obj.pulsePhase) * pulseAmount);
    });
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <hemisphereLight args={['#606080', '#102030', 0.5]} />
      {placeholders.map((obj, i) => {
        if (obj.shape === 'cube') {
          return (
            <mesh 
              key={`placeholder-${i}`}
              position={obj.position.toArray()}
              rotation={[obj.rotation.x, obj.rotation.y, obj.rotation.z]}
              scale={[obj.scale, obj.scale, obj.scale]}
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={obj.color} />
            </mesh>
          );
        } else if (obj.shape === 'sphere') {
          return (
            <mesh 
              key={`placeholder-${i}`}
              position={obj.position.toArray()}
              rotation={[obj.rotation.x, obj.rotation.y, obj.rotation.z]}
              scale={[obj.scale, obj.scale, obj.scale]}
            >
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshStandardMaterial color={obj.color} />
            </mesh>
          );
        } else if (obj.shape === 'ring') {
          return (
            <mesh 
              key={`placeholder-${i}`}
              position={obj.position.toArray()}
              rotation={[obj.rotation.x, obj.rotation.y, obj.rotation.z]}
              scale={[obj.scale, obj.scale, obj.scale]}
            >
              <torusGeometry args={[0.4, 0.2, 16, 32]} />
              <meshStandardMaterial color={obj.color} />
            </mesh>
          );
        } else {
          return (
            <mesh 
              key={`placeholder-${i}`}
              position={obj.position.toArray()}
              rotation={[obj.rotation.x, obj.rotation.y, obj.rotation.z]}
              scale={[obj.scale, obj.scale, obj.scale]}
            >
              <coneGeometry args={[0.5, 1, 4]} />
              <meshStandardMaterial color={obj.color} />
            </mesh>
          );
        }
      })}
    </>
  );
} 