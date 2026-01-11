import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';

const apiKey = process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error('Please set VITE_GEMINI_API_KEY environment variable');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const designSystem = `
# NEW DESIGN SYSTEM - "Faded Grandeur & Tropical Decay"

## Color Palette
- Primary Background: #222222 (Almost Black)
- Secondary Background: #392F24 (Dark Brown)
- Highlight: #D4A373 (Burnt Sienna)
- Accent: #337CCF (Muted Blue - for magical/ghost elements)
- Text Light: #F7F6F2 (Off White)
- Text Dark: #A27B5C (Dark Tan)

## Typography (Google Fonts)
- Headings: 'Playfair Display', serif
- Body: 'Merriweather', serif
- Labels: 'Cormorant Garamond', serif (italic for emphasis)

## Visual Style
- Dark, mysterious, dreamlike atmosphere
- Faded photograph aesthetic with sepia tones
- Subtle blur effects for "dreamy" feel
- Ghostly fade effects for supernatural elements
- Character cards look like old photographs
- Decaying/distorted visuals as story progresses
`;

async function askGeminiToRewrite(filePath: string, instructions: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const currentCode = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);

  const prompt = `You are an expert frontend developer. Rewrite this file with the new design system.

${designSystem}

## CURRENT FILE: ${fileName}
\`\`\`
${currentCode}
\`\`\`

## INSTRUCTIONS
${instructions}

## REQUIREMENTS
- Output ONLY the complete rewritten code, no explanations
- Keep all functionality intact
- Apply the new color palette and typography
- Maintain TypeScript types and React patterns
- Keep Framer Motion animations but adjust colors
- Do not add comments explaining changes

Output the complete file content:`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();

  // Clean up markdown code blocks if present
  text = text.replace(/^```\w*\n?/, '').replace(/\n?```$/, '');

  return text;
}

async function main() {
  const fileToProcess = process.argv[2];
  const instructions = process.argv[3] || 'Apply the new dark design system.';

  if (!fileToProcess) {
    console.error('Usage: npx tsx scripts/gemini-implement.ts <file-path> [instructions]');
    process.exit(1);
  }

  console.log(`🎨 Asking Gemini to rewrite: ${fileToProcess}`);
  console.log(`📝 Instructions: ${instructions}\n`);

  try {
    const newCode = await askGeminiToRewrite(fileToProcess, instructions);
    console.log(newCode);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
