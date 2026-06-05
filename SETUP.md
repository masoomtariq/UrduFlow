# UrduFlow Frontend - Setup & Configuration Guide

## Quick Start

### 1. Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at:
- Landing: `http://localhost:3000`
- Chat: `http://localhost:3000/chat`

### 2. Configure Backend Connection

By default, the frontend connects to `http://localhost:8000`.

To connect to a different FastAPI backend:

```bash
# Create .env.local file
echo 'NEXT_PUBLIC_API_BASE_URL=https://your-backend.com' > .env.local

# Restart dev server
pnpm dev
```

## Project Setup Details

### Directory Structure

```
app/
├── page.tsx                 # Landing page (public)
├── layout.tsx              # Root layout with metadata
├── globals.css             # Design tokens & typography
└── chat/
    └── page.tsx            # Chat interface (main app)

components/
└── chat/
    ├── Header.tsx          # Sticky header with logo
    ├── ConversationArea.tsx # Message container
    ├── UserTurnCard.tsx    # User message display
    ├── AssistantTurnCard.tsx # Assistant response
    ├── VoiceInput.tsx      # Recording controls
    └── AudioVisualizer.tsx # Frequency bars

hooks/
├── useChat.ts              # Main state management
├── useRecorder.ts          # MediaRecorder wrapper
└── useAudioVisualizer.ts   # Web Audio API integration

lib/
└── api/
    └── urdu-flow.ts        # API client

public/
└── images/
    ├── Hero_Logo.png       # Main logo image
    └── header_logo.png     # Header icon
```

### Design System

#### Colors (defined in `app/globals.css`)
```css
--deep-indigo: rgb(30 27 75)          /* Primary brand color */
--teal-accent: rgb(20 184 166)        /* Interactive elements */
--surface-white: rgb(248 250 252)     /* Background */
--on-surface: rgb(25 28 30)           /* Text */
--surface-variant: rgb(225 232 240)   /* Secondary backgrounds */
--border-subtle: rgba(30 27 75 / 0.08) /* Borders */
```

#### Fonts
- **Headlines**: Hanken Grotesk (via `.font-hanken`)
- **Body/UI**: Plus Jakarta Sans (via `.font-plus-jakarta`)
- **Urdu**: Noto Nastaliq Urdu (via `.font-noto-nastaliq`)

All fonts are imported from Google Fonts in `globals.css`.

### Key Files Explained

#### `app/page.tsx` - Landing Page
- Hero section with value proposition
- Feature list with checkmarks
- Two CTA buttons: "Try it" (Go to chat) and "See how it works"
- Responsive split layout (text + hero image)
- Mobile hamburger menu

#### `app/chat/page.tsx` - Chat Interface
- Orchestrates three main components
- Shows session ID in development mode
- Integrates useChat hook for state management

#### `hooks/useChat.ts` - Core Logic
Manages:
- Session ID generation (UUID v4)
- Turn history with 6 states per message:
  - `idle`: Initial state
  - `transcribing`: Waiting for /transcribe
  - `generating`: Waiting for /generate
  - `synthesizing`: Waiting for /tts
  - `complete`: All phases done
  - `error`: Any phase failed
- Three-phase workflow with independent retries
- Auto-play audio on TTS success

#### `hooks/useRecorder.ts` - Audio Recording
- Requests microphone with `echoCancellation`/`noiseSuppression`
- Tracks recording duration
- Auto-stops at 60 seconds
- Returns audio blob as WAV

#### `hooks/useAudioVisualizer.ts` - Frequency Visualization
- Creates Web Audio AnalyserNode
- Gets frequency data at 10-60 Hz per frequency bin
- Renders animated bars based on frequency amplitude
- Cleans up audio context on unmount

#### `lib/api/urdu-flow.ts` - API Client
Functions:
- `transcribeAudio(sessionId, audioFile)` → transcribed text
- `generateResponse(sessionId)` → generated text
- `synthesizeAudio(sessionId)` → audio blob
- `clearSession(sessionId)` → void
- `checkHealth()` → status

### State Flow

```
User Records Audio
        ↓
submitAudio(audioBlob)
        ↓
transcribeAudio() → userText
        ↓
generateResponse() → assistantText
        ↓
synthesizeAudio() → assistantAudio
        ↓
Audio Auto-plays + Turn Complete
```

**At any phase**, if error occurs:
- State shows error message
- Display independent "Retry X" button
- User can click retry without re-recording

## Development Workflow

### Making Changes

#### Adding a New Component
```bash
# 1. Create component in components/chat/
touch components/chat/MyComponent.tsx

# 2. Import in the appropriate parent:
# For example, if it's related to messages:
# Edit components/chat/ConversationArea.tsx

# 3. Test in browser
```

#### Modifying Colors
Edit `/app/globals.css` in the `:root` CSS custom properties:
```css
:root {
  --deep-indigo: rgb(30 27 75);  /* Change primary color */
  --teal-accent: rgb(20 184 166); /* Change accent color */
  /* ... */
}
```

#### Changing Fonts
1. Add new Google Font import to `app/globals.css`
2. Create CSS class in `@layer base`
3. Use in components: `className="font-my-font"`

#### Updating API Integration
1. Modify endpoint URLs in `lib/api/urdu-flow.ts`
2. Update request/response types
3. Update useChat.ts to match new response formats

### Building for Production

```bash
# Build optimized version
pnpm build

# Test production build locally
pnpm start
```

### Deployment

The app is optimized for Vercel deployment:

```bash
# Deploy to Vercel
vercel

# Or connect GitHub and auto-deploy from main branch
```

#### Environment Variables for Production
In your deployment platform, set:
```
NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com
```

## Troubleshooting

### Issue: "No microphone found"
**Solution**: 
- Check browser permissions (may need to reset)
- Test at `chrome://settings/content/microphone`
- Ensure HTTPS in production (MediaDevices requires it)
- Try different browser

### Issue: "Audio synthesis failed"
**Solutions**:
1. Check backend is running and responding
2. Verify `/tts` endpoint returns `audio/wav` blob
3. Check backend logs for errors
4. Inspect network request in DevTools

### Issue: "Urdu text not displaying correctly"
**Solutions**:
1. Verify Noto Nastaliq Urdu font loaded (DevTools > Network)
2. Check `.rtl-text` class applied to text container
3. Verify `dir="rtl"` attribute in HTML
4. Try different browser

### Issue: "Build errors about missing dependencies"
**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

## Performance Optimization

### Current Optimizations
- Next.js Image component for hero images
- Lazy-loaded audio players
- Minimal re-renders with useChat hook
- Efficient frequency visualization (RAF-based)

### Potential Improvements
1. **Code Splitting**: Lazy load chat component
2. **Image Optimization**: Use WebP with fallbacks
3. **Web Workers**: Offload frequency analysis
4. **Service Worker**: Cache static assets

## Testing

### Manual Testing Checklist

- [ ] **Landing Page**
  - [ ] Desktop view looks correct
  - [ ] Mobile view responsive
  - [ ] "Try it" button links to /chat
  - [ ] Navigation links scroll (if implemented)

- [ ] **Chat Page**
  - [ ] Session ID visible in dev mode
  - [ ] "Clear Chat" button works
  - [ ] Welcomes message displays on load

- [ ] **Recording**
  - [ ] Microphone permission request shows
  - [ ] Recording starts on button click
  - [ ] Visualizer animates during recording
  - [ ] Recording stops at 60 seconds (shows toast)

- [ ] **API Integration** (with running backend)
  - [ ] Audio uploads to /transcribe
  - [ ] Transcribed text appears in accordion
  - [ ] /generate called automatically
  - [ ] Assistant text appears in accordion
  - [ ] /tts called automatically
  - [ ] Audio player appears and auto-plays

- [ ] **Error Handling**
  - [ ] Failed transcription shows error + retry button
  - [ ] Failed generation shows error + retry button
  - [ ] Failed TTS shows error + retry button
  - [ ] Retries work correctly

- [ ] **Accessibility**
  - [ ] Tab navigation works
  - [ ] Buttons are keyboard accessible
  - [ ] Error messages announce to screen readers
  - [ ] Color contrast passes WCAG AA

## API Endpoint Testing

### Using cURL to test endpoints

```bash
# Test health
curl http://localhost:8000/health

# Test with dummy audio file
curl -X POST \
  -F "file=@audio.wav" \
  "http://localhost:8000/transcribe?session_id=test-session"

# Test generate
curl -X POST \
  "http://localhost:8000/generate?session_id=test-session"

# Test TTS
curl -X POST \
  "http://localhost:8000/tts?session_id=test-session" \
  -o output.wav
```

## Next Steps

1. **Connect to Backend**: Update `NEXT_PUBLIC_API_BASE_URL` to your FastAPI instance
2. **Test Recording**: Click "Start Recording" and verify all three phases work
3. **Deploy**: Push to Vercel or your hosting platform
4. **Monitor**: Use browser DevTools to monitor API calls and errors

---

Need help? Check README.md for troubleshooting and feature documentation.
