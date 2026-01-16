/**
 * Type extensions for Gemini 3 API features
 * These augment the @google/generative-ai SDK types for preview features
 */

import '@google/generative-ai';

declare module '@google/generative-ai' {
  // Thinking levels for Gemini 3
  type ThinkingLevel = 'minimal' | 'low' | 'medium' | 'high';

  interface ThinkingConfig {
    thinkingLevel: ThinkingLevel;
  }

  // Extended generation config with thinking support
  interface GenerationConfig {
    thinkingConfig?: ThinkingConfig;
    responseModalities?: Array<'text' | 'image' | 'audio'>;
  }

  // Thought signature in response candidates (Gemini 3 feature)
  interface GenerateContentCandidate {
    thoughtSignature?: string;
  }
}

/**
 * Type extensions for @google/genai SDK (TTS)
 */
declare module '@google/genai' {
  interface SpeechConfig {
    voiceConfig: {
      prebuiltVoiceConfig: {
        voiceName: string;
      };
    };
  }

  interface TTSGenerationConfig {
    responseModalities: ['AUDIO'];
    speechConfig: SpeechConfig;
  }

  interface TTSContentPart {
    text: string;
  }

  interface TTSContent {
    parts: TTSContentPart[];
  }

  interface TTSInlineData {
    mimeType: string;
    data: string; // base64 PCM audio
  }

  interface TTSResponsePart {
    inlineData?: TTSInlineData;
    text?: string;
  }

  interface TTSResponseContent {
    parts: TTSResponsePart[];
  }

  interface TTSCandidate {
    content?: TTSResponseContent;
  }

  interface TTSResponse {
    candidates?: TTSCandidate[];
  }
}
