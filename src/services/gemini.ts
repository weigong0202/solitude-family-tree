import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';
import type { Character, ChatMessage } from '../types';
import { getSpoilerSafeBioPrompt, getChatSystemPrompt, getTalkToTheDeadPrompt, getPortraitPrompt, getLivingMemoryPrompt } from './prompts';
import type { CharacterMemory } from './characterMemory';
import { generateMemorySummary } from './characterMemory';
import type { SceneRequest, GeneratedScene } from './macondoVisions';
import { buildScenePrompt, saveGeneratedScene } from './macondoVisions';
import { generateReturningGreeting, generateFirstGreeting } from './greetings';

let genAI: GoogleGenerativeAI | null = null;
let textModel: GenerativeModel | null = null;
let imageModel: GenerativeModel | null = null;

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

// Generate content with Google Search grounding for historical context
export async function generateWithSearchGrounding(
  query: string,
  currentChapter: number
): Promise<{ text: string; sources?: string[] }> {
  if (!textModel || !genAI) {
    throw new Error('Gemini not initialized');
  }

  const contextPrompt = `You are helping a reader of "One Hundred Years of Solitude" who is at Chapter ${currentChapter}.
Use Google Search to find accurate historical information about Colombia, the civil wars, and the context of the novel.
Do not spoil any events beyond chapter ${currentChapter}.

Query: ${query}`;

  try {
    const model = genAI.getGenerativeModel({
      model: GEMINI_TEXT_MODEL,
      // @ts-expect-error - Gemini 3 tools config
      tools: [{ googleSearch: {} }],
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: contextPrompt }] }],
      generationConfig: {
        temperature: 1.0,
        // @ts-expect-error - Gemini 3 thinking config
        thinkingConfig: { thinkingLevel: 'high' },
      },
    });

    const response = await result.response;
    const text = response.text();

    // Extract grounding sources if available
    const sources: string[] = [];
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    if (groundingMetadata?.groundingChunks) {
      for (const chunk of groundingMetadata.groundingChunks) {
        if (chunk.web?.uri) {
          sources.push(chunk.web.uri);
        }
      }
    }

    return { text, sources };
  } catch (error) {
    console.error('Error with search grounding:', error);
    throw error;
  }
}

// Create chat session with high thinking for Talk to the Dead
export function createChatSession(currentChapter: number): ChatSession | null {
  if (!textModel) {
    console.error('Gemini not initialized');
    return null;
  }

  const systemPrompt = getChatSystemPrompt(currentChapter);

  return textModel.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: `System context: ${systemPrompt}` }],
      },
      {
        role: 'model',
        parts: [{ text: 'I understand. I\'m here to help you explore "One Hundred Years of Solitude" while being careful not to spoil anything beyond your current chapter. Feel free to ask me about the characters, themes, symbolism, or anything else about what you\'ve read so far!' }],
      },
    ],
  });
}

export async function sendChatMessage(
  session: ChatSession,
  message: string
): Promise<string> {
  try {
    const result = await session.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
}

// Simple one-off chat for object stories and quick queries
export async function chatWithGemini(
  prompt: string,
  currentChapter: number
): Promise<string> {
  const session = createChatSession(currentChapter);
  if (!session) {
    throw new Error('Gemini not initialized');
  }
  return sendChatMessage(session, prompt);
}

// Create character chat session with high thinking for deep roleplay
export function createCharacterChatSession(
  character: Character,
  currentChapter: number
): ChatSession | null {
  if (!genAI) {
    console.error('Gemini not initialized');
    return null;
  }

  const systemPrompt = getTalkToTheDeadPrompt(character, currentChapter);

  // Use high thinking level for character roleplay
  const model = genAI.getGenerativeModel({
    model: GEMINI_TEXT_MODEL,
    generationConfig: {
      temperature: 1.0,
    },
  });

  return model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: `System context: ${systemPrompt}` }],
      },
      {
        role: 'model',
        parts: [{ text: `*A shimmer appears in the air, like heat rising from sun-baked earth. The faint scent of yellow flowers and old parchment fills the space.*

Ah... you have called me back from the realm of shadows. I am ${character.name}${character.nickname ? `, whom they called "${character.nickname}"` : ''}.

The boundary between worlds grows thin when the living remember us. What would you ask of one who has crossed the great river of time? Speak, and I shall answer what I can from beyond the veil...` }],
      },
    ],
  });
}

// Send message with thinking level control
export async function sendChatMessageWithThinking(
  session: ChatSession,
  message: string,
  _thinkingLevel: ThinkingLevel = 'high'
): Promise<string> {
  try {
    // Note: thinkingLevel is prepared for Gemini 3 when SDK supports it
    const result = await session.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
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

// Create Living Memory chat session with full memory context
export function createLivingMemorySession(
  character: Character,
  memory: CharacterMemory,
  currentChapter: number,
  isDeceased: boolean
): ChatSession | null {
  if (!genAI) {
    console.error('Gemini not initialized');
    return null;
  }

  const memorySummary = generateMemorySummary(memory);
  const systemPrompt = getLivingMemoryPrompt(character, currentChapter, memorySummary, isDeceased);

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
