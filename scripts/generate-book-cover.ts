/**
 * Script to generate the magical book cover image using Gemini
 * Run with: npx tsx scripts/generate-book-cover.ts
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

// Load API key from .env file manually
function loadEnvFile(): Record<string, string> {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf-8');
  const env: Record<string, string> = {};
  content.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  });
  return env;
}

const envVars = loadEnvFile();

const GEMINI_IMAGE_MODEL = 'gemini-2.0-flash-exp';

async function generateBookCover() {
  const apiKey = envVars.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error('Error: VITE_GEMINI_API_KEY not set in environment');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const imageModel = genAI.getGenerativeModel({
    model: GEMINI_IMAGE_MODEL,
    generationConfig: {
      temperature: 1.0,
    },
  });

  const prompt = `Create a flat, front-facing book cover design for "Cien Años de Soledad" (One Hundred Years of Solitude).

This is JUST the front cover surface - a flat rectangular design, NOT a 3D book.

Design elements:
- Deep burgundy/wine red aged leather texture as the base
- Ornate gold Art Nouveau border with flowing organic patterns
- Golden yellow butterflies scattered across the cover (the novel's iconic symbol)
- A mystical golden tree of life in the center (representing the family tree)
- Magical golden sparkles and small stars around the tree
- The title "Cien Años de Soledad" in elegant gold calligraphy at the bottom
- Author name "Gabriel García Márquez" in smaller gold text below
- Decorative gold corner flourishes

Style: Magical realism, ethereal, dreamlike
The design should feel ancient, mystical, and full of wonder.

CRITICAL: This must be a FLAT front-facing rectangle - like a book cover scan. No perspective, no 3D angle, no spine visible. Pure front view only.
Background: Transparent (this will be used as a texture overlay).`;

  console.log('Generating magical book cover image...');

  try {
    const result = await imageModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        // @ts-expect-error - Gemini image config
        responseModalities: ['image', 'text'],
      },
    });

    const response = await result.response;

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        const imageData = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        const extension = mimeType.split('/')[1] || 'png';

        // Save to public folder
        const outputPath = path.join(process.cwd(), 'public', `magical-book.${extension}`);
        const buffer = Buffer.from(imageData, 'base64');
        fs.writeFileSync(outputPath, buffer);

        console.log(`✓ Book cover saved to: ${outputPath}`);
        return;
      }
    }

    console.error('No image found in response');
  } catch (error) {
    console.error('Error generating image:', error);
    process.exit(1);
  }
}

generateBookCover();
