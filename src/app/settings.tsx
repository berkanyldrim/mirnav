import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LanguagePreference, LanguagePreferences } from '@/constants/languages';
import { DailyReminderTime } from '@/constants/notifications';
import { Spacing } from '@/constants/theme';
import {
  cancelDailyReminder,
  ensureNotificationPermission,
  scheduleDailyReminder,
} from '@/features/notifications/reminder';
import { useSettingsStore } from '@/features/settings/settings-store';
import { useTheme } from '@/hooks/use-theme';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const reminderEnabled = useSettingsStore((state) => state.reminderEnabled);
  const setReminderEnabled = useSettingsStore((state) => state.setReminderEnabled);

  const toggleReminder = async (enabled: boolean) => {
    if (!enabled) {
      setReminderEnabled(false);
      await cancelDailyReminder();
      return;
    }
    const granted = await ensureNotificationPermission();
    if (!granted) return;
    setReminderEnabled(true);
    await scheduleDailyReminder();
  };

  const renderOption = (option: LanguagePreference) => {
    const selected = option === language;

    return (
      <Pressable
        key={option}
        onPress={() => setLanguage(option)}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        accessibilityLabel={t(`settings.language.${option}`)}
        style={[
          styles.option,
          {
            backgroundColor: selected ? theme.backgroundSelected : theme.backgroundElement,
          },
        ]}>
        <ThemedText>{t(`settings.language.${option}`)}</ThemedText>
        {selected && <Ionicons name="checkmark" size={20} color={theme.accent} />}
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <ThemedText type="subtitle">{t('settings.title')}</ThemedText>
          <View style={styles.section}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              {t('settings.language.label')}
            </ThemedText>
            {LanguagePreferences.map(renderOption)}
          </View>
          <View style={styles.section}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              {t('settings.notifications.label')}
            </ThemedText>
            <View style={[styles.option, { backgroundColor: theme.backgroundElement }]}>
              <View style={styles.reminderInfo}>
                <ThemedText>{t('settings.notifications.dailyReminder')}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {t('settings.notifications.description', {
                    time: `${DailyReminderTime.hour}:${String(DailyReminderTime.minute).padStart(2, '0')}`,
                  })}
                </ThemedText>
              </View>
              <Switch
                value={reminderEnabled}
                onValueChange={toggleReminder}
                trackColor={{ true: theme.accent, false: theme.backgroundSelected }}
                accessibilityLabel={t('settings.notifications.dailyReminder')}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.four,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  section: {
    gap: Spacing.two,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: Spacing.three,
  },
  reminderInfo: {
    flex: 1,
    gap: Spacing.half,
    paddingRight: Spacing.two,
  },
});
