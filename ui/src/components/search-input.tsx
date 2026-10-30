"use client";

import { LuSearch } from "react-icons/lu";
import { Input, InputGroup } from "@chakra-ui/react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchInput({ value, onChange, placeholder = "Search…" }: SearchInputProps) {
  return (
    <InputGroup startElement={<LuSearch />} maxW="sm">
      <Input bg="white" size="sm" placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
    </InputGroup>
  );
}
