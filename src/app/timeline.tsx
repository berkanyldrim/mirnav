import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, SectionList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { findTagById } from '@/constants/tags';
import { Spacing } from '@/constants/theme';
import { SessionRecord } from '@/features/focus-session/session-log';
import { useSessionLogStore } from '@/features/focus-session/session-log-store';
import { toDateKey } from '@/features/focus-session/streak';
import { useEntitlementStore } from '@/features/store/entitlement-store';
import { groupRecordsByDate } from '@/features/timeline/group-records';
import { useTheme } from '@/hooks/use-theme';

export default function TimelineScreen() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const records = useSessionLogStore((state) => state.records);
  const isPro = useEntitlementStore((state) => state.isPro);

  const today = toDateKey(new Date());

  const formatSectionTitle = (dateKey: string) => {
    if (dateKey === today) return t('timeline.today');
    return new Date(`${dateKey}T12:00:00`).toLocaleDateString(i18n.language, {
      day: 'numeric',
      month: 'long',
    });
  };

  const renderRecord = ({ item }: { item: SessionRecord }) => {
    const completed = item.outcome === 'completed';
    const tag = findTagById(item.tagId);
    const time = new Date(item.endedAt).toLocaleTimeString(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={[styles.recordCard, { backgroundColor: theme.backgroundElement }]}>
        <Ionicons
          name={completed ? 'checkmark-circle' : 'close-circle'}
          size={22}
          color={completed ? theme.accent : theme.textSecondary}
        />
        <View style={styles.recordInfo}>
          <ThemedText type="smallBold">
            {completed ? t('timeline.completed') : t('timeline.failed')}
          </ThemedText>
          <View style={styles.recordMetaRow}>
            <View style={[styles.tagDot, { backgroundColor: tag.color }]} />
            <ThemedText type="small" themeColor="textSecondary">
              {t(`tags.${tag.id}`)} · {t('timeline.minutesValue', { count: item.durationMinutes })}
            </ThemedText>
          </View>
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {time}
        </ThemedText>
      </View>
    );
  };

  if (!isPro) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.teaser}>
            <Ionicons name="lock-closed" size={40} color={theme.textSecondary} />
            <ThemedText type="smallBold" style={styles.teaserText}>
              {t('timeline.proTitle')}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.teaserText}>
              {t('timeline.proMessage')}
            </ThemedText>
            <Pressable
              onPress={() => router.push('/store')}
              accessibilityRole="button"
              style={[styles.teaserButton, { backgroundColor: theme.accent }]}>
              <ThemedText type="smallBold" style={{ color: theme.accentForeground }}>
                {t('timeline.proCta')}
              </ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <SectionList
          sections={groupRecordsByDate(records)}
          keyExtractor={(item) => item.id}
          renderItem={renderRecord}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={<ThemedText type="subtitle">{t('timeline.title')}</ThemedText>}
          ListEmptyComponent={
            <ThemedText type="small" themeColor="textSecondary">
              {t('timeline.empty')}
            </ThemedText>
          }
          renderSectionHeader={({ section }) => (
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionHeader}>
              {formatSectionTitle(section.dateKey)}
            </ThemedText>
          )}
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
  sectionHeader: {
    marginTop: Spacing.two,
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: 16,
    padding: Spacing.three,
  },
  recordInfo: {
    flex: 1,
    gap: Spacing.half,
  },
  recordMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  tagDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  teaser: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  teaserText: {
    textAlign: 'center',
    maxWidth: 280,
  },
  teaserButton: {
    marginTop: Spacing.two,
    borderRadius: 999,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
});
