import { useState, useCallback, useRef } from 'react';
import { AnimationOptions, DEFAULT_ANIMATION_OPTIONS } from '@/types';

interface UseAnimationOptionsResult {
  options: AnimationOptions;
  updateOptions: (updates: Partial<AnimationOptions>) => void;
  resetOptions: () => void;
  isSaving: boolean;
  saveError: string | null;
}

export function useAnimationOptions(
  initialOptions: AnimationOptions = DEFAULT_ANIMATION_OPTIONS,
  onSave?: (options: AnimationOptions) => Promise<void>
): UseAnimationOptionsResult {
  const [options, setOptions] = useState<AnimationOptions>(initialOptions);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateOptions = useCallback((updates: Partial<AnimationOptions>) => {
    setOptions(prev => {
      const newOptions = { ...prev, ...updates };
      
      // Apply validation constraints
      if (updates.imageMinSize !== undefined && updates.imageMaxSize !== undefined) {
        newOptions.imageMinSize = Math.min(updates.imageMinSize, newOptions.imageMaxSize - 0.01);
        newOptions.imageMaxSize = Math.max(updates.imageMaxSize, newOptions.imageMinSize + 0.01);
      } else if (updates.imageMinSize !== undefined) {
        newOptions.imageMinSize = Math.min(updates.imageMinSize, newOptions.imageMaxSize - 0.01);
      } else if (updates.imageMaxSize !== undefined) {
        newOptions.imageMaxSize = Math.max(updates.imageMaxSize, newOptions.imageMinSize + 0.01);
      }
      
      // Clamp other values to their valid ranges
      if (updates.pulsationAmount !== undefined) {
        newOptions.pulsationAmount = Math.max(0, Math.min(updates.pulsationAmount, 0.5));
      }
      if (updates.pulsationRate !== undefined) {
        newOptions.pulsationRate = Math.max(0.1, Math.min(updates.pulsationRate, 2));
      }
      if (updates.maxImageCount !== undefined) {
        newOptions.maxImageCount = Math.max(1, Math.min(Math.round(updates.maxImageCount), 20));
      }
      
      // Auto-save with debouncing
      if (onSave) {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        setIsSaving(true);
        setSaveError(null);
        
        saveTimeoutRef.current = setTimeout(async () => {
          try {
            await onSave(newOptions);
            setIsSaving(false);
          } catch (error) {
            setIsSaving(false);
            setSaveError(error instanceof Error ? error.message : 'Failed to save options');
          }
        }, 1000); // 1 second debounce
      }
      
      return newOptions;
    });
  }, [onSave]);

  const resetOptions = useCallback(() => {
    setOptions(DEFAULT_ANIMATION_OPTIONS);
  }, []);

  return {
    options,
    updateOptions,
    resetOptions,
    isSaving,
    saveError,
  };
}
