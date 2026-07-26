export type Cat = {
  id: string;
  name: string;
  emoji: string;
  unlockHours: number;
};

export const Cats: Cat[] = [
  { id: 'boncuk', name: 'Boncuk', emoji: '🐈', unlockHours: 0 },
  { id: 'tekir', name: 'Tekir', emoji: '🐱', unlockHours: 1 },
  { id: 'duman', name: 'Duman', emoji: '🐈‍⬛', unlockHours: 3 },
  { id: 'pamuk', name: 'Pamuk', emoji: '😺', unlockHours: 6 },
  { id: 'sarman', name: 'Sarman', emoji: '😸', unlockHours: 10 },
  { id: 'minnos', name: 'Minnoş', emoji: '😻', unlockHours: 15 },
  { id: 'zeytin', name: 'Zeytin', emoji: '😼', unlockHours: 25 },
  { id: 'karamel', name: 'Karamel', emoji: '😽', unlockHours: 40 },
];

export const StarterCat = Cats[0];

export function findCatById(catId: string) {
  return Cats.find((cat) => cat.id === catId) ?? StarterCat;
}
