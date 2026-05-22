import React, { useEffect } from 'react';
import { Pressable, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { colors, shadows } from '@/lib/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TapZoneProps {
  onTap: () => void;
  btc: number;
}

export function TapZone({ onTap, btc }: TapZoneProps) {
  const scale = useSharedValue(1);
  const glow = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value * 0.4,
    transform: [{ scale: glow.value }],
  }));

  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    scale.value = withSequence(
      withSpring(0.92, { damping: 14, stiffness: 300 }),
      withSpring(1, { damping: 14, stiffness: 200 })
    );

    glow.value = withSequence(
      withSpring(1.3, { damping: 10, stiffness: 150 }),
      withSpring(1, { damping: 12, stiffness: 180 })
    );

    onTap();
  };

  return (
    <VStack className="items-center justify-center py-12">
      {/* BTC Balance Display */}
      <Text
        className="text-6xl font-extrabold mb-4"
        style={{
          color: colors.gold,
          letterSpacing: -1.5,
          textShadowColor: colors.goldGlow,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 20,
        }}
      >
        ₿{btc.toFixed(8)}
      </Text>

      <Text className="text-base mb-8" style={{ color: colors.textMuted }}>
        Bitcoin Balance
      </Text>

      {/* Tap Zone */}
      <AnimatedPressable
        onPress={handleTap}
        style={[animatedStyle, { position: 'relative' }]}
        accessibilityLabel="Tap to earn Bitcoin"
        accessibilityRole="button"
        testID="tap-zone"
      >
        {/* Glow effect */}
        <Animated.View
          style={[
            glowStyle,
            {
              position: 'absolute',
              top: -10,
              left: -10,
              right: -10,
              bottom: -10,
              borderRadius: 100,
              backgroundColor: colors.goldGlow,
            },
          ]}
        />

        {/* Main circle */}
        <VStack
          className="items-center justify-center"
          style={{
            width: 180,
            height: 180,
            borderRadius: 90,
            backgroundColor: colors.surfaceElevated,
            borderWidth: 3,
            borderColor: colors.gold,
            ...shadows.gold,
          }}
        >
          <Text
            className="text-6xl mb-2"
            style={{
              textShadowColor: colors.goldGlow,
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 12,
            }}
          >
            ₿
          </Text>
          <Text
            className="text-sm font-semibold"
            style={{ color: colors.gold }}
          >
            TAP
          </Text>
        </VStack>
      </AnimatedPressable>
    </VStack>
  );
}
