# Text-to-Speech Integration for Edventure

This document provides instructions on setting up and using the text-to-speech functionality in the Edventure educational platform.

## Overview

Edventure now includes text-to-speech capabilities powered by ElevenLabs, which provides high-quality, natural-sounding voices. This feature is implemented in the story mode dialogs, allowing characters to speak their lines.

## Setup

1. **Get an ElevenLabs API Key**
   - Sign up at [ElevenLabs](https://elevenlabs.io/)
   - Generate an API key from your account settings

2. **Configure Environment Variables**
   - Create or modify `.env.local` file in the project root:
   ```
   NEXT_PUBLIC_ELEVENLABS_API_KEY=your-elevenlabs-api-key
   NEXT_PUBLIC_ENABLE_TEXT_TO_SPEECH=true
   ```
   - Replace `your-elevenlabs-api-key` with your actual API key
   - Set `NEXT_PUBLIC_ENABLE_TEXT_TO_SPEECH` to `true` to enable the feature or `false` to disable it

3. **Install Dependencies**
   - The functionality uses axios which should already be installed, but make sure it's available:
   ```bash
   npm install axios
   ```

## Features

- **Automatic Text-to-Speech**: When a dialog appears, the text will be automatically read aloud
- **Toggle Audio**: Users can turn audio on/off using the speaker icon next to the character name
- **Synchronized Playback**: Audio playback is synchronized with text display
- **Voice Variation**: Different character types (monsters, guides, narrators) have different voices

## Voice Configuration

The default voice configuration can be modified in `lib/elevenLabsAPI.ts`:

```typescript
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
```

You can replace the voice IDs with other voices from ElevenLabs' voice library.

## Implementation Details

The text-to-speech functionality is implemented in:

1. `lib/elevenLabsAPI.ts` - Core API functionality
2. `components/story-mode/sql-game/DialogBox.tsx` - Integration with the dialog system

## Troubleshooting

- **No Audio Playing**: Ensure your browser allows audio playback and that your API key is valid
- **API Errors**: Check browser console for error messages related to the ElevenLabs API
- **Performance Issues**: If audio generation is slow, consider pre-generating audio for common phrases

## Future Enhancements

Potential improvements:
- Audio caching to reduce API calls and improve performance
- More voice variations based on context
- Voice customization options for users
- Support for additional languages

## Credits

- ElevenLabs for providing the text-to-speech API
- Edventure development team for integration 