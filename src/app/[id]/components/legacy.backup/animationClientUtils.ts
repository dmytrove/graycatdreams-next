import React from 'react';
import { AnimationOptions } from '@/types';

// Type for options with imageCounts
export type OptionsWithCounts = AnimationOptions & { imageCounts: Record<string, number> };

export async function fetchOptions(
  animationId: string,
  setOptions: React.Dispatch<React.SetStateAction<OptionsWithCounts>>
) {
  const res = await fetch(`/api/animation-options?session_id=${animationId}`);
  if (res.ok) {
    const data = await res.json();
    setOptions((prev) => ({ ...prev, ...data.options }));
  }
}

export async function handleDelete(
  url: string,
  setImgList: React.Dispatch<React.SetStateAction<string[]>>,
  setOptions: React.Dispatch<React.SetStateAction<OptionsWithCounts>>,
  startTransition: (cb: () => void) => void
) {
  const res = await fetch(`/api/delete-image?url=${encodeURIComponent(url)}`, { method: 'DELETE' });
  if (res.ok) {
    startTransition(() => {
      setImgList(prev => prev.filter(u => u !== url));
      setOptions(prev => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [url]: _unused, ...rest } = prev.imageCounts;
        return { ...prev, imageCounts: rest };
      });
    });
  }
}

// Update options immediately without debouncing
export function handleOptionChange(
  e: React.ChangeEvent<HTMLInputElement>,
  setOptions: React.Dispatch<React.SetStateAction<OptionsWithCounts>>
) {
  const { name, value, type, checked } = e.target;
  
  setOptions((opts) => {
    let v: number | string | boolean;
    if (type === 'checkbox') {
      v = checked;
    } else if (type === 'number' || type === 'range') {
      v = parseFloat(value);
    } else {
      v = value;
    }
    
    // Apply bounds constraints
    if (name === 'imageMinSize') {
      v = Math.max(0.1, Math.min(Number(v), opts.imageMaxSize - 0.01));
    }
    if (name === 'imageMaxSize') {
      v = Math.max(opts.imageMinSize + 0.01, Math.min(Number(v), 10));
    }
    if (name === 'pulsationAmount') {
      v = Math.max(0, Math.min(Number(v), 0.5));
    }
    if (name === 'pulsationRate') {
      v = Math.max(0.1, Math.min(Number(v), 2));
    }
    if (name === 'maxImageCount') {
      v = Math.max(1, Math.min(Math.round(Number(v)), 20));
    }
    
    const newOpts = { ...opts, [name]: v };
    
    // Immediately save to local storage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('animationOpts', JSON.stringify(newOpts));
    }
    
    return newOpts;
  });
}

export function handleImageCountChange(
  url: string,
  value: number,
  setOptions: React.Dispatch<React.SetStateAction<OptionsWithCounts>>
) {
  setOptions((opts) => ({
    ...opts,
    imageCounts: { ...opts.imageCounts, [url]: value },
  }));
}

export async function handleSaveOptions(
  e: React.FormEvent,
  animationId: string,
  options: OptionsWithCounts,
  setSavingOptions: React.Dispatch<React.SetStateAction<boolean>>
) {
  e.preventDefault();
  setSavingOptions(true);
  await fetch(`/api/animation-options?session_id=${animationId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ options }),
  });
  setSavingOptions(false);
}

export async function handleFiles(
  files: FileList | File[],
  setUploading: React.Dispatch<React.SetStateAction<boolean>>,
  setUploadError: React.Dispatch<React.SetStateAction<string | null>>,
  setImgList: React.Dispatch<React.SetStateAction<string[]>>
) {
  setUploading(true);
  setUploadError(null);
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append('file', file));
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  if (res.ok) {
    const data = await res.json();
    setImgList((prev) => [...prev, ...(data.urls || [])]);
  } else {
    setUploadError('Upload failed');
  }
  setUploading(false);
}

export function handleDrop(
  e: React.DragEvent<HTMLDivElement>,
  handleFiles: (files: FileList) => void
) {
  e.preventDefault();
  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    handleFiles(e.dataTransfer.files);
  }
}

export function handleFileInput(
  e: React.ChangeEvent<HTMLInputElement>,
  handleFiles: (files: FileList) => void
) {
  if (e.target.files && e.target.files.length > 0) {
    handleFiles(e.target.files);
  }
}

export function handleShare() {
  navigator.clipboard.writeText(window.location.href);
}

export async function handleDownloadVideo(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  setRecording: React.Dispatch<React.SetStateAction<boolean>>,
  setVideoUrl: React.Dispatch<React.SetStateAction<string | null>>
) {
  if (!canvasRef.current) return;
  setRecording(true);
  setVideoUrl(null);
  const stream = canvasRef.current.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    setVideoUrl(URL.createObjectURL(blob));
    setRecording(false);
  };
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 10000);
}