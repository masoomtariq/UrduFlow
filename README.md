# UrduFlow - Intelligent Urdu Voice Chat Frontend

A modern React-based voice chat interface for the UrduFlow Urdu language assistant. This frontend integrates with a FastAPI backend to provide real-time voice transcription, text generation, and audio synthesis in Urdu.

## Features

- **Voice Recording**: Record Urdu speech with automatic 60-second limit and real-time waveform visualization
- **Three-Phase Workflow**: Transcription → Generation → Audio Synthesis with independent retry buttons for each phase
- **Beautiful UI**: Modern design with teal and deep indigo color scheme, responsive across all devices
- **RTL Text Support**: Proper right-to-left rendering for Urdu text using Noto Nastaliq Urdu font
- **Session Management**: Unique session IDs for each conversation thread
- **Error Handling**: Graceful error states with actionable retry options
- **Real-time Feedback**: Toast notifications and loading states throughout the workflow

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4 with custom UrduFlow color system
- **Audio**: Web Audio API for recording, visualization, and playback
- **HTTP Client**: Fetch API with built-in error handling
- **Icons**: Lucide React
- **Notifications**: Sonner Toast Library
- **UUID Generation**: uuid library

## Project Structure

```
/app
  page.tsx                          # Landing page
  /chat
    page.tsx                        # Chat interface
  globals.css                       # Design tokens and typography
  layout.tsx                        # Root layout

/components
  /chat
    Header.tsx                      # Chat header with clear button
    VoiceInput.tsx                  # Recording controls and submission
    AudioVisualizer.tsx             # Frequency bar animation
    ConversationArea.tsx            # Scrollable message container
    UserTurnCard.tsx                # User message display with audio
    AssistantTurnCard.tsx           # Assistant response with text and audio

/hooks
  useChat.ts                        # Main chat state and workflow orchestration
  useRecorder.ts                    # Audio recording with MediaRecorder API
  useAudioVisualizer.ts             # Web Audio API frequency analysis

/lib
  /api
    urdu-flow.ts                    # API client for FastAPI backend

/public
  /images
    Hero_Logo.png                   # Main hero image
    header_logo.png                 # Header icon
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- FastAPI backend running on `http://localhost:8000`
- Microphone permissions enabled in browser

### Installation

1. **Clone and install dependencies**:
   ```bash
   pnpm install
   ```

2. **Configure API endpoint** (optional):
   - By default, the app connects to `http://localhost:8000`
   - To use a different endpoint, create a `.env.local` file:
     ```
     NEXT_PUBLIC_API_BASE_URL=https://your-api-endpoint.com
     ```

3. **Start the development server**:
   ```bash
   pnpm dev
   ```

4. **Open in browser**:
   - Landing page: `http://localhost:3000`
   - Chat interface: `http://localhost:3000/chat`

## API Integration

The frontend communicates with your FastAPI backend via four main endpoints:

### 1. Transcribe Audio
```
POST /transcribe?session_id={sessionId}
Content-Type: multipart/form-data

file: Blob (audio/wav)

Response: { session_id: string, transcribed_text: string }
```

### 2. Generate Response
```
POST /generate?session_id={sessionId}
Content-Type: application/json

Response: { session_id: string, generated_text: string }
```

### 3. Text-to-Speech
```
POST /tts?session_id={sessionId}
Content-Type: application/json

Response: Blob (audio/wav)
```

### 4. Clear Session
```
DELETE /clear_session?session_id={sessionId}

Response: {} (success) or error
```

### 5. Health Check (Optional)
```
GET /health

Response: { status: string }
```

## How It Works

### Recording Flow

1. **User clicks "Start Recording"**
   - Requests microphone permission
   - Starts MediaRecorder with audio/wav codec
   - Visualizer displays real-time frequency bars
   - Recording auto-stops at 60 seconds

2. **User submits audio**
   - Audio blob is sent to `/transcribe` endpoint
   - Spinner shows "Transcribing..."
   - On success: displays transcribed Urdu text in accordion
   - On error: shows error message with "Retry Transcription" button

3. **Response generation (automatic)**
   - Frontend calls `/generate` with same session ID
   - Spinner shows "Generating response..."
   - On success: displays assistant's Urdu text in accordion
   - On error: shows error with "Retry Generation" button

4. **Audio synthesis (automatic)**
   - Frontend calls `/tts` with same session ID
   - Skeleton loader displays
   - On success: audio player appears with auto-play enabled
   - On error: shows error with "Retry Audio" button

### Accordion Text Display

Both user and assistant messages use collapsible accordions (closed by default):
- Click to expand and read the full Urdu text
- Supports RTL rendering and Noto Nastaliq Urdu font
- Clean, minimalist design

### Session Management

- New UUID generated on component mount (React state only)
- Session persists during browser session
- "Clear Chat" resets conversation and generates new session ID
- No localStorage or persistent storage (ephemeral per session)

## Design System

### Colors
- **Primary**: Deep Indigo (#1E1B4B) - Headers, assistant cards
- **Accent**: Teal (#14B8A6) - Buttons, user cards, interactive elements
- **Background**: Surface White (#F8FAFC)
- **Text**: On-Surface (#191C1E)

### Typography
- **Headlines**: Hanken Grotesk (700-800 weight)
- **Body/UI**: Plus Jakarta Sans (400-600 weight)
- **Urdu Text**: Noto Nastaliq Urdu (serif)

### Spacing & Sizing
- Uses Tailwind spacing scale (4px base unit)
- Touch-friendly buttons (min 44x44px)
- Responsive padding: 4px (mobile) → 32px (desktop)

## Development

### Debugging

- Development mode shows session ID at bottom of chat page
- Use browser DevTools > Network to inspect API calls
- Console shows detailed error messages with `[v0]` prefix

### Customization

1. **Colors**: Edit `app/globals.css` CSS custom properties
2. **Fonts**: Modify font imports in `globals.css` and classes in components
3. **API Endpoint**: Set `NEXT_PUBLIC_API_BASE_URL` environment variable
4. **Recording Limit**: Change `maxDuration` in `app/chat/page.tsx` (in milliseconds)

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14.1+

Requires:
- MediaRecorder API support
- Web Audio API support
- Fetch API support

## Troubleshooting

### Microphone not detected
- Check browser permissions for microphone access
- Ensure HTTPS in production (required for MediaDevices API)
- Try refreshing the page

### API connection errors
- Verify FastAPI backend is running
- Check `NEXT_PUBLIC_API_BASE_URL` configuration
- Inspect browser console for CORS errors

### Audio not playing
- Check browser autoplay policies
- Verify audio/wav format from TTS endpoint
- Check browser DevTools > Audio debugging

### Urdu text not rendering correctly
- Ensure Noto Nastaliq Urdu font is loaded (check Network tab)
- Verify RTL attributes are present in DOM
- Check browser language settings

## Performance Tips

1. **Lazy Load Audio**: Audio players load on demand when expanded
2. **Optimized Images**: Hero images use Next.js Image component
3. **Minimal Dependencies**: Only essential packages included
4. **Efficient State**: useChat hook batches state updates

## Security Considerations

- **No Auth**: This frontend assumes backend handles authentication
- **Session Isolation**: Each session has unique UUID
- **CORS**: Configure backend CORS headers for production
- **Input Validation**: Audio blob validation on upload
- **No localStorage**: Session data never persisted to disk

## License

MIT - Feel free to use and modify for your projects.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Inspect browser console for error messages
3. Verify FastAPI backend is running and accessible
4. Check network requests in DevTools
