"use client";
import { ActivityProps } from "@/types/db";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Terminal } from "lucide-react";
import { useCurrentActivity } from "@/hooks/use-current-activity";
import { Skeleton } from "./ui/skeleton";
import { useEffect } from "react";
import { useDb } from "@/hooks/use-db";
import { ActivitiesList } from "./activities-list";
import { suscribeToCurrentUserData } from "@lftm/api";

interface Props {
  activities: ActivityProps[];
  userId: string;
}

export function Activities({ activities, userId }: Props) {
  const { client } = useDb();
  const { data, error, invalidate, isLoading } = useCurrentActivity({ userId });
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
            <Skeleton key={i} className="h-28 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="w-full">
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

      <ActivitiesList
        userId={userId}
        currentActivityId={data ? data.map((record)=> record.activity_id as string) : null}
      />
    </main>
  );
}
