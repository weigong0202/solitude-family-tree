/**
 * Script to generate all character portraits using Gemini Imagen
 * Run with: npx tsx scripts/generate-portraits.ts
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

// Character data (simplified for portrait generation)
const characters = [
  { id: 'jose-arcadio-buendia', name: 'José Arcadio Buendía', physicalDescription: 'A giant of a man with wild hair and an unkempt beard, powerful build', generation: 1 },
  { id: 'ursula', name: 'Úrsula Iguarán', physicalDescription: 'Small but tireless woman with sharp eyes and a practical demeanor', generation: 1 },
  { id: 'melquiades', name: 'Melquíades', physicalDescription: 'Gloomy man with an Asiatic look, large black hat like a raven, velvet vest', generation: 1, isGhost: true },
  { id: 'jose-arcadio-son', name: 'José Arcadio', physicalDescription: 'Monstrously large with tremendous strength, tattooed body', generation: 2 },
  { id: 'colonel-aureliano', name: 'Colonel Aureliano Buendía', physicalDescription: 'Thin and bony with sad eyes, later with a permanent melancholy', generation: 2 },
  { id: 'amaranta', name: 'Amaranta Buendía', physicalDescription: 'Beautiful in youth, wears a black bandage on her burned hand', generation: 2 },
  { id: 'rebeca', name: 'Rebeca Buendía', physicalDescription: 'Green eyes, long dark hair, delicate features', generation: 2 },
  { id: 'arcadio', name: 'Arcadio', physicalDescription: 'Resembles his father in stature, stern expression', generation: 3 },
  { id: 'aureliano-jose', name: 'Aureliano José', physicalDescription: 'Young soldier with his father\'s features', generation: 3 },
  { id: 'remedios-moscote', name: 'Remedios Moscote', physicalDescription: 'Very young, innocent features, childlike beauty', generation: 3 },
  { id: 'pilar-ternera', name: 'Pilar Ternera', physicalDescription: 'Voluptuous, laughing woman who ages into an ancient crone', generation: 2 },
  { id: 'santa-sofia', name: 'Santa Sofía de la Piedad', physicalDescription: 'Thin, silent woman with a haunted look', generation: 3 },
  { id: 'remedios-la-bella', name: 'Remedios the Beauty', physicalDescription: 'Unearthly beauty, simple white dress, innocent expression', generation: 4 },
  { id: 'aureliano-segundo', name: 'Aureliano Segundo', physicalDescription: 'Robust and jovial, later becomes corpulent', generation: 4 },
  { id: 'jose-arcadio-segundo', name: 'José Arcadio Segundo', physicalDescription: 'Identical to his twin but more serious demeanor', generation: 4 },
  { id: 'fernanda', name: 'Fernanda del Carpio', physicalDescription: 'Elegant, haughty, always dressed in mourning', generation: 4 },
  { id: 'petra-cotes', name: 'Petra Cotes', physicalDescription: 'Mulatto woman with a generous body and warm smile', generation: 4 },
  { id: 'renata-remedios', name: 'Renata Remedios (Meme)', physicalDescription: 'Lively young woman with modern tastes', generation: 5 },
  { id: 'jose-arcadio-iii', name: 'José Arcadio', physicalDescription: 'Effeminate, pampered appearance', generation: 5 },
  { id: 'amaranta-ursula', name: 'Amaranta Úrsula', physicalDescription: 'Beautiful, spirited, with a modern European style', generation: 5 },
  { id: 'aureliano-babilonia', name: 'Aureliano Babilonia', physicalDescription: 'Scholarly, introspective young man', generation: 6 },
  { id: 'mauricio-babilonia', name: 'Mauricio Babilonia', physicalDescription: 'Young mechanic always surrounded by yellow butterflies', generation: 5 },
  { id: 'gaston', name: 'Gastón', physicalDescription: 'European gentleman with refined manners', generation: 5 },
  { id: 'aureliano-pig-tail', name: 'Aureliano (The Last)', physicalDescription: 'Newborn with a pig\'s tail, the family curse fulfilled', generation: 7 },
];

const PORTRAITS_DIR = path.join(process.cwd(), 'public/portraits');
const GEMINI_IMAGE_MODEL = 'gemini-2.0-flash-exp';

function getPortraitPrompt(character: typeof characters[0]): string {
  const ghostNote = character.isGhost
    ? 'Ethereal, slightly translucent, ghostly quality with a mystical aura.'
    : '';

  return `Create a painted portrait in magical realism style of ${character.name}, a character from a multi-generational Latin American family saga.

Physical appearance: ${character.physicalDescription}

Style requirements:
- Colombian setting, 19th-20th century period
- Warm sepia and earth tones, soft dramatic lighting
- Oil painting style reminiscent of classical Latin American art
- Detailed brushwork with emotional depth
- Portrait format showing shoulders and face
- Weathered, aged paper texture effect
${ghostNote}

Create a single portrait image.`;
}

async function generatePortrait(
  genAI: GoogleGenerativeAI,
  character: typeof characters[0]
): Promise<Buffer | null> {
  const prompt = getPortraitPrompt(character);

  try {
    console.log(`Generating portrait for ${character.name}...`);

    const model = genAI.getGenerativeModel({
      model: GEMINI_IMAGE_MODEL,
      generationConfig: {
        temperature: 1.0,
      },
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        // @ts-expect-error - Gemini image generation config
        responseModalities: ['image', 'text'],
      },
    });

    const response = await result.response;

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      // @ts-expect-error - inlineData type
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        // @ts-expect-error - inlineData type
        const base64Data = part.inlineData.data;
        return Buffer.from(base64Data, 'base64');
      }
    }

    console.log(`  No image in response for ${character.name}`);
    return null;
  } catch (error) {
    console.error(`  Error generating portrait for ${character.name}:`, error);
    return null;
  }
}

async function main() {
  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('Please set GEMINI_API_KEY or VITE_GEMINI_API_KEY environment variable');
    console.error('Example: GEMINI_API_KEY=your-key npx tsx scripts/generate-portraits.ts');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Ensure portraits directory exists
  if (!fs.existsSync(PORTRAITS_DIR)) {
    fs.mkdirSync(PORTRAITS_DIR, { recursive: true });
  }

  console.log(`\nGenerating ${characters.length} portraits...`);
  console.log(`Saving to: ${PORTRAITS_DIR}\n`);

  let successCount = 0;
  let failCount = 0;

  for (const character of characters) {
    const outputPath = path.join(PORTRAITS_DIR, `${character.id}.png`);

    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      console.log(`✓ ${character.name} - already exists, skipping`);
      successCount++;
      continue;
    }

    const imageBuffer = await generatePortrait(genAI, character);

    if (imageBuffer) {
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`✓ ${character.name} - saved to ${character.id}.png`);
      successCount++;
    } else {
      console.log(`✗ ${character.name} - failed to generate`);
      failCount++;
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n========================================`);
  console.log(`Done! Generated ${successCount} portraits, ${failCount} failed.`);
  console.log(`Portraits saved to: ${PORTRAITS_DIR}`);
}

main();
