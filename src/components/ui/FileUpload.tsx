import React, { useCallback } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';
import styles from '@/styles/Sidebar.module.css';

interface FileUploadProps {
  onUploadComplete: (urls: string[]) => void;
  className?: string;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  customName?: string; // Add support for custom name (admin mode)
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  className = '',
  accept = 'image/png,image/jpeg,image/webp',
  multiple = true,
  maxFiles = 10,
  customName,
}) => {
  const { uploading, uploadError, uploadFiles, clearError } = useFileUpload(onUploadComplete, customName);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).slice(0, maxFiles);
      uploadFiles(files);
    }
  }, [uploadFiles, maxFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files).slice(0, maxFiles);
      uploadFiles(files);
    }
  }, [uploadFiles, maxFiles]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <div 
      className={`${styles.uploadArea} ${uploading ? styles.uploading : ''} ${className}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input 
        type="file" 
        multiple={multiple}
        accept={accept}
        style={{ display: 'none' }} 
        id="upload-input" 
        onChange={handleFileInput}
        disabled={uploading}
      />
      <label htmlFor="upload-input" className={styles.uploadLabel}>
        {uploading ? 'Uploading...' : 'Click or drag images here to upload'}
        {customName && <span style={{ display: 'block', fontSize: '0.8em', opacity: 0.8 }}>Using custom name: {customName}</span>}
      </label>
      {uploadError && (
        <div className={styles.uploadError}>
          {uploadError}
          <button 
            onClick={clearError}
            style={{ 
              marginLeft: '8px', 
              background: 'none', 
              border: 'none', 
              color: 'inherit', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
