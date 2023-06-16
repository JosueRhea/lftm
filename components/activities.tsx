"use client";
import { ActivityProps } from "@/types/db";
import { Activity } from "./activity";
import { useEffect, useState } from "react";
import { suscribeToActivityChanges } from "@/services/activity";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Terminal } from "lucide-react";

interface Props {
  activities: ActivityProps[];
  userId: string;
}

export function Activities({ activities, userId }: Props) {
  const client = createClientComponentClient();
  const [localActivities, setLocalActivities] =
    useState<ActivityProps[]>(activities);

  useEffect(() => {
    const channel = suscribeToActivityChanges(client, {
      userId,
      callback: (activity) => {
        const newActivity = activity.new;
        setLocalActivities((prev) => [...prev, newActivity]);
      },
    });

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  return (
    <div className="w-full">
      {localActivities.length <= 0 && (
        <Alert className="mt-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            Start creating activities to see them here.
          </AlertDescription>
        </Alert>
      )}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-4 gap-4">
        {localActivities.map((activity) => (
          <Activity key={activity.id} data={activity} />
        ))}
        <Activity isPlus={true} />
      </div>
    </div>
  );
}
