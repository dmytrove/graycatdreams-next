// Type declarations for the Images3D component
import * as React from 'react';
import * as THREE from 'three';

export interface AnimationOptions {
  maxImageCount: number;
  spinMaxSpeed: number;
  imageMinSize: number;
  imageMaxSize: number;
  objectInteraction: boolean;
  orbitDistance?: number;
  attractionForce?: number;
  orbitSpeed?: number;
  bounciness?: number;
  pulsationAmount?: number;
  pulsationRate?: number;
}

export interface FloatingObject {
  url: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
  rotation: number;
  rotationSpeed: number;
  orbitAngle: number;
}

export interface Images3DProps {
  images: string[];
  options: AnimationOptions;
}

declare const Images3D: React.FC<Images3DProps>;
export default Images3D;
