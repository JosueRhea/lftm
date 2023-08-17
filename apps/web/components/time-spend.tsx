"use client";

import { TimeSpendChart } from "./time-spend-chart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useTimeSpend } from "@/hooks/use-time-spend";
import { SelectActivity } from "./select-activity";
import { TimeSpendSkeleton } from "./time-spend-skeleton";

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
  } = useTimeSpend({
    userId,
  });

  if (isLoading) {
    return <TimeSpendSkeleton />;
  }

  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="w-full flex justify-between items-center">
          <CardTitle>Time spend on</CardTitle>
          {activities && selectedActivity != null && (
            <SelectActivity
              activities={activities}
              onChange={onActivityChange}
              selectedActivity={selectedActivity}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        {data && data.dayRecords && data.dayRecords.length > 0 ? (
          <TimeSpendChart data={data.dayRecords} />
        ) : (
          <div className="w-full flex justify-center my-16">
            <p className="text-center">No data to display</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
