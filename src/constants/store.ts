export const ProPlan = {
  trialDays: 7,
  monthlyPriceTry: 39.9,
  yearlyPriceTry: 399,
} as const;

export const ProFeatureKeys = ['stats', 'timeline', 'seasonalCats', 'cosmetics'] as const;

export type Cosmetic = {
  id: string;
  emoji: string;
  priceTry: number;
};

export const Cosmetics: Cosmetic[] = [
  { id: 'redScarf', emoji: '🧣', priceTry: 14.9 },
  { id: 'fishermanHat', emoji: '🎩', priceTry: 14.9 },
  { id: 'bowTie', emoji: '🎀', priceTry: 14.9 },
  { id: 'autumnStreet', emoji: '🍂', priceTry: 19.9 },
  { id: 'snowyRooftops', emoji: '❄️', priceTry: 19.9 },
  { id: 'summerSeaside', emoji: '🌊', priceTry: 19.9 },
];
