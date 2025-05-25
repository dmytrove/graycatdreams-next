import React from 'react';
import Image from 'next/image';

interface ImageUploadPanelProps {
  imgList: string[];
  uploading: boolean;
  uploadError: string | null;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDelete: (url: string) => void;
}

const ImageUploadPanel: React.FC<ImageUploadPanelProps> = ({
  imgList, uploading, uploadError, handleDrop, handleFileInput, handleDelete
}) => (
  <div>
    {imgList.length === 0 ? (
      <div style={{ 
        border: '4px dashed #333', 
        borderRadius: 12, 
        padding: 64, 
        textAlign: 'center', 
        background: 'rgba(24, 24, 24, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
      }}>
        <h2 style={{ fontSize: 24, marginBottom: 16, color: '#fff' }}>Welcome to Your Animation Space!</h2>
        <p style={{ fontSize: 16, color: '#aaa', marginBottom: 32, maxWidth: 500 }}>
          Upload some images to enhance your 3D animation. You can already see placeholder shapes floating around!
        </p>
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          style={{ 
            border: '2px dashed #444', 
            borderRadius: 12, 
            padding: 32, 
            textAlign: 'center', 
            background: 'rgba(34, 34, 34, 0.8)', 
            width: '100%', 
            maxWidth: 400,
            cursor: 'pointer' 
          }}
        >
          <input type="file" multiple accept="image/png,image/jpeg,image/webp" style={{ display: 'none' }} id="multi-upload-input" onChange={handleFileInput} />
          <label htmlFor="multi-upload-input" style={{ cursor: 'pointer', color: '#6cf', fontWeight: 500, display: 'block', fontSize: 18 }}>
            {uploading ? 'Uploading...' : 'Click or drag images here to upload'}
          </label>
          {uploadError && <div style={{ color: '#ff6b6b', marginTop: 8 }}>{uploadError}</div>}
        </div>
      </div>
    ) : (
      <>
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          style={{ 
            border: '2px dashed #444', 
            borderRadius: 12, 
            padding: 32, 
            textAlign: 'center', 
            background: 'rgba(24, 24, 24, 0.8)',
            marginBottom: 24,
            cursor: 'pointer' 
          }}
        >
          <input type="file" multiple accept="image/png,image/jpeg,image/webp" style={{ display: 'none' }} id="add-more-upload-input" onChange={handleFileInput} />
          <label htmlFor="add-more-upload-input" style={{ cursor: 'pointer', color: '#6cf', fontWeight: 500 }}>
            {uploading ? 'Uploading...' : 'Click or drag images here to upload more'}
          </label>
          {uploadError && <div style={{ color: '#ff6b6b', marginTop: 8 }}>{uploadError}</div>}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          {imgList.map((url) => (
            <div key={url} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
              <Image src={url} alt="User upload" width={80} height={80} style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 4 }} unoptimized />
              <button 
                onClick={() => handleDelete(url)} 
                style={{ 
                  position: 'absolute', 
                  top: 4, 
                  right: 4, 
                  background: 'rgba(255,0,0,0.8)', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 4, 
                  cursor: 'pointer',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);

export default ImageUploadPanel; 