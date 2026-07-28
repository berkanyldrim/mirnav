import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Cosmetic, Cosmetics, ProFeatureKeys, ProPlan } from '@/constants/store';
import { Spacing } from '@/constants/theme';
import { useEntitlementStore, isCosmeticOwned } from '@/features/store/entitlement-store';
import { formatPriceTry } from '@/features/store/format-price';
import { useTheme } from '@/hooks/use-theme';

export default function StoreScreen() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const entitlements = useEntitlementStore();

  const renderCosmetic = (cosmetic: Cosmetic) => {
    const owned = isCosmeticOwned(entitlements, cosmetic.id);

    return (
      <View
        key={cosmetic.id}
        style={[styles.cosmeticCard, { backgroundColor: theme.backgroundElement }]}>
        <ThemedText style={styles.cosmeticEmoji}>{cosmetic.emoji}</ThemedText>
        <ThemedText type="smallBold" numberOfLines={1}>
          {t(`store.cosmetics.items.${cosmetic.id}`)}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {owned
            ? t('store.cosmetics.includedBadge')
            : formatPriceTry(cosmetic.priceTry, i18n.language)}
        </ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="subtitle">{t('store.title')}</ThemedText>
          <View
            style={[
              styles.proCard,
              { backgroundColor: theme.backgroundElement, borderColor: theme.accent },
            ]}>
            <View style={styles.proTitleRow}>
              <ThemedText type="smallBold">{t('store.pro.title')}</ThemedText>
              <View style={[styles.proBadge, { backgroundColor: theme.accent }]}>
                <ThemedText type="small" style={{ color: theme.accentForeground }}>
                  {t('store.pro.badge')}
                </ThemedText>
              </View>
            </View>
            <View style={styles.featureList}>
              {ProFeatureKeys.map((featureKey) => (
                <View key={featureKey} style={styles.featureRow}>
                  <Ionicons name="checkmark-circle" size={18} color={theme.accent} />
                  <ThemedText type="small" style={styles.featureText}>
                    {t(`store.pro.features.${featureKey}`)}
                  </ThemedText>
                </View>
              ))}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('store.pro.cta', { count: ProPlan.trialDays })}
              style={[styles.ctaButton, { backgroundColor: theme.accent }]}>
              <ThemedText type="smallBold" style={{ color: theme.accentForeground }}>
                {t('store.pro.cta', { count: ProPlan.trialDays })}
              </ThemedText>
            </Pressable>
            <ThemedText type="small" themeColor="textSecondary" style={styles.priceNote}>
              {t('store.pro.priceNote', {
                yearly: formatPriceTry(ProPlan.yearlyPriceTry, i18n.language),
                monthly: formatPriceTry(ProPlan.monthlyPriceTry, i18n.language),
              })}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.priceNote}>
              {t('store.pro.comingSoon')}
            </ThemedText>
          </View>
          <View style={styles.cosmeticsSection}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              {t('store.cosmetics.label')}
            </ThemedText>
            <View style={styles.cosmeticsGrid}>{Cosmetics.map(renderCosmetic)}</View>
          </View>
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
    gap: Spacing.four,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  proCard: {
    borderRadius: 16,
    borderWidth: 2,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  proTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  proBadge: {
    borderRadius: 999,
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
  },
  featureList: {
    gap: Spacing.two,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  featureText: {
    flex: 1,
  },
  ctaButton: {
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  priceNote: {
    textAlign: 'center',
  },
  cosmeticsSection: {
    gap: Spacing.two,
  },
  cosmeticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  cosmeticCard: {
    flexBasis: '31%',
    flexGrow: 1,
    borderRadius: 16,
    alignItems: 'center',
    padding: Spacing.three,
    gap: Spacing.one,
  },
  cosmeticEmoji: {
    fontSize: 28,
    lineHeight: 34,
  },
});
