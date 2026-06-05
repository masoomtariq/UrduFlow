'use client';

import { useState } from 'react';
import { RotateCw, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Turn } from '@/hooks/useChat';

interface AssistantTurnCardProps {
  turn: Turn;
  onRetry: (phase: 'generation' | 'tts') => void;
  isLoading: boolean;
}

export function AssistantTurnCard({
  turn,
  onRetry,
  isLoading,
}: AssistantTurnCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isGenerating = turn.status === 'generating' && turn.phase === 'generation';
  const isSynthesizing = turn.status === 'synthesizing' && turn.phase === 'tts';
  const isGenerationError = turn.status === 'error' && turn.phase === 'generation';
  const isTTSError = turn.status === 'error' && turn.phase === 'tts';

  return (
    <div className="flex justify-end mb-4">
      <div className="min-w-[400px] max-w-xs md:max-w-md lg:max-w-lg bg-deep-indigo/10 border-r-4 border-deep-indigo rounded-lg p-4">
        

        {/* Audio Player - Skeleton Loading */}
        {isSynthesizing && (
          <div className="mb-3">
            <div className="animate-pulse bg-surface-container h-8 rounded w-full" />
          </div>
        )}

        {/* Audio Player - Complete */}
        {turn.assistantAudio && !isSynthesizing && (
          <div className="mb-3">
            <audio
              controls
              className="w-full h-8 rounded"
              src={URL.createObjectURL(turn.assistantAudio)}
            />
          </div>
        )}

        {/* Text Accordion */}
        {turn.assistantText && (
          <div className="mb-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm font-semibold text-on-surface hover:text-deep-indigo transition-colors w-full py-2 px-3 bg-white/50 rounded"
            >
              {isExpanded ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
              Response
            </button>
            {isExpanded && (
              <div className="mt-2 p-3 bg-white rounded text-sm text-on-surface leading-relaxed rtl-text font-noto-nastaliq">
                {turn.assistantText}
              </div>
            )}
          </div>
        )}

        {/* Status - Generating */}
        {isGenerating && (
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <div className="animate-spin">
              <div className="w-4 h-4 border-2 border-deep-indigo border-t-transparent rounded-full" />
            </div>
            Generating response...
          </div>
        )}

        {/* Status - Synthesizing */}
        {isSynthesizing && (
          <div className="flex items-center gap-2 text-sm text-on-surface-variant">
            <div className="animate-spin">
              <div className="w-4 h-4 border-2 border-deep-indigo border-t-transparent rounded-full" />
            </div>
            Creating audio...
          </div>
        )}

        {/* Error State - Generation */}
        {isGenerationError && (
          <div className="flex items-center gap-2 mt-2">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-600">
                {turn.error || 'Generation failed'}
              </p>
              <Button
                onClick={() => onRetry('generation')}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="mt-2 text-deep-indigo border-deep-indigo hover:bg-deep-indigo/10"
              >
                <RotateCw size={14} className="mr-1" />
                Retry Generation
              </Button>
            </div>
          </div>
        )}

        {/* Error State - TTS */}
        {isTTSError && (
          <div className="flex items-center gap-2 mt-2">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-600">
                {turn.error || 'Audio synthesis failed'}
              </p>
              <Button
                onClick={() => onRetry('tts')}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="mt-2 text-deep-indigo border-deep-indigo hover:bg-deep-indigo/10"
              >
                <RotateCw size={14} className="mr-1" />
                Retry Audio
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
