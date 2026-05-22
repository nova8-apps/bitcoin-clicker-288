import React from 'react';
import { Pressable, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Badge, BadgeText } from '@/components/ui/badge';
import type { Upgrade } from '@/types';
import { colors, shadows } from '@/lib/theme';

interface UpgradeCardProps {
  upgrade: Upgrade;
  canAfford: boolean;
  isLocked: boolean;
  onPurchase: () => void;
}

export function UpgradeCard({ upgrade, canAfford, isLocked, onPurchase }: UpgradeCardProps) {
  const cost = upgrade.baseCost * Math.pow(1.15, upgrade.currentLevel);

  const handlePress = () => {
    if (!canAfford || isLocked) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPurchase();
  };

  const tierColors = {
    1: colors.textSecondary,
    2: '#4488ff',
    3: '#aa44ff',
    4: colors.gold,
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={!canAfford || isLocked}
      accessibilityLabel={`Purchase ${upgrade.name}`}
      accessibilityRole="button"
      testID={`upgrade-${upgrade.id}`}
      style={({ pressed }) => ({
        opacity: !canAfford || isLocked ? 0.5 : pressed ? 0.9 : 1,
      })}
    >
      <VStack
        className="p-4 mb-3 rounded-2xl"
        style={{
          backgroundColor: colors.surfaceElevated,
          borderWidth: 1.5,
          borderColor: upgrade.currentLevel > 0 ? tierColors[upgrade.tier] : colors.border,
          ...shadows.soft,
        }}
      >
        <HStack className="items-start justify-between mb-2">
          <HStack className="items-center flex-1 mr-3">
            <Text className="text-3xl mr-3">{upgrade.icon}</Text>
            <VStack className="flex-1">
              <Text
                className="text-base font-semibold mb-1"
                style={{ color: colors.textPrimary }}
                numberOfLines={1}
              >
                {upgrade.name}
              </Text>
              <Text
                className="text-xs"
                style={{ color: colors.textMuted }}
                numberOfLines={2}
              >
                {upgrade.description}
              </Text>
            </VStack>
          </HStack>

          <Badge
            size="sm"
            variant="solid"
            style={{
              backgroundColor: tierColors[upgrade.tier],
              borderRadius: 8,
            }}
          >
            <BadgeText>T{upgrade.tier}</BadgeText>
          </Badge>
        </HStack>

        <HStack className="items-center justify-between mt-2">
          <VStack>
            <Text className="text-xs mb-1" style={{ color: colors.textMuted }}>
              Cost
            </Text>
            <Text
              className="text-sm font-bold"
              style={{ color: canAfford ? colors.gold : colors.error }}
            >
              ₿{cost.toFixed(6)}
            </Text>
          </VStack>

          <VStack className="items-end">
            <Text className="text-xs mb-1" style={{ color: colors.textMuted }}>
              Level
            </Text>
            <Text
              className="text-sm font-bold"
              style={{ color: colors.textPrimary }}
            >
              {upgrade.currentLevel}
            </Text>
          </VStack>

          <Pressable
            onPress={handlePress}
            disabled={!canAfford || isLocked}
            accessibilityLabel={isLocked ? 'Locked' : canAfford ? 'Buy upgrade' : 'Insufficient funds'}
            accessibilityRole="button"
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 10,
              backgroundColor: isLocked
                ? colors.border
                : canAfford
                ? colors.gold
                : colors.error,
            }}
          >
            <Text
              className="text-xs font-bold"
              style={{
                color: isLocked
                  ? colors.textMuted
                  : canAfford
                  ? colors.background
                  : colors.textPrimary,
              }}
            >
              {isLocked ? '🔒 LOCKED' : canAfford ? 'BUY' : 'LOW FUNDS'}
            </Text>
          </Pressable>
        </HStack>
      </VStack>
    </Pressable>
  );
}
