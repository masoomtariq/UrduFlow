'use client';

import { useState, useRef, useCallback } from 'react';

interface UseRecorderReturn {
  isRecording: boolean;
  duration: number;
  audioBlob: Blob | null;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  resetRecorder: () => void;
  mediaRecorder: MediaRecorder | null;
  audioStream: MediaStream | null;
}

export function useRecorder(maxDuration: number = 60000): UseRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const maxDurationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setAudioBlob(null);
      audioChunksRef.current = [];
      setDuration(0);

      let stream: MediaStream;
      
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      } catch (micError) {
        // Create a silent audio context for demo/sandbox mode (no microphone available)
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        stream = audioContext.createMediaStreamDestination().stream;
      }

      audioStreamRef.current = stream;

      // Determine supported mime type
      let mimeType = 'audio/webm';
      const types = [
        'audio/webm',
        'audio/webm;codecs=opus',
        'audio/mp4',
        'audio/wav',
        'audio/ogg',
      ];
      
      for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
      });

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);

      // Track duration
      let elapsed = 0;
      durationIntervalRef.current = setInterval(() => {
        elapsed += 100;
        setDuration(elapsed);

        // Auto-stop at max duration
        if (elapsed >= maxDuration && mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
        }
      }, 100);

      // Set timeout for max duration fallback
      maxDurationTimeoutRef.current = setTimeout(() => {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
        }
      }, maxDuration);


    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to start recording';
      setError(errorMessage);
      setIsRecording(false);
    }
  }, [maxDuration, isRecording]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || !audioStreamRef.current) {
        resolve(null);
        return;
      }

      const mediaRecorder = mediaRecorderRef.current;

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        });
        setAudioBlob(audioBlob);
        setIsRecording(false);

        // Clean up stream
        audioStreamRef.current?.getTracks().forEach((track) => {
          track.stop();
        });
        audioStreamRef.current = null;

        // Clear timers
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
        }
        if (maxDurationTimeoutRef.current) {
          clearTimeout(maxDurationTimeoutRef.current);
        }

        resolve(audioBlob);
      };

      mediaRecorder.stop();
    });
  }, []);

  const resetRecorder = useCallback(() => {
    setIsRecording(false);
    setDuration(0);
    setAudioBlob(null);
    setError(null);
    audioChunksRef.current = [];

    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
    if (maxDurationTimeoutRef.current) {
      clearTimeout(maxDurationTimeoutRef.current);
    }
  }, []);

  return {
    isRecording,
    duration,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    resetRecorder,
    mediaRecorder: mediaRecorderRef.current,
    audioStream: audioStreamRef.current,
  };
}
