import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameState, Upgrade } from '@/types';

// Seed upgrades - 40 total across 4 tiers
const createUpgrades = (): Upgrade[] => {
  const upgrades: Upgrade[] = [];
  const icons = ['💰', '⚡', '🚀', '💎', '👆', '🔥', '⭐', '🌟', '💫', '✨'];

  // Tier 1: 10 cheap upgrades (0-1 BTC unlock)
  for (let i = 0; i < 10; i++) {
    upgrades.push({
      id: `t1-${i}`,
      tier: 1,
      name: `Auto Miner ${i + 1}`,
      description: `Generates ${0.00001 * (i + 1)} BTC/s passively`,
      baseCost: 0.1 * (i + 1),
      currentLevel: 0,
      multiplier: 0.00001 * (i + 1),
      type: 'passive',
      icon: icons[i % icons.length],
      unlockRequirement: 0,
    });
  }

  // Tier 2: 10 moderate upgrades (10-100 BTC unlock)
  for (let i = 0; i < 10; i++) {
    upgrades.push({
      id: `t2-${i}`,
      tier: 2,
      name: `Click Booster ${i + 1}`,
      description: `${2 + i}x click value`,
      baseCost: 5 * (i + 1),
      currentLevel: 0,
      multiplier: 2 + i,
      type: 'click',
      icon: icons[i % icons.length],
      unlockRequirement: 10,
    });
  }

  // Tier 3: 10 expensive upgrades (100-1000 BTC unlock)
  for (let i = 0; i < 10; i++) {
    upgrades.push({
      id: `t3-${i}`,
      tier: 3,
      name: `Mining Farm ${i + 1}`,
      description: `Generates ${0.01 * (i + 1)} BTC/s`,
      baseCost: 50 * (i + 1),
      currentLevel: 0,
      multiplier: 0.01 * (i + 1),
      type: 'passive',
      icon: icons[i % icons.length],
      unlockRequirement: 100,
    });
  }

  // Tier 4: 10 ultra-expensive upgrades (1000+ BTC unlock)
  for (let i = 0; i < 10; i++) {
    upgrades.push({
      id: `t4-${i}`,
      tier: 4,
      name: `Quantum Processor ${i + 1}`,
      description: `${10 + i * 5}x all income`,
      baseCost: 500 * (i + 1),
      currentLevel: 0,
      multiplier: 10 + i * 5,
      type: i % 2 === 0 ? 'passive' : 'click',
      icon: icons[i % icons.length],
      unlockRequirement: 1000,
    });
  }

  return upgrades;
};

interface Store extends GameState {
  incrementBTC: () => void;
  purchaseUpgrade: (upgradeId: string) => boolean;
  claimDailyBonus: () => void;
  resetProgress: () => void;
  setPremium: (value: boolean) => void;
}

const INITIAL_STATE: GameState = {
  btc: 0,
  totalEarned: 0,
  clickValue: 0.00001,
  passiveIncomePerSecond: 0,
  upgrades: createUpgrades(),
  loginStreak: 0,
  lastLoginDate: null,
  startTime: Date.now(),
  isPremium: false,
};

export const useGameStore = create<Store>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      incrementBTC: () => {
        const { clickValue, isPremium } = get();
        const actualValue = isPremium ? clickValue * 2 : clickValue;
        set((s) => ({
          btc: s.btc + actualValue,
          totalEarned: s.totalEarned + actualValue,
        }));
      },

      purchaseUpgrade: (upgradeId: string) => {
        const state = get();
        const upgrade = state.upgrades.find((u) => u.id === upgradeId);
        if (!upgrade) return false;

        const cost = upgrade.baseCost * Math.pow(1.15, upgrade.currentLevel);
        if (state.btc < cost) return false;
        if (state.totalEarned < upgrade.unlockRequirement) return false;

        set((s) => {
          const newUpgrades = s.upgrades.map((u) => {
            if (u.id === upgradeId) {
              return { ...u, currentLevel: u.currentLevel + 1 };
            }
            return u;
          });

          const newClickValue = newUpgrades
            .filter((u) => u.type === 'click')
            .reduce((acc, u) => acc * Math.pow(u.multiplier, u.currentLevel), 0.00001);

          const newPassiveIncome = newUpgrades
            .filter((u) => u.type === 'passive')
            .reduce((acc, u) => acc + u.multiplier * u.currentLevel, 0);

          return {
            btc: s.btc - cost,
            upgrades: newUpgrades,
            clickValue: newClickValue,
            passiveIncomePerSecond: s.isPremium ? newPassiveIncome * 2 : newPassiveIncome,
          };
        });

        return true;
      },

      claimDailyBonus: () => {
        const now = new Date();
        const today = now.toDateString();
        const { lastLoginDate, loginStreak } = get();

        if (lastLoginDate === today) return;

        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const isConsecutive = lastLoginDate === yesterday.toDateString();

        const newStreak = isConsecutive ? loginStreak + 1 : 1;
        const bonus = 0.1 * newStreak;

        set((s) => ({
          btc: s.btc + bonus,
          totalEarned: s.totalEarned + bonus,
          loginStreak: newStreak,
          lastLoginDate: today,
        }));
      },

      resetProgress: () => set({ ...INITIAL_STATE, upgrades: createUpgrades() }),

      setPremium: (value: boolean) => {
        set((s) => ({
          isPremium: value,
          passiveIncomePerSecond: value ? s.passiveIncomePerSecond * 2 : s.passiveIncomePerSecond / 2,
        }));
      },
    }),
    {
      name: 'bitcoin-clicker-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
