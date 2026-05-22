import React, { useState } from 'react';
import { Alert, Linking } from 'react-native';
import { ScrollView } from '@/components/ui/scroll-view';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Switch } from '@/components/ui/switch';
import { Pressable } from '@/components/ui/pressable';
import { Divider } from '@/components/ui/divider';
import { useGameStore } from '@/lib/store';
import { colors } from '@/lib/theme';
import { ChevronRight, Trash2 } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

function SettingRow({
  icon,
  label,
  value,
  onPress,
  showChevron = false,
}: {
  icon: string;
  label: string;
  value?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <HStack
        className="p-4 items-center justify-between"
        style={{
          backgroundColor: colors.surfaceElevated,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <HStack className="items-center flex-1">
          <Text className="text-xl mr-3">{icon}</Text>
          <Text
            className="text-base"
            style={{ color: colors.textPrimary }}
          >
            {label}
          </Text>
        </HStack>

        <HStack className="items-center">
          {value}
          {showChevron && (
            <Icon
              as={ChevronRight}
              size="sm"
              style={{ color: colors.textMuted, marginLeft: 8 }}
            />
          )}
        </HStack>
      </HStack>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const isPremium = useGameStore((s) => s.isPremium);
  const setPremium = useGameStore((s) => s.setPremium);
  const resetProgress = useGameStore((s) => s.resetProgress);

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'This will delete all your Bitcoin, upgrades, and statistics. This cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetProgress();
            Alert.alert('Done', 'Your progress has been reset.');
          },
        },
      ]
    );
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://nova8.dev/privacy');
  };

  return (
    <VStack className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <VStack className="mt-6">
          <Text
            className="text-xs font-semibold px-6 mb-3"
            style={{ color: colors.textMuted }}
          >
            PREMIUM
          </Text>

          <SettingRow
            icon="⚡"
            label="Premium Mode (2X Income)"
            value={
              <Switch
                value={isPremium}
                onValueChange={setPremium}
                accessibilityLabel="Toggle premium mode"
              />
            }
          />
        </VStack>

        <VStack className="mt-8">
          <Text
            className="text-xs font-semibold px-6 mb-3"
            style={{ color: colors.textMuted }}
          >
            PREFERENCES
          </Text>

          <SettingRow
            icon="🔊"
            label="Sound Effects"
            value={
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                accessibilityLabel="Toggle sound effects"
              />
            }
          />

          <SettingRow
            icon="📳"
            label="Haptic Feedback"
            value={
              <Switch
                value={hapticsEnabled}
                onValueChange={setHapticsEnabled}
                accessibilityLabel="Toggle haptic feedback"
              />
            }
          />
        </VStack>

        <VStack className="mt-8">
          <Text
            className="text-xs font-semibold px-6 mb-3"
            style={{ color: colors.textMuted }}
          >
            LEGAL
          </Text>

          <SettingRow
            icon="📄"
            label="Privacy Policy"
            onPress={handlePrivacyPolicy}
            showChevron
          />
        </VStack>

        <VStack className="mt-8">
          <Text
            className="text-xs font-semibold px-6 mb-3"
            style={{ color: colors.textMuted }}
          >
            DANGER ZONE
          </Text>

          <Pressable
            onPress={handleReset}
            accessibilityLabel="Reset progress"
            accessibilityRole="button"
          >
            <HStack
              className="p-4 items-center"
              style={{
                backgroundColor: colors.surfaceElevated,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <Icon
                as={Trash2}
                size="sm"
                style={{ color: colors.error, marginRight: 12 }}
              />
              <Text
                className="text-base font-semibold"
                style={{ color: colors.error }}
              >
                Reset All Progress
              </Text>
            </HStack>
          </Pressable>
        </VStack>

        <VStack className="items-center py-12">
          <Text className="text-3xl mb-3">₿</Text>
          <Text
            className="text-sm"
            style={{ color: colors.textMuted }}
          >
            Bitcoin Clicker v1.0.0
          </Text>
        </VStack>
      </ScrollView>
    </VStack>
  );
}
