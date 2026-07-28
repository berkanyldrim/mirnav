export function formatPriceTry(amount: number, locale: string) {
  return `₺${amount.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
