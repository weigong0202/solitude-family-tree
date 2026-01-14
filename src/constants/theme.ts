/**
 * Centralized theme constants for the Solitude Family Tree application.
 * Based on the Solarized color palette with custom additions for magical realism aesthetic.
 */

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Primary accent colors
  gold: '#B58900',        // Primary accent - warmth, life, prosperity
  purple: '#6C71C4',      // Secondary accent - mystical, spiritual
  teal: '#2AA198',        // Tertiary accent - nature, family tree
  blue: '#268BD2',        // Deceased/spirit indicator
  orange: '#CB4B16',      // Warning, living warmth
  red: '#DC322F',         // Danger, death

  // Text colors
  text: '#586E75',        // Primary text
  textMuted: '#7C8B8B',   // Muted text (improved contrast)
  textSecondary: '#586E75', // Secondary text (same as primary for better readability)
  textLight: '#EEE8D5',   // Light text on dark backgrounds

  // Background colors
  backgroundDark: '#1A1410',    // Darkest background
  background: '#2D2118',        // Main dark background
  backgroundBrown: '#4A3728',   // Brown accent background
  cream: '#FDF6E3',             // Light cream background
  creamLight: '#EEE8D5',        // Lighter cream

  // Mood-specific colors
  moods: {
    hopeful: '#B58900',
    turbulent: '#DC322F',
    magical: '#268BD2',
    melancholic: '#657B83',
    apocalyptic: '#6C71C4',
    warm: '#B58900',
    mysterious: '#6C71C4',
    decayed: '#657B83',
  },

  // Status colors
  status: {
    alive: '#B58900',
    deceased: '#268BD2',
    notBorn: '#93A1A1',
  },

  // Transparency helpers
  withAlpha: (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },
} as const;

// ============================================================================
// FONTS
// ============================================================================

export const fonts = {
  heading: 'Playfair Display, serif',    // Elegant headings
  body: 'Lora, serif',                   // Readable body text
  accent: 'Cormorant Garamond, serif',   // Decorative accent text
  mono: 'var(--font-mono)',              // Monospace
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  glow: (color: string) => `0 0 20px ${colors.withAlpha(color, 0.4)}`,
  soft: '0 4px 6px rgba(0, 0, 0, 0.1)',
  medium: '0 8px 16px rgba(0, 0, 0, 0.2)',
  large: '0 16px 32px rgba(0, 0, 0, 0.3)',
  inset: 'inset 0 0 60px rgba(0, 0, 0, 0.5)',
} as const;

// ============================================================================
// GRADIENTS
// ============================================================================

export const gradients = {
  darkRadial: 'radial-gradient(ellipse at center, #2D2118 0%, #1A1410 100%)',
  darkRadialSubtle: 'radial-gradient(ellipse at center, #2D2118 0%, #1A1410 70%)',
  goldSubtle: 'linear-gradient(135deg, rgba(181, 137, 0, 0.1), #FDF6E3)',
  blueSubtle: 'linear-gradient(135deg, rgba(38, 139, 210, 0.1), #FDF6E3)',
  purpleSubtle: 'linear-gradient(135deg, rgba(108, 113, 196, 0.15), rgba(42, 161, 152, 0.1))',
  purpleTeal: 'linear-gradient(135deg, #6C71C4, #2AA198)',
  goldOrange: 'linear-gradient(135deg, #B58900, #CB4B16)',
} as const;

// ============================================================================
// BORDERS
// ============================================================================

export const borders = {
  gold: `1px solid ${colors.withAlpha(colors.gold, 0.5)}`,
  goldStrong: `2px solid ${colors.gold}`,
  purple: `1px solid ${colors.withAlpha(colors.purple, 0.5)}`,
  teal: `1px solid ${colors.withAlpha(colors.teal, 0.5)}`,
  blue: `1px solid ${colors.withAlpha(colors.blue, 0.5)}`,
  subtle: `1px solid ${colors.withAlpha(colors.textMuted, 0.3)}`,
} as const;

// ============================================================================
// SPACING (for consistency)
// ============================================================================

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  xxl: '3rem',     // 48px
} as const;

// ============================================================================
// TRANSITIONS
// ============================================================================

export const transitions = {
  fast: 'all 0.15s ease',
  normal: 'all 0.3s ease',
  slow: 'all 0.5s ease',
  colors: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
} as const;

// ============================================================================
// Z-INDEX LAYERS
// ============================================================================

export const zIndex = {
  base: 0,
  content: 10,
  overlay: 20,
  modal: 50,
  tooltip: 60,
  toast: 70,
} as const;

// ============================================================================
// THEME PRESETS (for Living Memory, etc.)
// ============================================================================

export const livingMemoryThemes = {
  deceased: {
    icon: '🦋',
    headerBg: gradients.purpleSubtle,
    headerBorder: colors.withAlpha(colors.purple, 0.3),
    chatBg: colors.withAlpha(colors.cream, 0.2),
    accentColor: colors.purple,
    buttonGradient: gradients.purpleTeal,
    userMsgBg: colors.withAlpha(colors.teal, 0.15),
    userMsgBorder: colors.withAlpha(colors.teal, 0.25),
    assistantMsgBg: colors.withAlpha(colors.purple, 0.12),
    assistantMsgBorder: colors.withAlpha(colors.purple, 0.25),
    inputBg: colors.withAlpha(colors.creamLight, 0.7),
    inputBorder: colors.withAlpha(colors.purple, 0.25),
    tagBg: colors.withAlpha(colors.purple, 0.12),
    tagBorder: colors.withAlpha(colors.purple, 0.25),
    summonTitle: 'Summon the Spirit',
    placeholder: 'Speak to the spirit...',
    loadingText: 'The spirit stirs...',
  },
  living: {
    icon: '🌻',
    headerBg: 'linear-gradient(135deg, rgba(181, 137, 0, 0.15), rgba(203, 75, 22, 0.1))',
    headerBorder: colors.withAlpha(colors.gold, 0.3),
    chatBg: colors.withAlpha(colors.cream, 0.4),
    accentColor: colors.gold,
    buttonGradient: gradients.goldOrange,
    userMsgBg: colors.withAlpha(colors.orange, 0.12),
    userMsgBorder: colors.withAlpha(colors.orange, 0.2),
    assistantMsgBg: colors.withAlpha(colors.gold, 0.1),
    assistantMsgBorder: colors.withAlpha(colors.gold, 0.2),
    inputBg: colors.withAlpha(colors.cream, 0.9),
    inputBorder: colors.withAlpha(colors.gold, 0.25),
    tagBg: colors.withAlpha(colors.gold, 0.1),
    tagBorder: colors.withAlpha(colors.gold, 0.2),
    summonTitle: 'Visit in Macondo',
    placeholder: 'Say something...',
    loadingText: 'Thinking...',
  },
} as const;

// Default export for convenience
const theme = {
  colors,
  fonts,
  shadows,
  gradients,
  borders,
  spacing,
  transitions,
  zIndex,
  livingMemoryThemes,
};

export default theme;
