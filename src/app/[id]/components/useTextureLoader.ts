import { useState, useEffect } from 'react';
import * as THREE from 'three';

export function useTextureLoader(urls: string[]) {
  const [loadedTextures, setLoadedTextures] = useState<THREE.Texture[]>([]);
  const [aspectRatios, setAspectRatios] = useState<number[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [validUrls, setValidUrls] = useState<string[]>([]);

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';
    const textures: THREE.Texture[] = [];
    const goodUrls: string[] = [];
    const ratios: number[] = [];
    let loadedCount = 0;
    const totalUrls = urls.length;
    urls.forEach((url) => {
      textureLoader.load(
        url,
        (texture) => {
          goodUrls.push(url);
          textures.push(texture);
          // Get aspect ratio from image
          const image = texture.image;
          if (image && image.width && image.height) {
            ratios.push(image.width / image.height);
          } else {
            ratios.push(1);
          }
          loadedCount++;
          if (loadedCount === totalUrls) {
            setLoadedTextures(prev => {
              if (prev.length === textures.length && prev.every((t, i) => t === textures[i])) return prev;
              return textures;
            });
            setAspectRatios(prev => {
              if (prev.length === ratios.length && prev.every((r, i) => r === ratios[i])) return prev;
              return ratios;
            });
            setValidUrls(prev => {
              if (prev.length === goodUrls.length && prev.every((u, i) => u === goodUrls[i])) return prev;
              return goodUrls;
            });
          }
        },
        undefined,
        (err) => {
          console.error(`Failed to load texture: ${url}`, err);
          loadedCount++;
          if (loadedCount === totalUrls && textures.length === 0) {
            setError(new Error('Failed to load all textures'));
          } else if (loadedCount === totalUrls) {
            setLoadedTextures(prev => {
              if (prev.length === textures.length && prev.every((t, i) => t === textures[i])) return prev;
              return textures;
            });
            setAspectRatios(prev => {
              if (prev.length === ratios.length && prev.every((r, i) => r === ratios[i])) return prev;
              return ratios;
            });
            setValidUrls(prev => {
              if (prev.length === goodUrls.length && prev.every((u, i) => u === goodUrls[i])) return prev;
              return goodUrls;
            });
          }
        }
      );
    });
    return () => {
      textures.forEach(texture => {
        if (texture) {
          texture.dispose();
        }
      });
    };
  }, [urls]);

  return { textures: loadedTextures, aspectRatios, error, validUrls };
} 