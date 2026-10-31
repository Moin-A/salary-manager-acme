"use client";

import { useState, type FormEvent } from "react";
import { Alert, Button, Field, HStack, Input, SimpleGrid, chakra } from "@chakra-ui/react";
import { CurrencySelect } from "@/components/currency-select";
import { ErrorAlert } from "@/components/error-alert";
import type { FieldErrors, SalaryFields, SalarySaveResult, SalarySummary } from "@/lib/types";

type SalaryFormProps = {
  salary: SalarySummary | null;
  currencies: string[];
  // The employee's country's currency, pre-selected for a new salary.
  defaultCurrency?: string;
  onSave: (fields: SalaryFields, note: string) => Promise<SalarySaveResult>;
  onReload: () => void;
  onDone: () => void;
};

export function SalaryForm({ salary, currencies, defaultCurrency, onSave, onReload, onDone }: SalaryFormProps) {
  const [baseAmount, setBaseAmount] = useState(salary ? String(Number(salary.base_amount)) : "");
  const [currency, setCurrency] = useState(salary?.currency ?? defaultCurrency ?? "");
  const [effectiveDate, setEffectiveDate] = useState(salary?.effective_date ?? "");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [conflict, setConflict] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const result = await onSave({ base_amount: baseAmount, currency, effective_date: effectiveDate }, note);
    setSaving(false);

    if (result.ok) {
      onDone();
    } else if ("conflict" in result) {
      setConflict(result.conflict);
    } else {
      setErrors(result.errors);
    }
  }

  function reloadAfterConflict() {
    onReload();
    onDone();
  }

  return (
    <chakra.form onSubmit={handleSubmit}>
      {conflict && <ConflictAlert message={conflict} onReload={reloadAfterConflict} />}
      {errors.base && <ErrorAlert message={errors.base[0]} />}

      <SimpleGrid columns={{ base: 1, md: 3 }} gap="4">
        <Field.Root invalid={Boolean(errors.base_amount)}>
          <Field.Label>Base Amount</Field.Label>
          <Input size="sm" type="number" step="0.01" value={baseAmount} onChange={(event) => setBaseAmount(event.target.value)} />
          <Field.ErrorText>{errors.base_amount?.[0]}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={Boolean(errors.currency)}>
          <Field.Label>Currency</Field.Label>
          <CurrencySelect currencies={currencies} value={currency} onChange={setCurrency} />
          <Field.ErrorText>{errors.currency?.[0]}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={Boolean(errors.effective_date)}>
          <Field.Label>Effective Date</Field.Label>
          <Input size="sm" type="date" value={effectiveDate} onChange={(event) => setEffectiveDate(event.target.value)} />
          <Field.ErrorText>{errors.effective_date?.[0]}</Field.ErrorText>
        </Field.Root>
      </SimpleGrid>

      {salary && (
        <Field.Root mt="4">
          <Field.Label>Note (optional)</Field.Label>
          <Input size="sm" placeholder="e.g. Annual review" value={note} onChange={(event) => setNote(event.target.value)} />
        </Field.Root>
      )}

      <HStack justify="flex-end" gap="2" mt="4">
        <Button variant="ghost" size="sm" onClick={onDone} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" colorPalette="blue" size="sm" loading={saving} loadingText="Saving…">
          Save
        </Button>
      </HStack>
    </chakra.form>
  );
}

function ConflictAlert({ message, onReload }: { message: string; onReload: () => void }) {
  return (
    <Alert.Root status="warning" mb="3">
      <Alert.Indicator />
      <Alert.Title flex="1">{message}</Alert.Title>
      <Button size="xs" variant="outline" onClick={onReload}>
        Reload
      </Button>
    </Alert.Root>
  );
}
