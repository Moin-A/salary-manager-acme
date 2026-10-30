"use client";

import { NativeSelect } from "@chakra-ui/react";

type CurrencySelectProps = {
  currencies: string[];
  value: string;
  onChange: (currency: string) => void;
};

export function CurrencySelect({ currencies, value, onChange }: CurrencySelectProps) {
  return (
    <NativeSelect.Root size="sm" bg="white">
      <NativeSelect.Field aria-label="Currency" value={value} onChange={(event) => onChange(event.target.value)}>
        {!value && <option value="">Select a currency</option>}
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}
