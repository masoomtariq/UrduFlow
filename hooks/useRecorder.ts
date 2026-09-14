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

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          'Microphone access is not available. Open this app on localhost or over HTTPS.'
        );
      }

      if (!window.MediaRecorder) {
        throw new Error('Audio recording is not supported by this browser.');
      }

      let stream: MediaStream;
      
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      } catch (err) {
        const errorName = err instanceof DOMException ? err.name : '';
        if (errorName !== 'OverconstrainedError' && errorName !== 'NotFoundError') {
          throw err;
        }

        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      audioStreamRef.current = stream;

      // Use a MIME type only when the browser explicitly supports it.
      const types = [
        'audio/webm',
        'audio/webm;codecs=opus',
        'audio/mp4',
        'audio/wav',
        'audio/ogg',
      ];

      const mimeType = types.find((type) =>
        MediaRecorder.isTypeSupported(type)
      );
      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

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
      const errorName = err instanceof DOMException ? err.name : '';
      const errorMessage =
        errorName === 'NotFoundError'
          ? 'No microphone was found. Connect or enable a microphone, then try again.'
          : errorName === 'NotAllowedError'
            ? 'Microphone permission was denied. Allow microphone access in your browser and try again.'
            : err instanceof Error
              ? err.message
              : 'Failed to start recording';
      audioStreamRef.current?.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
      mediaRecorderRef.current = null;
      setError(errorMessage);
      setIsRecording(false);
      throw new Error(errorMessage);
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
          type: mediaRecorder.mimeType,
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
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    audioStreamRef.current?.getTracks().forEach((track) => track.stop());
    audioStreamRef.current = null;
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
