"use client";
import React, { Suspense, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useAnimationOptions } from '@/hooks/useAnimationOptions';
import { useVideoRecorder } from '@/hooks/useVideoRecorder';
import { useAdmin } from '@/context/AdminContext'; // Use the new admin context
import { ImageGrid } from '@/components/ui/ImageGrid';
import { FileUpload } from '@/components/ui/FileUpload';
import { AnimationOptionsForm } from '@/components/animation/AnimationOptionsForm';
import { ThreeJSErrorBoundary } from '@/components/ThreeJSErrorBoundary';
import { api } from '@/lib/api/client';
import { AnimationOptions, DEFAULT_ANIMATION_OPTIONS } from '@/types';
import styles from './AnimationClient.module.css';

// Loading component for the 3D scene
const Loading3DScene = () => (
  <div 
    style={{
      width: '100%', 
      height: '100vh', 
      background: 'linear-gradient(to bottom, #111, #222)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '1.2rem'
    }}
  >
    <div style={{ animation: 'pulse 2s infinite' }}>Loading 3D scene...</div>
  </div>
);

// Dynamically import the 3D component to avoid SSR issues
const Images3DComponent = dynamic(() => import('./Images3D'), {
  ssr: false,
  loading: () => <Loading3DScene />
});

interface AnimationClientProps {
  images: string[];
  isAuthor: boolean;
  animationId: string;
  customName?: string;
}

export default function AnimationClient({ 
  images, 
  isAuthor, 
  animationId,
  customName: _customName 
}: AnimationClientProps) {
  // State management
  const [imgList, setImgList] = useState<string[]>(images || []);
  
  // Safely access admin state with error handling
  const adminContext = useAdmin();
  const { isAdmin } = adminContext?.adminState || { isAdmin: false };

  // Panel state: only one open at a time, all hidden by default
  const [openPanel, setOpenPanel] = useState<null | 'images' | 'controls'>(null);
  const leftSidebarOpen = openPanel === 'images';
  const rightSidebarOpen = openPanel === 'controls';

  const handleOpenPanel = useCallback((panel: 'images' | 'controls') => {
    setOpenPanel(prev => (prev === panel ? null : panel));
  }, []);

  const {
    startRecording: _startRecording,
  } = useVideoRecorder();

  const saveOptions = useCallback(async (options: AnimationOptions) => {
    if (!isAuthor) return;
    try {
      await api.saveAnimationOptions(animationId, options);
    } catch (err) {
      console.error('Failed to save options:', err);
      throw err;
    }
  }, [animationId, isAuthor]);

  const {
    options,
    updateOptions,
  } = useAnimationOptions(DEFAULT_ANIMATION_OPTIONS, saveOptions);

  // Load initial options
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const serverOptions = await api.getAnimationOptions(animationId);
        updateOptions(serverOptions);
      } catch (err) {
        console.error('Failed to load options:', err);
      }
    };
    loadOptions();
  }, [animationId, updateOptions]);

  // Handlers
  const handleUploadComplete = useCallback((urls: string[]) => {
    setImgList(prev => [...prev, ...urls]);
  }, []);

  const handleDeleteImage = useCallback(async (url: string) => {
    try {
      await api.deleteImage(url);
      setImgList(prev => prev.filter(u => u !== url));
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  }, []);

  // Debug info (client-side only)
  if (typeof window !== 'undefined') {
    console.log('AnimationClient render:', {
      leftSidebarOpen,
      rightSidebarOpen,
      imgList: imgList.length,
      isAuthor,
      optionsLoaded: !!options
    });
  }

  // Render 3D component
  const render3DComponent = () => {
    if (imgList.length === 0) {
      return (
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyStateContent}>
            <h2>No images yet</h2>
            <p>Upload some images to create a 3D animation</p>
            {isAuthor && (
              <button 
                className={styles.uploadButton}
                onClick={() => handleOpenPanel('images')}
              >
                Upload Images
              </button>
            )}
          </div>
        </div>
      );
    }

    // Wrap the 3D component in ThreeJSErrorBoundary for better error handling
    return (
      <ThreeJSErrorBoundary>
        <Suspense fallback={<Loading3DScene />}>
          <Images3DComponent
            images={imgList}
            options={options}
          />
        </Suspense>
      </ThreeJSErrorBoundary>
    );
  };

  return (
    <div className={styles.container}>
      {/* Main 3D scene rendered by the render3DComponent function */}
      {render3DComponent()}
      
      {/* Control Buttons - Fixed positioned buttons to open panels */}
      <div className={styles.controlButtons}>
        {/* Images button */}
        <button 
          className={`${styles.controlButton} ${leftSidebarOpen ? styles.active : ''}`}
          onClick={() => handleOpenPanel('images')}
          title="Images & Upload"
        >
          🖼️
        </button>
        
        {/* Controls button */}
        <button 
          className={`${styles.controlButton} ${rightSidebarOpen ? styles.active : ''}`}
          onClick={() => handleOpenPanel('controls')}
          title="Animation Controls"
        >
          ⚙️
        </button>
        
        {/* Share button */}
        <button 
          className={styles.controlButton}
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'GrayCAT Dreams - 3D Animation',
                url: window.location.href
              });
            } else if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }
          }}
          title="Share Animation"
        >
          📤
        </button>
        
        {/* Home button */}
        <button 
          className={styles.controlButton}
          onClick={() => window.location.href = '/'}
          title="Go to Home"
        >
          🏠
        </button>
      </div>
      
      {/* Left sidebar - Images and uploads */}
      {leftSidebarOpen && (
        <div className={`${styles.sidebar} ${styles.leftSidebar}`}>
          <h2>Images</h2>
          <p className={styles.helperText}>Upload and manage images for animation</p>
          
          {isAuthor && (
            <FileUpload 
              onUploadComplete={handleUploadComplete}
              maxFiles={10}
            />
          )}
          
          <div className={styles.imageGridContainer}>
            <ImageGrid 
              images={imgList} 
              onDeleteImage={isAuthor ? handleDeleteImage : undefined}
              showDeleteButton={isAuthor}
            />
          </div>
          
          <button onClick={() => setOpenPanel(null)} className={styles.closeButton}>
            ← Close
          </button>
        </div>
      )}
      
      {/* Right sidebar - Animation controls */}
      {rightSidebarOpen && (
        <div className={`${styles.sidebar} ${styles.rightSidebar}`}>
          <h2>Animation Controls</h2>
          <p className={styles.helperText}>Customize your animation experience</p>
          
          <AnimationOptionsForm 
            options={options}
            onOptionChange={updateOptions}
            imageCount={imgList.length}
          />
          
          {isAuthor && (
            <div style={{ marginTop: 24 }}>
              <Suspense fallback={null}>
                {/** Delete animation button for authors only */}
                {typeof window !== 'undefined' && (
                  <div>
                    {/** Lazy load to avoid hydration mismatch if needed */}
                    {React.createElement(require('./components/DeleteAnimationButton').default, { animationId })}
                  </div>
                )}
              </Suspense>
            </div>
          )}
          <button onClick={() => setOpenPanel(null)} className={styles.closeButton}>
            → Close
          </button>
        </div>
      )}

      {/* Rest of your UI components... */}
    </div>
  );
}
