import { formatPriceTry } from '@/features/store/format-price';

describe('formatPriceTry', () => {
  it('formats Turkish prices with comma decimals', () => {
    expect(formatPriceTry(39.9, 'tr')).toBe('₺39,90');
    expect(formatPriceTry(399, 'tr')).toBe('₺399,00');
  });

  it('formats English prices with dot decimals', () => {
    expect(formatPriceTry(14.9, 'en')).toBe('₺14.90');
  });
});
