'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  transcribeAudio,
  generateResponse,
  synthesizeAudio,
  clearSession,
} from '@/lib/api/urdu-flow';

export interface Turn {
  id: string;
  userAudio: Blob | null;
  userText: string;
  assistantText: string;
  assistantAudio: Blob | null;
  status: 'idle' | 'transcribing' | 'generating' | 'synthesizing' | 'complete' | 'error';
  error: string | null;
  phase: 'transcription' | 'generation' | 'tts';
}

interface UseChatReturn {
  sessionId: string;
  turns: Turn[];
  currentTurn: Turn | null;
  isLoading: boolean;
  error: string | null;
  submitAudio: (audioBlob: Blob) => Promise<void>;
  retryPhase: (turnId: string, phase: 'transcription' | 'generation' | 'tts') => Promise<void>;
  clearChat: () => Promise<void>;
  scrollToBottom: () => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export function useChat(): UseChatReturn {
  const [sessionId, setSessionId] = useState<string>('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Initialize session ID on mount
  useEffect(() => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  }, []);

  const currentTurn = turns.length > 0 ? turns[turns.length - 1] : null;

  const submitAudio = useCallback(
    async (audioBlob: Blob) => {
      if (!sessionId) return;

      setIsLoading(true);
      setError(null);

      const turnId = uuidv4();
      const newTurn: Turn = {
        id: turnId,
        userAudio: audioBlob,
        userText: '',
        assistantText: '',
        assistantAudio: null,
        status: 'transcribing',
        error: null,
        phase: 'transcription',
      };

      setTurns((prev) => [...prev, newTurn]);
      scrollToBottom();

      console.log(`[v0] Submitted audio for session ${sessionId}, turn ${turnId}`);

      try {
        // Phase 1: Transcribe
        let userText = '';
        try {
          const transcribeResult = await transcribeAudio(sessionId, audioBlob);
          userText = transcribeResult.transcription;
          console.log(`[v0] Transcribed text for turn ${turnId}: ${userText}`);
          setTurns((prev) =>
            prev.map((turn) =>
              turn.id === turnId
                ? {
                    ...turn,
                    userText,
                    status: 'generating',
                    phase: 'generation',
                  }
                : turn
            )
          );
        } catch (err) {
          const errorMsg =
            err instanceof Error ? err.message : 'Transcription failed';
          setTurns((prev) =>
            prev.map((turn) =>
              turn.id === turnId
                ? {
                    ...turn,
                    status: 'error',
                    error: errorMsg,
                    phase: 'transcription',
                  }
                : turn
            )
          );
          setError(errorMsg);
          setIsLoading(false);
          return;
        }

        // Phase 2: Generate Response
        let assistantText = '';
        try {
          const generateResult = await generateResponse(sessionId);
          assistantText = generateResult.response;
          console.log(`[v0] Generated response for turn ${turnId}: ${assistantText}`);
          setTurns((prev) =>
            prev.map((turn) =>
              turn.id === turnId
                ? {
                    ...turn,
                    assistantText,
                    status: 'synthesizing',
                    phase: 'tts',
                  }
                : turn
            )
          );
        } catch (err) {
          const errorMsg =
            err instanceof Error ? err.message : 'Generation failed';
          setTurns((prev) =>
            prev.map((turn) =>
              turn.id === turnId
                ? {
                    ...turn,
                    status: 'error',
                    error: errorMsg,
                    phase: 'generation',
                  }
                : turn
            )
          );
          setError(errorMsg);
          setIsLoading(false);
          return;
        }

        // Phase 3: Synthesize Audio
        try {
          const audioBlob = await synthesizeAudio(sessionId);
          console.log(`[v0] Synthesized audio for turn ${turnId}`);

          setTurns((prev) =>
            prev.map((turn) =>
              turn.id === turnId
                ? {
                    ...turn,
                    assistantAudio: audioBlob,
                    status: 'complete',
                    error: null,
                    phase: 'tts',
                  }
                : turn
            )
          );

          // Auto-play audio
          const audio = new Audio(URL.createObjectURL(audioBlob));
          audio.play().catch((err) => {
            console.error('[v0] Failed to auto-play audio:', err);
          });
        } catch (err) {
          const errorMsg =
            err instanceof Error ? err.message : 'Audio synthesis failed';
          setTurns((prev) =>
            prev.map((turn) =>
              turn.id === turnId
                ? {
                    ...turn,
                    status: 'error',
                    error: errorMsg,
                    phase: 'tts',
                  }
                : turn
            )
          );
          setError(errorMsg);
        }
      } finally {
        setIsLoading(false);
        scrollToBottom();
      }
    },
    [sessionId, scrollToBottom]
  );

  const retryPhase = useCallback(
    async (turnId: string, phase: 'transcription' | 'generation' | 'tts') => {
      if (!sessionId) return;

      setIsLoading(true);
      setError(null);

      const turn = turns.find((t) => t.id === turnId);
      if (!turn) return;

      try {
        console.log(`[v0] Retrying phase "${phase}" for turn ${turnId}`);
        if (phase === 'transcription' && turn.userAudio) {
          const transcribeResult = await transcribeAudio(
            sessionId,
            turn.userAudio
          );
          setTurns((prev) =>
            prev.map((t) =>
              t.id === turnId
                ? {
                    ...t,
                    userText: transcribeResult.transcription,
                    status: 'generating',
                    phase: 'generation',
                    error: null,
                  }
                : t
            )
          );
        } else if (phase === 'generation') {
          const generateResult = await generateResponse(sessionId);
          setTurns((prev) =>
            prev.map((t) =>
              t.id === turnId
                ? {
                    ...t,
                    assistantText: generateResult.response,
                    status: 'synthesizing',
                    phase: 'tts',
                    error: null,
                  }
                : t
            )
          );
        } else if (phase === 'tts') {
          const audioBlob = await synthesizeAudio(sessionId);
          setTurns((prev) =>
            prev.map((t) =>
              t.id === turnId
                ? {
                    ...t,
                    assistantAudio: audioBlob,
                    status: 'complete',
                    error: null,
                  }
                : t
            )
          );

          // Auto-play audio
          const audio = new Audio(URL.createObjectURL(audioBlob));
          audio.play().catch((err) => {
            console.error('[v0] Failed to auto-play audio:', err);
          });
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Retry failed';
        setTurns((prev) =>
          prev.map((t) =>
            t.id === turnId
              ? {
                  ...t,
                  status: 'error',
                  error: errorMsg,
                  phase,
                }
              : t
          )
        );
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, turns]
  );

  const clearChat = useCallback(async () => {
    if (!sessionId) return;

    try {
      await clearSession(sessionId);
      setTurns([]);
      setError(null);
      // Generate new session ID
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      console.log(`[v0] Cleared chat and started new session ${newSessionId}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Clear failed';
      setError(errorMsg);
    }
  }, [sessionId]);

  return {
    sessionId,
    turns,
    currentTurn,
    isLoading,
    error,
    submitAudio,
    retryPhase,
    clearChat,
    scrollToBottom,
    scrollContainerRef,
  };
}
