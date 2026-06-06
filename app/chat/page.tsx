'use client';

import { Header } from '@/components/chat/Header';
import { ConversationArea } from '@/components/chat/ConversationArea';
import { VoiceInput } from '@/components/chat/VoiceInput';
import { useChat } from '@/hooks/useChat';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="relative h-screen w-full overflow-hidden bg-surface-white">
      <div className="absolute top-0 w-full z-20 bg-transparent">
      {/* Header */}
        <Header onClearChat={clearChat} isLoading={isLoading} />
      </div>

      {/* Conversation Area */}
      <div className="h-full w-full pt-24 pb-40 overflow-y-auto">
      <ConversationArea
        turns={turns}
        onRetry={retryPhase}
        isLoading={isLoading}
        scrollContainerRef={scrollContainerRef}
      />
      </div>

      {/* Voice Input */}
      <div className="border-border-subtle absolute w-full bottom-0">
        <VoiceInput onSubmit={submitAudio} isLoading={isLoading} />
      </div>
    </div>
  );
}
