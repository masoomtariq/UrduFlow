'use client';

import { Header } from '@/components/chat/Header';
import { ConversationArea } from '@/components/chat/ConversationArea';
import { VoiceInput } from '@/components/chat/VoiceInput';
import { useChat } from '@/hooks/useChat';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function ChatPage() {
  const {
    sessionId,
    turns,
    isLoading,
    error,
    submitAudio,
    retryPhase,
    clearChat,
    scrollContainerRef,
  } = useChat();

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="flex flex-col h-screen bg-surface-white">
      {/* Header */}
      <Header onClearChat={clearChat} isLoading={isLoading} />

      {/* Conversation Area */}
      <ConversationArea
        turns={turns}
        onRetry={retryPhase}
        isLoading={isLoading}
        scrollContainerRef={scrollContainerRef}
      />

      {/* Voice Input */}
      <div className="border-border-subtle absolute w-full bottom-0">
        <VoiceInput onSubmit={submitAudio} isLoading={isLoading} />
      </div>
    </div>
  );
}
