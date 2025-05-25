import { useRef, useCallback } from 'react';

interface UseVideoRecorderResult {
  recording: boolean;
  videoUrl: string | null;
  startRecording: (canvas: HTMLCanvasElement) => void;
  stopRecording: () => void;
  clearVideo: () => void;
}

export function useVideoRecorder(): UseVideoRecorderResult {
  // Define stopRecording first so it can be referenced in startRecording
  const stopRecording = useCallback(() => {
    if (recorderRef.current && recordingRef.current) {
      recorderRef.current.stop();
    }
  }, []);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const recordingRef = useRef(false);
  const videoUrlRef = useRef<string | null>(null);




  const startRecording = useCallback((canvas: HTMLCanvasElement) => {
    if (recordingRef.current || !canvas) return;

    try {
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { 
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000 // 2.5 Mbps for good quality
      });

      chunksRef.current = [];
      recorderRef.current = recorder;
      recordingRef.current = true;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        if (videoUrlRef.current) {
          URL.revokeObjectURL(videoUrlRef.current);
        }
        videoUrlRef.current = URL.createObjectURL(blob);
        recordingRef.current = false;
        recorderRef.current = null;
      };

      recorder.start(100); // Collect data every 100ms

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (recorderRef.current && recordingRef.current) {
          stopRecording();
        }
      }, 10000);

    } catch (error) {
      console.error('Failed to start recording:', error);
      recordingRef.current = false;
      recorderRef.current = null;
    }
  }, [stopRecording]);



  const clearVideo = useCallback(() => {
    if (videoUrlRef.current) {
      URL.revokeObjectURL(videoUrlRef.current);
      videoUrlRef.current = null;
    }
  }, []);

  return {
    recording: recordingRef.current,
    videoUrl: videoUrlRef.current,
    startRecording,
    stopRecording,
    clearVideo,
  };
}
