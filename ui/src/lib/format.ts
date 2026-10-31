export function formatAmount(amount: string | number) {
  return Number(amount).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

// "2026-10-30T10:54:36.000Z" -> "2026-10-30 16:24" in the viewer's time zone.
export function formatDateTime(value: string) {
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Report figures in whole US dollars: 76452.21 -> "$76,452".
export function formatUsd(amount: number) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
