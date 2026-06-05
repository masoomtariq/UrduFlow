const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface TranscribeResponse {
  session_id: string;
  transcription: string;
}

export interface GenerateResponse {
  session_id: string;
  response: string;
}

export interface TTSResponse {
  session_id: string;
  audio_blob: Blob;
}

export interface HealthResponse {
  status: string;
}

export async function transcribeAudio(
  sessionId: string,
  audioFile: Blob
): Promise<TranscribeResponse> {
  const formData = new FormData();
  formData.append('audio', audioFile, 'audio.wav');

  const response = await fetch(
    `${API_BASE_URL}/transcribe?session_id=${encodeURIComponent(sessionId)}`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Transcription failed: ${response.statusText}`);
  }

  return response.json();
}

export async function generateResponse(
  sessionId: string
): Promise<GenerateResponse> {
  const response = await fetch(
    `${API_BASE_URL}/generate?session_id=${encodeURIComponent(sessionId)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Generation failed: ${response.statusText}`);
  }

  return response.json();
}

export async function synthesizeAudio(
  sessionId: string
): Promise<Blob> {
  const response = await fetch(
    `${API_BASE_URL}/tts?session_id=${encodeURIComponent(sessionId)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Audio synthesis failed: ${response.statusText}`);
  }

  return response.blob();
}

export async function clearSession(sessionId: string): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/clear_session?session_id=${encodeURIComponent(sessionId)}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    throw new Error(`Clear session failed: ${response.statusText}`);
  }
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`);
  }

  return response.json();
}
