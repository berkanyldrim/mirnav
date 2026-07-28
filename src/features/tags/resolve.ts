import { CustomTag, DefaultTag, Tag, Tags } from '@/constants/tags';

export type AnyTag = Tag | CustomTag;

export function isCustomTag(tag: AnyTag): tag is CustomTag {
  return 'name' in tag;
}

export function getAllTags(customTags: CustomTag[]): AnyTag[] {
  return [...Tags, ...customTags];
}

export function findTag(tagId: string, customTags: CustomTag[]): AnyTag {
  return getAllTags(customTags).find((tag) => tag.id === tagId) ?? DefaultTag;
}
