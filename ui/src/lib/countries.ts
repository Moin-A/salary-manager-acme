import type { Country } from "@/lib/types";

// The country with this id, or undefined while countries are loading.
export function findCountry(countries: Country[], countryId: number | undefined) {
  return countries.find((country) => country.id === countryId);
}

// Each currency the countries pay in, once, alphabetically: the salary form's options.
export function currencyCodes(countries: Country[]) {
  return [...new Set(countries.map((country) => country.currency_code))].sort();
}
