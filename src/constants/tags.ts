export type Tag = {
  id: string;
  color: string;
};

export const Tags: Tag[] = [
  { id: 'work', color: '#F87171' },
  { id: 'study', color: '#60A5FA' },
  { id: 'social', color: '#FB923C' },
  { id: 'rest', color: '#FACC15' },
  { id: 'fun', color: '#F472B6' },
  { id: 'sport', color: '#A3E635' },
  { id: 'other', color: '#818CF8' },
];

export type CustomTag = Tag & {
  name: string;
};

export const DefaultTag = Tags[1];

export const CustomTagColors = Tags.map((tag) => tag.color);
