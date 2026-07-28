import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useSessionStore } from '@/features/focus-session/session-store';
import { AnyTag, getAllTags, isCustomTag } from '@/features/tags/resolve';
import { useTagsStore } from '@/features/tags/tags-store';
import { useTheme } from '@/hooks/use-theme';

type TagPickerModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function TagPickerModal({ visible, onClose }: TagPickerModalProps) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const tagId = useSessionStore((state) => state.tagId);
  const selectTag = useSessionStore((state) => state.selectTag);
  const customTags = useTagsStore((state) => state.customTags);
  const addTag = useTagsStore((state) => state.addTag);
  const [query, setQuery] = useState('');

  const tagName = (tag: AnyTag) => (isCustomTag(tag) ? tag.name : t(`tags.${tag.id}`));
  const normalize = (value: string) => value.toLocaleLowerCase(i18n.language);

  const trimmedQuery = query.trim();
  const allTags = getAllTags(customTags);
  const visibleTags = trimmedQuery
    ? allTags.filter((tag) => normalize(tagName(tag)).includes(normalize(trimmedQuery)))
    : allTags;
  const exactMatch = allTags.some((tag) => normalize(tagName(tag)) === normalize(trimmedQuery));

  const close = () => {
    setQuery('');
    onClose();
  };

  const pickTag = (id: string) => {
    selectTag(id);
    close();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <Pressable style={styles.backdrop} onPress={close}>
        <Pressable>
          <ThemedView style={styles.sheet}>
            <ThemedText type="smallBold" style={styles.title}>
              {t('tags.label')}
            </ThemedText>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('tags.searchOrCreate')}
              placeholderTextColor={theme.textSecondary}
              style={[
                styles.searchInput,
                { backgroundColor: theme.backgroundElement, color: theme.text },
              ]}
            />
            <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
              {visibleTags.map((tag) => {
                const selected = tag.id === tagId;
                return (
                  <Pressable
                    key={tag.id}
                    onPress={() => pickTag(tag.id)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={tagName(tag)}
                    style={[
                      styles.row,
                      {
                        backgroundColor: selected
                          ? theme.backgroundSelected
                          : theme.backgroundElement,
                      },
                    ]}>
                    <View style={[styles.dot, { backgroundColor: tag.color }]} />
                    <ThemedText style={styles.rowLabel}>{tagName(tag)}</ThemedText>
                    {selected && <Ionicons name="checkmark" size={20} color={theme.accent} />}
                  </Pressable>
                );
              })}
              {trimmedQuery.length > 0 && !exactMatch && (
                <Pressable
                  onPress={() => pickTag(addTag(trimmedQuery).id)}
                  accessibilityRole="button"
                  accessibilityLabel={t('tags.createTag', { name: trimmedQuery })}
                  style={[styles.row, { backgroundColor: theme.backgroundElement }]}>
                  <Ionicons name="add" size={20} color={theme.accent} />
                  <ThemedText style={styles.rowLabel}>
                    {t('tags.createTag', { name: trimmedQuery })}
                  </ThemedText>
                </Pressable>
              )}
            </ScrollView>
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
    maxHeight: 480,
    borderRadius: 24,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  title: {
    textAlign: 'center',
  },
  searchInput: {
    borderRadius: 12,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    gap: Spacing.two,
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
