"use client";

import { useEffect, useState } from "react";

// Returns value only after it has stopped changing for delayMs, e.g. so a
// search box fetches once the user pauses typing rather than on every key.
export function useDebouncedValue<T>(value: T, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
