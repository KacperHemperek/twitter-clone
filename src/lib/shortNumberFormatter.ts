export function formatNumberToCompact(number: number) {
  return Intl.NumberFormat('en', { notation: 'compact' }).format(number);
}
