import React from 'react';
import Image from 'next/image';
import styles from '@/styles/Sidebar.module.css';

interface ImageGridProps {
  images: string[];
  onDeleteImage?: (url: string) => void;
  showDeleteButton?: boolean;
  className?: string;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  onDeleteImage,
  showDeleteButton = false,
  className = '',
}) => {
  if (images.length === 0) {
    return (
      <div className={`${styles.imageGrid} ${className}`}>
        <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', width: '100%' }}>
          No images uploaded yet
        </p>
      </div>
    );
  }

  return (
    <div className={`${styles.imageGrid} ${className}`}>
      {images.map((url) => (
        <div key={url} className={styles.imageItem}>
          <Image 
            src={url} 
            alt="User upload" 
            width={60} 
            height={60} 
            style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 'var(--border-radius-sm)' }}
            unoptimized 
          />
          {showDeleteButton && onDeleteImage && (
            <button
              onClick={() => onDeleteImage(url)}
              className={styles.deleteImageButton}
              aria-label={`Delete image ${url}`}
              title="Delete image"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
