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
  focusedGroup?: number;
  cameraSpeed?: number;
}

export interface FloatingObject {
  id: string;
  url: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  scale: number;
  targetScale: number;
  baseScale: number;
  rotation: number;
  rotationSpeed: number;
  orbitAngle: number;
  groupIndex: number;
  timeOffset: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitCenter: THREE.Vector3;
} 