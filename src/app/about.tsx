import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 700, margin: '60px auto', padding: 32, background: 'rgba(20,20,30,0.95)', borderRadius: 16, color: '#fff', boxShadow: '0 4px 24px #0004' }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 16 }}>About This Project</h1>
      <p style={{ fontSize: 18, lineHeight: 1.7, marginBottom: 24 }}>
        <b>Gray Cat Dreams</b> is a playful, interactive 3D animation space where you can upload your own images, control their movement, and share or download the resulting animation. Built with Next.js, React Three Fiber, and a focus on creative exploration, it lets you experiment with floating, spinning images in a beautiful, immersive environment.
      </p>
      <ul style={{ fontSize: 16, marginBottom: 24, paddingLeft: 24 }}>
        <li>Upload and animate your own images in 3D</li>
        <li>Customize animation options and download as video</li>
        <li>Share your animation with a simple link</li>
        <li>Enjoy a modern, responsive UI</li>
      </ul>
      <Link href="/" style={{ color: '#6cf', fontWeight: 600, fontSize: 18 }}>← Back to Home</Link>
    </div>
  );
} 