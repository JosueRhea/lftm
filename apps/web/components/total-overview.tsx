"use client";
import { useAverageTrackedTime, useTopActivities } from "@/hooks/use-overview";
import { Skeleton } from "./ui/skeleton";
import { iconsKV } from "@/data/icons";
import { parseElapsed } from "@/lib/utils";

interface Props {
  userId: string;
}

function TopActivity({ activity }: any) {
  const IconComp = iconsKV[activity.icon];
  return (
    <div key={activity.name} className="flex justify-between items-center">
      <div className="flex items-center gap-x-2">
        <IconComp className={"w-4 h-4"} />
        <p className="text-sm text-muted-foreground">{activity.name}</p>
      </div>
      <p className="text-sm text-muted-foreground">
        {parseElapsed(activity.total_elapsed_ms)}
      </p>
    </div>
  );
}

export const TotalOverview = ({ userId }: Props) => {
  const { data, isLoading } = useTopActivities({ userId });
  const { data: avg, isLoading: loadingAvg } = useAverageTrackedTime({
    userId,
  });

  const parsedAvg = avg != null ? parseElapsed(avg) : null;

  return (
    <div className="bg-card rounded-lg w-full h-full p-4 flex flex-col justify-between relative overflow-hidden">
      <div>
        {" "}
        <div className="bg-gradient-to-br from-pink-500 to-purple-500 absolute w-24 h-24 top-0 right-0 blur-2xl"></div>
        <h4 className="text-lg font-semibold mb-4">Total overview</h4>
        {loadingAvg ? (
          <div>
            <Skeleton className="h-4 inline-flex w-full bg-muted-foreground/50 align-self-center" />
            <Skeleton className="h-4 inline-flex w-2/6 bg-muted-foreground/50 align-self-center" />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Your average daily activity over the last 30 days are{" "}
            <strong>{parsedAvg}</strong>
          </p>
        )}
      </div>

      <div>
        {isLoading && data ? (
          <></>
        ) : (
          <>
            {/* @ts-ignore */}
            {data?.map((activity: any) => (
              <TopActivity activity={activity} key={activity.name} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
