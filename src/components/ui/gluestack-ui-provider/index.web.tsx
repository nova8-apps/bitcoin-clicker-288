import React from 'react';
import { config } from './config';
import { View, ViewProps } from 'react-native';

// Try to import overlay/toast providers — they may not be available on web
let OverlayProvider: React.ComponentType<{ children: React.ReactNode }> | null = null;
let ToastProvider: React.ComponentType<{ children: React.ReactNode }> | null = null;

try {
  const overlayModule = require('@gluestack-ui/core/overlay/creator');
  OverlayProvider = overlayModule.OverlayProvider;
} catch {
  // Not available on web — skip
}

try {
  const toastModule = require('@gluestack-ui/core/toast/creator');
  ToastProvider = toastModule.ToastProvider;
} catch {
  // Not available on web — skip
}

export type ModeType = 'light' | 'dark' | 'system';

export function GluestackUIProvider({
  mode = 'dark',
  ...props
}: {
  mode?: ModeType;
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  const colorScheme = mode === 'system' ? 'light' : mode;
  const colorConfig = config[colorScheme] || config.light || {};

  let content = props.children;
  if (ToastProvider) content = <ToastProvider>{content}</ToastProvider>;
  if (OverlayProvider) content = <OverlayProvider>{content}</OverlayProvider>;

  return (
    <View
      style={[
        colorConfig,
        { flex: 1, height: '100%', width: '100%' },
        props.style,
      ]}
      className={colorScheme === 'dark' ? 'dark' : ''}
    >
      {content}
    </View>
  );
}
