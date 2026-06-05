<<<<<<< HEAD
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

---

**UrduFlow**: Where Urdu Meets Intelligent Voice
=======
# 🤖 Urdu Voice Chatbot

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.54.0+-red.svg)](https://streamlit.io/)
[![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-green.svg)](https://groq.com/)
[![LangChain](https://img.shields.io/badge/LangChain-Enabled-yellow.svg)](https://langchain.com/)

🚀 **[Try the Live App](https://masoomtariq-urdu-bot.hf.space/)** 🚀

An intelligent voice-based conversational AI chatbot designed specifically for **Urdu language** speakers. This bot allows users to interact naturally through voice in Urdu, leveraging cutting-edge AI models and speech processing technologies.

## 🌟 Features

- 🎤 **Voice Input** - Speak naturally in Urdu and get instant text transcription
- 🤖 **AI-Powered Responses** - Uses Groq's Llama 3.3 70B model for intelligent, context-aware conversations
- 🔊 **Voice Output** - Responses are automatically converted to natural Urdu speech using Piper
- 💬 **Chat History** - Maintains complete conversation context with smart display
- 🎯 **Urdu-First Design** - Fully optimized for Urdu language processing
- ⚡ **Lightning Fast** - Powered by Groq's LPU technology for ultra-fast responses
- 📊 **LangSmith Integration** - Full observability and tracing for monitoring
- 🛡️ **Robust Error Handling** - Comprehensive error management for production use

## 🎥 Demo

Interact with the chatbot by:
1. Speaking in Urdu
2. Getting instant AI responses
3. Listening to natural voice output
4. Viewing complete conversation history

## 🏗️ Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Web Framework** | Streamlit | Interactive web UI |
| **LLM Provider** | Groq | Fast AI inference |
| **AI Model** | Llama 3.3 70B Versatile | Natural language understanding |
| **LLM Integration** | LangChain | Message handling & history |
| **Speech-to-Text** | Groq Whisper (whisper-large-v3-turbo) | Urdu voice → text conversion via Groq Cloud |
| **Text-to-Speech** | Piper | Urdu text → voice synthesis with a fine-tuned model |
| **Observability** | LangSmith | Request tracing & monitoring |
| **Environment** | python-dotenv | Secure API key management |

## 🎯 Architecture

```
User Voice (Urdu) 
      ↓
[Groq Speech-to-Text (whisper-large-v3-turbo)]
      ↓
Urdu Text Input
      ↓
[LangChain + Groq Llama 3.3 70B]
      ↓
Urdu Text Response
      ↓
[Piper Fine-Tuned Urdu Voice Model]
      ↓
Voice Output (Urdu)
```

## 📋 Prerequisites

- Python 3.8 or higher
- Microphone access for voice input
- Internet connection
- Groq API key (free tier available)
- LangSmith API key (optional, for monitoring)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/masoomtariq/Urdu_Bot.git
cd Urdu_Bot
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Setup Notes for Local Run

For a local Linux run, you need the Piper binary and both Urdu model files in the project root:

- `piper/piper`
- `ur_PK-fasih-medium-model.onnx`
- `ur_PK-fasih-medium-model.onnx.json`

One-time Linux setup:

```bash
mkdir -p piper
curl -L "https://github.com/rhasspy/piper/releases/latest/download/piper_linux_x86_64.tar.gz" -o /tmp/piper_linux_x86_64.tar.gz
tar -xzf /tmp/piper_linux_x86_64.tar.gz -C piper --strip-components=1
chmod +x piper/piper
rm -f /tmp/piper_linux_x86_64.tar.gz
curl -L "https://huggingface.co/IhorShevchuk/piper-voice-ur-fasih/resolve/main/ur_PK-fasih-medium-model.onnx" -o ur_PK-fasih-medium-model.onnx
curl -L "https://huggingface.co/IhorShevchuk/piper-voice-ur-fasih/resolve/main/ur_PK-fasih-medium-model.onnx.json" -o ur_PK-fasih-medium-model.onnx.json
```

Windows note: the Dockerfile uses the Linux Piper build, so native Windows users should use WSL/Linux or a Windows-compatible Piper release instead of the commands above.

### 5. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
# Required
GROQ_API_KEY=your_groq_api_key_here

# Optional (for monitoring)
LANGSMITH_API_KEY=your_langsmith_api_key_here
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
```

**Get Your API Keys:**
- **Groq API**: Sign up at [console.groq.com](https://console.groq.com/)
- **LangSmith**: Sign up at [smith.langchain.com](https://smith.langchain.com/)

## 💻 Usage

### Run the Application

```bash
streamlit run main.py
```

The app will open in your browser at `http://localhost:8501`

### How to Use

1. **Grant Microphone Permission** - Allow browser to access your microphone
2. **Click "پوچھیے" (Ask)** - Start recording your question in Urdu
3. **Speak Your Question** - Talk naturally in Urdu
4. **Wait for Processing** - The bot will:
   - Transcribe your voice to text
   - Generate an intelligent response
      - Convert response to voice using Piper
5. **Listen & Read** - View and hear the complete conversation
6. **Continue Chatting** - Ask follow-up questions with full context

### Clear Chat History

Click the **"🗑️ بات چیت صاف کریں"** button in the sidebar to start a new conversation.

## 📁 Project Structure

```
Urdu_Bot/
│
├── main.py                 # Main application file
│   ├── main()              # UI orchestration & workflow
│   ├── initialize_state()   # Session state management
│   ├── get_text()           # Speech recognition (Urdu)
│   ├── generate_response()  # AI response generation
│   ├── play_audio()         # Piper-based text-to-speech synthesis
│   ├── normalize_tts_text()  # Clean text before speech synthesis
│   └── display_previous_chats() # Chat history display
│
├── requirements.txt        # Python dependencies
├── .env                   # Environment variables (create this)
├── README.md              # Project documentation
└── LICENSE                # MIT License

```

## 🔧 How It Works

- Voice input is transcribed with Groq Whisper (`whisper-large-v3-turbo`)
- Responses are generated with Groq Llama 3.3 70B and stored in chat history
- Text-to-speech uses Piper with the Urdu voice model files listed above
- The current conversation stays in session and previous messages remain visible

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Ideas for Contribution
- Add support for other Pakistani languages (Pashto, Sindhi, Punjabi)
- Implement voice selection (male/female)
- Add conversation export feature
- Improve UI/UX design
- Add unit tests

## 🙏 Acknowledgments

- **Groq** - For providing ultra-fast LPU inference
- **Meta** - For the Llama 3.3 70B model
- **LangChain** - For excellent LLM integration framework
- **Groq** - For Speech-to-Text (Whisper) and model hosting
- **Piper** - For high-quality Urdu text-to-speech synthesis
- **Streamlit** - For the amazing web framework

## 👨‍💻 Author

**Masoom Tariq**
- GitHub: [@masoomtariq](https://github.com/masoomtariq)
- Email: mmasoomtariq@gmail.com
- LinkedIn: [Connect with me](https://www.linkedin.com/in/masoom-tariq-b0aa89291/))

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Open an [Issue](https://github.com/masoomtariq/Urdu_Bot/issues)
3. Review existing issues for solutions

---

⭐ **If you find this project useful, please consider giving it a star!** ⭐

---

**Built with ❤️ for the Urdu-speaking community**
>>>>>>> 4d31d42bbe55e3d75d46781e4a88fc2572b60c1e
