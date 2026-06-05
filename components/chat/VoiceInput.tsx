'use client';

import { useCallback, useEffect, useState } from 'react';
import { Mic, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRecorder } from '@/hooks/useRecorder';
import { useAudioVisualizer } from '@/hooks/useAudioVisualizer';
import { AudioVisualizer } from './AudioVisualizer';
import { toast } from 'sonner';

interface VoiceInputProps {
  onSubmit: (audioBlob: Blob) => Promise<void>;
  isLoading: boolean;
}

export function VoiceInput({ onSubmit, isLoading }: VoiceInputProps) {
  const {
    isRecording,
    duration,
    startRecording,
    stopRecording,
    resetRecorder,
    mediaRecorder,
    audioStream,
  } = useRecorder(60000);
  const { frequencyData, isActive } = useAudioVisualizer(
    mediaRecorder,
    audioStream,
    isRecording
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartRecord = useCallback(async () => {
    try {
      await startRecording();
      // Show info if in demo mode (no microphone available)
      if (!audioStream || audioStream.getAudioTracks().length === 0) {
        toast.info('Demo Mode: Running without microphone. Test the API connection with sample audio.');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to start recording';
      toast.error(errorMessage);
    }
  }, [startRecording, audioStream]);

  const handleStopRecord = useCallback(async () => {
    const blob = await stopRecording();
    if (blob && blob.size > 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(blob);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to submit audio';
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
        resetRecorder();
      }
    }
  }, [stopRecording, onSubmit, resetRecorder]);

  const handleCancel = useCallback(() => {
    resetRecorder();
  }, [resetRecorder]);

  const formatDuration = useCallback((ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Show warning at 55 seconds
  useEffect(() => {
    if (duration >= 55000 && duration < 56000 && isRecording) {
      toast.info('Recording will auto-stop at 60 seconds');
    }
  }, [duration, isRecording]);

  return (
    <div className="flex flex-col items-center gap-4 py-6 px-4">
      {/* Recording Status */}
      {isRecording && (
        <div className="text-center">
          <p className="text-sm text-on-surface-variant mb-2">
            Recording... {formatDuration(duration)}
          </p>
          <AudioVisualizer frequencyData={frequencyData} isActive={isActive} />
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        {!isRecording ? (
          <Button
            onClick={handleStartRecord}
            disabled={isLoading || isSubmitting}
            size="lg"
            className="bg-gradient-to-r from-deep-indigo to-teal-accent text-white hover:scale-105 transition-transform"
          >
            <Mic className="mr-2" size={20} />
            Start Recording
          </Button>
        ) : (
          <>
            <Button
              onClick={handleStopRecord}
              disabled={isSubmitting}
              size="lg"
              className="bg-gradient-to-r from-deep-indigo to-teal-accent text-white hover:scale-105 transition-transform"
            >
              <Send className="mr-2" size={20} />
              Submit
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="lg"
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              <X size={20} />
            </Button>
          </>
        )}
      </div>

      {isSubmitting && (
        <p className="text-sm text-on-surface-variant animate-pulse">
          Processing audio...
        </p>
      )}
    </div>
  );
}
