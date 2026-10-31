import { LuPencil, LuPlus } from "react-icons/lu";
import { Button, Card, Flex, Text } from "@chakra-ui/react";
import type { SalaryFields, SalarySaveResult, SalarySummary } from "@/lib/types";
import { SalaryForm } from "./salary-form";
import { SalaryOverview } from "./salary-overview";

type SalaryCardProps = {
  salary: SalarySummary | null;
  currencies: string[];
  defaultCurrency?: string;
  editing: boolean;
  onEdit: () => void;
  onSave: (fields: SalaryFields, note: string) => Promise<SalarySaveResult>;
  onReload: () => void;
  onDoneEditing: () => void;
};

export function SalaryCard({ salary, currencies, defaultCurrency, editing, onEdit, onSave, onReload, onDoneEditing }: SalaryCardProps) {
  return (
    <Card.Root size="sm" mb="6">
      <Card.Header>
        <Flex justify="space-between" align="center">
          <Card.Title fontSize="md">Current Salary</Card.Title>
          {!editing && (
            <Button colorPalette="blue" size="xs" onClick={onEdit}>
              {salary ? <LuPencil /> : <LuPlus />}
              {salary ? "Edit Salary" : "Add Salary"}
            </Button>
          )}
        </Flex>
      </Card.Header>
      <Card.Body>
        {editing ? (
          <SalaryForm
            salary={salary}
            currencies={currencies}
            defaultCurrency={defaultCurrency}
            onSave={onSave}
            onReload={onReload}
            onDone={onDoneEditing}
          />
        ) : salary ? (
          <SalaryOverview salary={salary} />
        ) : (
          <Text color="fg.muted">No salary yet.</Text>
        )}
      </Card.Body>
    </Card.Root>
  );
}
