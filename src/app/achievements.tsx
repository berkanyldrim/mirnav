import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Achievement, Achievements } from '@/constants/achievements';
import { Spacing } from '@/constants/theme';
import { getAchievementCurrent, isAchieved } from '@/features/achievements/progress';
import { useSessionStore } from '@/features/focus-session/session-store';
import { useTheme } from '@/hooks/use-theme';

export default function AchievementsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const totalFocusSeconds = useSessionStore((state) => state.totalFocusSeconds);
  const bestStreak = useSessionStore((state) => state.bestStreak);
  const completedSessionCount = useSessionStore((state) => state.completedSessionCount);

  const stats = { totalFocusSeconds, bestStreak, completedSessionCount };

  const renderAchievement = ({ item }: { item: Achievement }) => {
    const achieved = isAchieved(item, stats);
    const current = Math.min(getAchievementCurrent(item, stats), item.threshold);

    return (
      <View
        style={[
          styles.card,
          { backgroundColor: theme.backgroundElement },
          !achieved && styles.cardLocked,
        ]}>
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: achieved ? theme.accent : theme.backgroundSelected },
          ]}>
          <Ionicons
            name={item.icon}
            size={22}
            color={achieved ? theme.accentForeground : theme.textSecondary}
          />
        </View>
        <View style={styles.info}>
          <ThemedText type="smallBold">{t(`achievements.items.${item.id}.title`)}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {t(`achievements.items.${item.id}.description`)}{' '}
            {t('achievements.progressValue', { current, target: item.threshold })}
          </ThemedText>
        </View>
        {achieved && <Ionicons name="checkmark-circle" size={22} color={theme.accent} />}
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={Achievements}
          keyExtractor={(achievement) => achievement.id}
          renderItem={renderAchievement}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={<ThemedText type="subtitle">{t('achievements.title')}</ThemedText>}
        />
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
  list: {
    width: '100%',
  },
  listContent: {
    padding: Spacing.three,
    gap: Spacing.two,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: 16,
    padding: Spacing.three,
  },
  cardLocked: {
    opacity: 0.7,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: Spacing.half,
  },
});
