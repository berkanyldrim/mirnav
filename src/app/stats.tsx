import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useSessionLogStore } from '@/features/focus-session/session-log-store';
import { useSessionStore } from '@/features/focus-session/session-store';
import { getDisplayStreak, toDateKey } from '@/features/focus-session/streak';
import { getCompletedCountForDate, getCompletedMinutesForDate } from '@/features/stats/summary';
import { useTheme } from '@/hooks/use-theme';

type StatCardProps = {
  icon: ComponentProps<typeof Ionicons>['name'];
  value: string;
  label: string;
};

function StatCard({ icon, value, label }: StatCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <Ionicons name={icon} size={20} color={theme.accent} />
      <ThemedText type="subtitle">{value}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.cardLabel}>
        {label}
      </ThemedText>
    </View>
  );
}

export default function StatsScreen() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const records = useSessionLogStore((state) => state.records);
  const totalFocusSeconds = useSessionStore((state) => state.totalFocusSeconds);
  const completedSessionCount = useSessionStore((state) => state.completedSessionCount);
  const currentStreak = useSessionStore((state) => state.currentStreak);
  const lastCompletedDate = useSessionStore((state) => state.lastCompletedDate);
  const lastProtectionDate = useSessionStore((state) => state.lastProtectionDate);

  const today = toDateKey(new Date());
  const todayMinutes = getCompletedMinutesForDate(records, today);
  const todayCount = getCompletedCountForDate(records, today);
  const displayStreak = getDisplayStreak(
    lastCompletedDate,
    currentStreak,
    today,
    lastProtectionDate,
  );
  const totalHours = (totalFocusSeconds / 3600).toLocaleString(i18n.language, {
    maximumFractionDigits: 1,
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <ThemedText type="subtitle">{t('stats.title')}</ThemedText>
          <View style={styles.grid}>
            <StatCard
              icon="today-outline"
              value={t('stats.minutesValue', { count: todayMinutes })}
              label={t('stats.todayFocusLabel')}
            />
            <StatCard
              icon="checkmark-done-outline"
              value={String(todayCount)}
              label={t('stats.todaySessionsLabel')}
            />
            <StatCard
              icon="flame-outline"
              value={t('stats.daysValue', { count: displayStreak })}
              label={t('stats.streakLabel')}
            />
            <StatCard
              icon="time-outline"
              value={t('stats.hoursValue', { hours: totalHours })}
              label={t('stats.totalFocusLabel')}
            />
            <StatCard
              icon="paw-outline"
              value={String(completedSessionCount)}
              label={t('stats.totalSessionsLabel')}
            />
          </View>
          <Pressable
            onPress={() => router.push('/timeline')}
            accessibilityRole="button"
            accessibilityLabel={t('timeline.title')}
            style={[styles.timelineRow, { backgroundColor: theme.backgroundElement }]}>
            <Ionicons name="git-commit-outline" size={20} color={theme.accent} />
            <ThemedText type="smallBold" style={styles.timelineLabel}>
              {t('timeline.title')}
            </ThemedText>
            <View style={[styles.proBadge, { backgroundColor: theme.accent }]}>
              <ThemedText type="small" style={{ color: theme.accentForeground }}>
                {t('store.pro.badge')}
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
          </Pressable>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  card: {
    flexBasis: '47%',
    flexGrow: 1,
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  cardLabel: {
    textAlign: 'left',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: 16,
    padding: Spacing.three,
  },
  timelineLabel: {
    flex: 1,
  },
  proBadge: {
    borderRadius: 999,
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
  },
});
