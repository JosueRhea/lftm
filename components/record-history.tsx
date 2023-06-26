import { iconsKV } from "@/data/icons";
import { RecordWithRelationsProps } from "@/types/db";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Trash } from "lucide-react";
import { Pen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useActivityHistory } from "@/hooks/use-activity-history";

interface Props {
  data: RecordWithRelationsProps;
  userId: string;
}

export function RecordHistory({ data, userId }: Props) {
  const { deleteRecord } = useActivityHistory({ userId });

  const IconComp = iconsKV[data.activity.icon];
  const name = data.activity.name;
  const createdAt = new Date(data.created_at as string);
  const endDate = data.end_date ? new Date(data.end_date) : null;
  const isCurrentActivity = data.end_date == null;

  return (
    <div className="flex items-center w-full space-x-4 rounded-md border p-4">
      <div className="flex w-full items-center space-x-4">
        {IconComp && <IconComp className="w-6 h-6 stroke-primary" />}
        <div className="flex flex-col gap-y-1">
          <p className="text-base font-medium leading-none">{name}</p>
          <p className="text-sm leading-none text-muted-foreground">
            <strong>from</strong> {format(createdAt, "MMMM dd, hh:mm a")} <strong>to</strong>{" "}
            {endDate ? format(endDate, "MMMM dd,hh:mm a") : "now"}
          </p>
        </div>
      </div>

      <DropdownMenu>
        <TooltipProvider>
          <Tooltip>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="p-2"
                disabled={isCurrentActivity}
              >
                <TooltipTrigger asChild>
                  <MoreVertical className="w-6 h-6 stroke-primary" />
                </TooltipTrigger>
              </Button>
            </DropdownMenuTrigger>
            <TooltipContent>
              <p>Actions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem>
            <Pen className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem> */}
          <DropdownMenuItem
            onClick={
              isCurrentActivity ? undefined : () => deleteRecord(data.id)
            }
          >
            <Trash className="mr-2 h-4 w-4" />
            <span>Remove</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
