'use client';

import { useEffect } from 'react';
import { Turn } from '@/hooks/useChat';
import { UserTurnCard } from './UserTurnCard';
import { AssistantTurnCard } from './AssistantTurnCard';

interface ConversationAreaProps {
  turns: Turn[];
  onRetry: (turnId: string, phase: 'transcription' | 'generation' | 'tts') => void;
  isLoading: boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export function ConversationArea({
  turns,
  onRetry,
  isLoading,
  scrollContainerRef,
}: ConversationAreaProps) {
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [turns, scrollContainerRef]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 bg-surface-white"
    >
      {turns.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-hanken font-bold text-deep-indigo mb-2">
              Welcome to UrduFlow
            </h2>
            <p className="text-on-surface-variant max-w-md">
              Start your conversation by recording a message in Urdu. Click the mic
              button below and speak naturally.
            </p>
          </div>
        </div>
      ) : (
        <>
          {turns.map((turn) => (
            <div key={turn.id}>
              <UserTurnCard
                turn={turn}
                onRetry={(phase) => onRetry(turn.id, phase)}
                isLoading={isLoading}
              />
              <AssistantTurnCard
                turn={turn}
                onRetry={(phase) => onRetry(turn.id, phase)}
                isLoading={isLoading}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
