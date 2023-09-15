import { Pen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RecordWithRelationsProps } from "@/types/db";
import { useCustomRecord } from "@/hooks/use-custom-record";
import { FormErrors } from "./form-errors";
import { Button } from "./ui/button";
import { useActivityHistory } from "@/hooks/use-activity-history";
import { FormEvent } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: RecordWithRelationsProps;
  userId: string;
}

export function CustomRecord({ onOpenChange, open, record, userId }: Props) {
  const { onEndChange, onStartChange, start, end, errors, resetForm } =
    useCustomRecord({
      record: record as RecordWithRelationsProps,
    });
  const { updateRecord } = useActivityHistory({ userId });

  if (!record) return;

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const startDate = new Date(start);
    const endDate = new Date(end);
    // @ts-ignore
    if (isNaN(startDate) || isNaN(endDate)) return;

    updateRecord({
      ...record,
      created_at: startDate.toUTCString(),
      end_date: endDate.toUTCString(),
    });
    onOpenChange(false);
    resetForm();
  };

  const handleOnOpenChange = (openVal: boolean) => {
    onOpenChange(openVal);
    resetForm();
  };
  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="inline-flex">
            <span>
              <Pen className="w-4 h-4 mr-2" />
            </span>
            Edit record{" "}
          </DialogTitle>
        </DialogHeader>
        <form className="w-full" onSubmit={handleOnSubmit}>
          <div className="grid w-full items-center gap-1.5 mt-2">
            <Label htmlFor="email">Start</Label>
            <Input
              type="datetime-local"
              onChange={onStartChange}
              value={start}
            />
          </div>
          <div className="grid w-full items-center gap-1.5 mt-2">
            <Label htmlFor="email">End</Label>
            <Input type="datetime-local" onChange={onEndChange} value={end} />
          </div>
          <div className="mt-4 w-full">
            <FormErrors errors={errors} />
          </div>
          <Button
            disabled={errors.length > 0}
            type="submit"
            className="mt-2 w-full"
          >
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
