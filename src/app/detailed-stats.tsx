import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useSessionLogStore } from '@/features/focus-session/session-log-store';
import { toDateKey } from '@/features/focus-session/streak';
import { BarChart } from '@/features/stats/bar-chart';
import { getDailyMinutes, getHourlyMinutes, getMonthlyMinutes } from '@/features/stats/detailed';
import { useEntitlementStore } from '@/features/store/entitlement-store';
import { ProTeaser } from '@/features/store/pro-teaser';
import { useTheme } from '@/hooks/use-theme';

const Periods = ['day', 'week', 'month', 'year'] as const;

type Period = (typeof Periods)[number];

export default function DetailedStatsScreen() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const records = useSessionLogStore((state) => state.records);
  const isPro = useEntitlementStore((state) => state.isPro);
  const [period, setPeriod] = useState<Period>('week');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!isPro) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ProTeaser title={t('detailedStats.proTitle')} message={t('detailedStats.proMessage')} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  const today = toDateKey(new Date());
  const year = new Date().getFullYear();

  const formatDay = (dateKey: string) =>
    new Date(`${dateKey}T12:00:00`).toLocaleDateString(i18n.language, {
      day: 'numeric',
      month: 'long',
    });

  const buildChart = () => {
    if (period === 'day') {
      const values = getHourlyMinutes(records, today);
      return {
        values,
        labels: values.map((_, index) =>
          index % 6 === 0 ? String(index).padStart(2, '0') : null,
        ),
        pointLabel: (index: number) => `${String(index).padStart(2, '0')}:00`,
      };
    }
    if (period === 'week' || period === 'month') {
      const days = period === 'week' ? 7 : 30;
      const buckets = getDailyMinutes(records, today, days);
      return {
        values: buckets.map((bucket) => bucket.minutes),
        labels: buckets.map((bucket, index) => {
          if (period === 'week') {
            return new Date(`${bucket.dateKey}T12:00:00`).toLocaleDateString(i18n.language, {
              weekday: 'short',
            });
          }
          return index % 7 === 0 || index === days - 1 ? bucket.dateKey.slice(8) : null;
        }),
        pointLabel: (index: number) => formatDay(buckets[index].dateKey),
      };
    }
    const values = getMonthlyMinutes(records, year);
    return {
      values,
      labels: values.map((_, index) =>
        index % 3 === 0
          ? new Date(year, index, 15).toLocaleDateString(i18n.language, { month: 'short' })
          : null,
      ),
      pointLabel: (index: number) =>
        new Date(year, index, 15).toLocaleDateString(i18n.language, {
          month: 'long',
          year: 'numeric',
        }),
    };
  };

  const chart = buildChart();
  const periodTotal = chart.values.reduce((total, value) => total + value, 0);

  const changePeriod = (next: Period) => {
    setPeriod(next);
    setSelectedIndex(null);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="subtitle">{t('detailedStats.title')}</ThemedText>
          <View style={styles.periodRow}>
            {Periods.map((option) => {
              const selected = option === period;
              return (
                <Pressable
                  key={option}
                  onPress={() => changePeriod(option)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  style={[
                    styles.periodChip,
                    { backgroundColor: selected ? theme.accent : theme.backgroundElement },
                  ]}>
                  <ThemedText
                    type="smallBold"
                    style={{ color: selected ? theme.accentForeground : theme.text }}>
                    {t(`detailedStats.${option}`)}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
          <ThemedText type="smallBold">
            {selectedIndex === null
              ? t('detailedStats.periodTotal', { minutes: periodTotal })
              : t('detailedStats.selectedValue', {
                  label: chart.pointLabel(selectedIndex),
                  minutes: chart.values[selectedIndex],
                })}
          </ThemedText>
          <BarChart
            values={chart.values}
            labels={chart.labels}
            selectedIndex={selectedIndex}
            onSelectIndex={setSelectedIndex}
            getBarLabel={(index) =>
              t('detailedStats.selectedValue', {
                label: chart.pointLabel(index),
                minutes: chart.values[index],
              })
            }
          />
        </ScrollView>
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
    gap: Spacing.three,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  periodRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  periodChip: {
    borderRadius: 999,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
});
