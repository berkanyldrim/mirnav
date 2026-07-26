import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ProgressRing } from '@/components/progress-ring';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { findCatById } from '@/constants/cats';
import { CustomDurationMinutes, FocusDurationOptionsMinutes } from '@/constants/session';
import { Spacing } from '@/constants/theme';
import { useColonyStore } from '@/features/colony/colony-store';
import { formatClock } from '@/features/focus-session/format-time';
import { useSessionStore } from '@/features/focus-session/session-store';
import { getDisplayStreak, toDateKey } from '@/features/focus-session/streak';
import { useAppStateGuard } from '@/features/focus-session/use-app-state-guard';
import { useSessionClock } from '@/features/focus-session/use-session-clock';
import { useTheme } from '@/hooks/use-theme';

export default function FocusScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const status = useSessionStore((state) => state.status);
  const durationMinutes = useSessionStore((state) => state.durationMinutes);
  const currentStreak = useSessionStore((state) => state.currentStreak);
  const lastCompletedDate = useSessionStore((state) => state.lastCompletedDate);
  const selectDuration = useSessionStore((state) => state.selectDuration);
  const startSession = useSessionStore((state) => state.startSession);
  const failSession = useSessionStore((state) => state.failSession);
  const resetSession = useSessionStore((state) => state.resetSession);
  const activeCatId = useColonyStore((state) => state.activeCatId);
  const { remainingSeconds, totalSeconds } = useSessionClock();
  useAppStateGuard();

  const activeCat = findCatById(activeCatId);
  const displayStreak = getDisplayStreak(lastCompletedDate, currentStreak, toDateKey(new Date()));
  const ringSize = Math.min(width - Spacing.five * 2, 280);
  const progress = status === 'running' ? remainingSeconds / totalSeconds : 1;

  const changeDuration = (delta: number) => {
    const next = Math.min(
      CustomDurationMinutes.max,
      Math.max(CustomDurationMinutes.min, durationMinutes + delta),
    );
    selectDuration(next);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="smallBold">{activeCat.name}</ThemedText>
            <View style={[styles.streakBadge, { backgroundColor: theme.backgroundElement }]}>
              <Ionicons name="flame" size={16} color={theme.accent} />
              <ThemedText type="smallBold">
                {t('home.streakDays', { count: displayStreak })}
              </ThemedText>
            </View>
          </View>

          <View style={styles.timerSection}>
            <ProgressRing size={ringSize} strokeWidth={12} progress={progress}>
              <ThemedText style={styles.catEmoji}>{activeCat.emoji}</ThemedText>
              <ThemedText type="subtitle">{formatClock(remainingSeconds)}</ThemedText>
            </ProgressRing>
            <ThemedText themeColor="textSecondary" style={styles.hint}>
              {status === 'running' && t('home.runningHint', { cat: activeCat.name })}
              {status === 'idle' && t('home.idleHint', { cat: activeCat.name })}
              {status === 'completed' && t('home.completedMessage', { cat: activeCat.name })}
              {status === 'failed' && t('home.failedMessage', { cat: activeCat.name })}
            </ThemedText>
            {status === 'completed' && (
              <ThemedText type="smallBold">{t('home.completedTitle')}</ThemedText>
            )}
            {status === 'failed' && (
              <ThemedText type="smallBold">{t('home.failedTitle')}</ThemedText>
            )}
          </View>

          <View style={styles.controls}>
            {status === 'idle' && (
              <>
                <View style={styles.durationRow}>
                  {FocusDurationOptionsMinutes.map((minutes) => {
                    const selected = minutes === durationMinutes;
                    return (
                      <Pressable
                        key={minutes}
                        onPress={() => selectDuration(minutes)}
                        style={[
                          styles.durationChip,
                          { backgroundColor: selected ? theme.accent : theme.backgroundElement },
                        ]}>
                        <ThemedText
                          type="smallBold"
                          style={{ color: selected ? theme.accentForeground : theme.text }}>
                          {t('home.durationMinutes', { count: minutes })}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
                <View style={styles.stepperRow}>
                  <Pressable
                    onPress={() => changeDuration(-CustomDurationMinutes.step)}
                    accessibilityLabel={t('home.decreaseDuration')}
                    style={[styles.stepperButton, { backgroundColor: theme.backgroundElement }]}>
                    <Ionicons name="remove" size={20} color={theme.text} />
                  </Pressable>
                  <ThemedText type="smallBold" style={styles.stepperValue}>
                    {t('home.durationMinutes', { count: durationMinutes })}
                  </ThemedText>
                  <Pressable
                    onPress={() => changeDuration(CustomDurationMinutes.step)}
                    accessibilityLabel={t('home.increaseDuration')}
                    style={[styles.stepperButton, { backgroundColor: theme.backgroundElement }]}>
                    <Ionicons name="add" size={20} color={theme.text} />
                  </Pressable>
                </View>
                <Pressable
                  onPress={startSession}
                  style={[styles.primaryButton, { backgroundColor: theme.accent }]}>
                  <ThemedText type="smallBold" style={{ color: theme.accentForeground }}>
                    {t('home.startSession')}
                  </ThemedText>
                </Pressable>
              </>
            )}
            {status === 'running' && (
              <Pressable
                onPress={failSession}
                style={[styles.primaryButton, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText type="smallBold">{t('home.giveUp')}</ThemedText>
              </Pressable>
            )}
            {(status === 'completed' || status === 'failed') && (
              <Pressable
                onPress={resetSession}
                style={[styles.primaryButton, { backgroundColor: theme.accent }]}>
                <ThemedText type="smallBold" style={{ color: theme.accentForeground }}>
                  {t('home.newSession')}
                </ThemedText>
              </Pressable>
            )}
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
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    padding: Spacing.three,
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    borderRadius: 999,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  timerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  catEmoji: {
    fontSize: 48,
    lineHeight: 56,
  },
  hint: {
    textAlign: 'center',
    paddingHorizontal: Spacing.three,
  },
  controls: {
    gap: Spacing.three,
  },
  durationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  durationChip: {
    borderRadius: 999,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  stepperButton: {
    borderRadius: 999,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValue: {
    minWidth: 64,
    textAlign: 'center',
  },
  primaryButton: {
    borderRadius: 999,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
});
