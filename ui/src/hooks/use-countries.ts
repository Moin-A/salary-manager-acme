"use client";

import { useEffect, useState } from "react";
import type { Country } from "@/lib/types";

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    fetch("/api/countries")
      .then((response) => (response.ok ? response.json() : []))
      .then(setCountries);
  }, []);

  return countries;
}
