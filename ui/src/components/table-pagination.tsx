"use client";

import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { ButtonGroup, Flex, IconButton, Pagination, Text } from "@chakra-ui/react";
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
    <Flex justify={{ base: "center", sm: "flex-end" }} mt="4">
      <Pagination.Root
        count={pagination.total_count}
        pageSize={pagination.per_page}
        page={pagination.page}
        siblingCount={1}
        onPageChange={(details) => onPageChange(details.page)}
      >
        <ButtonGroup variant="ghost" size={{ base: "md", sm: "sm" }}>
          <Pagination.PrevTrigger asChild>
            <IconButton aria-label="Previous page">
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>
          {/* Phones: "Page 3 of 501" instead of every page number. */}
          <Text hideFrom="sm" px="2" fontSize="sm" alignSelf="center">
            Page {pagination.page.toLocaleString()} of {pagination.total_pages.toLocaleString()}
          </Text>
          <Flex hideBelow="sm">
            <Pagination.Items
              render={(item) => (
                <IconButton variant={{ base: "ghost", _selected: "solid" }} colorPalette="blue">
                  {item.value}
                </IconButton>
              )}
            />
          </Flex>
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
