import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const IdleAnimation: React.FC = () => {
  const numShapes = 8;
  const shapeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const positions = useRef(
    Array.from({ length: numShapes }, () => [
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5,
    ])
  );
  const velocities = useRef(
    Array.from({ length: numShapes }, () => [
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
    ])
  );

  useFrame((state) => {
    for (let i = 0; i < numShapes; i++) {
      for (let j = 0; j < 3; j++) {
        positions.current[i][j] += velocities.current[i][j];
        if (positions.current[i][j] > 6) velocities.current[i][j] *= -1;
        if (positions.current[i][j] < -6) velocities.current[i][j] *= -1;
      }
      positions.current[i][1] += Math.sin(state.clock.getElapsedTime() + i) * 0.01;
      const mesh = shapeRefs.current[i];
      if (mesh && mesh.position && mesh.rotation) {
        mesh.position.set(
          positions.current[i][0],
          positions.current[i][1],
          positions.current[i][2]
        );
        mesh.rotation.z = state.clock.getElapsedTime() * 0.2 + i;
      }
    }
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={0.5} />
      {Array.from({ length: numShapes }).map((_, i) => (
        <mesh
          key={i}
          ref={el => (shapeRefs.current[i] = el)}
        >
          {i % 2 === 0 ? (
            <sphereGeometry args={[0.7, 32, 32]} />
          ) : (
            <boxGeometry args={[1, 1, 1]} />
          )}
          <meshStandardMaterial color={i % 2 === 0 ? '#6cf' : '#fff'} roughness={0.4} metalness={0.2} />
        </mesh>
      ))}
    </>
  );
};

export default IdleAnimation; 