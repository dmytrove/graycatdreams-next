import React from 'react';

export default function FallbackContent() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} />
    </mesh>
  );
} 