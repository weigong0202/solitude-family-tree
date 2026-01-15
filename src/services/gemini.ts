import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';
import { GoogleGenAI } from '@google/genai';
import type { Character } from '../types';
import { getSpoilerSafeBioPrompt, getPortraitPrompt, getLivingMemoryPrompt } from './prompts';
import type { CharacterMemory, CharacterEmotionalState } from './characterMemory';
import { generateMemorySummary } from './characterMemory';
import type { SceneRequest, GeneratedScene } from './macondoVisions';
import { buildScenePrompt, saveGeneratedScene } from './macondoVisions';
import { generateReturningGreeting, generateFirstGreeting } from './greetings';
import type { AlternateTimeline, DivergencePoint } from '../types/alternateHistory';
import {
  buildProphecyPrompt,
  parseGeminiResponse,
  saveAlternateTimeline,
  generateTimelineId,
} from './alternateHistory';

let genAI: GoogleGenerativeAI | null = null;
let textModel: GenerativeModel | null = null;
let imageModel: GenerativeModel | null = null;
let genAITTS: GoogleGenAI | null = null; // TTS uses the @google/genai SDK

// Gemini 3 model configuration
const GEMINI_TEXT_MODEL = 'gemini-3-flash-preview';
const GEMINI_IMAGE_MODEL = 'gemini-3-pro-image-preview';

// Thinking levels for different use cases
export type ThinkingLevel = 'minimal' | 'low' | 'medium' | 'high';

export function initializeGemini(apiKey: string): void {
  genAI = new GoogleGenerativeAI(apiKey);

  // Text model with default high thinking for complex reasoning
  textModel = genAI.getGenerativeModel({
    model: GEMINI_TEXT_MODEL,
    generationConfig: {
      temperature: 1.0, // Gemini 3 recommends keeping at 1.0
    },
  });

  // Image generation model
  imageModel = genAI.getGenerativeModel({
    model: GEMINI_IMAGE_MODEL,
    generationConfig: {
      temperature: 1.0,
    },
  });

  // TTS model (uses @google/genai SDK)
  genAITTS = new GoogleGenAI({ apiKey });
}

export function isGeminiInitialized(): boolean {
  return textModel !== null;
}

export function getGeminiModels() {
  return {
    text: GEMINI_TEXT_MODEL,
    image: GEMINI_IMAGE_MODEL,
  };
}

// Generate character biography with thinking level control
export async function generateCharacterBio(
  character: Character,
  currentChapter: number,
  thinkingLevel: ThinkingLevel = 'medium'
): Promise<string> {
  if (!textModel || !genAI) {
    throw new Error('Gemini not initialized. Please set your API key.');
  }

  const prompt = getSpoilerSafeBioPrompt(character, currentChapter);

  try {
    // Create model with specific thinking level for this request
    const model = genAI.getGenerativeModel({
      model: GEMINI_TEXT_MODEL,
      generationConfig: {
        temperature: 1.0,
      },
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        // @ts-expect-error - Gemini 3 thinking config
        thinkingConfig: { thinkingLevel: thinkingLevel },
      },
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating bio:', error);
    throw error;
  }
}

// Generate character portrait using Gemini 3 image generation
export async function generateCharacterPortrait(
  character: Character
): Promise<string | null> {
  if (!imageModel || !genAI) {
    console.error('Gemini image model not initialized');
    return null;
  }

  const prompt = getPortraitPrompt(character);

  try {
    const result = await imageModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        // @ts-expect-error - Gemini 3 image config
        responseModalities: ['image', 'text'],
      },
    });

    const response = await result.response;

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    return null;
  } catch (error) {
    console.error('Error generating portrait:', error);
    return null;
  }
}

// ============================================================================
// MACONDO VISIONS - AI-Generated Scene Illustrations
// ============================================================================

// Generate a scene illustration using Gemini 3 image generation
export async function generateSceneImage(request: SceneRequest): Promise<GeneratedScene | null> {
  if (!imageModel || !genAI) {
    console.error('Gemini image model not initialized');
    return null;
  }

  const prompt = buildScenePrompt(request);

  try {
    const result = await imageModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        // @ts-expect-error - Gemini 3 image config
        responseModalities: ['image', 'text'],
      },
    });

    const response = await result.response;

    // Extract image from response
    let imageUrl: string | null = null;
    let caption: string | undefined;

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      } else if (part.text) {
        caption = part.text;
      }
    }

    if (!imageUrl) {
      console.error('No image in response');
      return null;
    }

    const scene: GeneratedScene = {
      id: `scene_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      request,
      imageUrl,
      timestamp: new Date(),
      caption,
    };

    // Save to localStorage
    saveGeneratedScene(scene);

    return scene;
  } catch (error) {
    console.error('Error generating scene:', error);
    return null;
  }
}

// Generate a caption/description for a scene using text model
export async function generateSceneCaption(
  sceneDescription: string,
  artStyle: string
): Promise<string> {
  if (!textModel || !genAI) {
    return '';
  }

  try {
    const prompt = `Write a brief, evocative caption (2-3 sentences) for a painting depicting this scene from "One Hundred Years of Solitude":

Scene: ${sceneDescription}
Art Style: ${artStyle}

The caption should be poetic and capture the magical realism atmosphere. Write in English.`;

    const model = genAI.getGenerativeModel({
      model: GEMINI_TEXT_MODEL,
      generationConfig: { temperature: 0.8 },
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        // @ts-expect-error - Gemini 3 thinking config
        thinkingConfig: { thinkingLevel: 'low' },
      },
    });

    return result.response.text().trim();
  } catch (error) {
    console.error('Error generating caption:', error);
    return '';
  }
}

// ============================================================================
// LIVING MEMORY - Persistent Character Conversations with Thought Signatures
// ============================================================================

export interface LivingMemoryResponse {
  text: string;
  thoughtSignature?: string;
  emotionalAnalysis: {
    moodShift?: CharacterEmotionalState['mood'];
    trustChange?: number;
    newTopics?: string[];
    memorableExchange?: string;
  };
}

export type ResponseStyle = 'brief' | 'balanced' | 'immersive';

// Create Living Memory chat session with full memory context
export function createLivingMemorySession(
  character: Character,
  memory: CharacterMemory,
  currentChapter: number,
  isDeceased: boolean,
  responseStyle: ResponseStyle = 'balanced'
): ChatSession | null {
  if (!genAI) {
    console.error('Gemini not initialized');
    return null;
  }

  const memorySummary = generateMemorySummary(memory);
  const systemPrompt = getLivingMemoryPrompt(character, currentChapter, memorySummary, isDeceased, responseStyle);

  // Use high thinking level for deep character roleplay with memory
  const model = genAI.getGenerativeModel({
    model: GEMINI_TEXT_MODEL,
    generationConfig: {
      temperature: 1.0,
    },
  });

  // Build history from past conversations (last 10 messages for context)
  const recentHistory = memory.conversationHistory.slice(-10);
  const historyParts: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [
    {
      role: 'user',
      parts: [{ text: `System context: ${systemPrompt}` }],
    },
  ];

  // Add initial greeting based on whether this is a returning visitor
  const isReturningVisitor = memory.emotionalState.interactionCount > 0;
  const greeting = isReturningVisitor
    ? generateReturningGreeting(character, memory, isDeceased)
    : generateFirstGreeting(character, isDeceased);

  historyParts.push({
    role: 'model',
    parts: [{ text: greeting }],
  });

  // Add recent conversation history
  for (const msg of recentHistory) {
    historyParts.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    });
  }

  return model.startChat({ history: historyParts });
}

// Generate mock thought signature for demo purposes
// This simulates what the Gemini 3 thought signature feature would provide
async function generateMockThoughtSignature(
  character: Character,
  userMessage: string,
  assistantResponse: string
): Promise<string | undefined> {
  if (!genAI) return undefined;

  try {
    const model = genAI.getGenerativeModel({
      model: GEMINI_TEXT_MODEL,
      generationConfig: { temperature: 0.7 },
    });

    const prompt = `You are simulating the inner thoughts of ${character.name} from "One Hundred Years of Solitude" by Gabriel García Márquez.

The visitor just said: "${userMessage}"

${character.name} responded: "${assistantResponse.slice(0, 200)}..."

Write 1-2 sentences capturing ${character.name}'s private inner thoughts or reasoning while formulating this response. This should reveal:
- What memories or emotions were stirred
- Any hesitation or internal conflict
- Deeper meaning they didn't say aloud

Write in third person, past tense, like a narrator describing their thoughts. Be poetic and evocative, fitting the novel's magical realism style. Keep it under 50 words.

Example: "The question stirred memories long buried beneath the weight of solitude. He considered the futility of explaining time to those who had not lived it backwards."`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        // @ts-expect-error - Gemini 3 thinking config
        thinkingConfig: { thinkingLevel: 'minimal' },
      },
    });

    return result.response.text().trim();
  } catch (error) {
    console.error('Error generating mock thought signature:', error);
    return undefined;
  }
}

// Send message to Living Memory session and analyze response
export async function sendLivingMemoryMessage(
  session: ChatSession,
  message: string,
  character: Character
): Promise<LivingMemoryResponse> {
  try {
    const result = await session.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    // Extract thought signature if available (Gemini 3 feature)
    let thoughtSignature: string | undefined;
    const candidate = response.candidates?.[0];

    // @ts-expect-error - Gemini 3 thought signature field
    if (candidate?.thoughtSignature) {
      // @ts-expect-error - Gemini 3 thought signature field
      thoughtSignature = candidate.thoughtSignature;
    } else {
      // Generate mock thought signature for demo (until API supports it natively)
      thoughtSignature = await generateMockThoughtSignature(character, message, text);
    }

    // Analyze the conversation for emotional updates
    const emotionalAnalysis = await analyzeConversationForEmotions(
      message,
      text,
      character
    );

    return {
      text,
      thoughtSignature,
      emotionalAnalysis,
    };
  } catch (error) {
    console.error('Error in Living Memory message:', error);
    throw error;
  }
}

// Analyze conversation to determine emotional state changes
async function analyzeConversationForEmotions(
  userMessage: string,
  assistantResponse: string,
  character: Character
): Promise<LivingMemoryResponse['emotionalAnalysis']> {
  if (!genAI) {
    return {};
  }

  try {
    const model = genAI.getGenerativeModel({
      model: GEMINI_TEXT_MODEL,
      generationConfig: {
        temperature: 0.3, // Lower temperature for consistent analysis
      },
    });

    const analysisPrompt = `Analyze this conversation between a user and the spirit of ${character.name} from "One Hundred Years of Solitude".

User said: "${userMessage}"

${character.name} responded: "${assistantResponse}"

Provide a JSON analysis with these fields:
- moodShift: If the conversation should change the character's mood, specify one of: "neutral", "warm", "melancholic", "agitated", "mysterious", "joyful". Only include if there's a clear reason for mood change.
- trustChange: A number from -10 to +10 indicating how much trust changed. Positive for empathetic/respectful messages, negative for rude/dismissive ones. 0 if neutral.
- newTopics: Array of 1-3 word topic labels for any new subjects discussed (e.g., "family", "death", "love", "war", "ice", "alchemy")
- memorableExchange: If this was a significant moment worth remembering, summarize it in under 15 words. Otherwise null.

Respond ONLY with valid JSON, no markdown formatting.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: analysisPrompt }] }],
      generationConfig: {
        // @ts-expect-error - Gemini 3 thinking config
        thinkingConfig: { thinkingLevel: 'low' },
      },
    });

    const analysisText = result.response.text().trim();

    // Parse JSON response
    try {
      // Remove any markdown code block formatting if present
      const cleanJson = analysisText.replace(/```json\n?|\n?```/g, '').trim();
      const analysis = JSON.parse(cleanJson);

      return {
        moodShift: analysis.moodShift || undefined,
        trustChange: typeof analysis.trustChange === 'number' ? analysis.trustChange : 0,
        newTopics: Array.isArray(analysis.newTopics) ? analysis.newTopics : undefined,
        memorableExchange: analysis.memorableExchange || undefined,
      };
    } catch {
      console.warn('Could not parse emotional analysis:', analysisText);
      return {};
    }
  } catch (error) {
    console.error('Error analyzing emotions:', error);
    return {};
  }
}

// ============================================================================
// ALTERNATE HISTORY - Melquíades' Prophecy "What If" Generator
// ============================================================================

export interface AlternateProphecyResult {
  timeline: AlternateTimeline;
  rawResponse: string;
}

/**
 * Generate an alternate timeline using Gemini's high-level reasoning
 * Uses thinkingLevel: 'high' for complex causal analysis
 */
export async function generateAlternateProphecy(
  question: string,
  scenario: DivergencePoint | null = null
): Promise<AlternateProphecyResult> {
  if (!genAI) {
    throw new Error('Gemini not initialized. Please set your API key.');
  }

  const prompt = buildProphecyPrompt(scenario, question);

  try {
    // Use high thinking level for complex causal reasoning about alternate timelines
    const model = genAI.getGenerativeModel({
      model: GEMINI_TEXT_MODEL,
      generationConfig: {
        temperature: 1.0,
      },
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        // @ts-expect-error - Gemini 3 thinking config
        thinkingConfig: { thinkingLevel: 'high' },
      },
    });

    const response = await result.response;
    const rawResponse = response.text();

    // Parse the structured response
    const parsed = parseGeminiResponse(rawResponse);

    // Create the timeline object
    const timeline: AlternateTimeline = {
      id: generateTimelineId(),
      divergencePoint: scenario || {
        id: 'custom',
        title: 'Custom Question',
        description: question,
        chapter: 0,
        characterIds: [],
        originalOutcome: '',
        category: 'event',
      },
      question,
      narrative: parsed.narrative,
      effects: parsed.effects,
      thinkingTrace: parsed.reasoning,
      timestamp: new Date(),
    };

    // Save to localStorage
    saveAlternateTimeline(timeline);

    return {
      timeline,
      rawResponse,
    };
  } catch (error) {
    console.error('Error generating alternate prophecy:', error);
    throw error;
  }
}

// ============================================================================
// TEXT-TO-SPEECH - Character Voice Narration
// ============================================================================

const GEMINI_TTS_MODEL = 'gemini-2.5-flash-preview-tts';

/**
 * Generate audio narration for character dialogue using Gemini TTS
 * @param text - The text to convert to speech
 * @param voiceName - The voice to use (e.g., 'Charon', 'Kore', 'Puck')
 * @returns Base64-encoded PCM audio data (24kHz, 16-bit, mono)
 */
export async function generateCharacterNarration(
  text: string,
  voiceName: string
): Promise<string> {
  if (!genAITTS) {
    throw new Error('Gemini TTS not initialized. Please set your API key.');
  }

  try {
    const response = await genAITTS.models.generateContent({
      model: GEMINI_TTS_MODEL,
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    // Extract audio data from response
    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) {
      throw new Error('No audio data returned from TTS API');
    }

    return audioData; // base64-encoded PCM
  } catch (error) {
    console.error('Error generating character narration:', error);
    throw error;
  }
}

/**
 * Check if TTS is available
 */
export function isTTSInitialized(): boolean {
  return genAITTS !== null;
}
