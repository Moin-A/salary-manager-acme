export function formatAmount(amount: string | number) {
  return Number(amount).toLocaleString("en-US", { maximumFractionDigits: 2 });
}
