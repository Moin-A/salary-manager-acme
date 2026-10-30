import { Text } from "@chakra-ui/react";
import type { PaginationInfo } from "@/lib/types";

// "Showing 21–40 of 1,212 employees"
export function ResultsSummary({ pagination, noun }: { pagination: PaginationInfo; noun: string }) {
  const { page, per_page, total_count } = pagination;
  const first = total_count > 0 ? (page - 1) * per_page + 1 : 0;
  const last = Math.min(page * per_page, total_count);

  return (
    <Text fontSize="sm" color="fg.muted" mb="3">
      Showing {first.toLocaleString()}–{last.toLocaleString()} of {total_count.toLocaleString()} {noun}
    </Text>
  );
}
