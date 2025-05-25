import { useState, useCallback } from 'react';

interface UseFileUploadResult {
  uploading: boolean;
  uploadError: string | null;
  uploadFiles: (files: FileList | File[]) => Promise<string[]>;
  clearError: () => void;
}

export function useFileUpload(
  onUploadComplete?: (urls: string[]) => void
): UseFileUploadResult {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFiles = useCallback(async (files: FileList | File[]): Promise<string[]> => {
    setUploading(true);
    setUploadError(null);
    
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        // Validate file type
        if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
          throw new Error(`Unsupported file type: ${file.type}`);
        }
        
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File too large: ${file.name}. Maximum size is 5MB.`);
        }
        
        formData.append('file', file);
      });

      const response = await fetch('/api/upload', { 
        method: 'POST', 
        body: formData 
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      const uploadedUrls = data.urls || [];
      
      onUploadComplete?.(uploadedUrls);
      return uploadedUrls;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(errorMessage);
      throw error;
    } finally {
      setUploading(false);
    }
  }, [onUploadComplete]);

  const clearError = useCallback(() => {
    setUploadError(null);
  }, []);

  return {
    uploading,
    uploadError,
    uploadFiles,
    clearError,
  };
}
