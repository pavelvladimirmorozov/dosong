export type Theme = 'dark' | 'white';

export const THEME_COLORS: Record<Theme, { bg: string; text: string; muted: string }> = {
  dark: { bg: '#1e1e1e', text: '#d4d4d4', muted: '#858585' },
  white: { bg: '#f0f2f5', text: '#1a1a2e', muted: '#888888' },
};
