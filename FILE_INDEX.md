# UrduFlow Frontend - File Index

Complete guide to all files created in this project.

## Documentation Files

### README.md
- **Purpose**: Main project documentation
- **Content**: Feature overview, tech stack, setup instructions, API documentation, design system details
- **Audience**: All stakeholders
- **Length**: 272 lines

### SETUP.md
- **Purpose**: Detailed setup and configuration guide
- **Content**: Installation, backend configuration, directory structure, development workflow, deployment
- **Audience**: Developers
- **Length**: 339 lines

### IMPLEMENTATION.md
- **Purpose**: Project completion summary
- **Content**: What was built, technical details, deployment instructions, known limitations
- **Audience**: Project leads, developers
- **Length**: 347 lines

### .env.example
- **Purpose**: Environment variables template
- **Content**: API endpoint configuration, optional settings
- **Audience**: Developers
- **Edit**: Rename to `.env.local` and customize

## Application Files

### Core Pages

#### `app/page.tsx`
- **Type**: Page component
- **Purpose**: Landing page with hero, features, and CTAs
- **Size**: ~200 lines
- **Key Features**:
  - Hero section with gradient text
  - 5-feature checklist
  - Responsive grid layout
  - Mobile hamburger menu
  - Links to `/chat` page

#### `app/chat/page.tsx`
- **Type**: Page component
- **Purpose**: Main chat interface orchestrator
- **Size**: ~55 lines
- **Key Features**:
  - Integrates Header, ConversationArea, VoiceInput
  - Manages error toast notifications
  - Shows session ID in dev mode
  - Flex layout with sticky header

#### `app/layout.tsx`
- **Type**: Root layout
- **Purpose**: Global metadata, fonts, and structure
- **Modified**: Updated metadata to UrduFlow branding
- **Key Features**:
  - Title: "UrduFlow - Intelligent Urdu Voice Chat"
  - Analytics integration (conditionally)
  - Body with font-sans class

#### `app/globals.css`
- **Type**: Global styles
- **Purpose**: Tailwind imports, design tokens, typography classes
- **Size**: 150+ lines
- **Key Additions**:
  - Google Fonts imports (Hanken Grotesk, Plus Jakarta Sans, Noto Nastaliq Urdu)
  - CSS custom properties for UrduFlow colors
  - Utility classes (.font-hanken, .font-plus-jakarta, .font-noto-nastaliq, .rtl-text)
  - Tailwind theme configuration

## Chat Components

### Header

#### `components/chat/Header.tsx`
- **Type**: Presentational component
- **Purpose**: Sticky header with branding and controls
- **Size**: 45 lines
- **Props**:
  - `onClearChat()` - Callback for clear button
  - `isLoading` - Loading state for button
- **Features**:
  - Logo display with image
  - "Clear Chat" button with trash icon
  - Responsive text (hidden on mobile)
  - Glass-morphism backdrop blur

### Conversation Display

#### `components/chat/ConversationArea.tsx`
- **Type**: Container component
- **Purpose**: Scrollable message feed with scroll-to-bottom
- **Size**: 66 lines
- **Props**:
  - `turns` - Array of Turn objects
  - `onRetry()` - Retry callback
  - `isLoading` - Global loading state
  - `scrollContainerRef` - Ref for scrolling
- **Features**:
  - Auto-scrolls on new messages
  - Empty state with welcome message
  - Maps turns to user/assistant cards

#### `components/chat/UserTurnCard.tsx`
- **Type**: Presentational component
- **Purpose**: Display user-recorded message with audio and transcription
- **Size**: 89 lines
- **Props**:
  - `turn` - Turn object with user data
  - `onRetry()` - Transcription retry callback
  - `isLoading` - Loading state
- **Features**:
  - Audio player for recorded file
  - Accordion for transcribed text (closed by default)
  - Error state with retry button
  - Transcribing spinner
  - Teal border accent
  - RTL text support

#### `components/chat/AssistantTurnCard.tsx`
- **Type**: Presentational component
- **Purpose**: Display assistant response with text and synthesized audio
- **Size**: 137 lines
- **Props**:
  - `turn` - Turn object with assistant data
  - `onRetry()` - Generation/TTS retry callback
  - `isLoading` - Loading state
- **Features**:
  - Accordion for response text (closed by default)
  - Audio player for synthesized speech (auto-play)
  - Skeleton loader during synthesis
  - Error states for generation and TTS
  - Independent retry buttons per phase
  - Deep indigo accent border
  - RTL text support

### Input Controls

#### `components/chat/VoiceInput.tsx`
- **Type**: Container component
- **Purpose**: Recording controls with visualization
- **Size**: 126 lines
- **Props**:
  - `onSubmit()` - Audio submission callback
  - `isLoading` - Loading state for submission
- **Hooks Used**:
  - `useRecorder()` - Recording state
  - `useAudioVisualizer()` - Frequency data
- **Features**:
  - Start/Stop recording button
  - Recording duration display (MM:SS)
  - Cancel button during recording
  - Submit button to send audio
  - Toast for 60-second limit warning
  - Submitting state indicator

#### `components/chat/AudioVisualizer.tsx`
- **Type**: Presentational component
- **Purpose**: Real-time frequency bar animation
- **Size**: 31 lines
- **Props**:
  - `frequencyData` - Uint8Array from Web Audio API
  - `isActive` - Recording state
- **Features**:
  - 6 frequency bars
  - Teal gradient coloring
  - Dynamic height scaling (0-100%)
  - Opacity changes based on recording state
  - Smooth transitions (75ms)

## Custom Hooks

### State Management

#### `hooks/useChat.ts`
- **Type**: Custom hook
- **Purpose**: Main chat state and three-phase workflow orchestration
- **Size**: 326 lines
- **Returns**:
  - `sessionId` - UUID for session
  - `turns` - Array of Turn objects
  - `currentTurn` - Last turn or null
  - `isLoading` - Global loading flag
  - `error` - Last error message
  - `submitAudio()` - Async function to process audio
  - `retryPhase()` - Async function to retry a phase
  - `clearChat()` - Async function to reset session
  - `scrollToBottom()` - Scroll helper
  - `scrollContainerRef` - Ref object
- **Features**:
  - UUID generation on mount
  - Three-phase workflow (transcribe → generate → tts)
  - Automatic phase progression
  - Independent retry buttons
  - Auto-play audio on success
  - Toast error notifications
  - Scroll-to-bottom on new messages

### Audio Recording

#### `hooks/useRecorder.ts`
- **Type**: Custom hook
- **Purpose**: MediaRecorder wrapper with state management
- **Size**: 146 lines
- **Returns**:
  - `isRecording` - Boolean recording state
  - `duration` - Elapsed time in milliseconds
  - `audioBlob` - Blob of recorded audio
  - `error` - Error message if any
  - `startRecording()` - Async function to request mic and start
  - `stopRecording()` - Async function to stop and return blob
  - `resetRecorder()` - Function to clear state
  - `mediaRecorder` - Reference to MediaRecorder instance
  - `audioStream` - Reference to MediaStream
- **Features**:
  - Microphone permission handling
  - Audio/wav codec selection
  - Duration tracking every 100ms
  - 60-second auto-stop
  - Echo cancellation and noise suppression
  - Proper cleanup of streams

### Audio Visualization

#### `hooks/useAudioVisualizer.ts`
- **Type**: Custom hook
- **Purpose**: Web Audio API frequency analysis
- **Size**: 92 lines
- **Returns**:
  - `frequencyData` - Uint8Array of byte frequencies
  - `isActive` - Visualization active state
- **Parameters**:
  - `mediaRecorder` - MediaRecorder instance (unused, kept for future)
  - `audioStream` - MediaStream from recorder
  - `isRecording` - Recording state boolean
- **Features**:
  - AudioContext creation and management
  - AnalyserNode setup
  - getByteFrequencyData() calls at RAF rate
  - Proper cleanup on unmount
  - Suspended context resume

## API Client

#### `lib/api/urdu-flow.ts`
- **Type**: API client module
- **Purpose**: Typed API functions for FastAPI backend
- **Size**: 108 lines
- **Exports**:
  - `transcribeAudio(sessionId, audioFile)` - POST /transcribe
  - `generateResponse(sessionId)` - POST /generate
  - `synthesizeAudio(sessionId)` - POST /tts
  - `clearSession(sessionId)` - DELETE /clear_session
  - `checkHealth()` - GET /health
- **Types Exported**:
  - `TranscribeResponse`
  - `GenerateResponse`
  - `TTSResponse`
  - `HealthResponse`
- **Features**:
  - Configurable base URL from env
  - Proper error handling
  - FormData for file uploads
  - JSON parsing for responses
  - Blob handling for audio

## Asset Files

### Images

#### `/public/images/Hero_Logo.png`
- **Purpose**: Main hero illustration
- **Format**: PNG
- **Used In**: Landing page (right side hero image)
- **Size**: 512x512px (recommended)

#### `/public/images/header_logo.png`
- **Purpose**: Circular logo for header
- **Format**: PNG
- **Used In**: Header component (sticky top)
- **Size**: 48x48px (recommended)

## File Statistics

### Total Files Created: 24

**Breakdown by Category**:
- Documentation: 4 files (README.md, SETUP.md, IMPLEMENTATION.md, .env.example)
- Pages: 2 files (app/page.tsx, app/chat/page.tsx)
- Components: 6 files (Header, ConversationArea, UserTurnCard, AssistantTurnCard, VoiceInput, AudioVisualizer)
- Hooks: 3 files (useChat, useRecorder, useAudioVisualizer)
- Styles: 1 file (globals.css - modified)
- API: 1 file (urdu-flow.ts)
- Config: 1 file (.env.example)
- Layout: 1 file (layout.tsx - modified)
- Images: 2 files (Hero_Logo.png, header_logo.png)

### Total Lines of Code: ~2000+
- Components: ~600 lines
- Hooks: ~560 lines
- API Client: ~108 lines
- Documentation: ~1000+ lines

## Dependencies Added

### New Package
- `uuid` - For session ID generation

### Pre-installed (Used)
- `next` - Framework
- `react` - UI library
- `react-dom` - DOM rendering
- `tailwindcss` - Styling
- `lucide-react` - Icons
- `sonner` - Toast notifications

## File Organization Best Practices

✅ **Following**:
- Flat structure for pages (no nested folders unless needed)
- Grouped components in `components/chat/`
- Centralized hooks in `hooks/`
- API in `lib/api/`
- Assets in `public/images/`
- Clear, descriptive filenames
- Consistent naming: camelCase for files and variables, PascalCase for components

## Quick Navigation

| Task | File |
|------|------|
| Change colors | `app/globals.css` - Update CSS custom properties |
| Add new component | Create in `components/chat/` |
| Modify state logic | `hooks/useChat.ts` |
| Change API endpoint | `lib/api/urdu-flow.ts` |
| Update landing page | `app/page.tsx` |
| Update chat layout | `app/chat/page.tsx` |
| Modify fonts | `app/globals.css` or component classes |
| Configure backend | `.env.local` |

## Version Information

- **Next.js**: 16.2.6
- **React**: 19.2.4
- **Tailwind CSS**: 4.2
- **Node.js**: 18+
- **Package Manager**: pnpm

---

For more details, refer to README.md or SETUP.md
