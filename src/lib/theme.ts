export const colors = {
  // Premium dark theme
  background: '#0a0a0f',
  surface: '#12121a',
  surfaceElevated: '#1a1a26',
  surfaceHighlight: '#22223',

  // Gold accent
  gold: '#FFD700',
  goldDark: '#D4AF37',
  goldLight: '#FFF8DC',
  goldGlow: 'rgba(255, 215, 0, 0.2)',

  // Text
  textPrimary: '#ffffff',
  textSecondary: '#a0a0b0',
  textMuted: '#6b6b7b',

  // Status
  success: '#00ff88',
  error: '#ff4444',
  warning: '#ffaa00',

  // Borders
  border: 'rgba(255, 255, 255, 0.1)',
  borderGold: 'rgba(255, 215, 0, 0.3)',
};

export const shadows = {
  gold: {
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
};
