import React from 'react';

interface HeaderToolbarProps {
  copied: boolean;
  onShare: () => void;
  recording: boolean;
  onDownloadVideo: () => void;
  videoUrl: string | null;
}

const HeaderToolbar: React.FC<HeaderToolbarProps> = ({ copied, onShare, recording, onDownloadVideo, videoUrl }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
    <h1 style={{ fontWeight: 700, fontSize: 28, marginBottom: 8, color: '#fff', margin: 0 }}>Animation Space</h1>
    <div style={{ display: 'flex', gap: 8 }}>
      <button
        onClick={onShare}
        style={{
          background: '#6cf',
          color: '#111',
          border: 'none',
          borderRadius: 6,
          padding: '8px 16px',
          fontWeight: 600,
          fontSize: 16,
          cursor: 'pointer',
          marginLeft: 8,
          position: 'relative',
        }}
        title="Copy shareable link"
      >
        {copied ? 'Copied!' : 'Share'}
      </button>
      <button
        onClick={onDownloadVideo}
        disabled={recording}
        style={{
          background: recording ? '#aaa' : '#222',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '8px 16px',
          fontWeight: 600,
          fontSize: 16,
          cursor: recording ? 'not-allowed' : 'pointer',
          marginLeft: 8,
          position: 'relative',
        }}
        title="Download animation as video"
      >
        {recording ? 'Recording…' : 'Download Video'}
      </button>
    </div>
    {videoUrl && (
      <div style={{ marginTop: 8 }}>
        <a href={videoUrl} download="animation.webm" style={{ color: '#6cf', fontWeight: 600 }}>
          Download Ready! Click here
        </a>
      </div>
    )}
  </div>
);

export default HeaderToolbar; 