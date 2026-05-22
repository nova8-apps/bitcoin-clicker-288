export interface Upgrade {
  id: string;
  tier: 1 | 2 | 3 | 4;
  name: string;
  description: string;
  baseCost: number;
  currentLevel: number;
  multiplier: number; // How much it increases click or passive income
  type: 'click' | 'passive';
  icon: string; // Emoji or icon identifier
  unlockRequirement: number; // Total BTC needed to unlock
}

export interface GameState {
  btc: number;
  totalEarned: number;
  clickValue: number;
  passiveIncomePerSecond: number;
  upgrades: Upgrade[];
  loginStreak: number;
  lastLoginDate: string | null;
  startTime: number;
  isPremium: boolean;
}
