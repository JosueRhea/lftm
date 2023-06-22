"use client";
import { ActivityProps } from "@/types/db";
import { Activity } from "./activity";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Terminal } from "lucide-react";
import { useCurrentActivity } from "@/hooks/use-current-activity";
import { Skeleton } from "./ui/skeleton";
import { useEffect } from "react";
import { suscribeToCurrentUserData } from "@/services/activity";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Props {
  activities: ActivityProps[];
  userId: string;
}

export function Activities({ activities, userId }: Props) {
  const client = createClientComponentClient();
  const { data, error, invalidate, isLoading, isRefetching } =
    useCurrentActivity({ userId });
  useEffect(() => {
    const channel = suscribeToCurrentUserData(client, {
      userId,
      callback: async () => {
        invalidate();
      },
      tag: "activities-subscription",
    }).subscribe(() => {});

    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (isLoading && !data) {
    return (
      <div className="mt-4">
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {activities.length <= 0 && (
        <Alert className="mt-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            Start creating activities to see them here.
          </AlertDescription>
        </Alert>
      )}
      {error != null && (
        <Alert variant="destructive" className="mt-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something went wrong</AlertDescription>
        </Alert>
      )}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-4 gap-4">
        {error == null && activities.map((activity) => {
          const currentActivity = data?.data;
          const isActive =
            currentActivity != null &&
            activity.id == currentActivity.activity_id;
          const isDisabled =
            (currentActivity != null &&
              activity.id != currentActivity.activity_id) ||
            isActive;

          return (
            <Activity
              key={activity.id}
              data={activity}
              disabled={isDisabled}
              isActive={isActive}
            />
          );
        })}
        <Activity isPlus={true} />
      </div>
    </div>
  );
}
