"use client";

import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { ButtonGroup, Flex, IconButton, Pagination } from "@chakra-ui/react";
import type { PaginationInfo } from "@/lib/types";

type TablePaginationProps = {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
};

export function TablePagination({ pagination, onPageChange }: TablePaginationProps) {
  if (pagination.total_pages <= 1) {
    return null;
  }

  return (
    <Flex justify="flex-end" mt="4">
      <Pagination.Root
        count={pagination.total_count}
        pageSize={pagination.per_page}
        page={pagination.page}
        siblingCount={1}
        onPageChange={(details) => onPageChange(details.page)}
      >
        <ButtonGroup variant="ghost" size="sm">
          <Pagination.PrevTrigger asChild>
            <IconButton aria-label="Previous page">
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>
          <Pagination.Items
            render={(item) => (
              <IconButton variant={{ base: "ghost", _selected: "solid" }} colorPalette="blue">
                {item.value}
              </IconButton>
            )}
          />
          <Pagination.NextTrigger asChild>
            <IconButton aria-label="Next page">
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </Flex>
  );
}
