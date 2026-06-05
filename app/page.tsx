'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, PlayCircle, Check, Mic, Menu } from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface-white text-on-surface font-plus-jakarta antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface/70 backdrop-blur-xl border-b border-border-subtle shadow-sm">
        <div className="flex justify-between items-center w-full px-4 md:px-16 py-4 max-w-6xl mx-auto">
          {/* Brand Logo */}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-on-surface-variant font-label-md hover:text-teal-accent transition-colors">
              Features
            </a>
            <a href="#technology" className="text-on-surface-variant font-label-md hover:text-teal-accent transition-colors">
              Technology
            </a>
            <a href="#history" className="text-on-surface-variant font-label-md hover:text-teal-accent transition-colors">
              History
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center justify-center bg-transparent border-2 border-teal-accent text-teal-accent hover:bg-teal-accent/10 px-6 py-2 rounded-full font-label-md transition-all duration-300 hover:scale-105">
              Sign In
            </button>
            <Link
              href="/chat"
              className="flex items-center justify-center bg-gradient-to-r from-deep-indigo to-teal-accent text-white px-6 py-2 rounded-full font-label-md shadow-lg transition-all duration-300 hover:scale-105"
            >
              Try it
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-deep-indigo p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border-subtle bg-surface p-4">
            <nav className="flex flex-col gap-4">
              <a href="#features" className="text-on-surface-variant font-label-md hover:text-teal-accent transition-colors">
                Features
              </a>
              <a href="#technology" className="text-on-surface-variant font-label-md hover:text-teal-accent transition-colors">
                Technology
              </a>
              <a href="#history" className="text-on-surface-variant font-label-md hover:text-teal-accent transition-colors">
                History
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center w-full px-4 md:px-16 py-12 md:py-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-8 z-10">
            {/* Hero Text */}
            <div className="space-y-4">
              <h1 className="font-hanken text-4xl md:text-6xl font-bold text-deep-indigo leading-tight">
                Where Urdu Meets Intelligent Voice{' '}
                <span className="bg-gradient-to-r from-deep-indigo to-teal-accent bg-clip-text text-transparent">
                  for Natural, Brilliant Conversations
                </span>
              </h1>
              <p className="text-lg text-on-surface-variant max-w-xl">
                Your intelligent voice assistant powered by AI.
              </p>
            </div>

            {/* Feature List */}
            <ul className="space-y-4 text-on-surface-variant max-w-lg">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-accent flex-shrink-0 mt-1" />
                <span>Speak naturally in Urdu and get instant AI responses in real time.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-accent flex-shrink-0 mt-1" />
                <span>Listen to smooth, human-like Urdu voice output.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-accent flex-shrink-0 mt-1" />
                <span>Keep every conversation saved in a complete chat history.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-accent flex-shrink-0 mt-1" />
                <span>Switch between speaking, reading, and listening with a simple, intuitive interface.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-teal-accent flex-shrink-0 mt-1" />
                <span>Enjoy a natural Urdu chat experience designed for speed, clarity, and ease.</span>
              </li>
            </ul>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link
                href="/chat"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-deep-indigo to-teal-accent text-white px-8 py-4 rounded-full font-label-md shadow-lg transition-all duration-300 hover:scale-105"
              >
                Try it
                <ArrowRight size={20} />
              </Link>
              <a
                href="#"
                className="text-teal-accent font-label-md hover:underline underline-offset-4 transition-all duration-300 flex items-center gap-2"
              >
                <PlayCircle size={20} />
                See how it works
              </a>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative w-full aspect-video group">
            {/* Decorative background */}
            <div className="absolute -inset-4 bg-teal-accent/5 rounded-full blur-3xl opacity-50 transition-opacity duration-500 group-hover:opacity-70 z-0" />

            {/* Main Image Container */}
            <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-lg transition-transform duration-500 transform group-hover:-translate-y-2 group-hover:scale-[1.02] bg-white z-10 flex items-center justify-center border border-border-subtle">
              <Image
                src="/images/Hero_Logo.png"
                alt="UrduFlow Hero Interface"
                fill
                className="object-cover"
              />
            </div>

            {/* Floating Element */}
            <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md border border-border-subtle shadow-lg rounded-xl p-4 flex items-center gap-3 z-20 animate-bounce">
              <div className="w-10 h-10 rounded-full bg-teal-accent/10 flex items-center justify-center">
                <Mic className="w-5 h-5 text-teal-accent" />
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Listening</span>
                <div className="flex gap-1 mt-1 items-center h-4">
                  <div className="w-1 bg-deep-indigo rounded-full animate-pulse" style={{ height: '60%' }} />
                  <div className="w-1 bg-teal-accent rounded-full animate-pulse" style={{ height: '100%', animationDelay: '0.2s' }} />
                  <div className="w-1 bg-deep-indigo rounded-full animate-pulse" style={{ height: '40%', animationDelay: '0.1s' }} />
                  <div className="w-1 bg-teal-accent rounded-full animate-pulse" style={{ height: '80%', animationDelay: '0.3s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-white border-t border-border-subtle w-full mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full px-4 md:px-16 py-8 max-w-6xl mx-auto font-plus-jakarta text-on-surface">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-hanken text-2xl font-black text-deep-indigo mb-2">UrduFlow</span>
            <p className="text-on-surface-variant/80 text-sm">© 2024 UrduFlow AI. Harmonizing Heritage and Intelligence.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-on-surface-variant/80">
            <a href="#privacy" className="hover:text-teal-accent underline-offset-4 transition-colors hover:underline">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-teal-accent underline-offset-4 transition-colors hover:underline">
              Terms of Service
            </a>
            <a href="#support" className="hover:text-teal-accent underline-offset-4 transition-colors hover:underline">
              Contact Support
            </a>
            <a href="#api" className="hover:text-teal-accent underline-offset-4 transition-colors hover:underline">
              API Documentation
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
