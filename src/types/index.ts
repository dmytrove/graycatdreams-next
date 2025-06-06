import * as THREE from 'three';

// Core animation options interface - single source of truth
export interface AnimationOptions {
  // Basic controls (always used)
  maxImageCount: number;          // ✅ Controls number of floating objects
  spinMaxSpeed: number;           // ✅ Controls rotation and movement speed
  imageMinSize: number;           // ✅ Controls minimum scale of objects
  imageMaxSize: number;           // ✅ Controls maximum scale of objects
  
  // Visual effects (functional)
  pulsationAmount: number;        // ✅ Controls scale pulsation effect
  pulsationRate: number;          // ✅ Controls pulsation speed
  bounciness: number;             // ✅ Controls collision response
  
  // Movement template (now functional!)
  movementTemplate: number;       // ✅ Controls movement pattern (0-6)
  
  // Lighting & Shading (new!)
  lightingMode: number;           // ✅ Controls lighting setup (0-7)
  ambientIntensity: number;       // ✅ Controls ambient light strength
  lightIntensity: number;         // ✅ Controls directional light strength
  lightColor: string;             // ✅ Controls light color
  animatedLighting: boolean;      // ✅ Enables animated lighting effects
  
  // Camera controls (functional)
  parallaxEnabled: boolean;       // ✅ Enables automatic camera movement
  parallaxSpeed: number;          // ✅ Controls camera transition speed
  parallaxInterval: number;       // ✅ Controls camera switch timing
  
  // Interaction (functional)
  objectInteraction: boolean;     // ✅ Enables mouse interaction
  
  // Fog & Atmosphere (new!)
  fogEnabled: boolean;            // ✅ Enables atmospheric fog effects
  fogType: number;                // ✅ Fog calculation type (0-2)
  fogColor: string;               // ✅ Fog color (hex)
  fogNear: number;                // ✅ Fog start distance (linear fog)
  fogFar: number;                 // ✅ Fog end distance (linear fog)
  fogDensity: number;             // ✅ Fog density (exponential fog)
  
  // Legacy/unused controls (kept for API compatibility but not exposed in UI)
  orbitDistance: number;          // ❌ Not implemented in current scene
  attractionForce: number;        // ❌ Not implemented in current scene
  orbitSpeed: number;             // ❌ Not implemented in current scene
  focusedGroup: number;           // ❌ Not implemented in current scene
  cameraSpeed: number;            // ❌ Not implemented in current scene
}

// Default animation options
export const DEFAULT_ANIMATION_OPTIONS: AnimationOptions = {
  // Essential controls
  maxImageCount: 10,
  spinMaxSpeed: 1.0,
  imageMinSize: 1.0,
  imageMaxSize: 2.0,
  
  // Visual effects
  pulsationAmount: 0.2,
  pulsationRate: 0.5,
  bounciness: 0.7,
  
  // Movement
  movementTemplate: 0, // Random Drift
  
  // Lighting & Shading
  lightingMode: 0, // Default lighting
  ambientIntensity: 0.6,
  lightIntensity: 0.8,
  lightColor: '#ffffff',
  animatedLighting: false,
  
  // Camera
  parallaxEnabled: false,
  parallaxSpeed: 0.03,
  parallaxInterval: 6,
  
  // Interaction
  objectInteraction: false,
  
  // Fog & Atmosphere (disabled by default)
  fogEnabled: false,
  fogType: 0, // Linear fog
  fogColor: '#222222',
  fogNear: 10,
  fogFar: 50,
  fogDensity: 0.02,
  
  // Legacy (kept for compatibility)
  orbitDistance: 3,
  attractionForce: 0.02,
  orbitSpeed: 0.02,
  focusedGroup: -1,
  cameraSpeed: 0.05,
};

// Extended options with image counts for UI
export interface AnimationOptionsWithCounts extends AnimationOptions {
  imageCounts: Record<string, number>;
}

// 3D floating object interface
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

// Upload metadata interface
export interface UploadMetadata {
  url: string;
  imageId: string;
  session_id: string | null;
  timestamp: number;
  customName?: string; // Optional custom name for admin mode
}

// Admin-related types
export interface AdminCredentials {
  adminSecret: string;
}

export interface AdminSessionOptions {
  customId?: string; // Custom ID for creating a custom-named session
}

// Session data interface
export interface SessionData {
  images: UploadMetadata[];
  options: AnimationOptions;
  customName?: string; // Optional custom name for admin mode
}

// Component prop interfaces
export interface Images3DProps {
  images: string[];
  options: AnimationOptions;
}

export interface SceneContentProps {
  images: string[];
  options: AnimationOptions & { 
    movementTemplate?: number; 
    distinguishGroups?: boolean; 
  };
}

export interface AnimationOptionsFormProps {
  options: AnimationOptions;
  handleOptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageCount: number;
}

// Animation preset interface
export interface AnimationPreset {
  name: string;
  options: Partial<AnimationOptions>;
  description?: string;
}

// Movement template names - now functional!
export const MOVEMENT_TEMPLATES = [
  'Random Drift',
  'Orbit',
  'Spiral', 
  'Bounce',
  'Wave',
  'Swirl',
  'Figure-8',
] as const;

export type MovementTemplate = typeof MOVEMENT_TEMPLATES[number];
export type FogPreset = typeof FOG_PRESETS[number];

// Movement template descriptions
export const MOVEMENT_DESCRIPTIONS = [
  'Objects float randomly with gentle bouncing',
  'Objects orbit around invisible centers',
  'Objects move in expanding spiral patterns',
  'High-energy bouncing with extra randomness',
  'Objects follow sine wave patterns',
  'Objects swirl around the center point',
  'Objects trace figure-8 infinity patterns',
] as const;

// Lighting mode names and descriptions
export const LIGHTING_MODES = [
  'Soft Even',      // 0 - Balanced ambient + directional
  'Dramatic',       // 1 - High contrast, strong shadows
  'Studio',         // 2 - Multi-point lighting setup
  'Sunset',         // 3 - Warm orange/red lighting
  'Cool Blue',      // 4 - Cool blue/cyan lighting
  'Neon',           // 5 - Vibrant pink/purple
  'Golden Hour',    // 6 - Warm golden lighting
  'Moonlight',      // 7 - Cool silver/blue night lighting
] as const;

export const LIGHTING_DESCRIPTIONS = [
  'Balanced lighting with soft shadows',
  'High contrast with strong directional light',
  'Professional multi-light studio setup',
  'Warm sunset colors with orange/red tones',
  'Cool blue and cyan lighting',
  'Vibrant neon pink and purple lighting',
  'Warm golden hour photography lighting',
  'Cool moonlight with silver/blue tones',
] as const;

// Predefined light colors for each mode
export const LIGHTING_COLORS = [
  '#ffffff', // Soft Even - White
  '#ffffff', // Dramatic - White 
  '#ffffff', // Studio - White
  '#ff6b35', // Sunset - Orange
  '#4dabf7', // Cool Blue - Blue
  '#ff6b9d', // Neon - Pink
  '#ffd43b', // Golden Hour - Gold
  '#74c0fc', // Moonlight - Light Blue
] as const;

// Fog type names and descriptions
export const FOG_TYPES = [
  'Linear',      // 0 - Distance-based linear fog
  'Exponential', // 1 - Exponential fog calculation
  'Exp²',        // 2 - Exponential squared fog
] as const;

export type FogType = typeof FOG_TYPES[number];

export const FOG_DESCRIPTIONS = [
  'Linear fog with defined start and end distances',
  'Exponential fog with density-based calculation', 
  'Exponential squared fog for dramatic depth effects',
] as const;

// Fog color presets that work well with lighting modes
export const FOG_PRESETS = [
  { name: 'Soft Gray', color: '#666666', description: 'Subtle atmospheric depth' },
  { name: 'Deep Blue', color: '#1a237e', description: 'Ocean depths or night sky' },
  { name: 'Warm Amber', color: '#ff8f00', description: 'Sunset or golden hour atmosphere' },
  { name: 'Cool Cyan', color: '#00acc1', description: 'Icy or futuristic ambiance' },
  { name: 'Purple Haze', color: '#7b1fa2', description: 'Mystical or dreamy effect' },
  { name: 'Smoke Gray', color: '#424242', description: 'Industrial or smoky atmosphere' },
] as const;

// API response interfaces
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UploadResponse {
  urls: string[];
}

export interface AnimationOptionsResponse {
  options: AnimationOptions;
}

// Control categories for UI organization
export const FUNCTIONAL_CONTROLS = [
  'maxImageCount',
  'spinMaxSpeed', 
  'imageMinSize',
  'imageMaxSize',
  'pulsationAmount',
  'pulsationRate',
  'bounciness',
  'movementTemplate',
  'lightingMode',
  'ambientIntensity',
  'lightIntensity',
  'lightColor',
  'animatedLighting',
  'parallaxEnabled',
  'parallaxSpeed',
  'parallaxInterval',
  'objectInteraction',
  'fogEnabled',
  'fogType', 
  'fogColor',
  'fogNear',
  'fogFar',
  'fogDensity',
] as const;

export const LEGACY_CONTROLS = [
  'orbitDistance',
  'attractionForce', 
  'orbitSpeed',
  'focusedGroup',
  'cameraSpeed',
] as const;
