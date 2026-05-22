import React, { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { ScrollView } from '@/components/ui/scroll-view';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { TapZone } from '@/components/TapZone';
import { UpgradeCard } from '@/components/UpgradeCard';
import { useGameStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import { BarChart3, Settings } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function GameScreen() {
  const btc = useGameStore((s) => s.btc);
  const totalEarned = useGameStore((s) => s.totalEarned);
  const passiveIncomePerSecond = useGameStore((s) => s.passiveIncomePerSecond);
  const upgrades = useGameStore((s) => s.upgrades);
  const isPremium = useGameStore((s) => s.isPremium);
  const incrementBTC = useGameStore((s) => s.incrementBTC);
  const purchaseUpgrade = useGameStore((s) => s.purchaseUpgrade);
  const claimDailyBonus = useGameStore((s) => s.claimDailyBonus);

  const passiveInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    claimDailyBonus();
  }, [claimDailyBonus]);

  useEffect(() => {
    if (passiveIncomePerSecond > 0) {
      passiveInterval.current = setInterval(() => {
        useGameStore.setState((s) => ({
          btc: s.btc + s.passiveIncomePerSecond / 10,
          totalEarned: s.totalEarned + s.passiveIncomePerSecond / 10,
        }));
      }, 100);
    }

    return () => {
      if (passiveInterval.current) {
        clearInterval(passiveInterval.current);
      }
    };
  }, [passiveIncomePerSecond]);

  const visibleUpgrades = upgrades.filter((u) => totalEarned >= u.unlockRequirement);

  return (
    <VStack className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <HStack className="px-6 pt-14 pb-4 items-center justify-between">
        <VStack>
          <Text
            className="text-2xl font-bold"
            style={{
              color: colors.textPrimary,
              letterSpacing: -0.5,
            }}
          >
            Bitcoin Clicker
          </Text>
          {passiveIncomePerSecond > 0 && (
            <Text className="text-xs mt-1" style={{ color: colors.success }}>
              +₿{passiveIncomePerSecond.toFixed(8)}/s {isPremium && '⚡ 2X'}
            </Text>
          )}
        </VStack>

        <HStack className="gap-3">
          <Pressable
            onPress={() => router.push('/stats')}
            accessibilityLabel="View statistics"
            testID="stats-button"
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.surfaceElevated,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon as={BarChart3} size="sm" style={{ color: colors.gold }} />
          </Pressable>

          <Pressable
            onPress={() => router.push('/settings')}
            accessibilityLabel="Open settings"
            testID="settings-button"
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.surfaceElevated,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon as={Settings} size="sm" style={{ color: colors.textSecondary }} />
          </Pressable>
        </HStack>
      </HStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Tap Zone */}
        <TapZone onTap={incrementBTC} btc={btc} />

        {/* Upgrades Section */}
        <VStack className="px-6 mt-8">
          <HStack className="items-center justify-between mb-4">
            <Text
              className="text-xl font-bold"
              style={{ color: colors.textPrimary }}
            >
              Upgrades
            </Text>
            <Text className="text-sm" style={{ color: colors.textMuted }}>
              {visibleUpgrades.length} / {upgrades.length} unlocked
            </Text>
          </HStack>

          {visibleUpgrades.length === 0 ? (
            <VStack className="py-12 items-center">
              <Text className="text-4xl mb-3">💰</Text>
              <Text
                className="text-base font-semibold mb-2"
                style={{ color: colors.textPrimary }}
              >
                Start Earning
              </Text>
              <Text
                className="text-sm text-center"
                style={{ color: colors.textMuted }}
              >
                Tap the Bitcoin symbol above to start earning.{'\n'}
                Upgrades will unlock as you progress!
              </Text>
            </VStack>
          ) : (
            visibleUpgrades.map((upgrade) => (
              <UpgradeCard
                key={upgrade.id}
                upgrade={upgrade}
                canAfford={btc >= upgrade.baseCost * Math.pow(1.15, upgrade.currentLevel)}
                isLocked={totalEarned < upgrade.unlockRequirement}
                onPurchase={() => purchaseUpgrade(upgrade.id)}
              />
            ))
          )}
        </VStack>
      </ScrollView>
    </VStack>
  );
}
