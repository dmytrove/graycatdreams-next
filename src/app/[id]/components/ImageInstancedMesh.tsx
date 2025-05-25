import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FloatingObject } from '@/types';

function ImageInstancedMesh({ objects, aspect, texture }: { objects: FloatingObject[]; aspect: number; texture: THREE.Texture }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  useFrame(() => {
    if (!meshRef.current) return;
    objects.forEach((obj, i) => {
      const matrix = new THREE.Matrix4();
      matrix.compose(
        obj.position,
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, obj.rotation)),
        new THREE.Vector3(obj.scale * aspect, obj.scale, 1)
      );
      meshRef.current!.setMatrixAt(i, matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, objects.length]}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        alphaTest={0.01}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

export default ImageInstancedMesh; 