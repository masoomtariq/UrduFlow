'use client';

import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onClearChat: () => void;
  isLoading: boolean;
}

export function Header({ onClearChat, isLoading }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle shadow-sm backdrop-blur-sm bg-transparent absolute top-0 w-full ">
      <div className="flex justify-between items-center w-full px-4 md:px-8 py-4">
        {/* Logo */}
        <div className="flex items-center gap-1">
            <span className="font-hanken text-2xl font-bold text-deep-indigo flex items-center">
              UrduFl
              <Image
                src="/images/header_logo.png"
                alt="UrduFlow Logo"
                width={24}
                height={24}
                className="h-6 w-6 mx-px object-contain"
              />
              w
            </span>
          </div>

        {/* Clear Chat Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearChat}
          disabled={isLoading}
          className="text-on-surface-variant hover:text-teal-accent"
        >
          <Trash2 size={18} />
          <span className="hidden sm:inline ml-2">Clear Chat</span>
        </Button>
      </div>
    </header>
  );
}
