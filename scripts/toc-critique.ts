/**
 * TOC Design Critique Script
 * Uses Gemini to analyze and critique the Table of Contents UI design
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.VITE_GEMINI_API_KEY || '';

const tocDesignDescription = `
# Table of Contents (TOC) Design for "One Hundred Years of Solitude" Interactive Book

## Structure
The TOC spans two facing pages in an interactive flip book interface:
- Left page: The Founders era (chapters 1-6) and The Wars era (chapters 7-9)
- Right page: The Banana Company era (chapters 10-15) and The Reckoning era (chapters 16-20)

## Visual Design

### Page Background
- Left page: Gradient from cream (#ede7d8) to parchment (#fdf8ed), with inset shadow on right edge
- Right page: Similar gradient with inset shadow on left edge (simulating book spine)
- Subtle noise texture overlay (3% opacity) for paper feel
- **NEW: Subtle yellow butterfly watermark** (6% opacity) floating in background on each page, with gentle animation

### Chronicle Title (Left page only)
- Font: Playfair Display, serif
- Size: 1.5rem
- Color: #4e342e (dark brown)
- Centered with decorative star ornaments (✦) in gold (#B58900) on each side

### Era Section Headers
- Era Name: Cormorant Garamond font, 1rem, uppercase, letter-spacing 0.12em, gold (#B58900)
- Era Date: Lora font, 0.85rem, italic, light gray (#93a1a1)
- Separated by gold border-bottom (25% opacity)
- Compact spacing: 4px padding-bottom, 4px margin-bottom

### Chapter Buttons
- Full-width buttons with compact 4px 8px padding
- Left-aligned flex layout with:
  1. Chapter number: Cormorant Garamond, 1rem, bold, gold (#B58900), fixed 22px width
  2. Chapter title: Cormorant Garamond, 1rem, font-weight 600, dark brown (#4e342e), truncated with ellipsis
- **Mood dots removed** for cleaner design
- Hover: light gold background (8% opacity), thin gold border (30% opacity), 4px right slide transform
- Active state: 2px slide, darker background (15% opacity)
- Transparent border by default (1px solid transparent) for smooth hover transition

### Section Dividers
- **NEW: Hand-drawn SVG wavy line** instead of fleuron
- Gold color (#B58900), 50% opacity
- SVG path with gentle curves: "M0,5 Q25,2 50,5 T100,5 T150,5 T200,5"
- Width: 120px, centered
- Margin: 6px vertical

### Footer (Right page only)
- Border-top in gold (20% opacity)
- **NEW: SVG wavy line ornament** instead of star symbols
- **NEW: Thematic quote**: "The first of the line is tied to a tree and the last is being eaten by the ants."
- Quote: Lora font, 0.8rem, italic, muted gray (#657b83), line-height 1.3

### Typography Stack
- Headings: Playfair Display (elegant, literary)
- Era labels & Chapter titles: Cormorant Garamond (refined, classical, consistent)
- Dates & quotes: Lora (readable, warm serif)

### Color Palette
- Primary gold accent: #B58900 (aged gold, used for numbers, headers, ornaments, hover states)
- Text primary: #4e342e (warm dark brown, for titles)
- Text muted: #93a1a1 (light gray, for dates)
- Quote text: #657b83 (medium gray)
- Background: cream/parchment gradients
- Butterfly watermark: #B58900 at 6% opacity

### Spacing (Compact)
- Page inner padding: 16px 20px
- Era section margin-bottom: 4px
- Section divider margin: 6px vertical
- Chapter button padding: 4px 8px
- Chapter button gap: 0
- Footer padding-top: 8px

### Magical Realism Elements
- Subtle animated yellow butterflies (referencing the novel's iconic yellow butterflies that follow Mauricio Babilonia)
- Hand-drawn style SVG dividers suggesting imperfect, organic lines
- Warm parchment textures evoking aged manuscripts
`;

const critiquePrompt = `You are a senior UX/UI designer with expertise in:
- Visual aesthetics and typography
- Literary/book-themed digital interfaces
- Classic and elegant design systems
- Magical realism aesthetic in digital design
- Color theory and visual hierarchy

Please critique the Table of Contents (TOC) design for an interactive digital book experience based on "One Hundred Years of Solitude" by Gabriel García Márquez.

Evaluate and provide detailed feedback on:

1. **Visual Hierarchy & Information Architecture**
   - Is the era/chapter organization clear?
   - Does the layout guide the eye effectively?
   - Are the visual weights appropriately distributed?

2. **Typography Choices**
   - Is the font pairing (Playfair Display, Cormorant Garamond, Lora) effective?
   - Are sizes and weights appropriate for the hierarchy?
   - Does the typography evoke the literary theme?

3. **Color Usage**
   - Is the gold (#B58900) accent used effectively?
   - Does the mood dot color coding add value or clutter?
   - Is the contrast sufficient for readability?

4. **Interaction Design**
   - Are the chapter buttons clearly clickable?
   - Is the hover feedback (slide + background) appropriate?
   - Could the affordances be improved?

5. **Emotional & Thematic Resonance**
   - Does it feel like a classic book's table of contents?
   - Does it evoke the magical realism of the novel?
   - Is the parchment/aged aesthetic overdone or just right?

6. **Specific Issues & Improvements**
   - What specific elements work well?
   - What specific elements need improvement?
   - Provide concrete suggestions with example CSS values or design changes.

7. **Overall Assessment**
   - Rate the design (1-10) with justification
   - Top 3 things to keep
   - Top 3 things to change

Be specific, critical, and actionable. For suggestions, explain WHY and provide concrete design specs where helpful.

${tocDesignDescription}
`;

async function runCritique() {
  if (!API_KEY) {
    console.error('Please set VITE_GEMINI_API_KEY environment variable');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  console.log('📖 Requesting TOC design critique from Gemini...\n');

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: critiquePrompt }] }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 4096,
      },
    });

    const response = await result.response;
    console.log('━'.repeat(70));
    console.log('GEMINI DESIGN CRITIQUE: TABLE OF CONTENTS');
    console.log('━'.repeat(70));
    console.log(response.text());
    console.log('━'.repeat(70));
  } catch (error) {
    console.error('Error:', error);
  }
}

runCritique();
