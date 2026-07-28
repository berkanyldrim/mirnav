import '@/lib/i18n';

import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider, Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function RootLayout() {
  const scheme = useColorScheme();
  const { t } = useTranslation();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: { backgroundColor: colors.background },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: t('tabs.focus'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="timer-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="colony"
          options={{
            title: t('tabs.colony'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="paw-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: t('tabs.stats'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen name="timeline" options={{ href: null }} />
        <Tabs.Screen name="achievements" options={{ href: null }} />
        <Tabs.Screen
          name="store"
          options={{
            title: t('tabs.store'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="storefront-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t('tabs.settings'),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
