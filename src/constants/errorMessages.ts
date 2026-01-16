/**
 * Centralized error messages for user-facing errors.
 * Using constants ensures consistency and makes localization easier.
 */

export const ERROR_MESSAGES = {
  // Gemini initialization errors
  geminiNotInitialized: 'Gemini not initialized. Please set your API key.',
  geminiApiKeyRequired: 'Please configure your Gemini API key to use this feature.',

  // Living Memory errors
  livingMemoryApiKeyRequired: 'Please enter your Gemini API key to use Living Memory.',
  livingMemoryNotInitialized: 'Character memory not initialized.',
  livingMemorySessionFailed: 'Failed to create Living Memory session.',
  livingMemoryResponseFailed: 'Failed to get response. The spirit may be resting...',

  // Character bio errors
  bioGenerationFailed: 'Failed to generate biography. Using default description.',

  // Portrait errors
  portraitLoadFailed: 'Failed to load portrait',

  // Scene generation errors
  sceneGenerationFailed: 'Failed to generate image. Please try again.',
  sceneGenerationError: 'An error occurred while generating the image.',

  // Prophecy errors
  prophecyQuestionRequired: 'Please enter a question to ask the prophet.',
  prophecyVisionClouded: 'The prophet\'s vision was clouded. Please try again.',

  // TTS errors
  ttsNotInitialized: 'Gemini TTS not initialized. Please set your API key.',
  ttsNoAudioData: 'No audio data returned from TTS API',

  // Storage errors
  storageQuotaExceeded: 'Storage is full. Oldest conversations have been removed.',
  storageSaveFailed: 'Failed to save conversation. Please try again.',
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;
