import { Input } from "@chakra-ui/react";

// A native month input: its value is "YYYY-MM", the format the report API takes.
export function MonthPicker({ month, onChange }: { month: string; onChange: (month: string) => void }) {
  return (
    <Input
      type="month"
      aria-label="Report month"
      value={month}
      onChange={(event) => event.target.value && onChange(event.target.value)}
      bg="white"
      w="auto"
    />
  );
}
