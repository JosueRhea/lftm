"use client";
import { Button } from "./ui/button";
import { AddActivity } from "./add-activity";
import { ActivityProps } from "@/types/db";
import { iconsKV } from "@/data/icons";
import { useCurrentActivity } from "@/hooks/use-current-activity";
import { cn } from "@/lib/utils";
import { useMyActivity } from "@/hooks/use-my-activity";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";

type Props = {
  isPlus?: boolean;
  isActive?: boolean;
  disabled?: boolean;
  data?: ActivityProps;
  userId: string;
};

export function Activity({
  isPlus = false,
  isActive = false,
  disabled = false,
  data,
  userId,
}: Props) {
  const { startActivity } = useCurrentActivity({ userId });
  const { data: myActivity, isLoading } = useMyActivity({ userId });

  if (isPlus) {
    return <AddActivity />;
  }

  if (!data) return null;

  const currentActivity = myActivity?.records.find(
    (n) => n.activity_id == data.id
  );

  const progressValue =
    currentActivity && myActivity?.totalCount
      ? Math.floor((currentActivity.counter / 24) * 100)
      : null;

  const name = data?.name;
  const icon = data?.icon as string;

  const IconComp = iconsKV[icon];

  return (
    <button
      className={cn(
        "w-full h-28 relative flex flex-col justify-between items-start text-left rounded-md py-2 px-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
        isActive
          ? "pointer-events-none bg-primary text-primary-foreground"
          : "bg-secondary"
      )}
      // variant={"ghost"}
      onClick={disabled ? undefined : () => startActivity({ activity: data })}
      disabled={disabled && !isActive}
    >
      <div className="w-full flex justify-between items-center">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {name}
        </h4>
        <IconComp className={"w-4 h-4"} />
      </div>
      <div className="w-full h-fit">
        {isLoading ? (
          <>
            <Skeleton
              className={cn(
                "w-full h-2 mb-1 bg-muted-foreground/50",
                isActive && "bg-muted-foreground/20"
              )}
            />
            <Skeleton
              className={cn(
                "w-3/6 h-2 mb-1 bg-muted-foreground/50",
                isActive && "bg-muted-foreground/20"
              )}
            />
          </>
        ) : (
          <>
            <Progress
              className={cn("h-2 mb-1 bg-muted-foreground/10", isActive && "bg-secondary/30")}
              value={progressValue}
              indicatorClassname={cn("bg-secondary-foreground")}
            />
            <p
              className={cn(
                "text-sm",
                isActive
                  ? "text-primary-foreground"
                  : "text-secondary-foreground"
              )}
            >
              {progressValue
                ? progressValue + "%" + " today"
                : "No tracked today"}
            </p>
          </>
        )}
      </div>
    </button>
  );
}
