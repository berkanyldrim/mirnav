import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Tags } from '@/constants/tags';
import { Spacing } from '@/constants/theme';
import { useSessionStore } from '@/features/focus-session/session-store';
import { useTheme } from '@/hooks/use-theme';

type TagPickerModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function TagPickerModal({ visible, onClose }: TagPickerModalProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const tagId = useSessionStore((state) => state.tagId);
  const selectTag = useSessionStore((state) => state.selectTag);

  const pickTag = (id: string) => {
    selectTag(id);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable>
          <ThemedView style={styles.sheet}>
            <ThemedText type="smallBold" style={styles.title}>
              {t('tags.label')}
            </ThemedText>
            {Tags.map((tag) => {
              const selected = tag.id === tagId;
              return (
                <Pressable
                  key={tag.id}
                  onPress={() => pickTag(tag.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={t(`tags.${tag.id}`)}
                  style={[
                    styles.row,
                    {
                      backgroundColor: selected
                        ? theme.backgroundSelected
                        : theme.backgroundElement,
                    },
                  ]}>
                  <View style={[styles.dot, { backgroundColor: tag.color }]} />
                  <ThemedText style={styles.rowLabel}>{t(`tags.${tag.id}`)}</ThemedText>
                  {selected && <Ionicons name="checkmark" size={20} color={theme.accent} />}
                </Pressable>
              );
            })}
          </ThemedView>
        </Pressable>
      </Pressable>
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
    minWidth: 280,
    maxWidth: 400,
    borderRadius: 24,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  title: {
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: 12,
    padding: Spacing.three,
  },
  rowLabel: {
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
});
