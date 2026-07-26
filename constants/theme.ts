// Financial Mind Map - Design System
export const Colors = {
  // Core Palette
  background: '#050B18',
  surface: '#0D1B2E',
  surfaceElevated: '#122240',
  surfaceBorder: '#1E3352',

  // Brand
  primary: '#3D9EFF',
  primaryGlow: 'rgba(61,158,255,0.25)',
  gold: '#F5C842',
  goldGlow: 'rgba(245,200,66,0.2)',

  // Semantic
  success: '#2ECC71',
  successGlow: 'rgba(46,204,113,0.2)',
  danger: '#FF4D6A',
  dangerGlow: 'rgba(255,77,106,0.2)',
  warning: '#FF9A3C',
  warningGlow: 'rgba(255,154,60,0.2)',

  // Text
  textPrimary: '#F0F6FF',
  textSecondary: '#8AA5C8',
  textMuted: '#4A6480',
  textOnPrimary: '#FFFFFF',

  // Category node colors
  nodeHousing: '#3D9EFF',
  nodeFood: '#FF6B6B',
  nodeTransport: '#F5C842',
  nodeEntertainment: '#A78BFA',
  nodeSavings: '#2ECC71',
  nodeHealth: '#26C6DA',
  nodeShopping: '#FF9A3C',
  nodeIncome: '#57E89C',

  // Overlay
  overlay: 'rgba(5,11,24,0.85)',
  overlayLight: 'rgba(13,27,46,0.7)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Typography = {
  // Font sizes (based on 16 scale)
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 20,
  xl: 22,
  xxl: 28,
  hero: 34,

  // Line heights
  tight: 1.3,
  normal: 1.5,
  relaxed: 1.7,

  // Weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  }),
};
