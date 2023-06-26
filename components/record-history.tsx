import { iconsKV } from "@/data/icons";
import { RecordWithRelationsProps } from "@/types/db";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { MoreVertical } from "lucide-react";

interface Props {
  data: RecordWithRelationsProps;
}

export function RecordHistory({ data }: Props) {
  const IconComp = iconsKV[data.activity.icon];
  const name = data.activity.name;
  const createdAt = new Date(data.created_at as string);
  const endDate = data.end_date ? new Date(data.end_date) : null;
  return (
    <div className="flex items-center w-full space-x-4 rounded-md border p-4">
      <div className="flex w-full items-center space-x-4">
        {IconComp && <IconComp className="w-6 h-6 stroke-primary" />}
        <div className="flex flex-col gap-y-1">
          <p className="text-base font-medium leading-none">{name}</p>
          <p className="text-sm leading-none text-muted-foreground">
            from {format(createdAt, "hh:mm a")} to{" "}
            {endDate ? format(endDate, "hh:mm a") : "now"}
          </p>
        </div>
      </div>
      <Button variant="ghost" className="p-2">
        <MoreVertical className="w-6 h-6 stroke-primary" />
      </Button>
    </div>
  );
}
