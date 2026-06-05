'use client';

import { useState } from 'react';
import { Volume2, RotateCw, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Turn } from '@/hooks/useChat';

interface UserTurnCardProps {
  turn: Turn;
  onRetry: (phase: 'transcription') => void;
  isLoading: boolean;
}

export function UserTurnCard({ turn, onRetry, isLoading }: UserTurnCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isTranscribing = turn.status === 'transcribing' && turn.phase === 'transcription';
  const isError = turn.status === 'error' && turn.phase === 'transcription';

  return (
    <div className="flex justify-start mb-4">
      <div className="min-w-[350px] max-w-xs md:max-w-md lg:max-w-lg border-l-4 border-teal-accent bg-teal-accent/5 rounded-lg p-4">
        {/* Audio Player */}
        {turn.userAudio && (
          <div className="mb-3">
            <audio
              controls
              className="w-full h-8 rounded"
              src={URL.createObjectURL(turn.userAudio)}
            />
          </div>
        )}

        {/* Transcribed Text Accordion */}
        {turn.userText && (
          <div className="mb-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm font-semibold text-on-surface hover:text-teal-accent transition-colors w-full py-2 px-3 bg-white/50 rounded"
            >
              {isExpanded ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
              Your Message
            </button>
            {isExpanded && (
              <div className="mt-2 p-3 bg-white rounded text-sm text-on-surface leading-relaxed rtl-text font-noto-nastaliq">
                {turn.userText}
              </div>
            )}
          </div>
        )}

        {/* Status */}
        {isTranscribing && (
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <div className="animate-spin">
              <div className="w-4 h-4 border-2 border-teal-accent border-t-transparent rounded-full" />
            </div>
            Transcribing...
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="flex items-center gap-2 mt-2">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-600">{turn.error || 'Transcription failed'}</p>
              <Button
                onClick={() => onRetry('transcription')}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="mt-2 text-teal-accent border-teal-accent hover:bg-teal-accent/10"
              >
                <RotateCw size={14} className="mr-1" />
                Retry Transcription
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
