import { Badge } from "@chakra-ui/react";

const COLORS: Record<string, string> = {
  salary_changed: "blue",
  effective_date_changed: "green",
};

export function EventTypeBadge({ eventType }: { eventType: string | null }) {
  if (!eventType) {
    return null;
  }

  return (
    <Badge colorPalette={COLORS[eventType] ?? "gray"} variant="subtle" fontFamily="mono" fontSize="xs">
      {eventType}
    </Badge>
  );
}
