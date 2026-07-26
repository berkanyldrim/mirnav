import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, Share, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { findCatById } from '@/constants/cats';
import { Spacing } from '@/constants/theme';
import { useColonyStore } from '@/features/colony/colony-store';
import { useSessionStore } from '@/features/focus-session/session-store';
import { useTheme } from '@/hooks/use-theme';

export function SessionRewardModal() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const status = useSessionStore((state) => state.status);
  const durationMinutes = useSessionStore((state) => state.durationMinutes);
  const currentStreak = useSessionStore((state) => state.currentStreak);
  const totalFocusSeconds = useSessionStore((state) => state.totalFocusSeconds);
  const unlockedCatId = useSessionStore((state) => state.unlockedCatId);
  const resetSession = useSessionStore((state) => state.resetSession);
  const activeCatId = useColonyStore((state) => state.activeCatId);

  const activeCat = findCatById(activeCatId);
  const unlockedCat = unlockedCatId === null ? null : findCatById(unlockedCatId);
  const totalHours = (totalFocusSeconds / 3600).toLocaleString(i18n.language, {
    maximumFractionDigits: 1,
  });

  const shareProgress = () => {
    Share.share({
      message: t('reward.shareMessage', { minutes: durationMinutes, cat: activeCat.name }),
    }).catch(() => undefined);
  };

  return (
    <Modal
      visible={status === 'completed'}
      transparent
      animationType="fade"
      onRequestClose={resetSession}>
      <View style={styles.backdrop}>
        <ThemedView style={styles.sheet}>
          <ThemedText style={styles.emoji}>{unlockedCat ? unlockedCat.emoji : '🎉'}</ThemedText>
          <ThemedText type="smallBold" style={styles.title}>
            {unlockedCat
              ? t('reward.newCatTitle', { cat: unlockedCat.name })
              : t('home.completedTitle')}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.message}>
            {unlockedCat
              ? t(`colony.cats.${unlockedCat.id}`)
              : t('home.completedMessage', { cat: activeCat.name })}
          </ThemedText>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="flame" size={18} color={theme.accent} />
              <ThemedText type="smallBold">
                {t('home.streakDays', { count: currentStreak })}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {t('reward.streakLabel')}
              </ThemedText>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="time" size={18} color={theme.accent} />
              <ThemedText type="smallBold">
                {t('reward.hoursValue', { hours: totalHours })}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {t('reward.totalFocusLabel')}
              </ThemedText>
            </View>
          </View>

          <Pressable
            onPress={resetSession}
            style={[styles.button, { backgroundColor: theme.accent }]}>
            <ThemedText type="smallBold" style={{ color: theme.accentForeground }}>
              {t('reward.close')}
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={shareProgress}
            style={[styles.button, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="smallBold">{t('reward.share')}</ThemedText>
          </Pressable>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.three,
  },
  sheet: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
  },
  emoji: {
    fontSize: 56,
    lineHeight: 64,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginVertical: Spacing.two,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.one,
    borderRadius: 16,
    padding: Spacing.three,
  },
  button: {
    alignSelf: 'stretch',
    borderRadius: 999,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
});
