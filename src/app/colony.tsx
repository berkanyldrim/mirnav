import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Cat, Cats, findCatById } from '@/constants/cats';
import { Spacing } from '@/constants/theme';
import { useColonyStore } from '@/features/colony/colony-store';
import { getNextLockedCat, getUnlockProgress, isCatUnlocked } from '@/features/colony/unlock';
import { useSessionStore } from '@/features/focus-session/session-store';
import { useTheme } from '@/hooks/use-theme';

export default function ColonyScreen() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const totalFocusSeconds = useSessionStore((state) => state.totalFocusSeconds);
  const activeCatId = useColonyStore((state) => state.activeCatId);
  const setActiveCat = useColonyStore((state) => state.setActiveCat);

  const activeCat = findCatById(activeCatId);
  const nextCat = getNextLockedCat(totalFocusSeconds);
  const totalHours = (totalFocusSeconds / 3600).toLocaleString(i18n.language, {
    maximumFractionDigits: 1,
  });

  const renderCat = ({ item }: { item: Cat }) => {
    const unlocked = isCatUnlocked(item, totalFocusSeconds);
    const active = item.id === activeCatId;

    if (!unlocked) {
      return (
        <View
          accessibilityLabel={t('colony.lockedCat', { cat: item.name, hours: item.unlockHours })}
          style={[styles.card, { backgroundColor: theme.backgroundElement, opacity: 0.6 }]}>
          <Ionicons name="lock-closed" size={24} color={theme.textSecondary} />
          <ThemedText type="small" themeColor="textSecondary">
            {t('colony.lockedHours', { count: item.unlockHours })}
          </ThemedText>
        </View>
      );
    }

    return (
      <Pressable
        onPress={() => setActiveCat(item.id)}
        accessibilityLabel={t('colony.selectCat', { cat: item.name })}
        style={[
          styles.card,
          { backgroundColor: theme.backgroundElement },
          active && { borderWidth: 2, borderColor: theme.accent },
        ]}>
        <ThemedText style={styles.cardEmoji}>{item.emoji}</ThemedText>
        <ThemedText type="small" numberOfLines={1}>
          {item.name}
        </ThemedText>
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={Cats}
          keyExtractor={(cat) => cat.id}
          numColumns={4}
          renderItem={renderCat}
          style={styles.list}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <ThemedText type="subtitle">{t('colony.title')}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {t('colony.totalFocus', { hours: totalHours })}
                </ThemedText>
              </View>
              <View style={[styles.activeCard, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText style={styles.activeEmoji}>{activeCat.emoji}</ThemedText>
                <View style={styles.activeInfo}>
                  <View style={styles.activeNameRow}>
                    <ThemedText type="smallBold">{activeCat.name}</ThemedText>
                    <View style={[styles.activeBadge, { backgroundColor: theme.accent }]}>
                      <ThemedText type="small" style={{ color: theme.accentForeground }}>
                        {t('colony.activeBadge')}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText type="small" themeColor="textSecondary">
                    {t(`colony.cats.${activeCat.id}`)}
                  </ThemedText>
                </View>
              </View>
              {nextCat ? (
                <View style={styles.nextUnlock}>
                  <ThemedText type="small" themeColor="textSecondary">
                    {t('colony.nextUnlock', { cat: nextCat.name, hours: nextCat.unlockHours })}
                  </ThemedText>
                  <View
                    style={[styles.progressTrack, { backgroundColor: theme.backgroundElement }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: theme.accent,
                          width: `${getUnlockProgress(nextCat, totalFocusSeconds) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              ) : (
                <ThemedText type="small" themeColor="textSecondary">
                  {t('colony.allUnlocked')}
                </ThemedText>
              )}
            </View>
          }
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
    alignItems: 'center',
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
  header: {
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  activeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: 16,
    padding: Spacing.three,
  },
  activeEmoji: {
    fontSize: 40,
    lineHeight: 48,
  },
  activeInfo: {
    flex: 1,
    gap: Spacing.one,
  },
  activeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  activeBadge: {
    borderRadius: 999,
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
  },
  nextUnlock: {
    gap: Spacing.one,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  gridRow: {
    gap: Spacing.two,
  },
  card: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  cardEmoji: {
    fontSize: 28,
    lineHeight: 34,
  },
});
