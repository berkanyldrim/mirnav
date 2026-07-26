export type Cat = {
  id: string;
  name: string;
  emoji: string;
};

export const StarterCat: Cat = {
  id: 'boncuk',
  name: 'Boncuk',
  emoji: '🐈',
};

export const Cats: Cat[] = [StarterCat];

export function findCatById(catId: string) {
  return Cats.find((cat) => cat.id === catId) ?? StarterCat;
}
