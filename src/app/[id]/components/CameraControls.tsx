'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControlProps {
  groups: number;      // Number of image groups
  focusIndex?: number; // Which group to focus on (-1 for overview)
  transitionSpeed?: number; // Speed of camera transitions
}

// This component provides smooth camera transitions between image groups
const CameraControls: React.FC<CameraControlProps> = ({ 
  groups, 
  focusIndex = -1, 
  transitionSpeed = 0.05 
}) => {
  const { camera, size } = useThree();
  const perspCamera = camera as THREE.PerspectiveCamera;
  
  // Create refs to store camera target positions
  const targetPosition = useRef(new THREE.Vector3(0, 0, 12));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const prevGroupsRef = useRef(groups);
  const prevFocusIndexRef = useRef(focusIndex);
  const transitionProgressRef = useRef(1); // 0 = starting transition, 1 = completed
  
  // Update target position when focusIndex, groups, or window size changes
  useEffect(() => {
    if (prevFocusIndexRef.current !== focusIndex || prevGroupsRef.current !== groups) {
      transitionProgressRef.current = 0;
      prevFocusIndexRef.current = focusIndex;
      prevGroupsRef.current = groups;
    }

    // Calculate aspect ratio and adjust viewport to fit content
    const aspect = size.width / size.height;
    
    // Adjust field of view based on screen size
    // Use a wider FOV for narrow screens
    const baseFOV = 50;
    const fovAdjustment = aspect < 1 ? (1 / aspect) * 15 : 0;
    perspCamera.fov = baseFOV + fovAdjustment;
    
    // Calculate the target z-distance based on the FOV and desired view height
    const desiredViewHeight = 8; // How much vertical space we want to show
    const zDistance = (desiredViewHeight / 2) / Math.tan((perspCamera.fov * Math.PI / 180) / 2);
    
    if (focusIndex < 0) {
      // Overview position
      const width = Math.max(1, groups - 1) * 12;
      // Adjust Z distance to fit all groups
      const z = Math.max(zDistance, 12 + width * 0.25);
      targetPosition.current.set(0, 0, z);
      targetLookAt.current.set(0, 0, 0);
    } else {
      // Focus on a specific group
      targetPosition.current.set(0, 0, zDistance);
      targetLookAt.current.set(0, 0, 0);
    }
    
    perspCamera.updateProjectionMatrix();
  }, [focusIndex, groups, size.width, size.height, camera, perspCamera]);
  
  // Smoothly animate the camera to the target position each frame
  useFrame(({ clock }) => {
    // Use easing function for smoother motion
    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
    
    // Update transition progress
    if (transitionProgressRef.current < 1) {
      transitionProgressRef.current = Math.min(1, transitionProgressRef.current + transitionSpeed * 0.5);
    }
    
    // Calculate dynamic lerp factor based on transition progress
    const dynamicSpeed = transitionSpeed * (1 - easeOutQuad(transitionProgressRef.current) * 0.5);
    
    // Add subtle oscillation for more natural camera movement
    const oscillation = Math.sin(clock.elapsedTime * 0.3) * 0.0003;
    
    // Smoothly interpolate camera position
    camera.position.lerp(targetPosition.current, dynamicSpeed);
    
    // Add subtle movement to prevent perfectly static camera
    if (transitionProgressRef.current > 0.9) {
      camera.position.y += oscillation;
    }
    
    // Create a temporary vector to store the current camera lookAt point
    const currentLookAt = new THREE.Vector3(0, 0, 0);
    camera.getWorldDirection(currentLookAt);
    currentLookAt.multiplyScalar(10).add(camera.position);
    
    // Smoothly interpolate lookAt position
    const newLookAt = new THREE.Vector3().lerpVectors(
      currentLookAt, 
      targetLookAt.current, 
      dynamicSpeed
    );
    
    // Make camera look at the interpolated point
    camera.lookAt(newLookAt);
  });

  return null; // This component doesn't render anything
};

export default CameraControls;
