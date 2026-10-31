import { Text } from "@chakra-ui/react";
import type { ExchangeRateInfo } from "@/lib/types";

// Converted amounts are approximate: they use the latest rate for each currency.
export function ExchangeRatesNote({ rates }: { rates: ExchangeRateInfo[] }) {
  if (rates.length === 0) return null;

  const rateList = rates.map((rate) => `1 ${rate.currency} = ${rate.rate_to_usd} USD (${rate.rate_date})`).join(" · ");

  return (
    <Text mt="3" fontSize="sm" color="fg.muted">
      Amounts in USD, converted with the latest exchange rates: {rateList}
    </Text>
  );
}
