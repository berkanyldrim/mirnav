import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useOnboardingStore } from '@/features/onboarding/onboarding-store';
import { useTheme } from '@/hooks/use-theme';

const Steps = [
  { id: 'intro', emoji: '🐈' },
  { id: 'colony', emoji: '🐾' },
  { id: 'streak', emoji: '🔥' },
] as const;

export function OnboardingFlow() {
  const { t } = useTranslation();
  const theme = useTheme();
  const completeOnboarding = useOnboardingStore((state) => state.completeOnboarding);
  const [stepIndex, setStepIndex] = useState(0);

  const step = Steps[stepIndex];
  const lastStep = stepIndex === Steps.length - 1;

  const goNext = () => {
    if (lastStep) {
      completeOnboarding();
      return;
    }
    setStepIndex(stepIndex + 1);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.skipRow}>
          <Pressable
            onPress={completeOnboarding}
            accessibilityRole="button"
            style={styles.skipButton}>
            <ThemedText type="small" themeColor="textSecondary">
              {t('onboarding.skip')}
            </ThemedText>
          </Pressable>
        </View>
        <View style={styles.body}>
          <ThemedText style={styles.emoji}>{step.emoji}</ThemedText>
          <ThemedText type="subtitle" style={styles.title}>
            {t(`onboarding.steps.${step.id}.title`)}
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.message}>
            {t(`onboarding.steps.${step.id}.message`)}
          </ThemedText>
        </View>
        <View style={styles.footer}>
          <View style={styles.dots}>
            {Steps.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === stepIndex ? theme.accent : theme.backgroundSelected,
                  },
                ]}
              />
            ))}
          </View>
          <Pressable
            onPress={goNext}
            accessibilityRole="button"
            style={[styles.nextButton, { backgroundColor: theme.accent }]}>
            <ThemedText type="smallBold" style={{ color: theme.accentForeground }}>
              {lastStep ? t('onboarding.start') : t('onboarding.next')}
            </ThemedText>
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
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    padding: Spacing.three,
  },
  skipRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  skipButton: {
    padding: Spacing.two,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  emoji: {
    fontSize: 72,
    lineHeight: 84,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    maxWidth: 300,
  },
  footer: {
    gap: Spacing.three,
    paddingBottom: Spacing.three,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  nextButton: {
    borderRadius: 999,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
});
