"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useMyActivity } from "@/hooks/use-my-activity";
import { MyActivitySkeleton } from "./my-activity-skeleton";
import { ActivityChart } from "./activity-chart";
import { MostTrackedActivities } from "./most-tracked-activities";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";

interface Props {
  userId: string;
}

export const MyActivity = ({ userId }: Props) => {
  const { data, error, isLoading, isRefetching } = useMyActivity({ userId });
  const [activeIndex, setActiveIndex] = useState(0);

  if (!data || isLoading || isRefetching) {
    return <MyActivitySkeleton />;
  }

  const setSelectedIndex = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <Card>
      <CardHeader>
        <div className="w-full flex justify-between items-center">
          <CardTitle>My activity</CardTitle>
          <p>Today</p>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data && !error && (
          <>
            <div className="w-full flex items-center justify-center">
              {data.length > 0 ? (
                <ActivityChart
                  data={data}
                  selectedIndex={activeIndex}
                  setSelectedIndex={setSelectedIndex}
                />
              ) : (
                <div className="w-full h-52 flex items-center justify-center">
                  <p>No activity tracked yet</p>
                </div>
              )}
            </div>
            <MostTrackedActivities
              data={data}
              setSelectedIndex={setSelectedIndex}
              selectedIndex={activeIndex}
            />
          </>
        )}
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Something went wrong</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
