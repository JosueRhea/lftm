"use client";
import { AddActivity } from "./add-activity";
import { ActivityProps } from "@/types/db";
import { iconsKV } from "@/data/icons";
import { useCurrentActivity } from "@/hooks/use-current-activity";
import { cn } from "@/lib/utils";
import { useActivityRecords, useMyActivity } from "@/hooks/use-my-activity";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";
import { format } from "date-fns";
import { Clock2 } from "lucide-react";

type Props = {
  isPlus?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  data?: ActivityProps;
  userId: string;
  shouldContainSkipToContentId?: boolean;
};

export function Activity({
  isPlus = false,
  isActive = false,
  disabled = false,
  data,
  userId,
  shouldContainSkipToContentId = false,
}: Props) {
  const { startActivity } = useCurrentActivity({ userId });
  const { data: recordsData, isLoading } = useActivityRecords({
    userId,
    activityId: data?.id ?? null,
  });

  if (isPlus) {
    return <AddActivity />;
  }

  if (!data) return null;

  const progressValue =
    recordsData?.total && recordsData.total > 0
      ? (recordsData?.total / (1000 * 60 * 60 * 24)) * 100
      : null;

  const first3Records = recordsData?.data?.slice(0, 2);
  const countOfMoreRecords = recordsData && recordsData?.data?.length - 2;

  const name = data?.name;
  const icon = data?.icon as string;

  const IconComp = iconsKV[icon];

  return (
    <button
      className={cn(
        "w-full h-28 relative border overflow-hidden shadow-sm flex flex-col justify-between items-start text-left rounded-md py-2 px-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
        isActive
          ? "pointer-events-none bg-primary text-primary-foreground"
          : "bg-card"
      )}
      onClick={disabled ? undefined : () => startActivity({ activity: data })}
      disabled={disabled && !isActive}
      id={shouldContainSkipToContentId ? "activities-list" : undefined}
    >
      <div className="w-full">
        <div className="w-full flex justify-between items-center">
          <h4 className="scroll-m-20 font-semibold tracking-tight">{name}</h4>
          <IconComp className={"w-4 h-4"} />
        </div>
        <div>
          <div className="text-xs">
            {first3Records?.map((record) => {
              if (record.id === "untracked" || record.end_date == null)
                return null;

              return (
                <div className="flex gap-x-1 items-center">
                  <Clock2 className="w-3 h-3" />
                  <p>
                    {format(new Date(record.created_at as string), "hh:mm aa")}
                    {"-"}
                    {format(new Date(record.end_date as string), "hh:mm aa")}
                  </p>
                </div>
              );
            })}
            {countOfMoreRecords && countOfMoreRecords > 0 && (
              <p className="text-xs text-muted-foreground">
                +{countOfMoreRecords} more
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="w-full h-fit">
        {isLoading ? (
          <>
            <Skeleton
              className={cn(
                "w-3/6 h-2 mb-1 bg-muted-foreground/50",
                isActive && "bg-muted-foreground/20"
              )}
            />
          </>
        ) : (
          <>
            <p
              className={cn(
                "text-xs",
                isActive
                  ? "text-primary-foreground"
                  : "text-secondary-foreground"
              )}
            >
              {progressValue != null
                ? progressValue.toFixed(2) + "%" + " today"
                : "No tracked today"}
            </p>
            <Progress
              className={cn(
                "h-0.5 bg-transparent absolute rounded-none bottom-0 left-0 right-0 w-full"
              )}
              value={progressValue}
              indicatorClassname={cn(
                "bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500"
              )}
            />
          </>
        )}
      </div>
    </button>
  );
}
