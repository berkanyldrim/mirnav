import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ProTeaserProps = {
  title: string;
  message: string;
};

export function ProTeaser({ title, message }: ProTeaserProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Ionicons name="lock-closed" size={40} color={theme.textSecondary} />
      <ThemedText type="smallBold" style={styles.text}>
        {title}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.text}>
        {message}
      </ThemedText>
      <Pressable
        onPress={() => router.push('/store')}
        accessibilityRole="button"
        style={[styles.button, { backgroundColor: theme.accent }]}>
        <ThemedText type="smallBold" style={{ color: theme.accentForeground }}>
          {t('store.pro.gateCta')}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  text: {
    textAlign: 'center',
    maxWidth: 280,
  },
  button: {
    marginTop: Spacing.two,
    borderRadius: 999,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
});
