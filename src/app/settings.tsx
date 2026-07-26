import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { LanguagePreference, LanguagePreferences } from '@/constants/languages';
import { Spacing } from '@/constants/theme';
import { useSettingsStore } from '@/features/settings/settings-store';
import { useTheme } from '@/hooks/use-theme';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const language = useSettingsStore((state) => state.language);
  const setLanguage = useSettingsStore((state) => state.setLanguage);

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
});
