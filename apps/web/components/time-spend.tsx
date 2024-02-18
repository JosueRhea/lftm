"use client";

import { TimeSpendChart } from "./time-spend-chart";
import { CardTitle } from "./ui/card";
import { useTimeSpend } from "@/hooks/use-time-spend";
import { SelectActivity } from "./select-activity";
import { TimeSpendSkeleton } from "./time-spend-skeleton";
import { TimeRangePicker } from "./time-range-picker";

interface Props {
  userId: string;
}

export function TimeSpend({ userId }: Props) {
  const {
    error,
    data,
    selectedActivity,
    activities,
    onActivityChange,
    isLoading,
    date,
    setDate,
  } = useTimeSpend({
    userId,
  });

  return (
    <>
      <div className="w-full flex justify-between items-center">
        <CardTitle>Time spent on</CardTitle>
      </div>
      {activities && selectedActivity != null && (
        <div className="flex gap-2 my-4 flex-col sm:flex-row">
          <TimeRangePicker onChange={setDate} range={date} />
          <SelectActivity
            activities={activities}
            onChange={onActivityChange}
            selectedActivity={selectedActivity}
          />
        </div>
      )}
      {isLoading ? (
        <TimeSpendSkeleton />
      ) : (
        <div className="mt-4">
          {data && data.dayRecords && data.dayRecords.length > 0 ? (
            <TimeSpendChart data={data.dayRecords} />
          ) : (
            <div className="w-full flex justify-center my-16">
              <p className="text-center">No data to display</p>
            </div>
          )}
        </div>
      )}
      {data && data.totalTrackedTime != null && (
        <div className="w-full sm:w-1/4 my-4 border p-4 rounded-md">
          <p className="text-xl font-semibold">
            {data.totalTrackedTime.days > 0
              ? `${data.totalTrackedTime.days}d ${data.totalTrackedTime.hours}h ${data.totalTrackedTime.minutes}m`
              : `${data.totalTrackedTime.hours}h ${data.totalTrackedTime.minutes}m ${data.totalTrackedTime.seconds}s`}
          </p>
          <p className="text-muted-foreground">Total time tracked</p>
        </div>
      )}
    </>
  );
}
