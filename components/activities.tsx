"use client";
import { ActivityProps, RecordWithRelationsProps } from "@/types/db";
import { Activity } from "./activity";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Terminal } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import {
  getCurrentActivity,
  suscribeToCurrentUserData,
} from "@/services/activity";

interface Props {
  activities: ActivityProps[];
  userId: string;
  currentActivityServer?: RecordWithRelationsProps | null;
}

export function Activities({
  activities,
  userId,
  currentActivityServer,
}: Props) {
  const client = createClientComponentClient();
  const [currentActivity, setCurrentActivity] = useState(currentActivityServer);

  // useEffect(() => {
  //   setLocalActivities(activities);
  // }, [activities]);

  useEffect(() => {
    const channel = suscribeToCurrentUserData(client, {
      userId,
      callback: async (data) => {
        const newUserActivity = data?.new?.current_activity;
        if (newUserActivity) {
          const { data } = await getCurrentActivity(client, {
            activityId: newUserActivity,
          });
          if (data) {
            setCurrentActivity(data as RecordWithRelationsProps);
          }
        } else {
          setCurrentActivity(null);
        }
      },
      tag: "activities-subscription",
    }).subscribe(() => {});

    return () => {
      channel.unsubscribe();
    };
  }, []);

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
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-4 gap-4">
        {activities.map((activity) => {
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
