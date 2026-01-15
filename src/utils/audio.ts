/**
 * Audio utilities for converting Gemini TTS output to playable audio
 *
 * Gemini TTS returns base64-encoded PCM audio data (24kHz, 16-bit, mono)
 * which needs to be converted to WAV format for browser playback.
 */

/**
 * Convert base64-encoded PCM audio to WAV format
 * @param base64Pcm - Base64 encoded PCM audio data from Gemini TTS
 * @returns Blob containing WAV audio data
 */
export function pcmToWav(base64Pcm: string): Blob {
  // Decode base64 to binary
  const pcmData = Uint8Array.from(atob(base64Pcm), c => c.charCodeAt(0));

  // WAV format parameters (matching Gemini TTS output)
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);

  // Create WAV header (44 bytes)
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + pcmData.length, true); // File size - 8
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);                 // Sub-chunk size (16 for PCM)
  view.setUint16(20, 1, true);                  // Audio format (1 = PCM)
  view.setUint16(22, numChannels, true);        // Number of channels
  view.setUint32(24, sampleRate, true);         // Sample rate
  view.setUint32(28, byteRate, true);           // Byte rate
  view.setUint16(32, blockAlign, true);         // Block align
  view.setUint16(34, bitsPerSample, true);      // Bits per sample

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, pcmData.length, true);     // Data size

  // Combine header and PCM data
  return new Blob([wavHeader, pcmData], { type: 'audio/wav' });
}

/**
 * Helper to write a string into a DataView
 */
function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

/**
 * Create an audio player from base64 PCM data
 * @param base64Pcm - Base64 encoded PCM audio data
 * @returns Object URL for the audio that can be used with HTMLAudioElement
 */
export function createAudioUrl(base64Pcm: string): string {
  const wavBlob = pcmToWav(base64Pcm);
  return URL.createObjectURL(wavBlob);
}
