/**
 * Design Critique Script
 * Uses Gemini 3 to analyze and critique the UI design
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.VITE_GEMINI_API_KEY || '';

const currentDesign = `
# One Hundred Years of Solitude - Interactive Family Tree Website

## Current Design Summary:

### Color Palette (Parchment & Ink Theme):
- Background: #FDF6E3 (warm parchment cream)
- Primary Text: #586E75 (dark ink gray)
- Accent Gold: #B58900 (aged gold)
- Secondary Text: #93A1A1 (light gray)
- Ghost/Spirit Blue: #268BD2 (ethereal blue)
- Error Red: #DC322F

### Typography:
- Headings/Body: EB Garamond (serif) - literary, classic feel
- Technical/UI: JetBrains Mono (monospace) - data labels, status

### Key Components:

1. **Hero Section**
   - Full-screen landing with animated title
   - "Begin the Journey" scroll prompt
   - Subtle floating golden dust particles

2. **Chapter Sections** (20 total)
   - Full-screen scroll-based navigation
   - Each chapter has: number badge, era label, title, opening quote, summary, key events, character cards
   - Mood-based gradient backgrounds (hopeful=amber, turbulent=red, magical=blue, melancholic=gray, apocalyptic=purple)
   - Navigation dots on right side

3. **Character Cards (Magical Realist Style)**
   - Rounded corners, parchment background
   - Portrait (circular, 64px), name, nickname, generation/chapter info
   - Description text, optional quote
   - Ghost state: 40% opacity, sepia filter, blue accent
   - Ink-bleed animation on appear
   - "Click to explore" / "Speak with the dead" hint

4. **Character Modal**
   - Slide-up modal with portrait header
   - Family connections section
   - AI-generated biography
   - "Speak with Spirit" button for deceased characters
   - Chat interface for Talk to the Dead

5. **Chat Panel**
   - Fixed bottom-right floating button
   - Slide-up panel, 500px height
   - Toggle between Story Q&A and Historical Context modes
   - Message bubbles with timestamps

6. **Visual Effects**
   - Yellow butterflies (chapters 14-17)
   - Rain effect (chapters 15-16)
   - Golden floating dust particles
   - Parchment texture overlay

7. **Ambient Music**
   - Web Audio API generated drone
   - Toggle button bottom-left
   - Volume control on hover

### Interactions:
- Scroll-based chapter navigation
- Click character cards → modal
- Hover portrait → generate AI portrait
- Chat toggle → floating panel
- Navigation dots → jump to chapter

### Current Issues/Concerns:
- Mobile responsiveness not fully tested
- Accessibility (screen readers, keyboard nav) needs work
- Loading states could be more polished
- No onboarding/tutorial for first-time users
`;

const critiquePrompt = `You are a senior UX/UI designer with expertise in:
- Interaction design
- Visual aesthetics
- Accessibility (WCAG)
- Magical realism aesthetic in digital design
- Literary/book-themed interfaces

Please critique the following website design for an interactive "One Hundred Years of Solitude" family tree experience.

Provide feedback in these categories:

1. **Visual Aesthetics** (color, typography, spacing, visual hierarchy)
2. **Interaction Design** (user flows, affordances, feedback, micro-interactions)
3. **Emotional Design** (does it evoke magical realism? literary feel? appropriate mood?)
4. **Accessibility** (potential issues, improvements needed)
5. **Mobile Experience** (responsive considerations)
6. **Specific Component Critiques** (what works, what doesn't)
7. **Concrete Suggestions** (specific CSS/design changes to implement)

Be specific and actionable. For each suggestion, explain WHY and provide example CSS or design specs where helpful.

${currentDesign}
`;

async function runCritique() {
  if (!API_KEY) {
    console.error('Please set VITE_GEMINI_API_KEY environment variable');
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });

  console.log('🎨 Requesting design critique from Gemini 3...\n');

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: critiquePrompt }] }],
      generationConfig: {
        temperature: 1.0,
        maxOutputTokens: 4096,
      },
    });

    const response = await result.response;
    console.log('━'.repeat(60));
    console.log('GEMINI 3 DESIGN CRITIQUE');
    console.log('━'.repeat(60));
    console.log(response.text());
    console.log('━'.repeat(60));
  } catch (error) {
    console.error('Error:', error);
  }
}

runCritique();
