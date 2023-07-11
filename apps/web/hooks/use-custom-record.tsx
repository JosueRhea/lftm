import { toDatetimeLocal } from "@/lib/date";
import { RecordWithRelationsProps } from "@/types/db";
import { ChangeEvent, useEffect, useState } from "react";

interface Props {
  record: RecordWithRelationsProps;
}

export function useCustomRecord({ record }: Props) {
  const [start, setStart] = useState(
    toDatetimeLocal(record.created_at ?? new Date().toISOString())
  );
  const [end, setEnd] = useState(
    toDatetimeLocal(record.end_date ?? new Date().toISOString())
  );
  const [errors, setErrors] = useState<string[]>([]);

  const onStartChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStart(e.target.value);
  };

  const onEndChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEnd(e.target.value);
  };

  useEffect(() => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const now = new Date().getTime();
    if (endDate < startDate) {
      setErrors(["End date must be greather than start date"]);
    } else if (startDate > now) {
      setErrors(["Start date must be less or equal to now"]);
    } else if (endDate > now) {
      setErrors(["End date must be less or equal to now"]);
    } else {
      setErrors([]);
    }
  }, [start, end]);

  const resetForm = () => {
    setStart(toDatetimeLocal(record.created_at ?? new Date().toISOString()));
    setEnd(toDatetimeLocal(record.end_date ?? new Date().toISOString()));
    setErrors([]);
  };

  const onSubmit = () => {
    if (errors.length > 0) return;
  };

  return {
    onStartChange,
    onEndChange,
    start,
    end,
    errors,
    resetForm,
  };
}
