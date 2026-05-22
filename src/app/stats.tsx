import React from 'react';
import { ScrollView } from '@/components/ui/scroll-view';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Divider } from '@/components/ui/divider';
import { useGameStore } from '@/lib/store';
import { colors, shadows } from '@/lib/theme';

function StatRow({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <VStack
      className="p-4 mb-3 rounded-2xl"
      style={{
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.soft,
      }}
    >
      <HStack className="items-center mb-2">
        <Text className="text-2xl mr-3">{icon}</Text>
        <Text className="text-sm" style={{ color: colors.textMuted }}>
          {label}
        </Text>
      </HStack>
      <Text
        className="text-2xl font-bold ml-11"
        style={{
          color: colors.gold,
          letterSpacing: -0.5,
        }}
      >
        {value}
      </Text>
    </VStack>
  );
}

export default function StatsScreen() {
  const totalEarned = useGameStore((s) => s.totalEarned);
  const passiveIncomePerSecond = useGameStore((s) => s.passiveIncomePerSecond);
  const upgrades = useGameStore((s) => s.upgrades);
  const loginStreak = useGameStore((s) => s.loginStreak);
  const startTime = useGameStore((s) => s.startTime);
  const isPremium = useGameStore((s) => s.isPremium);

  const totalUpgradesPurchased = upgrades.reduce((acc, u) => acc + u.currentLevel, 0);
  const timePlayed = Math.floor((Date.now() - startTime) / 1000 / 60);

  return (
    <VStack className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
      >
        {isPremium && (
          <VStack
            className="p-4 mb-4 rounded-2xl items-center"
            style={{
              backgroundColor: colors.goldGlow,
              borderWidth: 1.5,
              borderColor: colors.gold,
            }}
          >
            <Text className="text-xl mb-1">⚡</Text>
            <Text
              className="text-sm font-bold"
              style={{ color: colors.gold }}
            >
              PREMIUM ACTIVE · 2X INCOME
            </Text>
          </VStack>
        )}

        <StatRow
          icon="💰"
          label="Total Earned"
          value={`₿${totalEarned.toFixed(8)}`}
        />

        <StatRow
          icon="⚡"
          label="Passive Income"
          value={`₿${passiveIncomePerSecond.toFixed(8)}/s`}
        />

        <StatRow
          icon="🚀"
          label="Upgrades Purchased"
          value={totalUpgradesPurchased.toString()}
        />

        <StatRow
          icon="🔥"
          label="Login Streak"
          value={`${loginStreak} days`}
        />

        <StatRow
          icon="⏱️"
          label="Time Played"
          value={`${timePlayed} minutes`}
        />

        <Divider className="my-6" style={{ backgroundColor: colors.border }} />

        <VStack className="items-center py-8">
          <Text className="text-5xl mb-4">🏆</Text>
          <Text
            className="text-lg font-semibold mb-2"
            style={{ color: colors.textPrimary }}
          >
            Keep Building!
          </Text>
          <Text
            className="text-sm text-center"
            style={{ color: colors.textMuted }}
          >
            You're on your way to becoming a Bitcoin tycoon
          </Text>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
