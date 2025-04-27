import axios from "axios"

// Replace with actual ElevenLabs API key, preferably from environment variables
const API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY || 'your-elevenlabs-api-key'
const ENABLE_TEXT_TO_SPEECH = process.env.NEXT_PUBLIC_ENABLE_TEXT_TO_SPEECH === 'true'

// Audio player instance to manage playback
let audioPlayer: HTMLAudioElement | null = null

// Function to get text-to-speech audio from ElevenLabs
export const generateSpeech = async (text: string, voiceId: string = 'EXAVITQu4vr4xnSDxMaL'): Promise<Blob> => {
  // If text-to-speech is disabled, return empty blob
  if (!ENABLE_TEXT_TO_SPEECH) {
    return new Blob([], { type: 'audio/mpeg' })
  }

  try {
    // Define voice settings
    const options = {
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      data: {
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      },
      responseType: 'blob' as const
    }

    const response = await axios(options)
    return response.data
  } catch (error: any) {
    console.error('ElevenLabs API error:', error.response?.data || error.message)
    throw new Error('Failed to generate speech')
  }
}

// Function to play generated audio
export const playAudio = async (audioBlob: Blob): Promise<void> => {
  if (!ENABLE_TEXT_TO_SPEECH) return

  try {
    // Create a URL for the audio blob
    const audioUrl = URL.createObjectURL(audioBlob)
    
    // Create a new audio element if one doesn't exist or stop current playback
    if (audioPlayer) {
      audioPlayer.pause()
      audioPlayer.src = ''
    } else {
      audioPlayer = new Audio()
    }
    
    // Set the source and play
    audioPlayer.src = audioUrl
    audioPlayer.play()
    
    // Clean up the URL when done
    audioPlayer.onended = () => {
      URL.revokeObjectURL(audioUrl)
    }
  } catch (error) {
    console.error('Error playing audio:', error)
  }
}

// Helper function to stop audio playback
export const stopAudio = (): void => {
  if (!ENABLE_TEXT_TO_SPEECH || !audioPlayer) return

  audioPlayer.pause()
  audioPlayer.src = ''
}

// Define voice mapping for different speakers
export const getVoiceForSpeaker = (speaker: 'character' | 'monster' | 'narrator', context?: string): string => {
  // Default voices
  const voices = {
    'character': 'EXAVITQu4vr4xnSDxMaL', // Default male voice
    'monster': '29vD33N1CtxCmqQRPOHJ', // More dramatic voice
    'narrator': 'MF3mGyEYCl7XYWbV9V6O' // Narrator voice
  }
  
  // Return voice ID based on speaker type
  return voices[speaker]
}

// Helper to check if text-to-speech is enabled
export const isTextToSpeechEnabled = (): boolean => {
  return ENABLE_TEXT_TO_SPEECH
} 