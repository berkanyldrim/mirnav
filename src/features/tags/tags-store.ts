import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { CustomTag, CustomTagColors } from '@/constants/tags';
import { appStorage } from '@/lib/storage';

type TagsState = {
  customTags: CustomTag[];
  addTag: (name: string) => CustomTag;
};

export const useTagsStore = create<TagsState>()(
  persist(
    (set, get) => ({
      customTags: [],
      addTag: (name) => {
        const existing = get().customTags;
        const tag: CustomTag = {
          id: `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          name: name.trim(),
          color: CustomTagColors[existing.length % CustomTagColors.length],
        };
        set({ customTags: [...existing, tag] });
        return tag;
      },
    }),
    {
      name: 'tags',
      storage: appStorage,
    },
  ),
);
