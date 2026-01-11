import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error('Please set VITE_GEMINI_API_KEY environment variable');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const currentDesign = `
# Current Website: "One Hundred Years of Solitude" Interactive Family Tree

## Current Tech Stack
- React 18 + Vite + TypeScript
- Framer Motion for animations
- TailwindCSS for styling
- Gemini 3 for AI features

## Current Visual Design
- Theme: "Parchment and Ink" - cream/beige backgrounds (#FDF6E3) with dark text (#586E75)
- Accent colors: Gold (#B58900), Ghost Blue (#268BD2)
- Fonts: EB Garamond (serif) for body, Special Elite (typewriter) for labels
- Scroll-based chapter navigation (20 chapters)
- Character cards with portraits
- Magical effects: yellow butterflies, rain, golden dust particles

## Current Components
1. Hero Section - title and "Begin the Journey" button
2. Chapter Sections - each chapter has quote, summary, key events, characters introduced/died
3. Character Cards - portrait, name, generation, status (alive/deceased)
4. Character Modal - bio, family connections, AI-generated content
5. Chat Panel - Q&A about the book
6. "Talk to the Dead" - chat with deceased characters' spirits
7. Séance Navigation - circular table with candles for chapter selection
8. Ambient Music player

## The Novel's Themes (for design inspiration)
- Magical realism - ordinary mixed with supernatural
- Cyclical time - history repeating across generations
- Solitude and isolation
- Colombian setting - tropical, lush, 19th-20th century
- Family destiny and curses
- Yellow butterflies (symbol of love/Mauricio Babilonia)
- Alchemy and mysticism (José Arcadio Buendía's obsession)
- Rain (4+ years of continuous rain in the novel)
- Ghosts and the dead living among the living

## What I Want
Please provide a COMPLETE UI redesign with:
1. New color palette (with hex codes)
2. Typography recommendations
3. Layout structure for each major component
4. Animation and interaction ideas
5. Visual metaphors that capture the magical realism
6. CSS/styling code snippets where helpful

Be bold and creative! This is for a hackathon showcasing Gemini's capabilities.
`;

async function getGeminiRedesign() {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
  });

  const prompt = `You are a world-class UI/UX designer specializing in immersive, artistic web experiences.

${currentDesign}

Please provide a COMPLETE visual redesign for this website. Be specific with:
- Exact hex color codes
- Font names (from Google Fonts)
- CSS code snippets
- Detailed component layouts
- Animation descriptions

Focus on creating something that feels like stepping into the world of magical realism - mysterious, beautiful, slightly unsettling, dreamlike. Think of the visual style of films like "Pan's Labyrinth" or artwork by Remedios Varo.

Structure your response as:
1. DESIGN PHILOSOPHY (2-3 sentences)
2. COLOR PALETTE (with hex codes and usage)
3. TYPOGRAPHY (font names and sizes)
4. COMPONENT REDESIGNS (for each major component)
5. ANIMATIONS & INTERACTIONS
6. CSS CODE SNIPPETS (ready to implement)`;

  try {
    console.log('🎨 Asking Gemini for a complete UI redesign...\n');

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('='.repeat(60));
    console.log('GEMINI UI REDESIGN PROPOSAL');
    console.log('='.repeat(60));
    console.log(text);
    console.log('='.repeat(60));

    return text;
  } catch (error) {
    console.error('Error getting redesign:', error);
    throw error;
  }
}

getGeminiRedesign();
