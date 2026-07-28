import { CustomTag, DefaultTag, Tags } from '@/constants/tags';
import { findTag, getAllTags, isCustomTag } from '@/features/tags/resolve';

const customTag: CustomTag = { id: 'custom-1', name: 'Kitap', color: '#F87171' };

describe('isCustomTag', () => {
  it('distinguishes custom tags from default tags', () => {
    expect(isCustomTag(customTag)).toBe(true);
    expect(isCustomTag(Tags[0])).toBe(false);
  });
});

describe('getAllTags', () => {
  it('lists default tags before custom tags', () => {
    const all = getAllTags([customTag]);
    expect(all).toHaveLength(Tags.length + 1);
    expect(all[all.length - 1]).toBe(customTag);
  });
});

describe('findTag', () => {
  it('finds default and custom tags by id', () => {
    expect(findTag('work', [customTag]).id).toBe('work');
    expect(findTag('custom-1', [customTag])).toBe(customTag);
  });

  it('falls back to the default tag for unknown ids', () => {
    expect(findTag('missing', [])).toBe(DefaultTag);
  });
});
