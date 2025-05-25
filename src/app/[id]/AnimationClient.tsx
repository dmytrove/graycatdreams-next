"use client";
import React, { Suspense, useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useAnimationOptions } from '@/hooks/useAnimationOptions';
import { useResponsiveSidebar } from '@/hooks/useResponsiveSidebar';
import { useVideoRecorder } from '@/hooks/useVideoRecorder';
import { ImageGrid } from '@/components/ui/ImageGrid';
import { FileUpload } from '@/components/ui/FileUpload';
import { AnimationOptionsForm } from '@/components/animation/AnimationOptionsForm';
import { api } from '@/lib/api/client';
import { AnimationOptions, DEFAULT_ANIMATION_OPTIONS } from '@/types';
import styles from './AnimationClient.module.css';

// Dynamically import the 3D component to avoid SSR issues
const Images3DComponent = dynamic(() => import('./Images3D'), {
  ssr: false,
  loading: () => (
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
  )
});

interface AnimationClientProps {
  images: string[];
  isAuthor: boolean;
  animationId: string;
}

export default function AnimationClient({ 
  images, 
  isAuthor, 
  animationId 
}: AnimationClientProps) {
  // State management
  const [imgList, setImgList] = useState<string[]>(images || []);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Custom hooks
  const {
    leftSidebarOpen,
    rightSidebarOpen,
    toggleLeftSidebar,
    toggleRightSidebar,
  } = useResponsiveSidebar();

  const {
    recording,
    videoUrl,
    startRecording,
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
    isSaving,
    saveError,
  } = useAnimationOptions(DEFAULT_ANIMATION_OPTIONS, saveOptions);

  // Load initial options
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const serverOptions = await api.getAnimationOptions(animationId);
        updateOptions(serverOptions);
      } catch (err) {
        console.error('Failed to load options:', err);
        setError('Failed to load animation settings');
      }
    };
    loadOptions();
  }, [animationId, updateOptions]);

  // Find canvas element when component mounts
  useEffect(() => {
    const findCanvas = () => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvasRef.current = canvas;
      }
    };

    // Try immediately and after a short delay
    findCanvas();
    const timeout = setTimeout(findCanvas, 1000);
    return () => clearTimeout(timeout);
  }, []);

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
      setError('Failed to delete image');
    }
  }, []);

  const handleShare = useCallback(() => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  }, []);

  const handleDownloadVideo = useCallback(() => {
    if (!canvasRef.current) {
      alert('Canvas not found. Please wait for the 3D scene to load.');
      return;
    }
    startRecording(canvasRef.current);
  }, [startRecording]);

  const handleDeleteAnimation = useCallback(async () => {
    if (!window.confirm('Are you sure you want to delete this animation and all its images? This cannot be undone.')) {
      return;
    }

    try {
      await api.deleteAnimation(animationId);
      document.cookie = `animation_${animationId}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      window.location.href = '/';
    } catch (err) {
      console.error('Failed to delete animation:', err);
      setError('Failed to delete animation');
    }
  }, [animationId]);

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

  return (
    <div className={styles.animationClientContainer}>
      {/* Error Display */}
      {error && (
        <div className={styles.errorDisplay}>
          {error}
          <button
            onClick={() => setError(null)}
            className={styles.errorCloseButton}
          >
            ×
          </button>
        </div>
      )}

      {/* Always Visible Toggle Buttons */}
      <button
        onClick={toggleLeftSidebar}
        className={`${styles.toggleButton} ${leftSidebarOpen ? styles.toggleButtonLeftOpen : styles.toggleButtonLeft}`}
        title={leftSidebarOpen ? 'Close Images' : 'Open Images'}
      >
        {leftSidebarOpen ? '✕' : '🖼️'}
      </button>

      <button
        onClick={toggleRightSidebar}
        className={`${styles.toggleButton} ${rightSidebarOpen ? styles.toggleButtonRightOpen : styles.toggleButtonRight}`}
        title={rightSidebarOpen ? 'Close Controls' : 'Open Controls'}
      >
        {rightSidebarOpen ? '✕' : '⚙️'}
      </button>

      {/* 3D Scene */}
      <Suspense fallback={<div>Loading animation...</div>}>
        <Images3DComponent images={imgList} options={options} />
      </Suspense>

      {/* Left Sidebar: Image Management */}
      {leftSidebarOpen && (
        <div className={`${styles.sidebar} ${styles.sidebarLeft}`}>
          <h3 className={styles.sidebarTitle}>
            Images ({imgList.length})
          </h3>
          
          {/* Upload Section (Authors Only) */}
          {isAuthor && (
            <FileUpload
              onUploadComplete={handleUploadComplete}
              maxFiles={10}
            />
          )}

          {/* Image Grid */}
          <ImageGrid
            images={imgList}
            onDeleteImage={isAuthor ? handleDeleteImage : undefined}
            showDeleteButton={isAuthor}
          />

          {/* Delete Animation Button (Authors Only) */}
          {isAuthor && (
            <button
              onClick={handleDeleteAnimation}
              className={styles.deleteButton}
            >
              🗑️ Delete Animation
            </button>
          )}
        </div>
      )}

      {/* Right Sidebar: Controls */}
      {rightSidebarOpen && (
        <div className={`${styles.sidebar} ${styles.sidebarRight}`}>
          <h3 className={styles.sidebarTitle}>
            Controls
          </h3>

          {/* Share and Video Controls */}
          <div className={styles.controlButtons}>
            <button
              onClick={handleShare}
              className={styles.shareButton}
              title="Copy shareable link"
            >
              📤 Share
            </button>
            <button
              onClick={handleDownloadVideo}
              disabled={recording}
              className={`${styles.recordButton} ${recording ? styles.recordButtonDisabled : ''}`}
              title="Download animation as video"
            >
              {recording ? '🔴 Recording...' : '📹 Record'}
            </button>
          </div>

          {/* Video Download Link */}
          {videoUrl && (
            <a 
              href={videoUrl} 
              download="animation.webm" 
              className={styles.videoDownloadLink}
            >
              ⬇️ Download Ready! Click here
            </a>
          )}

          {/* Animation Options (Authors Only) */}
          {isAuthor && imgList.length > 0 && (
            <>
              <AnimationOptionsForm
                options={options}
                onOptionChange={updateOptions}
                imageCount={imgList.length}
              />
              {isSaving && (
                <div className={styles.savingIndicator}>
                  💾 Saving…
                </div>
              )}
              {saveError && (
                <div className={styles.saveError}>
                  ❌ {saveError}
                </div>
              )}
            </>
          )}

          {!isAuthor && (
            <div className={styles.readOnlyNotice}>
              👀 Viewing animation in read-only mode
            </div>
          )}
        </div>
      )}
    </div>
  );
}
