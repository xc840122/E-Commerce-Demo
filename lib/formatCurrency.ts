export function formatCurrency(
  amount: number,
  currencyCode: string = "NZD",
  locale: string = "en-NZ"
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode.toUpperCase(),
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency", error);
    return `${currencyCode.toUpperCase()} ${amount.toFixed(2)}`;
  }
}